样例数据包（CDM UI/UX v0.16 — 航空发动机研制场景）

说明
- 这些文件用于驱动原型/Storybook/E2E 示例，非生产数据。
- 业务背景：以“航空发动机研制（涡扇/涡喷）”为场景，覆盖性能/环保/可靠性等指标。
- REQIF 为最小演示结构，未完整覆盖数据类型/模式；可用于导入流程调试。
- SRS 提供 Markdown 模板，可转换为 DOCX（保留样式与目录）。

文件结构
- reqif/sample.reqif — 最小 REQIF 示例（XML，发动机需求片段）
- srs/SRS_template.md — SRS 模板（Markdown，可导出 DOCX）
- mock/
  - requirements.json — 发动机领域示例需求
  - metrics.json — 性能/环保/可靠性示例指标（推力、TSFC、TIT、NOx 等）
  - rbom.json — 发动机部件层级（风扇/LPC/HPC/燃烧室/HPT/LPT/FADEC 等）
  - diffs.json — 需求或指标变更示例
  - change_packages.json — 更改包与路由示例
  - regression_batches.json — 回归批次（如地面试车/性能验证）
  - jobs.json — 作业进度（导入/抽取等）
