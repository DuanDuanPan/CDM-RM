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

