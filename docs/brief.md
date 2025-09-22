# Project Brief: CDM 需求集成 MVP

Version: v1.0  
Last Updated: 2025-09-19  
Owner: 潘端端  
Reviewers: 待定

## Introduction
本项目旨在于单模块范围内，于3–5天内打通“DOORS→系统需求→指标→RBOM→差异→变更单/变更包→站内信/OA→验证/回归”的最小闭环，形成可演示、可复核的端到端链路。

- 范围（包含）：
  - 系统需求模板与映射（DOORS→系统需求）
  - 指标抽取与口径（中英匹配、词典/MDM、单位/量纲、范围/阈值、去重）
  - RBOM 按 Part 绑定与基线；差异报告关键字段（变更类型/对象/级别/责任人）
  - 变更单/变更包 → 责任人分发；站内信/OA 通知；严格的人工回滚机制（SOP）
  - 验证与回归：用例/工况更新规则、按变更包生成回归批次、RBOM层级分组看板样例
- 范围（不含）：SLA、影响评分、外部工单对接、多维RBOM（功能/接口维度暂留扩展位）
- 依据输入：docs/brainstorming-session-results.md、DOORS导出样本（必要字段）、RBOM片段（含Part标识）
- 成功判据：
  - 1条完整样例链路（DOORS→…→验证/回归）
  - 1份差异报告 + 1个变更包
  - 通知记录日志（站内信/OA）
  - 回归看板样例（通过率/阻塞项/剩余工作量）

### Stakeholder Round Table（利益相关方视角要点）
- 赞助人/业务负责人：
  - 价值验证：3–5天完成闭环演示
  - 关注度量：差异报告可见、任务完成率
- 产品负责人（PO）：
  - MVP 边界：不做 SLA/影响评分/外部工单对接
  - 成果物：模板、映射表、变更单/包样例与试点回放
- 系统架构/系统工程：
  - 决策：RBOM 以 Part 为绑定起点，预留功能/接口扩展
  - 基线：DOORS 与 RBOM 最小基线对齐，支持差异追溯
- 开发负责人（后端/集成）：
  - 技术切口：DOORS 导出→映射→指标抽取（规则/正则/词典）→RBOM 绑定→差异构建→消息发送
  - 风险：字段异构与词汇歧义，先以人工复核兜底
- QA/验证：
  - 规则：影响≥中→用例失效并派生更新任务；回归按变更包分批
  - 留痕：报告/模型/日志/审计链
- 合规/数据治理（MDM）：
  - 要求：单位/量纲统一、枚举取值域纳入词典
  - 追溯：来源ID+标题/内容哈希作为去重/关联锚点
- 下游专业负责人（方案/详设/仿真/验证）：
  - 依赖：验证环节依赖 RBOM 基线；允许消息合并与人工回滚
  - 诉求：差异报告明确变更类型、影响对象、级别、责任人
- 项目经理/PMO：
  - 组织：单模块试点、周内评审冻结；站内信/OA 作为唯一通知渠道
  - 风险控制：不引入外部工单对接，先保证闭环

#### 潜在冲突与协同
- 冲突：
  - 完备评分体系 vs 先行闭环 → 先不做影响评分，仅“必触发+责任人路由”
  - 自动回滚 vs 人工严格回滚 → 当前阶段选择后者并制定 SOP
  - 单维 RBOM-Part vs 多维扩展 → 先 Part，预留功能/接口扩展
  - 对接外部工单 vs 内置轻流程 → 先不对接，集中站内信/OA
- 协同：
  - 共识 MVP：DOORS→系统需求→指标→RBOM→差异→变更包/单→通知→验证/回归
  - 关键基建：模板/映射/词典/基线/差异字段
  - 快速试点 + 轻评审 → 尽快形成可演示成果

---

## Executive Summary
• 产品概念（1–2句）：CDM 需求集成 MVP 在单模块内打通“DOORS→系统需求→指标→RBOM→差异→变更包/单→站内信/OA→验证/回归”的最小闭环，提供可演示、可复核的端到端链路。

• 主要问题：跨系统需求与变更缺乏统一口径与闭环，导致下游设计/验证效率低、追溯性差、响应滞后。

• 目标用户：使用 DOORS（或同类）进行需求管理、需要联动设计与验证的复杂工程团队。

• 关键价值：3–5天完成可演示闭环，形成差异报告与任务分发的运营闭环；以 Part 级 RBOM 为现实切口，后续可扩展功能/接口维度。

• 取舍与假设：先闭环后完善（不含 SLA/影响评分/外部工单对接）；RBOM 聚焦 Part 并预留扩展位；统一站内信/OA 通知；采用严格的人工回滚 SOP；词典/MDM/单位量纲逐步补齐、人工复核兜底。
• 试点范围：单模块、5–10 条样本、3–5 天。

## Problem Statement
跨系统的需求与变更缺乏统一口径与闭环，导致下游设计/验证对上游变化反应滞后、追溯困难、返工增加。在现有流程中，DOORS 等上游工具与设计/验证侧的数据链路未形成可度量的闭环，指标抽取与 RBOM 映射不稳定，差异难以及时传导到变更与任务层。

• 当前痛点（现状与症状）
- 口径不统一：中英混用、单位/量纲不一致、取值域分散，指标抽取准确率不稳，重复与歧义并存
- 变更无法闭环：更多依赖人工同步，缺少统一的差异报告与自动派生的变更单/变更包与通知
- RBOM 关联薄弱：以 Part 级为主但缺少明确的基线与差异字段集，影响范围难以快速定位
- 协同碎片化：站内信/OA/线下沟通并存，责任路由与回滚机制依赖经验与临时协调

• 影响与风险（基线值待试点回填）
- 变更响应时长偏长（具体比例以试点测得为准），设计/验证返工率上升（以试点测得为准）
- 追溯耗时高（单位工时以试点测得为准），里程碑延期风险与质量合规风险增加

• 既有方案不足之处
- 工具割裂：DOORS 负责需求管理但未形成到 RBOM/变更/验证的端到端数据线程
- 缺统一模板/映射/词典与基线机制，难以标准化与复用

• 紧迫性与时机
- 通过 3–5 天单模块试点，先形成最小闭环与可演示样例，再渐进扩展到评分、SLA、外部工单与多维 RBOM

• 证据与示例（占位）
- 将在样本导出与试点运行后补充：字段异构清单、抽取误差样例、差异到任务的传导延迟样例
- 回补来源：样本导出、访谈纪要与日志审计

## Proposed Solution
概述：以最小改造形成端到端闭环，优先可演示、可复核、可追溯。

- 实施链路：DOORS 导出 → 系统需求模板映射 → 指标抽取（规则/正则/词典/人工兜底） → RBOM 按 Part 绑定 → 差异报告 → 变更包/更改单 → 责任人分发与站内信/OA → 用例/工况更新与回归批次/看板
  - 端点示例：/import, /diffs, /changes, /notifications, /rbom, /metrics
  - 典型场景：指标/需求下发 → 专业组开展工作（方案/详设/仿真/验证等模块） → 验证结果回传 → 需求验证闭环（用例/工况更新与回归批次）
  - 下发/回传端点：/dispatch, /work-packages, /deliverables, /verifications, /closure（MVP 强制 Ack 确认代替 SLA/评分）

分角色方案要点：
- 赞助人/业务负责人：3–5 天闭环演示；以差异报告 + 任务分发体现价值；不做 SLA/评分/外部工单以降低试点对接成本
- 产品负责人（PO）：MVP“做/不做”清单明确（做：模板/映射/指标/RBOM/差异/变更/通知/回归；不做：SLA/评分/外部工单）；试点验收物为样例链路、差异报告、变更包、通知日志、回归看板样例
- 架构/系统工程：RBOM 自 Part 维度切入并建立最小基线与差异字段集；统一溯源键（ModuleID/ObjectID/BaselineID）与去重键（来源ID + 标题/内容哈希）
- 开发（后端/集成）：按实施链路逐步落地；以映射表/词典缓解字段异构；关键节点引入人工复核与严格回滚 SOP
- QA/验证：影响≥中则用例失效并派生更新任务；回归按变更包成批执行并在看板展示通过率/阻塞项/剩余量；全程留痕（报告/模型/日志/审计链）
- 合规/数据治理（MDM）：统一单位/量纲与枚举取值域；中英术语与参数描述标准化；完善版本/基线与审计日志
- 下游专业（方案/详设/仿真/验证）：验证依赖 RBOM 基线；支持消息合并与严格的人工回滚；差异报告含变更类型/对象/级别/责任人以利于快速定位
- PMO/项目管理：单模块试点 + 周内评审冻结；站内信/OA 统一通知渠道；先内置轻流程，后续评估对接外部工单

确认的取舍与约束：
- 先闭环后扩展：不含 SLA、影响评分、外部工单；RBOM 先 Part 并预留功能/接口扩展位
- 质量与安全优先：词典/MDM 逐步补齐 + 人工复核；严格且可审计的人工回滚 SOP
- 配置与词典：字段/词典（MDM）支持热更新，避免频繁发布阻塞

可扩展路径（远期）：
- 多维 RBOM（功能/接口）与权重/继承策略；影响评分与 SLA；对接外部工单；自动化对比与接口冻结；组织级度量与可视化

## Target Users

### Primary User Segment: 系统/需求工程师（DOORS负责人）
- 画像: 大型工程组织（航天/汽车/轨交等）；熟悉 DOORS；管理模块/对象/基线
- 行为: 维护需求与基线、导出数据、与系统工程/设计团队协作
- 痛点: 口径统一、模板映射、指标抽取、溯源与变更传导
- 目标: 提升 DOORS→系统需求/指标转换效率与准确率；缩短变更响应

### Secondary User Segment: 下游专业负责人（方案/详设/仿真/验证）
- 画像: 分系统/专业负责人；掌控设计任务与验证进度
- 行为: 接收变更通知、编排任务、管理 RBOM 基线、维护用例/工况
- 痛点: 差异报告清晰、RBOM 影响范围明确、自动派生任务、回归看板可视
- 目标: 快速定位影响、减少返工、增强可追溯与审计；看板使用频率：日常查看/每周评审

### Tertiary User Segment: 专业组执行人（设计/仿真/验证工程师）
- 画像: 具体执行人员，按专业/分系统分配
- 行为: 接收工作包（Ack）、开展方案/详设/仿真/验证、提交交付物与验证结果
- 痛点: 任务清晰度/责任到人/资料口径统一、交付物一处提交即可闭环
- 目标: 明确接收、降低返工、快速完成闭环；看板查看频率：日常

## Goals & Success Metrics

### Business Objectives
- 3–5 天内完成单模块闭环演示并通过评审
- 产出模板/映射/差异报告/变更包/通知日志/回归看板样例
- 建立 RBOM-Part 绑定与基线，至少生成 1 份差异报告
- 指标抽取准确率≥90%（试点），关键项人工复核覆盖

### User Success Metrics
- 变更响应时长缩短 ≥40%
- 追溯耗时降低 ≥60%
- 影响≥中用例自动失效标记率 =100%
- 任务分发到人准确率 ≥95%
 - 下发→接收确认（Ack）中位数 ≤8 小时（以试点测得为准）
 - 闭环完成率（试点样本）以试点测得为准

### Key Performance Indicators (KPIs)
- 差异→任务派生时间中位数 ≤8 小时
- 抽取准确率 ≥90%（试点），稳态目标 ≥95%
- 通知送达率 ≥99%，阅读/确认率 ≥95%
- 回归通过率 ≥90%，阻塞项清零 ≤2 天
（数据口径说明：采集自系统日志、队列事件与数据库聚合）

注：任务分发到人准确率定义为“首次分发命中责任人且无需重新指派”的比例。
 - 工作包一次通过率与交付物返工率（以试点测得为准）

## MVP Scope

### Core Features (Must Have)
- DOORS→系统需求映射：冻结模板字段与中英映射；溯源键（ModuleID/ObjectID/BaselineID）；去重键（来源ID+标题/内容哈希）
- 指标抽取与口径：规则/正则/词典（MDM）；单位/量纲统一与换算；范围/阈值与取值域规范
- RBOM：以 Part 级绑定为起点；建立最小基线；差异报告字段（变更类型/对象/级别/责任人）
- 变更编排与通知：差异→变更包/更改单→按责任人分发；消息合并后通过站内信/OA发送；严格人工回滚 SOP
- 验证与回归：影响≥中→用例失效并派生更新任务；按变更包生成回归批次；RBOM 层级分组看板（通过率/阻塞/剩余）
 - 差异报告导出：支持 CSV/Markdown 导出，便于外部评审与存档
 - 需求/指标下发与接收确认（Ack）：生成工作包，专业组在收件箱确认接收（责任到人）
 - 交付物与验证结果回传：支持文件/链接与结构化结论，双向追溯系统需求/指标/用例
 - 闭环状态与覆盖：更新需求验证闭环与覆盖率，并联动回归批次

### Out of Scope for MVP
- SLA（响应/完成时限）
- 影响评分体系（幅度/覆盖/关键度/成熟度）
- 外部工单/看板系统对接
- 多维 RBOM 全量（功能/接口维度先留扩展位）
- 自动回滚（当前为严格的人工回滚 SOP）
 - 接口冻结策略（仅记录指标，暂不实施）
 - 外部 PLM/ALM 工单对接（保留接口，当前不纳入）
 - 自动评分与 SLA（采用强制 Ack + 责任到人，不引入自动评分）

### MVP Success Criteria
- 1 条完整链路样例（DOORS→…→验证/回归）可演示、可复核
- ≥1 份差异报告与 1 个变更包产出并留痕
- 站内信/OA 通知记录可查询；回归看板样例展示关键指标
- 指标抽取试点准确率 ≥90%，关键项有人工复核
 - ≥1 条“下发→接收→交付→回传→闭环”的完整样例并留痕（审计日志/附件）

## Post-MVP Vision

### Phase 2 Features
- 多维 RBOM（功能/接口）与继承/聚合/权重策略
- 影响评分与等级映射；简化 SLA 规则
- DOORS 与 RBOM 的自动化基线对比与接口冻结策略
- 与外部工单系统松耦合集成（双向链接与同步；最小适配=单向推送+双向深链）

### Long-term Vision
- 数字线程：指标变化驱动仿真工况与验证数据自动更新与触发
- LLM/NLP 提升中英字段映射与指标抽取的置信度
- 组织级度量与可视化（成熟度、吞吐、响应/修复时长）

### Expansion Opportunities
- 扩展到多模块/多产品线；对接更多需求源（非 DOORS）
- 引入供应商/外部协作方的变更同步与验证共享

## Technical Considerations

### Platform Requirements
- Target Platforms: 内部 Web（单体仓库 Monorepo）
- Browser/OS Support: Chrome/Edge LTS（Windows 10+/macOS 12+）
- Performance Requirements: 10条样本导入<2分钟；导入后5分钟内完成差异与通知
- Time/Locale: ISO 8601 + Asia/Shanghai (UTC+8)

### Technology Preferences
- Frontend: Next.js 14+（App Router, React 18），Tailwind CSS 3.4+，shadcn/ui 组件库；Radix UI primitives；TanStack Table/Query（可选）
- Backend: NestJS 10（REST），Zod/DTO 双层校验，BullMQ（需要 Redis）
- Database/ORM: Postgres 15 + Prisma ORM；迁移用 Prisma Migrate
- Data Processing: DuckDB（本地/内存表）+ Node 流式处理；（备选：Python 工具链用于离线）
- Messaging/Integration: HTTP/Webhook 适配站内信/OA（先提供Mock适配器）
- Infra/Tooling: Node.js 20 LTS，pnpm 工作空间；ESLint/Prettier；Husky + lint-staged；Vitest/Jest（分别用于 web/api）

### Security & Config
- 环境变量：使用 .env.local / .env.production（按环境隔离），密钥不入库、不入 Git
- RBAC 角色（初版）：Viewer（只读）、Editor（编辑导入与数据）、Reviewer（审核与基线）、Admin（配置与字典）
- 审计：所有导入/修改/通知操作写入审计日志，含操作者与时间戳

### Architecture Considerations
- Repository Structure（Monorepo, pnpm）：
  - apps/web（Next.js + Tailwind + shadcn/ui）
  - apps/api（NestJS + Prisma + BullMQ）
  - packages/ui（可选：共享UI主题与组件封装）
  - packages/config（ESLint/TSConfig/Prettier共享）
- Service Architecture: 
  - API 层：REST（/import, /diffs, /changes, /notifications, /rbom, /metrics）
  - Jobs 层：BullMQ 队列（导入→映射→抽取→差异→变更→通知流水线；dispatch→ack 提醒仅提示不作为 SLA）
  - Storage：Postgres（业务数据），Redis（队列/缓存），DuckDB（就地计算）
  - API 扩展：/dispatch, /work-packages, /deliverables, /verifications, /closure（支持最小闭环）
- Integration Requirements:
  - DOORS 导出（CSV）导入端点与预检查；站内信/OA 通过HTTP适配；RBOM 数据源导入端点
- Security/Compliance:
  - 最小 RBAC（Viewer/Editor/Reviewer/Admin）；全链路审计日志；只读/编辑边界；数据留痕
  - 配置化枚举与词典（MDM）加载；环境变量管理（.env, Vault 可选）

### Data Model（初版表清单）
- requirements, metrics, rbom_nodes, diffs, change_orders, change_packages, notifications, audit_logs, lookups,
  work_packages, acknowledgements, deliverables, verifications, closures

## Constraints & Assumptions

### Constraints
- Timeline: 3–5 天单模块试点
- Resources: 业务分析/系统工程/后端各 1（最小配置）
- Technical: 暂不对接外部工单；采用手动同步与轻量流程

### Key Assumptions
- 提供 DOORS 导出样本与 RBOM 片段（含必要字段）
- 可快速冻结模板/映射/词典的 MVP 版本
- 站内信/OA 可直接作为通知渠道使用

## Risks & Open Questions

### Key Risks
- 样本不齐或字段异构严重，影响试点节奏
- 指标抽取准确率不足，导致下游误判
- 回滚流程不清引发状态混乱
 - 交付物格式/体积与存储受限；人工回传一致性与可核验性

### Open Questions
- RBOM 层级与命名规范的最终确定时点？
- 指标抽取验收阈值（稳态≥95%？）
- 责任人路由与消息合并的管理权限边界？
 - 回传是否需要审批/签署流程？交付物保留周期与敏感数据处理策略？

### Areas Needing Further Research
- 中英术语词典/MDM 的初版与维护机制
- 单位/量纲换算与范围/阈值表达标准
- 基线与差异的对比与留痕细则

## Appendices

### A. RBOM 层级命名规范（V1 采纳）
- 层级：System → Subsystem → Assembly → Part → Interface/Feature（已采纳）
- 命名规则：<层级缩写>-<语义名>-<序号>（示例：SYS-Power-01, ASM-Drive-03, PRT-Bolt-M8）
- 备注：试点阶段以 Part 为绑定起点，功能/接口维度留作扩展位

### B. 前端 UI 基线（Tailwind + shadcn/ui）
- 设计令牌：
  - 色板：slate/stone 为中性色，primary=blue（可按品牌调色）；支持 dark 模式
  - 圆角半径：md=8px；阴影与描边采用 shadcn 默认
  - 字体：系统字体栈（后续可上品牌字体）
- 组件集（初始安装）：
  - Layout：AppShell、Sidebar、Header、Breadcrumb
  - 基础：Button、Input、Select、Textarea、Checkbox、Radio、Switch、Tooltip、Badge、Avatar、Tabs、Accordion
  - 反馈：Dialog、Drawer、Toast（sonner）、Alert、Skeleton
  - 数据：Table（TanStack + shadcn 表格封装）、Card、Chart 占位（后续接入）
- 页面骨架：
  - 仪表盘（回归通过率/阻塞项/剩余量卡片）
  - 导入与预检页（上传CSV，展示预检结果）
  - 差异报告页（过滤/分组/导出）
  - 变更包/更改单页（明细与通知状态）
  - RBOM 视图（层级/搜索/影响热力图占位）
  - 暗色模式：默认随系统设置（可切换）
  - 下发中心/收件箱（批量下发、Ack 确认、责任到人）
  - 交付物与验证结果（上传/链接、验证结论录入）
  - 闭环看板（闭环率、未确认、待回传、回归批次链接）

### C. 术语表（Glossary）
- DOORS：需求管理工具，作为上游真源
- RBOM：需求/指标驱动的物料/功能结构树
- MDM：主数据/词典管理
- SLA：服务级别协议（本期不纳入）
- SOP：标准作业流程（用于严格人工回滚）

## Next Steps

### Immediate Actions
1. 提供 DOORS 导出样本与 RBOM 片段（5–10 条）（Owner: 待定）
2. 冻结系统需求模板与映射表（V1）（Owner: 待定）
3. 确认指标口径规范与去重/溯源键（Owner: 待定）
4. 产出 RBOM 基线与差异字段集（Owner: 待定）
5. 编排变更单/变更包与责任人分发规则；开通站内信/OA 发送（Owner: 待定）
6. 设定回归批次与看板样例；定义数据留痕（Owner: 待定）
7. 生成小样本数据校验报告（字段完备度、枚举映射差异、抽取准确率初测）（Owner: 待定）
 8. 定义工作包与验证结果的最小模板（Owner: 待定）
 9. 增加“下发→接收→回传→闭环”演示验收项（Owner: 待定）

### Scaffolding Plan（按方案2）
1. 初始化 Monorepo（pnpm）与基础工具链（ESLint/Prettier/Husky）
2. apps/web：Next.js + Tailwind + shadcn/ui 安装与主题配置；搭建仪表盘与导入页骨架
3. apps/api：NestJS 初始化；Prisma 连接 Postgres；BullMQ 连接 Redis；定义导入/差异/变更/通知端点与队列
4. 数据模型（Prisma 初版）：requirements, metrics, rbom_nodes, diffs, change_orders, change_packages, notifications, audit_logs, lookups
5. 适配器：站内信/OA Mock 适配器（可切换真实端点）
6. 导入流水线：CSV→预检→映射→抽取→差异→变更→通知（可回放；Mock 适配器可通过 ENV 切换真实端点）
7. 下发/回传：/dispatch→/work-packages（Ack）→/deliverables→/verifications→/closure 的最小实现与审计

### PM Handoff
This Project Brief provides the full context for CDM 需求集成 MVP. 请进入 PRD 生成流程，逐节评审并完善对应规范与实施计划。
