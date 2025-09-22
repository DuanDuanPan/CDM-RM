# Epic 4：指标抽取与 RBOM 绑定

---

## Story 4.1 规则/正则/词典抽取
As a Data Engineer,
I want rule/regex/MDM extraction,
so that 指标抽取稳定可复核。

Acceptance Criteria
- 可配置规则/正则/词典；支持单位/量纲换算与范围/阈值
- 抽取结果带置信度与来源引用；错误清单可导出

---

## Story 4.2 LLM 抽取 Job 与审计
As a Platform Engineer,
I want LLM extractor as async jobs,
so that 大模型可控、可追溯。

Acceptance Criteria
- 任务化：超时/重试/告警；人工复核兜底
- 审计：记录 prompt/模型/版本/置信度；脱敏存储

---

## Story 4.3 人工复核与修订
As a Reviewer,
I want human review UI,
so that 关键指标可人工把关。

Acceptance Criteria
- 复核界面展示来源文本/抽取结果/理由；支持接受/驳回/修订
- 修订写审计；阈值可配置

---

## Story 4.4 需求/指标 ↔ RBOM Part 绑定
As a Systems Engineer,
I want link req/metrics to RBOM part,
so that 影响范围可定位。

Acceptance Criteria
- 可选择 RBOM 节点；支持批量绑定与解绑；写入基线
- 绑定关系可追溯（需求/指标→RBOM 节点）

---

## Story 4.5 RBOM 基线管理
As a Systems Engineer,
I want RBOM baseline,
so that 变化可对比与回滚。

Acceptance Criteria
- 生成/冻结基线；差异对比；版本审计

---

## Story 4.6 差异生成与导出
As a Product Owner,
I want diffs with export,
so that 变更可下发。

Acceptance Criteria
- 差异字段：变更类型/对象/级别/责任人；过滤/分组/导出（CSV/Markdown）
- 与后续变更包/通知流水线对接

