# Epic 3：需求元模型与动态表单/表格（仅需求实体）

说明：本 Epic 面向 PRD 2.1 的 FR26–FR37 与相关 NFR（NFR11–NFR14）。所有故事遵循：可审计、可回滚、默认拒绝（权限）、服务端强制策略。

---

## Story 3.1 需求元模型定义与版本化
As a Configurator,
I want to define requirement fields via meta schema,
so that teams can 扩展需求字段而无需改动数据库结构。

Acceptance Criteria
1. 可新增/编辑字段：类型=文本/富文本/数值（含单位）/布尔/日期/枚举（MDM）/多选/引用/附件/JSON/公式
2. 字段属性：必填/默认值/范围/正则/只读/隐藏/描述/分组；引用字段可选单/多指向需求条目
3. 版本化：保存产生新版本（含 diff），可标记为“基线/发布”；历史版本可回看/回滚
4. 审计：记录操作者、时间、差异摘要；满足 NFR4、NFR11

---

## Story 3.2 Prisma/JSONB 扩展与索引
As a Developer,
I want JSONB extras + 索引,
so that 扩展字段具备查询性能。

Acceptance Criteria
1. requirements 表含 `extras JSONB` 字段，默认 `{}`
2. 对高频 JSON 路径建立 GIN 索引（示例：`(extras -> 'priority')`）
3. 迁移脚本幂等、可回滚，CI 跑迁移单测通过

---

## Story 3.3 动态表单生成与校验
As an Editor,
I want auto-generated forms from meta schema,
so that 快速创建/编辑需求条目。

Acceptance Criteria
1. 表单从元模型渲染；支持条件显隐、分组、提示
2. 校验由 JSON Schema 生成 Zod 校验，前后端一致；错误信息用户可读
3. 支持草稿保存与提交；提交失败留存用户输入

---

## Story 3.4 字段级权限（默认拒绝）
As an Admin,
I want server-enforced field permissions,
so that 敏感字段不被越权访问/修改。

Acceptance Criteria
1. RBAC 角色=Viewer/Editor/Reviewer/Admin/Configurator；默认拒绝
2. API 仅返回被授权字段；未授权字段不在响应中（而非置空）
3. 未授权写入返回 403 并审计；覆盖 NFR11、NFR14 指标

---

## Story 3.5 动态表格（列表）与保存视图
As a User,
I want configurable data grids,
so that 高效浏览/筛选/编辑需求。

Acceptance Criteria
1. 服务端分页/排序/过滤；列选择/顺序/宽度/冻结；分组/汇总/列公式
2. 内联编辑尊重字段权限；批量选择/批量编辑（可撤销）
3. 保存视图（个人），含列与过滤配置；视图可命名、设默认
4. 性能：首屏 P95 ≤ 300ms；交互 P95 ≤ 200ms（KPI）

---

## Story 3.6 视图共享治理（审批/TTL）
As a Reviewer,
I want approve shared views,
so that 组织/角色视图受控发布。

Acceptance Criteria
1. 共享范围：私有/团队/组织/角色；组织/角色范围需至少 1 名 Reviewer 审批
2. 视图支持 TTL（默认 90 天），到期自动下线；可续期；审计版本
3. 周报导出共享视图清单与访问统计

---

## Story 3.7 导出映射与水印/脱敏
As a User,
I want governed export presets,
so that 导出合规、可追溯。

Acceptance Criteria
1. 导出 CSV/Excel 遵循列级权限与字段映射；支持多语言表头
2. 水印：导出者/时间/视图ID/traceId；>5k 行需审批与限流
3. 脱敏规则可按字段配置（示例：哈希/遮蔽）；导出 P95 ≤ 5s（≤5k 行）

---

## Story 3.8 /meta/requirements* API 与审计
As a Configurator,
I want CRUD APIs for meta,
so that 以接口管理与发布元模型。

Acceptance Criteria
1. 端点：/meta/requirements,/meta/req-fields,/meta/req-views,/meta/req-rules（增删改查）
2. 所有变更写入审计日志；支持对比两个版本并生成 diff
3. 合规：OpenAPI 文档覆盖；Spectral lint 通过

---

## Story 3.9 最小触发器（字段变更→通知/任务）
As a Reviewer,
I want minimal triggers,
so that 变更可自动通知/派发。

Acceptance Criteria
1. 触发器范围：需求字段变更→通知（站内信/OA Mock）或生成任务（工作包）
2. 去抖/合并策略可设（避免风暴）；触发审计可查
3. 失败重试与告警；可停用/启用

---

## 非功能/验证要点（统一适用）
- 审计：每个故事相关的创建/修改均写审计（操作者、时间、差异）
- 回滚：元模型与视图配置均可回滚至上一发布版本
- 安全：未授权访问/导出事件=0；默认拒绝；导出含水印
- 性能：表单 P95 ≤ 200ms；表格 P95 ≤ 300ms（首屏）；导出 P95 ≤ 5s（≤5k 行）

