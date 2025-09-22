# 5. Architecture Overview
- Monorepo 结构：
  - apps/web（Next.js + Tailwind + shadcn/ui）
  - apps/api（NestJS + Prisma + BullMQ）
  - packages/ui（可选：共享 UI 主题与组件）
  - packages/config（共享 ESLint/TSConfig/Prettier 配置）
- 服务与存储：
  - API 层：/import, /diffs, /changes, /notifications, /rbom, /metrics
  - Meta 层：/meta/requirements, /meta/req-fields, /meta/req-views, /meta/req-rules（仅需求元模型读写与发布）
  - Jobs 层：导入→映射→抽取→差异→变更→通知流水线（BullMQ/Redis）
  - 存储：Postgres（业务数据），Redis（队列/缓存），DuckDB（就地计算）
  - 适配器：`doors-adapter`（REQIF 读取与 DXL 同步/反写）、`notifications-adapter`（站内信/OA），支持 Mock/Real 切换
  - 合同与观测：Swagger/OpenAPI（/api/__openapi.json）+ 生成客户端/类型；Prometheus `/metrics` 暴露（应用/队列/DB）
  - 策略与权限：服务端策略执行（Policy Enforcement）中间层，统一字段/列级权限、视图共享与导出治理（默认拒绝、审计、水印、限流）
- 数据模型（初版）：requirements, metrics, rbom_nodes, diffs, change_orders, change_packages, notifications, audit_logs, lookups, work_packages, acknowledgements, deliverables, verifications, closures
 - 数据模型（初版）：requirements, metrics, rbom_nodes, diffs, change_orders, change_packages, notifications, audit_logs, lookups, work_packages, acknowledgements, deliverables, verifications, closures；
   视图与导出：req_saved_views（用户/角色视图定义）、req_view_shares（共享范围与权限）、export_presets（导出预设）

---
