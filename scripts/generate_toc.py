#!/usr/bin/env python3
import sys
from pathlib import Path
import re

HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")


def first_heading(md_path: Path) -> str:
    try:
        for line in md_path.read_text(encoding="utf-8").splitlines():
            m = HEADING_RE.match(line)
            if m:
                return m.group(2).strip()
    except Exception:
        pass
    return md_path.stem


def generate_toc(dir_path: Path, title: str):
    files = []
    for p in sorted(dir_path.glob("*.md")):
        if p.name.lower() in {"index.md", "toc.md", "readme.md"}:
            continue
        files.append(p)

    lines = []
    lines.append(f"# {title} TOC")
    lines.append("")
    lines.append("## Sections")
    lines.append("")
    for p in files:
        heading = first_heading(p)
        # Use relative path from dir
        rel = f"./{p.name}"
        lines.append(f"- [{heading}]({rel})")

    out = dir_path / "toc.md"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return out


def main():
    if len(sys.argv) < 3:
        print("Usage: generate_toc.py <dir> <title>")
        sys.exit(2)
    dir_path = Path(sys.argv[1])
    title = sys.argv[2]
    if not dir_path.exists() or not dir_path.is_dir():
        print(f"Directory not found: {dir_path}")
        sys.exit(1)
    out = generate_toc(dir_path, title)
    print(str(out))


if __name__ == "__main__":
    main()

