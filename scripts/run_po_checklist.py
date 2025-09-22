#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime


def exists(path: Path):
    return path.exists()


def md_count(dir_path: Path):
    if not dir_path.exists() or not dir_path.is_dir():
        return 0
    return len(list(dir_path.glob('*.md')))


def main():
    root = Path.cwd()
    ts = datetime.now().strftime('%Y%m%d-%H%M%S')
    out_dir = root / 'docs' / 'qa'
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / f'po-master-checklist-report-{ts}.md'

    prd_md = root / 'docs' / 'prd.md'
    arch_md = root / 'docs' / 'architecture.md'
    prd_dir = root / 'docs' / 'prd'
    arch_dir = root / 'docs' / 'architecture'
    fe_spec = root / 'docs' / 'front-end-spec.md'
    arch_fe = arch_dir / '前端架构frontend-architecture.md'
    qa_dir = root / 'docs' / 'qa'
    stories_dir = root / 'docs' / 'stories'
    openapi_file = root / 'docs' / 'openapi.baseline.json'

    project_type = 'GREENFIELD' if prd_md.exists() and arch_md.exists() else 'BROWNFIELD'
    has_uiux = fe_spec.exists() or arch_fe.exists()

    checks = []
    def add(name, ok, note=""):
        checks.append((name, ok, note))

    # Documents presence
    add('PRD 文档存在 (docs/prd.md)', exists(prd_md))
    add('架构文档存在 (docs/architecture.md)', exists(arch_md))
    add('PRD 分片 index.md 存在', exists(prd_dir / 'index.md'))
    add('架构分片 index.md 存在', exists(arch_dir / 'index.md'))
    add('PRD 分片数量 > 0', md_count(prd_dir) > 1)  # index + shards
    add('架构分片数量 > 0', md_count(arch_dir) > 1)
    add('PRD toc.md 已生成', exists(prd_dir / 'toc.md'))
    add('架构 toc.md 已生成', exists(arch_dir / 'toc.md'))
    add('前端规格存在 (docs/front-end-spec.md 或 架构/前端架构)', has_uiux)
    add('OpenAPI 基线文件存在 (docs/openapi.baseline.json)', exists(openapi_file))
    add('QA 目录存在 (docs/qa)', qa_dir.exists())
    add('Stories 目录存在 (docs/stories)', stories_dir.exists())

    ok_count = sum(1 for _, ok, _ in checks if ok)
    total = len(checks)

    lines = []
    lines.append('# PO 主清单执行报告')
    lines.append('')
    lines.append(f'- 项目类型: {project_type}')
    lines.append(f'- 是否包含 UI/UX: {"是" if has_uiux else "否"}')
    lines.append(f'- 结果汇总: {ok_count}/{total} 通过')
    lines.append('')
    lines.append('## 检查项')
    for name, ok, note in checks:
        mark = 'PASS' if ok else 'FAIL'
        extra = f' — {note}' if note else ''
        lines.append(f'- [{mark}] {name}{extra}')

    lines.append('')
    lines.append('## 备注')
    lines.append('- 本报告聚焦“文档生态完整性”，未覆盖 CI/CD、运行环境等运行时项。')
    lines.append('- 需要可扩展为交互式逐条确认模式。')

    out_file.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(str(out_file))


if __name__ == '__main__':
    main()

