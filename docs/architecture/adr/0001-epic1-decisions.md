# ADR-0001：Epic 1 设计阶段决策集锦

状态：拟定（Proposed）
日期：2025-09-22
范围：Epic 1 基础设施 / 契约 / 可观测性

## 背景
本 ADR 汇总 Epic 1 在设计阶段达成的关键决策与实施指引，作为进入开发阶段的统一依据。执行层面对应 Story 1.1–1.10。

## 决策与指引

1) 工具链与工作区（Story 1.1）
- Node：20 LTS；启用 Corepack
- Yarn：Berry（v3），不可变安装（`yarn install --immutable`）
- 工作区：`apps/*`、`packages/*`
- `.yarnrc.yml`：`nodeLinker: node-modules`

2) 代码规范与提交检查（Story 1.2）
- ESLint：TS/React/Promise/Prettier 插件；基础规则：单引号、120 列
- Prettier：与 ESLint 对齐；统一格式
- 提交钩子：Husky + lint-staged（eslint --fix + prettier -w）
- Commit 规范：Conventional Commits，保留 `commitlint.config.js`

3) 测试基线（Story 1.3）
- Web 测试框架：Vitest
- API 测试框架：Jest 或 Vitest（二选一）
- 覆盖率：设定门槛（建议单元 80%）；CI 收集与产出报告
- 脚本：`test:client`、`test:server`、`coverage`

4) 数据与迁移（Story 1.4）
- ORM：Prisma；提交首个迁移；CI 运行 `migrate deploy`
- 回滚：提供最小回滚/差异验证（`prisma migrate diff`）
- 索引：根据查询为 JSONB/高频字段补足（必要时 raw SQL 迁移）

5) 契约与生成（Story 1.5）
- OpenAPI：保留生成脚本（导出/光谱/diff/类型/客户端）
- 运行时：暴露 `/api/__openapi.json`（与生成产物一致）
- 生成物：类型与客户端串入构建/发布流程

6) 日志与追踪（Story 1.6）
- 日志：Pino 结构化；字段：ts/level/service/env/domain/msg/traceId/reqId/duration_ms/error
- 追踪：OpenTelemetry；注入 requestId/traceId；响应回传 `x-trace-id`
- 脱敏：字段白名单 + 机密过滤；禁止打印 PII/密钥

7) 指标与健康（Story 1.7、1.8）
- 指标：Prometheus `/metrics`；默认进程与 HTTP 指标；提供示例告警
- 健康：`/api/__health_check` 返回版本/时区；提供金丝雀页/路由

8) 安全基线（Story 1.9）
- 运行时配置：dotenv-safe/envalid 校验必填；提供 `.env.example`
- 供应链：CI 保持 gitleaks + OSV 扫描

9) CI 与分支保护（Story 1.10）
- 质量作业：install --immutable、lint、prettier:check、type-check、test、build
- 受保护分支：main/next/develop 禁止直推；要求 `contracts`、`security`、`build` 状态通过；≥1 Reviewer

## 影响
- 提升可重复性与可观测性；形成一致的质量门禁
- CI 时长增加需通过缓存与并行优化

## 待办（进入开发时落地）
- 脚手架与配置文件落地（.yarnrc.yml、Husky、ESLint/Prettier、测试配置）
- 服务端路由与中间件实现（OpenAPI、健康检查、日志/追踪、指标）
- CI 工作流补全与分支保护在仓库设置中启用

