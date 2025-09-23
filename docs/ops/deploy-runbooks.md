# 部署与运行手册（Runbooks）

版本：v0.1（草案）  
状态：待评审（PO）

## 目标
为 CI/本地/目标环境提供最小可执行的运行手册，覆盖首次运行、契约导出、常见回滚路径。

## 环境与工件
- 目标环境：待定（建议：Web 用 Vercel、API 用 Render/Railway、DB 用 Supabase、Redis 用 Upstash）
- 工件：OpenAPI（`docs/openapi.json`）、类型与客户端包产物（`packages/api-*`）
- 监控：Pino + OTEL + Prometheus `/metrics`（按架构文档）

## 本地运行（最小）
1. 依赖：`docker compose -f docker-compose.dev.yml up -d postgres redis`
2. 契约：`yarn api:openapi && yarn api:types && yarn api:client`
3. （预留）API 启动：`yarn dev:api`（待脚手架）
4. （预留）Web 启动：`yarn dev:web`（待脚手架）

## CI 建议流程（草案）
- 安装：`corepack enable` → `yarn install --immutable`
- 契约：`yarn api:openapi` → `yarn api:spectral` → `yarn api:types` → `yarn api:client`
- 质量：`yarn lint && yarn prettier:check && yarn type-check && yarn test:web && yarn test:api`
- 工件：上传 OpenAPI、Spectral sarif、Diff 报告、覆盖率

## 数据库迁移（Database Migrations）
1. 准备环境变量：在 CI/本地均需设置 `DATABASE_URL`，开发环境额外推荐配置 `SHADOW_DATABASE_URL`（影子库可安全删除）。提交前可运行 `node scripts/validate-env.cjs`，该脚本基于 `dotenv-safe` 加载 `.env` 与 `.env.example` 并校验；迁移相关 Yarn 脚本会自动调用该校验。
2. 生成客户端：`yarn prisma:generate`（会调用 `apps/api` workspace 内的 Prisma CLI）。
3. 应用迁移：
   - 本地迭代：`yarn prisma:migrate`（运行 `prisma migrate dev`，生成 SQL 并同步数据库）。
   - 部署/CI：`yarn workspace @cdm/api prisma migrate deploy`，禁止在生产直接运行 `migrate dev`。
4. 回滚演练：`yarn prisma:rollback` 生成最新迁移与空数据库的 diff SQL，需在审阅或应急时手动执行。
5. 记录与审计：迁移日志保存在 `apps/api/prisma/migrations/<timestamp>_<name>/migration.sql`，提交 PR 时一并审核；必要时将回滚剧本补充至本手册。

## 环境变量与密钥（示例）
- `.env.example`：列出必需变量与说明
- GitHub Environments：`dev/staging/prod` 分离审批与 Secrets 注入
- 运行前验证：`dotenv-safe`/`envalid`（或等价）

## 回滚与恢复（建议）
- 数据库迁移：每次迁移提供撤销方案（Prisma Migrate）
- 配置回滚：保留上一版本环境变量快照
- 功能开关：对风险项以特性开关控制（默认关闭）
- 监控告警：部署后观察关键指标（错误率、延迟、队列堆积）

## 附录
- 观测目标：参考 `docs/architecture.md` 中 Observability/Monitoring 章节
- 错误处理：统一错误模型与用户反馈策略参考前端规范
