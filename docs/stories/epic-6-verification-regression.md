# Epic 6：验证与回归闭环

---

## Story 6.1 用例失效与任务派生
As a QA Lead,
I want auto mark invalid cases when impact ≥ medium,
so that 变更驱动验证更新。

Acceptance Criteria
- 影响等级≥中时，关联用例标记失效；生成更新任务
- 规则可配置；写审计

---

## Story 6.2 回归批次生成
As a QA Lead,
I want regression batches per change package,
so that 回归组织有序。

Acceptance Criteria
- 根据变更包生成批次；与工作包/用例关联
- 执行状态追踪；失败重试与报告

---

## Story 6.3 回归看板与指标
As a Manager,
I want RBOM-level regression board,
so that 通过率/阻塞/剩余可视化。

Acceptance Criteria
- 看板按 RBOM 层级分组；显示通过率/阻塞项/剩余量
- 支持过滤/导出；KPI 对齐 PRD 7.3

---

## Story 6.4 闭环状态与覆盖
As a PO,
I want closure & coverage updates,
so that 需求验证闭环可量化。

Acceptance Criteria
- 交付物与验证结果回传后更新闭环状态与覆盖
- 审计与追溯：需求/指标/用例/批次互链

