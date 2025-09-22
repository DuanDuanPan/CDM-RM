# Getting Started（上手指南）

版本：v0.1（草案）  
状态：待评审（PO）

## 先决条件
- Node.js 20.x（仓库根已提供 `.nvmrc`）
- Yarn 3（通过 `corepack enable` 启用）
- 可选：Docker（本地 Postgres/Redis）

## 一次性设置
1. 启用 Corepack 并安装依赖
   - `corepack enable`
   - `yarn --version`
   - `yarn install --immutable`
2. 校验工作区（Monorepo）
   - `yarn workspaces list --json`
3. 本地依赖（如需）
   - `docker compose -f docker-compose.dev.yml up -d postgres redis`

## 最小路径（无开发，仅验证契约流水线）
1. 导出 OpenAPI：`yarn api:openapi`
2. 生成类型与客户端：
   - `yarn api:types`
   - `yarn api:client`
3. 契约检查（可选）：
   - 光谱规则：`yarn api:spectral`
   - 与基线对比：`yarn api:diff`

产物：
- `docs/openapi.json`
- `packages/api-types/src/index.ts`
- `packages/api-client/`（生成客户端）

## 常见问题（FAQ）
- Q: 安装失败或锁文件冲突？
  - A: 使用 `yarn install --immutable`，并确认 Node 版本匹配 `.nvmrc`。
- Q: 无法找到 `packages/*` 目录？
  - A: 确保 root 配置了 `workspaces`，并已创建 `packages/api-types`、`packages/api-client` 占位目录。
- Q: OpenAPI 未生成？
  - A: 先执行 `yarn api:openapi`，若 `docs/openapi.baseline.json` 存在将以其为基础；否则生成最小骨架。

## 后续（进入开发前）
- 按 `docs/ops/day0-readiness.md` 完成 GO/NO‑GO 门槛
- 明确 `docs/ops/raci.md` 责任与账号
- 评审 `docs/ops/deploy-runbooks.md` 并确认目标环境

