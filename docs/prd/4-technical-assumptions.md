# 4. Technical Assumptions
- Frontend: Next.js 14+（App Router, React 18），Tailwind CSS 3.4+，shadcn/ui（Radix Primitives），可选 TanStack Table/Query
- Backend: NestJS 10（REST），Zod/DTO 双层校验，BullMQ（Redis）
- Database/ORM: Postgres 15 + Prisma ORM（Prisma Migrate 进行迁移）
- Data Processing: DuckDB（本地/内存表）+ Node 流式处理（可选 Python 工具链用于离线）
- Messaging/Integration: 站内信/OA HTTP 适配器（MVP 使用 Mock，预留真实端点切换）
- Infra/Tooling: Node.js 20 LTS，Yarn 3（Berry）Workspaces（建议 `nodeLinker: node-modules`，Corepack 启用）；ESLint/Prettier；Husky + lint-staged；Vitest/Jest（分别用于 web/api）
- Time/Locale: ISO 8601 + Asia/Shanghai（UTC+8）

（动态建模技术路线，建议；范围仅需求实体）
- 元模型存储：核心需求表维持强类型，扩展字段以 JSONB 字段 `extras` 存储（Prisma JSON 类型），对高频查询的 JSON 路径建立 GIN 索引
- 校验与表单：以 JSON Schema 描述“需求字段/校验”，运行时生成 Zod 校验与表单渲染模型；支持条件显隐与默认值/计算表达式
- 版本与迁移：维护 `meta_requirements/meta_req_fields/meta_req_versions/meta_req_views/meta_req_rules` 元数据表，所有变更版本化；迁移以脚本或后台 Job 执行并审计
- API：提供 `/meta/requirements/*` 端点用于读取/更新需求元模型与视图定义；暴露动态查询接口（受控白名单字段）
- 权限：建议新增 `Configurator` 角色用于变更需求元模型与规则；字段级权限通过视图配置下发到前后端

（契约与观测基线，建议）
- OpenAPI 契约：由 Nest Swagger 暴露 `/api/__openapi.json`（或 yaml）；使用 `openapi-typescript` 与 `openapi-typescript-codegen` 生成类型与客户端
- 可观测性：Pino 日志 + OpenTelemetry 上下文贯穿；Prometheus `/metrics` 导出（应用/队列/DB 指标），附告警样例

（前端 UI 并存策略）
- UI 约定：以 Tailwind + shadcn/ui 为主；在复杂表单/表格场景可限定模块使用 AntD/Formily；禁止同一组件内混用，边界以“页面/模块”为单位

（适配器与抽取服务）
- 适配器层：DOORS 适配器（REQIF 解析 + DXL 客户端，Mock/Real 可切换）、通知适配器（站内信/OA，Mock/Real 可切换）
- 抽取服务：LLM 抽取作为异步 Job（超时/重试/人工复核兜底；prompt/模型/版本/置信度审计）

（动态表格技术要点）
- 列表/表格采用服务端分页/排序/过滤；前端建议 TanStack Table，开启行虚拟化以支撑大列表
- 视图管理：用户/角色级保存视图（列配置/过滤条件/排序/分组）；导出 CSV/Excel
 - 权限与导出：列级权限在服务端强制，查询仅返回被授权字段；导出复用同一权限检查与字段映射（与 SRS 模板一致）

---
