# CDM 需求集成 MVP

CDM (Change & Demand Management) 需求集成 MVP 旨在于单模块试点内打通「DOORS → 系统需求 → 指标 → RBOM → 差异 → 变更 → 通知 → 验证/回归」的最小闭环，确保跨角色的需求、变更与验证信息可追溯、可演示、可复核。本仓库集中管理业务文档、架构资料、OpenAPI 规格与示例实现脚手架。

## Key Objectives

- 建立自 DOORS 导入到系统需求建模的统一模板与中英映射。
- 维护 RBOM（以 Part 级绑定切口）并生成差异/变更报告及责任分派。
- 通过站内信 / OA 通知打通变更派发与人工回滚机制。
- 生成回归批次与看板样例，保障验证与追溯闭环。

## Quick Start

1. 使用 Volta 或 `nvm` 切换到 Node.js v20.14.0（仓库已提供 `.nvmrc`）。
2. 执行初始化脚本，启用 Corepack 并确认 Yarn 3.6.1：
   ```bash
   yarn setup
   ```
3. 安装依赖（首次安装会生成 `yarn.lock`，后续请保持不可变安装）：
   ```bash
   corepack yarn install --immutable
   ```
4. 验证工作区识别是否正确（结果应列出 apps 与 packages 下的各个目录）：
   ```bash
   corepack yarn workspaces list --verbose
   ```
5. 生成/更新 OpenAPI 规格（基于 `docs/openapi.baseline.json`）：
   ```bash
   yarn api:openapi
   ```
6. 使用 Spectral 校验 OpenAPI 规范：
   ```bash
   yarn api:spectral
   ```
7. 如需对比最新 OpenAPI 与基线差异：
   ```bash
   yarn api:diff
   ```

> CI (`.github/workflows/quality.yml`) 已启用 `actions/setup-node@v4` 的 Yarn 缓存，并在安装后执行 `git diff --exit-code yarn.lock`，确保缓存命中与锁文件稳定性。新增 `db-migrate` 作业会与 `contracts`、`security`、`test` 并行运行，在容器化 Postgres/Redis 上执行 `prisma migrate deploy`、生成回滚脚本，并运行 `yarn test:migrate` 验证索引与表结构。

## 质量门槛

- 单元测试覆盖率：Web（Vitest）与 API（Jest）全局行/语句/函数/分支均需 ≥80%，低于阈值测试即失败。
- 本地执行 `yarn test:client && yarn test:server` 可生成覆盖率报告，结果输出到 `reports/coverage/web` 与 `reports/coverage/api`。
- 使用 `yarn coverage` 汇总覆盖率摘要，快速核对 `coverage-summary.json` 中的指标。
- CI 中通过 `yarn test:client` 与 `yarn test:server` 跑通测试，并将 `coverage-web`、`coverage-api` 工件上传供审阅。

### 测试基线排错

- `yarn install --immutable` 如报缺失 workspace/依赖，请运行 `corepack enable` 后重新执行，并确保锁文件（`yarn.lock`、`.yarn/install-state.gz`）随代码提交。
- `yarn test:client` 支持附加 `--no-threads`，脚本会自动转为单进程执行；仍建议默认直接运行以保持更快速度。
- 覆盖率未达 80% 时命令会以非零状态结束，可先运行 `yarn coverage` 查看 `coverage-summary.json` 中的明细，再补充对应测试。
- 生成的覆盖率文件位于 `reports/coverage/web` 与 `reports/coverage/api`，CI 会将其上传为 `coverage-web`、`coverage-api` 工件。

## 开发流程

1. 本地开发前执行 `yarn lint && yarn prettier:check && yarn type-check`，保持与 CI 质量门槛一致。
2. 提交代码前，`yarn prepare` 会自动安装 Husky 钩子；`pre-commit` 钩子通过 `lint-staged` 自动运行 ESLint/Prettier 修复。
3. 删除或修改格式后请使用 `yarn lint:fix` 与 `yarn format` 进行批量矫正，保证提交 diff 纯净。
4. Git 提交遵循 Conventional Commits，例如 `feat(api): add request audit log`，scope 需保持 kebab-case。
5. 如涉及 API 变更，需在 PR 描述中附 `yarn api:openapi` / `yarn api:types` 等命令的执行记录，并说明安全影响。
6. 在打开 PR 前确认 README“质量门槛”要求已满足，并在 PR 模板中勾选自检项。
7. 如本次改动影响性能/可靠性/容量，请同步比对 `docs/architecture/nfrslo-与告警性能可靠性可用性.md` 与 `docs/architecture/测试与覆盖率testing-coverage.md`，更新必要的监控或覆盖率计划。

### 数据库迁移

- 复制 `.env.example` 为 `.env` 并根据环境调整 `DATABASE_URL` / `SHADOW_DATABASE_URL`；本地建议复用 `docker-compose.dev.yml` 中的 Postgres。任何 `yarn prisma:*` 或 `yarn test:migrate` 命令都会先执行 `scripts/validate-env.cjs`，该脚本基于 `dotenv-safe` 自动加载 `.env` 并对 `.env.example` 做比对，缺失变量会立即退出。
- 生成客户端：`yarn prisma:generate`（等价于 `yarn workspace @cdm/api prisma generate`）。
- 创建/更新迁移：`yarn prisma:migrate`，默认运行 `prisma migrate dev` 并写入 `apps/api/prisma/migrations/`。
- 部署生产迁移：CI/预发使用 `yarn workspace @cdm/api prisma migrate deploy`；回滚脚本可通过 `yarn prisma:rollback` 生成。
- 验证迁移：运行 `yarn test:migrate`，会对核心表/索引执行集成检查（见 `apps/api/__tests__/migration.spec.ts`）。

## Repository Layout

| Path                        | Description                                             |
| --------------------------- | ------------------------------------------------------- |
| `docs/brief.md`             | 项目简介与范围定义（最新更新日期见文档头部）。          |
| `docs/prd/` & `docs/prd.md` | PRD 及其拆分文档，覆盖目标、范围、KPI、风险等。         |
| `docs/architecture/`        | 架构 ADR、C4 图、技术栈、部署方案、治理策略等详尽资料。 |
| `docs/stories/`             | 需求故事与 Epic 拆分，供开发与质量团队协作。            |
| `apps/api/`                 | 后端相关脚手架（当前包含 Prisma schema 占位）。         |
| `apps/web/`                 | Web 前端占位工作区，后续会接入 Next.js 14。             |
| `apps/worker/`              | 队列/批处理 Worker 占位工作区。                         |
| `packages/shared/`          | 共享类型与工具库，供前后端复用。                        |
| `packages/config/`          | ESLint、Prettier、TSConfig 等集中配置。                 |
| `packages/api-client/`      | OpenAPI 生成的客户端 SDK（自动产出内容）。              |
| `packages/api-types/`       | OpenAPI 生成的 TypeScript 类型定义。                    |
| `scripts/`                  | 自动化脚本（如 `export-openapi.js` 用于导出规范）。     |
| `web-bundles/`              | 预置的多角色 Agent Prompt 及团队扩展包。                |
| `AGENTS.md`                 | Codex CLI / BMAD Agent 使用说明。                       |

## API Tooling

- `yarn api:openapi`：从基线导出或生成最小 OpenAPI 规格，可通过 `APP_VERSION` 与 `API_BASE_URL` 环境变量覆盖版本及服务端点。
- `yarn api:spectral`：使用 Stoplight Spectral 对 `docs/openapi.json` 执行规范检查。
- `yarn api:diff`：对比 `docs/openapi.baseline.json` 与最新导出的差异（不会因差异退出）。
- `yarn api:types`：基于最新 OpenAPI 生成 TypeScript 类型定义（输出至 `packages/api-types/`）。
- `yarn api:client`：生成 Axios 客户端 SDK（输出至 `packages/api-client/`）。

## Documentation & Collaboration

- 建议按以下顺序阅读：`docs/brief.md` → `docs/prd.md` → `docs/architecture/index.md`，快速掌握业务背景与技术方案。
- `docs/security/`、`docs/ops/`、`docs/qa/` 等子目录提供安全、运维、测试等专题治理清单。
- CODEx / BMAD 角色说明位于 `AGENTS.md` 与 `web-bundles/agents/`，供多角色协作时引用。

## Conventions

- 使用 Yarn 3（node-modules linker）管理依赖，请统一通过 `corepack yarn install --immutable` 安装；请勿手动生成或提交 `node_modules/`。
- Git 提交遵循 Conventional Commits，结合仓库根目录的 `commitlint.config.js`。
- 文档默认使用 Markdown（UTF-8），新增文件请遵循已有命名与层级结构。

如需扩展 README，请同步更新相关文档并在 PR 中说明变更背景。
