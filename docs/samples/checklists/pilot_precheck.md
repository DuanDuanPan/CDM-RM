# 试点数据预检查清单（MVP）

适用范围：本清单用于导入前对 DOORS 导出样本与 RBOM 片段进行快速核验。

## A. 文件与列完备性
- doors_requirements.csv: 必含列 `module_id,object_id,baseline_id,heading,text,priority,status,verification_method,created_at`
- doors_metrics.csv: 必含列 `module_id,object_id,baseline_id,metric_name,original_unit,default_unit,lower_value,lower_inclusive,upper_value,upper_inclusive`
- rbom_fragment.csv: 必含列 `system_code,subsystem_code,assembly_code,part_id,part_name,baseline_id`

## B. 键唯一性与关联
- (module_id,object_id,baseline_id) 组合作为上游唯一键，不可重复
- doors_metrics.csv 中的行，必须能在 doors_requirements.csv 找到对应唯一键

## C. 枚举/术语/时间格式
- priority 必在 P0/P1/P2 集合内，或能通过 priority_mapping.csv 映射
- status 必在 草拟/评审中/冻结/变更中/关闭 内，或能通过 status_mapping.csv 映射
- verification_method 通过 verification_method_mapping.csv 统一
- created_at 必为 ISO 8601，默认时区 Asia/Shanghai (UTC+8)

## D. 单位与量纲
- original_unit→default_unit 可通过 units_mapping.csv 找到换算规则
- 范围/阈值：lower/upper 值及 inclusive 布尔取值（true/false）

## E. RBOM 基线
- rbom_fragment.csv 的 baseline_id 不为空
- part_id 唯一且命名符合内部规范（见 brief.md 附录命名建议）

## F. 样本规模与完整性
- doors_requirements.csv 5–10 行（建议），覆盖不同优先级与状态
- 每条至少 1 个 metric（如无则标注原因）
- RBOM 片段包含对应的 part_id

## H. 下发与回传补充
- work_packages.csv：字段完备（work_package_id, requirement_id/metric_id, assignee, due_at, status）；ack_at 可留空待试点
- verification_results.csv：包含 result（通过/不通过/条件通过）、evidence_uri、reviewer/submitted_by、时间戳
- 关联性：work_packages 与 requirements/metrics 可回溯；verification_results 可回溯到用例/工况（若有）

## G. 异常与补录
- 不可解析/缺失项登记列表：记录文件/行号/字段/原因
- 指派复核/补录责任人与时限（内部跟踪）

---

完成后产出：《小样本数据校验报告》：
- 字段完备度（通过/缺失项清单）
- 枚举/术语映射差异统计
- 单位映射覆盖率与异常项数量
- 唯一键冲突/孤儿 metric 行统计
- 建议修复清单与预估工时
