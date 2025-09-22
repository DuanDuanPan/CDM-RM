#!/usr/bin/env python3
import re
import sys
import os
import json
from datetime import datetime
from pathlib import Path


LINK_RE = re.compile(r"(!)?\[([^\]]*)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")
HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")


ASCII_PUNCT = r"!\"#$%&'()*+,./:;<=>?@[\\]^`{|}~"
CH_PUNCT = "，。、：；（）《》【】「」『』！？—·“”‘’〈〉·……→"


def slugify(text: str) -> str:
    s = text.strip().lower()
    # Replace spaces/tabs with single dash
    s = re.sub(r"\s+", "-", s)
    # Remove punctuation (ASCII + common CJK punct)
    table = str.maketrans({ch: "" for ch in ASCII_PUNCT + CH_PUNCT})
    s = s.translate(table)
    # Collapse multiple dashes
    s = re.sub(r"-+", "-", s)
    # Strip leading/trailing dashes
    s = s.strip("-")
    return s


def collect_anchors(md_path: Path):
    anchors = set()
    try:
        with md_path.open("r", encoding="utf-8") as f:
            for line in f:
                m = HEADING_RE.match(line.rstrip())
                if m:
                    text = m.group(2).strip()
                    if text:
                        slug = slugify(text)
                        anchors.add(slug)
                        # also add alt without dashes as a loose fallback
                        anchors.add(slug.replace("-", ""))
                        # and raw lowercased text as a very loose fallback
                        anchors.add(text.lower())
    except Exception:
        pass
    return anchors


def resolve_path(base: Path, target: str) -> Path:
    # Normalize ./ and ../ parts
    return (base.parent / target).resolve()


def is_external(url: str) -> bool:
    return url.startswith("http://") or url.startswith("https://") or url.startswith("mailto:") or url.startswith("tel:")


def validate_links(md_file: Path, repo_root: Path):
    issues = []
    checked = 0
    external = 0
    anchors_cache = {}

    try:
        content = md_file.read_text(encoding="utf-8")
    except Exception as e:
        issues.append({
            "type": "read_error",
            "message": f"无法读取文件: {e}",
            "file": str(md_file)
        })
        return checked, external, issues

    for m in LINK_RE.finditer(content):
        is_image = bool(m.group(1))
        url = m.group(3).strip()
        if not url or url.startswith("#"):
            # Pure anchor within same file
            anchor = url[1:] if url.startswith("#") else ""
            if anchor:
                checked += 1
                anchors = anchors_cache.get(md_file)
                if anchors is None:
                    anchors = collect_anchors(md_file)
                    anchors_cache[md_file] = anchors
                slug = slugify(anchor)
                ok = (slug in anchors) or (slug.replace("-", "") in anchors) or (anchor.lower() in anchors)
                if not ok:
                    issues.append({
                        "type": "missing_anchor",
                        "message": f"未找到锚点 #{anchor}",
                        "file": str(md_file),
                        "target": f"#{anchor}"
                    })
            continue

        # Strip optional title suffix like )"title"
        # Already handled by regex

        if is_external(url):
            external += 1
            continue

        # Split anchor
        if "#" in url:
            path_part, anchor = url.split("#", 1)
        else:
            path_part, anchor = url, None

        # Normalize path (handle URL-encoded spaces %20 basic)
        path_part = path_part.replace("%20", " ")
        target_path = resolve_path(md_file, path_part)
        # Constrain to repo root to avoid escaping
        try:
            target_path.relative_to(repo_root)
        except Exception:
            # Outside repo; skip
            continue

        checked += 1

        if not target_path.exists():
            issues.append({
                "type": "missing_file",
                "message": "目标文件不存在",
                "file": str(md_file),
                "target": path_part
            })
            continue

        if anchor:
            if target_path.suffix.lower() == ".md":
                anchors = anchors_cache.get(target_path)
                if anchors is None:
                    anchors = collect_anchors(target_path)
                    anchors_cache[target_path] = anchors
                slug = slugify(anchor)
                ok = (slug in anchors) or (slug.replace("-", "") in anchors) or (anchor.lower() in anchors)
                if not ok:
                    issues.append({
                        "type": "missing_anchor",
                        "message": f"未找到锚点 #{anchor}",
                        "file": str(md_file),
                        "target": f"{path_part}#{anchor}"
                    })

    return checked, external, issues


def walk_markdown_files(base_dirs):
    for base in base_dirs:
        base_path = Path(base)
        if not base_path.exists():
            continue
        for p in base_path.rglob("*.md"):
            yield p


def main():
    args = sys.argv[1:]
    base_dirs = args if args else ["docs"]
    repo_root = Path.cwd()

    total_checked = 0
    total_external = 0
    all_issues = []

    for md_file in walk_markdown_files(base_dirs):
        checked, external, issues = validate_links(md_file, repo_root)
        total_checked += checked
        total_external += external
        for iss in issues:
            all_issues.append(iss)

    summary = {
        "checked": total_checked,
        "external": total_external,
        "issues": len(all_issues),
    }

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    out_dir = Path("docs/qa")
    out_dir.mkdir(parents=True, exist_ok=True)
    out_md = out_dir / f"link-audit-{timestamp}.md"
    out_json = out_dir / f"link-audit-{timestamp}.json"

    # Write markdown report
    lines = []
    lines.append("# 链接与锚点校验报告")
    lines.append("")
    lines.append(f"- 校验范围: {', '.join(base_dirs)}")
    lines.append(f"- 总链接数: {total_checked}")
    lines.append(f"- 外部链接数(已跳过): {total_external}")
    lines.append(f"- 问题数: {len(all_issues)}")
    lines.append("")
    if all_issues:
        lines.append("## 发现的问题")
        for i, iss in enumerate(all_issues, 1):
            lines.append(f"{i}. [{iss['type']}] {iss['message']} — 文件: `{iss['file']}` 目标: `{iss.get('target','')}`")
    else:
        lines.append("未发现问题。")

    out_md.write_text("\n".join(lines), encoding="utf-8")
    out_json.write_text(json.dumps({"summary": summary, "issues": all_issues}, ensure_ascii=False, indent=2), encoding="utf-8")

    # Console output
    print(json.dumps({"summary": summary, "report": str(out_md)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
