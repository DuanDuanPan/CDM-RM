# Day‑0 就绪清单（进入开发前）

版本：v0.1（草案）  
状态：待评审（PO）

## 目标
在不触发开发的前提下，统一并固化进入开发前的必要准备项与门槛（GO/NO‑GO），确保后续故事可被“低歧义、高确定性”地执行。

## 适用范围
- 项目类型：Greenfield（含 UI）
- 文档来源：`docs/prd.md`、`docs/architecture.md`、`docs/front-end-spec.md`、`docs/stories/`

## 必须完成项（Must‑Fix）

1) Monorepo & Yarn 3 基线
- 根 `package.json` 声明 `packageManager: yarn@3.x`（已具备）
- 新增 `.yarnrc.yml`，设定 `nodeLinker: node-modules`
- 根新增 `workspaces: ["apps/*", "packages/*"]`
- README 增补 `corepack enable`、`yarn install --immutable` 与工作区校验指令

2) 契约产物目录
- 建立 `packages/api-types` 与 `packages/api-client` 两个目录（含 README 占位）
- 对齐脚本：`api:types`/`api:client` 产物路径一致

3) CI 测试矩阵
- 现有 `contracts`/`security` 任务保留
- 新增 `quality` 任务：`lint`、`prettier:check`、`type-check`、`test:web`、`test:api`、覆盖率上传
- 分支保护要求：合并需以上状态全部通过

4) 环境与密钥基线
- 新增 `.env.example` 与变量说明清单
- 方案选型：`dotenv-safe` + `envalid`（或等价）
- 贡献指南中明确密钥不入库、轮换与审计要求

## 建议完成项（Should‑Fix）
- RACI：明确 Vercel/Supabase/Upstash/Render 账号创建、密钥归属与审批
- Storybook + A11y 检查：最小 Storybook 工程与 axe 检查
- 部署与运行手册：本地/CI/环境变量/首次运行/回滚示例
- 错误消息与 UX 文案：关键流程错误码与用户可读文案

## GO/NO‑GO 门槛（建议写入分支保护说明）
- Monorepo 工作区可列出且依赖安装可复现
- CI 包含契约/安全/测试三类门槛并生效
- 契约产物目录存在且可生成类型与客户端
- 环境与密钥治理文档与样例具备
- 按 Getting Started 最小路径可独立完成一次“拉仓库→安装→导出契约”

## 附：执行与校验建议
- 命令建议：
  - `corepack enable && yarn --version`
  - `yarn install --immutable`
  - `yarn workspaces list --json`
  - `yarn api:openapi && yarn api:types && yarn api:client`
- 产物快照：将 `docs/openapi.json`、`reports/*.sarif`、`reports/openapi-diff.txt` 作为 CI 工件上传

