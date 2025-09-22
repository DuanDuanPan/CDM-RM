# CDM 需求集成 MVP

CDM (Change & Demand Management) 需求集成 MVP 旨在于单模块试点内打通「DOORS → 系统需求 → 指标 → RBOM → 差异 → 变更 → 通知 → 验证/回归」的最小闭环，确保跨角色的需求、变更与验证信息可追溯、可演示、可复核。本仓库集中管理业务文档、架构资料、OpenAPI 规格与示例实现脚手架。

## Key Objectives
- 建立自 DOORS 导入到系统需求建模的统一模板与中英映射。
- 维护 RBOM（以 Part 级绑定切口）并生成差异/变更报告及责任分派。
- 通过站内信 / OA 通知打通变更派发与人工回滚机制。
- 生成回归批次与看板样例，保障验证与追溯闭环。

## Quick Start
1. 安装 Node.js 20（本项目使用 Yarn 3.x Berry）。
2. 启用 Corepack 并安装依赖：
   ```bash
   corepack enable
   yarn install
   ```
3. 生成/更新 OpenAPI 规格（基于 `docs/openapi.baseline.json`）：
   ```bash
   yarn api:openapi
   ```
4. 使用 Spectral 校验 OpenAPI 规范：
   ```bash
   yarn api:spectral
   ```
5. 如需对比最新 OpenAPI 与基线差异：
   ```bash
   yarn api:diff
   ```

## Repository Layout
| Path | Description |
| --- | --- |
| `docs/brief.md` | 项目简介与范围定义（最新更新日期见文档头部）。 |
| `docs/prd/` & `docs/prd.md` | PRD 及其拆分文档，覆盖目标、范围、KPI、风险等。 |
| `docs/architecture/` | 架构 ADR、C4 图、技术栈、部署方案、治理策略等详尽资料。 |
| `docs/stories/` | 需求故事与 Epic 拆分，供开发与质量团队协作。 |
| `apps/api/` | 后端相关脚手架（当前包含 Prisma schema 占位）。 |
| `scripts/` | 自动化脚本（如 `export-openapi.js` 用于导出规范）。 |
| `web-bundles/` | 预置的多角色 Agent Prompt 及团队扩展包。 |
| `AGENTS.md` | Codex CLI / BMAD Agent 使用说明。 |

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
- 使用 Yarn Berry（Plug'n'Play）管理依赖；请勿手动生成 `node_modules/`。
- Git 提交遵循 Conventional Commits，结合仓库根目录的 `commitlint.config.js`。
- 文档默认使用 Markdown（UTF-8），新增文件请遵循已有命名与层级结构。

如需扩展 README，请同步更新相关文档并在 PR 中说明变更背景。
