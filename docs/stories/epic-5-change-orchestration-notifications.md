# Epic 5：变更编排与通知

---

## Story 5.1 由差异派生更改单/变更包
As a PO,
I want change orders/packages from diffs,
so that 变更可管理与跟踪。

Acceptance Criteria
- 规则将差异聚合为更改单；可手工合并/拆分
- 更改单/包状态机：Draft→Planned→Dispatched→InProgress→Closed/Cancelled；审计

---

## Story 5.2 责任人路由
As a PM,
I want routing rules,
so that 任务分发到人。

Acceptance Criteria
- 路由规则按模块/对象/级别/专业组；支持覆盖与例外
- 路由生效写审计；命中率指标可统计

---

## Story 5.3 Ack 收件箱
As an Executor,
I want ack inbox,
so that 接收确认受控。

Acceptance Criteria
- 收件箱列表：待确认/已确认/超时；Ack 操作写审计
- KPI：Ack 中位数 ≤ 8h（试点）

---

## Story 5.4 通知合并与发送
As a Notifier,
I want merged notifications,
so that 降低噪音。

Acceptance Criteria
- 站内信/OA（Mock）；合并策略可配置；送达/阅读/确认留痕
- 失败重试与告警；黑白名单可配置

---

## Story 5.5 工作包追踪
As a Manager,
I want work package tracking,
so that 进度可见。

Acceptance Criteria
- 工作包详情：来源差异/截止/负责人/子任务；状态与审计
- 统计：完成率、剩余、阻塞项

