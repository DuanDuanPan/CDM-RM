# 样本与模板使用说明（试点）

目录：docs/samples/

## 1. 模板文件（templates）
- templates/doors_requirements.csv — DOORS 导出样本（需求主体，不含指标）
- templates/doors_metrics.csv — 与上表通过 (module_id,object_id,baseline_id) 关联的指标样本
- templates/rbom_fragment.csv — RBOM 片段（至少包含 Part 层级）
 - templates/work_packages.csv — 工作包下发样本（支持 Ack）
 - templates/verification_results.csv — 验证结果回传样本（含证据链接）

填写建议：
- created_at 用 ISO 8601，默认 Asia/Shanghai (UTC+8)
- priority/status/verification_method 可先写上游原值，按 lookups 自动映射
- metrics 表的范围用 lower/upper + inclusive 布尔值表示

## 2. 映射表（lookups）
- lookups/priority_mapping.csv — 上游优先级到 P0/P1/P2
- lookups/status_mapping.csv — 上游状态到 草拟/评审中/冻结/变更中/关闭
- lookups/verification_method_mapping.csv — 验证方式同义词到统一术语
- lookups/units_mapping.csv — 单位换算与目标量纲

## 3. 预检查清单（checklists）
- checklists/pilot_precheck.md — 导入前快速核验要点

## 4. 参考规范
- docs/specs/doors-to-system-mapping.md — 字段映射、清洗、枚举映射与去重
- docs/specs/metric-spec.md — 指标抽取来源、单位/量纲、范围语法、质量标准
- docs/brief.md — MVP 目标、范围、命名规范（附录）

## 5. 下一步
1) 按模板导出并填充 5–10 条样本
2) 运行《checklists/pilot_precheck.md》逐项核验
3) 将样本放在 templates/ 下并告知我开始处理
4) 我将基于映射与规范产出首批结果（系统需求草案/差异报告/变更包样例）
5) 可选：提供下发与回传样本（work_packages/verification_results），我将演示闭环视图与统计
