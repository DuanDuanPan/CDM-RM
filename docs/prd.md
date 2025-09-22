# CDM 需求集成 MVP Product Requirements Document (PRD)

版本: 0.1  
状态: 草稿（基于项目简介自动生成）  
Owner: 潘端端  
Reviewers: 待定  
生成依据: docs/brief.md

---

## 1. Goals and Background Context

### 1.1 Goals
- 先同步 DOORS 中的需求为“原始需求”，再将原始需求转化为“系统需求”
- 指标拆解完成后开展系统设计与分析，并据此形成 RBOM
- 形成 RBOM 后分为两条链路：
  - 主链路：需求伴随/指标分配 → 对象/组件实现 → 验证
  - 支链路：变更 → 差异 → 通知 → 回归

### 1.2 Background Context
CDM 需求集成 MVP 面向使用 DOORS 的工程团队，解决跨系统需求与变更缺乏统一口径与闭环的问题，导致下游设计/验证反应滞后、追溯困难与返工增加。通过最小改造形成端到端链路，优先保障可演示、可复核、可追溯，并在单模块试点中以 Part 级 RBOM 为现实切口，逐步扩展到多维度、评分与外部系统对接。MVP 集成策略：使用 Mock 数据/适配器进行对接验证，待评审通过后可按环境变量切换至真实端点。

### 1.3 Change Log
| Date       | Version | Description                              | Author |
|------------|---------|------------------------------------------|--------|
| 2025-09-22 | 0.6     | 增补 RBAC/视图/导出治理（默认拒绝/审批/水印） | PM     |
| 2025-09-22 | 0.5     | 动态表格增强：列级权限/视图共享/导出映射      | PM     |
| 2025-09-22 | 0.4     | 调整 Post‑MVP、重构 Epics 与 Next Steps    | PM     |
| 2025-09-22 | 0.3     | 更新范围与KPI；补充约束/假设/风险与缓解措施   | PM     |
| 2025-09-22 | 0.2     | 新增“动态建模（仅需求条目）与低代码配置能力” | PM     |
| 2025-09-22 | 0.1     | 更新目标与背景；加入 Mock 集成说明        | PM     |
| 2025-09-19 | 0.1     | 首版 PRD 草稿（基于项目简介生成）         | PM     |

---

## 2. Requirements

### 2.1 Functional Requirements (FR)
- FR1: 支持导入 DOORS REQIF（首选），可选兼容 CSV；支持通过 DXL 直接同步 DOORS 中的需求（MVP 使用 Mock，同步与接口预留真实端点切换）
- FR2: 维护系统需求模板与中英映射，可配置并可冻结基线（版本化）
- FR3: 从原始/系统需求中抽取指标，支持规则/正则/词典（MDM）、大模型抽取（LLM），并提供人工复核兜底
- FR4: 统一单位/量纲并进行换算；校验范围/阈值与取值域
- FR5: 溯源与去重（ModuleID/ObjectID/BaselineID；来源ID+标题/内容哈希）
- FR6: 需求/指标绑定 RBOM（Part 级），建立最小 RBOM 基线
- FR7: 系统需求支持拆分/合并，并保留溯源关系
- FR8: 支持需求结构管理，结构与 DOORS 模块对应（按模块/层级浏览与统计）
- FR9: 系统需求支持新增/修改/删除；从 DOORS 同步的需求不可删除（仅允许状态/属性更新）
- FR10: 支持查询与过滤（按模块/版本/状态/责任人/关键字等）
- FR11: 支持自动编码，编码规则可配置（前缀/序列/位数/校验）
- FR12: 生成差异（变更类型/对象/级别/责任人），支持过滤/分组/导出（CSV/Markdown）
- FR13: 差异派生更改单/变更包并自动路由责任人
- FR14: 站内信/OA 通知（支持合并），记录送达/阅读/确认
- FR15: 工作包下发与收件箱 Ack 确认（责任到人）
- FR16: 接收交付物与验证结果（文件/链接 + 结构化结论），与需求/指标/用例双向追溯
- FR17: 当影响≥中时，自动将相关用例标记为失效并派生更新任务
- FR18: 按变更包生成回归批次；看板按 RBOM 层级展示通过率/阻塞项/剩余工作量
- FR19: 需求反写 DOORS：将状态、交付物等信息写回（MVP 使用 Mock，预留真实端点切换）
- FR20: 标杆对比：导入/维护标杆产品的核心指标，自动对比并识别风险项
- FR21: 需求规格说明书（SRS）导入与导出（DOC/DOCX 优先；选配 Markdown）
- FR22: 型谱选用：从需求指标/条目出发，推荐型谱化产品（可多选），给出匹配理由；支持 Top-N 推荐与规则可配置（权重/得分阈值）
- FR23: 提供 API 端点：/import, /diffs, /changes, /notifications, /rbom, /metrics, /dispatch, /work-packages, /deliverables, /verifications, /closure
- FR24: 审计日志：记录导入/修改/通知等关键操作（操作者、时间戳、对象、结果），支持查询
- FR25: 集成要求：DOORS REQIF/（可选 CSV）导入、RBOM 数据源导入、站内信/OA HTTP 适配（MVP 用 Mock；DXL 同步与 DOORS 反写预留）

（动态建模与低代码配置能力：仅覆盖“需求条目”实体）
- FR26: 需求元模型配置：仅对“需求条目（原始/系统需求）”支持自定义字段与属性描述，允许按模块定义字段集合与可见性
- FR27: 需求字段类型与校验：支持文本/富文本、数值（含单位）、布尔、日期/时间、枚举（词典/MDM）、多选、引用（需求间关联）、附件、JSON、公式/计算字段；支持必填/默认值/范围/正则等校验
- FR28: 需求模型版本化与迁移：字段/结构变更须版本化与审计；提供数据迁移策略（自动/脚本）；保障与 DOORS 字段映射的兼容性；支持基线冻结与回滚
- FR29: 需求动态表单与列表：基于需求元模型自动生成“创建/编辑/查看”表单与列表视图；支持布局与条件显隐、字段级只读/隐藏（按角色），提供预览
- FR30: 需求规则与触发（MVP 最小）：支持对需求条目配置最小触发器（如字段变更→派发通知/任务）；后续扩展低代码规则引擎（权重/阈值可配置）
- FR31: 需求元模型 API：提供获取需求元模型/字段定义与动态校验的 API；支持对自定义字段的查询/过滤/排序（含 JSONB 路径）
- FR32: 权限：需求元模型/字段/规则变更仅限特定角色（建议新增 Configurator），支持字段级权限（可见/编辑）
- FR33: 审计：需求模型与配置变更需完整留痕（操作者/时间/差异），支持回滚
- FR34: 需求动态表格：基于需求元模型生成可配置表格视图（列选择/顺序/冻结与宽度、排序/筛选/分组/汇总、列公式）；支持内联编辑（受字段权限）、批量操作、保存/共享视图（用户/角色）、导出 CSV/Excel；支持服务端分页/排序/过滤
 - FR35: 列级权限：按角色/条件控制需求字段/表格列的可见/可编辑（服务端强制），默认拒绝（deny-by-default）；所有访问与变更写审计
 - FR36: 视图共享与治理：视图可设为私有/团队/组织/角色；支持发布/下线、默认视图置顶、Owner/Editor/Viewer 权限模型与版本审计
 - FR37: 导出映射与预设：导出 CSV/Excel 时复用字段映射与多语言表头；支持保存导出预设（与 SRS 模板字段映射一致），导出遵循列级权限

### 2.2 Non-Functional Requirements (NFR)
- NFR1: 性能目标：10 条样本导入 < 2 分钟；导入后 ≤ 5 分钟内完成差异与通知
- NFR2: 可靠性与运营目标：通知送达率 ≥ 99%，阅读/确认率 ≥ 95%；回归通过率 ≥ 90%，阻塞项清零 ≤ 2 天
- NFR3: 安全与权限：RBAC（Viewer/Editor/Reviewer/Admin）；最小权限；只读/编辑边界清晰
- NFR4: 合规与审计：全链路审计日志；配置化枚举与词典（MDM）加载；环境变量管理（.env），密钥不入库
- NFR5: 隐私与保密：数据“永久保留”，保留与访问须符合企业保密规定（保密要求优先）
- NFR6: 本地化与时间：ISO 8601 + Asia/Shanghai（UTC+8）
- NFR7: 可恢复性：关键流程提供严格人工回滚 SOP，并完整留痕
- NFR8: 可观测性：采集系统日志、队列事件、数据库聚合以支撑 KPI 统计
- NFR9: 可配置性：词典/映射可热更新，尽量避免频繁发版
- NFR10: 集成策略：MVP 使用 Mock 适配器，可通过环境变量切换真实端点
 - NFR11: RBAC 治理：默认拒绝（deny-by-default）；服务端强制字段/列级权限；角色矩阵（Viewer/Editor/Reviewer/Admin/Configurator）；配置变更需审计
 - NFR12: 视图共享治理：视图支持私有/团队/组织/角色范围；“组织/角色级发布”需至少 1 名 Reviewer 审批；支持有效期（TTL）、撤销与历史版本审计；定期（周）输出共享视图清单与访问统计
 - NFR13: 导出治理：导出遵循同一权限检查；默认开启水印（导出者、时间、视图ID/traceId）；支持字段脱敏与列白名单；导出条数/频率可限流，支持审批阈值（如>5k 行需审批）
 - NFR14: 违规检测：未授权访问/导出告警；失败/绕权重试封禁（含 IP/账号）；每月安全巡检（密钥/依赖/审计抽样）

---

## 3. User Interface Design Goals

> 注：以下为产品级 UI/UX 目标，不是详设规格；“待确认”项将在后续评审或头脑风暴中补充。

### 3.1 Overall UX Vision
- 以“闭环透明度”为核心，突出导入→差异→变更→通知→验证/回归的链路状态与留痕
- 表格驱动的信息密集视图 + 明确的筛选/分组/导出能力；关键节点展示责任人与状态
- 采用向导式导入与预检，降低首轮试点的操作复杂度与出错率

### 3.2 Key Interaction Paradigms
- 向导式导入/预检 → 合法性报告 → 一键进入流水线
- 主线/支线组织：主线（需求伴随/指标分配 → 对象/组件实现 → 验证）、支线（变更 → 差异 → 通知 → 回归）
- 配置/使用分区：配置中心与操作中心分离（模板/映射/词典、编码、集成、规则）；配置变更需审计
- 列表/明细双栏：差异报告、变更包/更改单、通知投递与确认
- RBOM 层级视图 + 影响范围定位；回归看板的分组/过滤/穿透

### 3.3 Core Screens and Views（统一组织）

- 主线（使用）：
  - 需求结构管理（按 DOORS 模块/层级浏览与统计；支持拆分/合并、CRUD〔同步来源不可删〕）
  - 需求列表（动态表格视图：列/筛选/排序/分组/汇总、内联编辑、保存/共享视图、导出）
  - 指标抽取与分配（抽取结果复核、分配到对象/组件、异常项处理）
  - 对象/组件实现跟踪（需求伴随到实现的状态视图，责任到人）
  - 验证与回归（用例失效标记、更新任务、回归批次）
  - 闭环看板（闭环率、未确认、待回传、回归批次链接）
  - 工作包/收件箱（批量下发、Ack 确认）
  - 交付物与验证结果（上传/链接、验证结论录入）

- 支线（使用）：
  - 差异报告（过滤/分组/导出）
  - 变更包/更改单（明细、生命周期与通知状态）
  - 通知中心（站内信/OA 送达/阅读/确认）
  - 回归批次与看板（按 RBOM 层级展示通过率/阻塞/剩余）

- 跨域（使用）：
  - 导入与预检（REQIF/DOCX/SRS 导入向导，字段完备度与校验报告）
  - 查询中心（模块/版本/状态/责任人/关键字的统一检索与过滤）
  - RBOM 视图（层级/搜索/影响热力图占位）
  - SRS 导入/导出（DOC/DOCX 优先；选配 Markdown）
  - 标杆对比（对比标杆核心指标，风险识别与解释）
  - 型谱选用（从指标/条目选择，Top‑N 推荐与匹配度解释）

- 配置（配置中心）：
  - DOORS 集成（REQIF 导入、DXL 同步、反写配置；MVP 标注 Mock，可切换真实端点）
  - 模板/映射/词典（MDM 管理）
  - 编码配置（前缀/序列/位数/校验与预览，批量重编码工具）
- 需求模型/字段配置（仅需求实体；字段类型与校验、版本与基线、字段级权限）
  - 需求表单/表格与视图设计器（动态表单与动态表格：列/布局、条件显隐、预览、保存视图、视图共享设置）
  - RBOM 基线与层级命名（规范设置与基线冻结）
  - 标杆库管理（标杆数据维护、来源与版本）
  - 型谱规则配置（权重/得分阈值与策略）
  - 规则/触发器配置（最小触发：需求字段变更→派发通知/任务）
  - SRS 模板管理（导入/导出模板与字段映射）
  - 通知/路由规则配置（责任人路由与消息合并策略）

### 3.4 Accessibility: 待确认

### 3.5 Branding: 品牌规范待定

### 3.6 Target Device and Platforms: 桌面 Web（不适配移动端）

---

## 4. Technical Assumptions
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

## 5. Architecture Overview
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

## 6. Scope

### 6.1 In Scope (MVP)
- REQIF 导入（兼容 CSV），导入预检与错误报告
- DOORS DXL 同步（MVP 使用 Mock，可切换真实端点）
- DOORS 反写（状态/交付物等，MVP 使用 Mock，可切换真实端点）
- 模板/映射/词典；指标抽取与口径统一（含 LLM 抽取与人工复核）；RBOM-Part 绑定与差异
- 需求元模型（仅需求实体）：自定义字段、动态表单、字段级权限、最小触发器、审计
- 编码配置：编码规则管理、预览、批量重编码工具
- 差异→变更包/更改单→责任人路由；站内信/OA 通知；严格人工回滚 SOP
- 验证与回归：用例失效与任务派生；按变更包生成回归批次；RBOM 层级分组看板
- SRS 导入与导出（DOC/DOCX 优先；选配 Markdown）
- 标杆对比：导入/维护标杆核心指标，自动对比与风险识别
- 型谱选用：从指标/条目选择，Top‑N 推荐与规则可配置，输出匹配理由
- 差异报告 CSV/Markdown 导出；工作包下发→Ack→交付物→验证→闭环留痕

### 6.2 Out of Scope (MVP)
- SLA、影响评分体系、外部工单系统对接
- 多维 RBOM 全量（功能/接口维度先留扩展位）
- 自动回滚（当前采用严格人工回滚 SOP）

---

## 7. Goals & Success Metrics

### 7.1 Business Objectives
- 3–5 天内完成单模块闭环演示并通过评审
- 产出模板/映射/差异报告/变更包/通知日志/回归看板样例
- 建立 RBOM-Part 绑定与基线，至少生成 1 份差异报告
- 指标抽取准确率 ≥ 90%（试点），关键项人工复核覆盖

### 7.2 User Success Metrics
- 变更响应时长缩短 ≥ 40%
- 追溯耗时降低 ≥ 60%
- 影响≥中用例自动失效标记率 = 100%
- 任务分发到人准确率 ≥ 95%
- 下发→Ack 中位数 ≤ 8 小时（以试点测得为准）

### 7.3 Key Performance Indicators (KPIs)
- 差异→任务派生时间中位数 ≤ 8 小时
- 抽取准确率 ≥ 90%（试点），稳态目标 ≥ 95%
- 通知送达率 ≥ 99%，阅读/确认率 ≥ 95%
- 回归通过率 ≥ 90%，阻塞项清零 ≤ 2 天
- REQIF 导入成功率 ≥ 99%（样本集）；导入失败可复核比例 = 100%
- DXL 同步/反写 Job 成功率 ≥ 99%（MVP Mock）；端到端 P95 ≤ 60s（Mock 环境）
- 需求模型/配置变更到生效平均时长 ≤ 10 分钟（含审批与发布）
- 动态表单渲染/校验 P95 ≤ 200ms（单页）
- 动态表格首屏渲染 P95 ≤ 300ms；列/筛选交互响应 P95 ≤ 200ms（服务端分页）
- 导出 P95 ≤ 5s（≤5k 行，CSV/Excel；遵循列级权限与字段映射）
 - 未授权访问/导出事件 = 0（按月）；视图审批平均时长 ≤ 1 工作日；视图过期治理合规率 = 100%
- SRS 导出完整性 = 100%；SRS 导入字段映射覆盖率 ≥ 90%
- 标杆对比覆盖率/命中率、型谱 Top‑N 推荐接受率（数值阈值：待确认）
- 数据来源：系统日志、队列事件与数据库聚合

---

## 8. Constraints & Assumptions

### 8.1 Constraints
- Timeline: 单模块试点周期 3–5 天
- Resources: 业务分析/系统工程/后端 各 1（最小配置）
- Technical（技术约束）:
  - 数据库仅支持 Postgres 15（启用 JSONB 与 GIN 索引），不做多方言兼容
  - Node.js 20 LTS；Yarn 3（Berry）Workspaces，启用 Corepack；CI 固定 Node 次要版
  - 仅桌面 Web，不支持移动端适配
  - 暂不对接外部工单；采用手动同步与轻量流程
- Security/Compliance（安全与合规）:
  - 数据“永久保留”，备份加密与日志脱敏必须落实；密钥不入库（env/vault），使用 dotenv-safe/envalid 校验环境变量
  - 禁止打印 PII/密钥；提交前执行密钥扫描（如 gitleaks）
- Observability（可观测性）:
  - 必须使用结构化 JSON 日志（Pino），Prometheus `/metrics` 暴露应用/队列/DB 指标
  - 统一 requestId/traceId 贯穿（OTEL 上下文），错误结构统一
 - Governance（治理）:
   - 视图发布到“组织/角色”范围需审批（至少 1 名 Reviewer）；默认有效期 90 天（可续期）；过期自动下线
   - 导出默认水印与字段脱敏开启；>5k 行导出需审批与限流；导出记录包含视图/traceId/请求者

### 8.2 Assumptions
- 提供 DOORS 导出样本与 RBOM 片段（含必要字段）；可获得 DXL 测试环境或录制样本
- 可快速冻结模板/映射/词典的 MVP 版本
- 站内信/OA 可直接作为通知渠道（MVP 使用 Mock）
- SRS 模板（DOC/DOCX）可提供并允许字段绑定映射
- 提供标杆核心指标样本与初版型谱规则（可先以 CSV/JSON 维护）
- LLM 抽取可使用指定服务或离线模型；策略允许超时/重试/人工复核
- 动态建模初版以 JSON Schema + JSONB 实现（仅覆盖需求实体；不引入额外 NoSQL），后续如需可评估插件式扩展

---

## 9. Risks & Open Questions

### 9.1 Key Risks
- REQIF 规范差异或供应商扩展导致解析失败/字段丢失
- DXL 接口访问受限（权限/网络/频率限制）或变更影响同步稳定性
- LLM 抽取产生幻觉/不一致，或命中敏感词导致风控
- 需求元模型变更引发字段映射漂移（与 DOORS/导出模板不一致）
- JSONB 未建立合适索引导致查询退化；大表迁移风险与锁表
- 回滚流程不清引发状态混乱；长链路任务缺乏补偿机制
- 交付物格式/体积与存储受限；人工回传一致性与可核验性不足
- 日志/数据保留与保密要求冲突（PII/敏感字段未正确脱敏/加密）
 - 列级权限配置错误导致数据越权泄露；导出绕过权限校验

### 9.3 Mitigations（缓解措施）
- REQIF：引入预检与字段映射报告；覆盖主流厂商样本用例；失败项人工复核
- DXL：限流与重试；隔离测试环境；接口契约版本固定与回放测试
- LLM：超时/重试与置信阈值；人工复核兜底；Prompt 与输出审计脱敏
- 元模型：版本化与基线冻结；变更前差异评估与迁移脚本；回滚预案
- 性能：为常用 JSONB 路径建 GIN 索引；批处理与分页；读写分离按需评估
- 审计与合规：统一日志字段；敏感字段脱敏；密钥扫描与依赖巡检；备份加密与访问控制
 - 权限与导出：服务端强制字段白名单/策略；导出与查询复用同一权限校验；默认拒绝；关键视图需双人复核与审计

### 9.2 Open Questions（含用户补充）
- RBOM 层级与命名规范的最终确定时点？（待确认）
- 指标抽取验收阈值（稳态≥95%？）→ 后续使用头脑风暴确定
- 责任人路由与消息合并的管理权限边界？（待确认）
- 回传是否需要审批/签署流程？交付物保留周期与敏感数据处理策略？→ 永久保留，须符合保密规定
- 里程碑与时间线（具体日期/评审窗口）→ 待定

---

## 10. Post-MVP Vision
- 多维 RBOM（功能/接口）与继承/聚合/权重策略
- 影响评分与等级映射；SLA 策略与阈值
- 自动化基线对比与接口冻结策略（与变更窗协同）
- 外部工单/看板系统深度集成（双向同步、状态机映射）
- LLM 抽取与对齐增强（校验器与领域适配器）、提示工程与评测体系
- 移动端适配与可离线模式（只读）
- 多租户与更细粒度 RBAC/ABAC；审计报表与合规模板

---

## 11. Epics Plan（MVP 草案，待确认）

- Epic 1: 基础设施 / 契约 / 观测
  - 目标：Yarn 3 Workspaces、ESLint/Prettier/Husky、Vitest/Jest；Pino+OTEL、Prometheus /metrics；Nest Swagger + OpenAPI 生成脚本；Prisma 基线；gitleaks + dotenv-safe/envalid；健康检查/金丝雀路由

- Epic 2: 集成与导入（REQIF / DXL / SRS / 编码）
  - 目标：REQIF 导入与预检（兼容 CSV）；DXL 同步（Mock，可切换真实端点，增量+幂等）；SRS DOC/DOCX 导入/导出最小实现；编码规则管理与批量重编码；MDM/词典装载

- Epic 3: 需求元模型与动态表单（仅需求实体）
  - 目标：meta_requirements* 元数据表与 JSONB 扩展；/meta/requirements* API；字段/列级权限与审计；表单与表格（动态表格视图）与视图设计器（含共享设置）；导出映射与预设；最小触发器（字段变更→通知/任务）

- Epic 4: 指标抽取与 RBOM 绑定
  - 目标：规则/正则/词典 + LLM 抽取（异步 Job、超时/重试/人工复核、审计）；RBOM 基线与 Part 级绑定；差异生成与导出

- Epic 5: 变更编排与通知
  - 目标：差异→更改单/变更包；责任人路由与 Ack 流；站内信/OA 通知（合并、送达/阅读/确认留痕）；工作包下发与追踪

- Epic 6: 验证与回归闭环
  - 目标：影响≥中用例失效与任务派生；按变更包生成回归批次；RBOM 层级看板与闭环状态/覆盖计算

- Epic 7: 标杆对比与型谱选用
  - 目标：标杆库导入/维护与对比（风险识别与解释）；型谱规则配置；Top‑N 推荐与匹配度解释

> 注：故事与验收标准将在后续故事化阶段拆解，保持单次执行可完成（2–4 小时粒度）。

---

## 12. Next Steps
1) 工具链/CI：Yarn 3 配置（.yarnrc.yml/nodeLinker）、Husky/lint-staged/commitlint、ESLint/Prettier、Vitest/Jest、GitHub Actions 工作流；分支保护
2) 契约/观测：Nest Swagger 暴露 /api/__openapi.json；脚本 `api:types`/`api:client`；Pino+OTEL 中间件；Prometheus /metrics
3) 数据与迁移：Prisma 基线（requirements/metrics/rbom_nodes/...）；meta_requirements* 与 JSONB extras；索引策略（GIN）
4) 适配器：doors-adapter（REQIF 解析 + DXL Mock 客户端 + 切换开关）；notifications-adapter（站内信/OA Mock）
5) 导入/预检：REQIF 预检规则与报告；SRS DOC/DOCX 映射模板与导出格式；编码规则配置与批量重编码
6) 元模型与表单/表格：需求字段模型配置、字段/列级权限与审计；表单/表格（动态表格视图）与视图设计器（含共享设置）最小实现；导出映射与预设；触发器（字段变更→通知/任务）
6.1) 治理落地：视图审批流（Reviewer 审批→发布→到期自动下线/续期）；导出水印与脱敏策略；>5k 行导出审批与限流；共享视图周报
7) 抽取与差异：规则/正则/词典 + LLM 抽取 Job；RBOM 绑定与差异生成；导出（CSV/Markdown）
8) 变更/通知/闭环：更改单/变更包与路由；Ack 收件箱；通知合并与留痕；回归批次/看板与闭环状态
9) 标杆/型谱：导入样本数据与规则；Top‑N 推荐与解释
10) 合规：dotenv-safe/envalid 校验；gitleaks；日志脱敏策略与备份加密预案

---

## 13. Ownership
- Owner: 潘端端
- PM: John（文档编制）
- Reviewers: 待定（架构/后端/QA/MDM/PMO）

> 集成策略：MVP 全程使用 Mock 数据；真实端点与适配器在后续评审通过后再切换。
