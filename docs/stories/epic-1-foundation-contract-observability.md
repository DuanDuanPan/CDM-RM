# Epic 1：基础设施 / 契约 / 可观测性（MVP）

说明：确保统一工具链、类型契约与可观测性基线。所有故事必须落地 CI 与审计。

---

## Story 1.1 Yarn 3 Workspaces 与 Node 20 LTS
As a DevOps,
I want Yarn 3 (Berry) workspaces on Node 20 LTS,
so that 依赖与脚本统一、可缓存、可复现。

Acceptance Criteria
- `.yarnrc.yml` 配置 `nodeLinker: node-modules`；`corepack enable`
- 根 `packageManager` 指定 yarn@3；工作区识别 apps/* packages/*
- CI 缓存 Yarn 与 Node；锁文件稳定

---

## Story 1.2 代码规范与提交检查
As a Maintainer,
I want ESLint/Prettier/Husky/lint-staged/commitlint,
so that 规范与提交范围被强制。

Acceptance Criteria
- ESLint 规则：TS/React/Promise/Prettier；Prettier 单引号/120 列
- Husky pre-commit：eslint --fix + prettier -w；commitlint 检查 type/scope
- 提交信息与 PR 模板就位

---

## Story 1.3 测试基线（Vitest/Jest）
As a Developer,
I want test runners for web/api,
so that 单元/集成/E2E 可执行。

Acceptance Criteria
- web 使用 Vitest；api 使用 Jest 或 Vitest（二选一）
- `yarn test:client`/`yarn test:server` 与 coverage 通过
- CI 启动最小测试矩阵

---

## Story 1.4 Prisma 基线与迁移
As a Backend Developer,
I want Prisma schema/migrate baseline,
so that 数据模型可演进且审计。

Acceptance Criteria
- 初始化 `prisma/schema.prisma`；创建首个迁移
- `requirements/metrics/rbom_nodes/...` 最小表与索引
- CI 执行 migrate + 回滚用例

---

## Story 1.5 Swagger/OpenAPI 导出
As an API Owner,
I want Nest Swagger export,
so that 前后端共享契约。

Acceptance Criteria
- 路由暴露 `/api/__openapi.json`（或 yaml）
- `api:types`/`api:client` 生成类型与客户端包
- Spectral Lint 通过；OpenAPI diff 报告生成

---

## Story 1.6 Pino + OpenTelemetry 日志
As an SRE,
I want structured logs with trace context,
so that 故障可追踪与聚合。

Acceptance Criteria
- 中间件注入 requestId/traceId；响应头回传 `x-trace-id`
- 日志字段：ts/level/service/env/domain/msg/traceId/reqId/duration_ms/error
- 禁止打印 PII/密钥；日志脱敏策略样例落地

---

## Story 1.7 Prometheus /metrics 指标
As an SRE,
I want Prometheus metrics endpoint,
so that QPS/延迟/错误可观测。

Acceptance Criteria
- 暴露 `/metrics`（应用/队列/DB 指标）
- 附带示例告警规则；本地/CI 可拉取

---

## Story 1.8 健康检查与金丝雀
As a Platform Engineer,
I want health-check & canary,
so that 部署后有基本验收。

Acceptance Criteria
- `/api/__health_check` 返回 200 与版本/时区
- Canary 页面或路由显示构建信息

---

## Story 1.9 安全基线
As a Security Engineer,
I want gitleaks + env 校验,
so that 密钥与配置合规。

Acceptance Criteria
- 引入 gitleaks 与 OSV 依赖扫描脚本（或审计替代）
- `dotenv-safe/envalid` 校验 env；密钥不入库

---

## Story 1.10 CI 工作流与分支保护
As a Maintainer,
I want mandatory CI checks & branch protection,
so that 主干质量受控。

Acceptance Criteria
- CI：install --immutable、lint、prettier:check、type-check、test、build
- 保护分支：main/next/develop 禁止直推；最少 1 Reviewer；必需状态检查

---

## Story 1.11 Monorepo & Yarn 3 落地修正（Must‑Fix）
As a Maintainer,
I want monorepo workspaces & yarn3 baseline enforced,
so that 依赖与脚手架一致且可复现。

Acceptance Criteria
- 根增加 `.yarnrc.yml`，设置 `nodeLinker: node-modules`
- `package.json` 增加 `workspaces: ["apps/*", "packages/*"]`
- `README` 补充 `corepack enable`、`yarn install --immutable` 与 `yarn workspaces list --json` 校验
- PR 校验：提交后 CI 中打印工作区列表（用于审查）

---

## Story 1.12 CI 测试矩阵扩展（Must‑Fix）
As a Maintainer,
I want extend CI to run lint/prettier/type-check/tests/coverage,
so that 质量门槛在合并前强制执行。

Acceptance Criteria
- 在现有 `contracts`/`security` 之外新增 `quality` 任务
- 质量任务包含：`lint`、`prettier:check`、`type-check`、`test:web`、`test:api`、覆盖率上传
- 分支保护绑定 `quality` 状态检查；未通过不可合并
- 产物：覆盖率报告与日志作为工件上传

---

## Story 1.13 契约产物目录就绪（Must‑Fix）
As an API Owner,
I want api types/client packages to be ready,
so that 前后端可基于契约协同并生成可复用包。

Acceptance Criteria
- 创建 `packages/api-types` 与 `packages/api-client` 目录并提供 README 占位
- `api:types` 输出至 `packages/api-types/src/index.ts`
- `api:client` 输出至 `packages/api-client/`
- `docs/users/getting-started.md` 增补最小演练说明（已提供）

---

## Story 1.14 环境与密钥基线（Must‑Fix）
As a Security Engineer,
I want env & secrets baseline with validation,
so that 配置与密钥治理在开发初期即刻生效。

Acceptance Criteria
- 新增 `.env.example` 与变量说明文档
- 采用 `dotenv-safe` + `envalid`（或等价）在运行时校验必需变量
- 贡献指南中明确：密钥不入库、轮换策略、权限最小化
- CI 环境使用 GitHub Environments + Secrets 注入

## QA Results

### Review Date: 2025-09-22

### Reviewed By: Quinn (Test Architect)

### Story 1.1 Yarn 3 Workspaces 与 Node 20 LTS

### Code Quality Assessment

- 当前仓库未发现 `.yarnrc.yml`，也未配置 `workspaces`（apps/*、packages/*）。根 `package.json` 已声明 `packageManager: yarn@3.6.1` 且 engines.node >=20，但核心落地尚缺。
- 未见 CI 中关于 Yarn 缓存/Node 版本矩阵/`--immutable` 等约束脚本与校验。
- 受影响范围为整个工具链与依赖管理，建议高优先级实现。

### Refactoring Performed

- 本次为规划期顾问式评审，未改动源文件。

### Compliance Check

- Coding Standards: ✓（不适用/未触达源代码层面）
- Project Structure: ✗（缺少 workspaces 显式配置与 `.yarnrc.yml`）
- Testing Strategy: ✗（缺少安装与 CI 校验用例）
- All ACs Met: ✗（AC 未落地）

### Improvements Checklist

- [ ] 新增 `.yarnrc.yml`，设定 `nodeLinker: node-modules`，并在 README/CI 中启用 `corepack enable`
- [ ] 在根 `package.json` 增加 `workspaces: ["apps/*", "packages/*"]`，并校验现有目录结构（已存在 `apps/`）
- [ ] CI 增加步骤：`corepack enable`、缓存 Yarn/Node、`yarn install --immutable`、锁文件校验
- [ ] 增加最小验证脚本：`yarn workspaces list --json` 以确保发现工作区
- [ ] 在贡献文档中记录 Node 版本策略与 Yarn 3 相关指令

### Security Review

- 无直接安全风险，但供应链与锁定策略缺失会引入一致性与可复现性风险。

### Performance Considerations

- CI 缓存策略未落地，可能影响构建时长。

### Files Modified During Review

- 无

### Gate Status

Gate: CONCERNS → docs/qa/gates/1.1-yarn-3-workspaces-node-20-lts.yml
Risk profile: docs/qa/assessments/1.1-risk-20250922.md（如需要可后续补充）
NFR assessment: docs/qa/assessments/1.1-nfr-20250922.md（如需要可后续补充）

### Recommended Status

✗ Changes Required - 建议尽快完成以上清单后再复审

### Review Date: 2025-09-22

### Reviewed By: Quinn (Test Architect)

### Story 1.2 代码规范与提交检查

### Code Quality Assessment

- 当前仓库存在 `commitlint.config.js`，但尚未检测到 ESLint、Prettier、Husky、lint-staged 的依赖与脚本配置。
- 未见 `.husky/` 钩子与 `pre-commit` 执行链；`package.json` 未包含 `lint`、`prettier:*`、`type-check`、`test:*` 的脚本组合。
- 该故事为基础质量门禁的一部分，建议优先级同 1.1。

### Refactoring Performed

- 顾问式评审，未改动源文件。

### Compliance Check

- Coding Standards: ✗（缺少 ESLint/Prettier 配置与依赖）
- Project Structure: ✓（可后续引入 packages/config 共享配置）
- Testing Strategy: ✗（缺少提交前/CI 的静态检查与格式化校验）
- All ACs Met: ✗（AC 未落地）

### Improvements Checklist

- [ ] 安装并初始化 ESLint（TS/React/Promise/Prettier 插件）与 Prettier；统一单引号/120 列
- [ ] 新增 `scripts`: `lint`, `prettier:check`, `prettier:write`
- [ ] 安装 Husky 与 lint-staged；配置 `pre-commit`：`eslint --fix` + `prettier -w`
- [ ] 保留并启用 commitlint（已有配置）；在 CI 中增加 commit 信息校验（可选）
- [ ] 在 PR 模板中提示 lint/format 必过

### Security Review

- 无直接安全问题；代码风格与提交规范缺失会影响可维护性与一致性。

### Performance Considerations

- lint/format 在大仓库下需合理使用 cache 与并行参数；监控 CI 时间。

### Files Modified During Review

- 无

### Gate Status

Gate: CONCERNS → docs/qa/gates/1.2-code-standards-commit-checks.yml
Risk profile: docs/qa/assessments/1.2-risk-20250922.md（如需要可后续补充）
NFR assessment: docs/qa/assessments/1.2-nfr-20250922.md（如需要可后续补充）

### Recommended Status

✗ Changes Required - 完成以上清单后再复审

### Review Date: 2025-09-22

### Reviewed By: Quinn (Test Architect)

### Story 1.9 安全基线

### Code Quality Assessment

- CI `security` 作业已包含 gitleaks 与 OSV 扫描，基础安全扫描已覆盖。
- 未见 `dotenv-safe`/`envalid` 等环境变量校验依赖与运行时校验逻辑；未见 `.env.example` 或 env 文档。

### Refactoring Performed

- 顾问式评审，未改动源文件。

### Compliance Check

- Coding Standards: ✓
- Project Structure: ✓
- Testing Strategy: ✗（缺少 env 校验与负面用例）
- All ACs Met: ✗（扫描部分达成；env 校验缺失）

### Improvements Checklist

- [ ] 引入 `dotenv-safe` 或 `envalid`，在应用启动时校验必需 env；提供 `.env.example`
- [ ] 在 CI 中加入 env 校验环节（构建/启动脚本即失败）
- [ ] 在日志策略中再次强调禁止打印机密（与 1.6 配套）

### Security Review

- 供应链扫描已覆盖，但运行时配置校验缺失；优先补齐。

### Performance Considerations

- 扫描与校验对构建耗时影响较小；注意缓存。

### Files Modified During Review

- 无

### Gate Status

Gate: CONCERNS → docs/qa/gates/1.9-security-baseline.yml
Risk profile: docs/qa/assessments/1.9-risk-20250922.md（如需要可后续补充）
NFR assessment: docs/qa/assessments/1.9-nfr-20250922.md（如需要可后续补充）

### Recommended Status

✗ Changes Required - 完成以上清单后再复审

### Review Date: 2025-09-22

### Reviewed By: Quinn (Test Architect)

### Story 1.10 CI 工作流与分支保护

### Code Quality Assessment

- 现有工作流 `quality.yml` 覆盖：Node/Corepack、`yarn install --immutable`、OpenAPI 导出/光谱/diff、类型与客户端生成、安全扫描（gitleaks/OSV）。
- 未覆盖：`lint`、`prettier:check`、`type-check`、`test`、`build`；分支保护策略需在仓库设置中配置必需检查。

### Refactoring Performed

- 顾问式评审，未改动源文件。

### Compliance Check

- Coding Standards: ✗（需在 CI 强制）
- Project Structure: ✓
- Testing Strategy: ✗（缺少测试与类型检查）
- All ACs Met: ✗（部分达成）

### Improvements Checklist

- [ ] 新增 `build` 作业：执行 `lint`、`prettier:check`、`type-check`、`test`、`build`（结合 1.1/1.2/1.3 的脚本）
- [ ] 配置分支保护：main/next/develop 禁止直推；要求 `contracts`、`security`、`build` 状态通过；最少 1 Reviewer
- [ ] 将缓存策略应用于构建/测试以缩短时长

### Security Review

- 分支保护对审计与质量门禁至关重要；务必启用。

### Performance Considerations

- 控制 CI 并行与缓存，避免冗余安装与重复构建。

### Files Modified During Review

- 无

### Gate Status

Gate: CONCERNS → docs/qa/gates/1.10-ci-workflows-branch-protection.yml
Risk profile: docs/qa/assessments/1.10-risk-20250922.md（如需要可后续补充）
NFR assessment: docs/qa/assessments/1.10-nfr-20250922.md（如需要可后续补充）

### Recommended Status

✗ Changes Required - 完成以上清单后再复审

### Review Date: 2025-09-22

### Reviewed By: Quinn (Test Architect)

### Story 1.7 Prometheus /metrics 指标

### Code Quality Assessment

- 文档与 OpenAPI baseline 中存在 `/metrics` 描述，但未见服务端实现与指标采集/导出代码。
- 未提供示例告警规则与本地/CI 拉取验证。

### Refactoring Performed

- 顾问式评审，未改动源文件。

### Compliance Check

- Coding Standards: ✓
- Project Structure: ✓
- Testing Strategy: ✗（缺少指标导出与拉取验证）
- All ACs Met: ✗

### Improvements Checklist

- [ ] 使用 `prom-client` 或 NES/T Fastify 插件暴露 `/metrics`；添加默认指标（进程/HTTP 请求直方图等）
- [ ] 提供示例告警规则（延迟/错误率/无数据）并文档化；在 dev/ci 可通过 curl 拉取校验
- [ ] 将 `/metrics` 接入 CI（冒烟拉取 + 非 200 失败）

### Security Review

- 确保不在指标中暴露 PII；必要时限制访问或脱敏。

### Performance Considerations

- 合理配置直方图桶与采样，避免指标量暴涨。

### Files Modified During Review

- 无

### Gate Status

Gate: CONCERNS → docs/qa/gates/1.7-prometheus-metrics.yml
Risk profile: docs/qa/assessments/1.7-risk-20250922.md（如需要可后续补充）
NFR assessment: docs/qa/assessments/1.7-nfr-20250922.md（如需要可后续补充）

### Recommended Status

✗ Changes Required - 完成以上清单后再复审

### Review Date: 2025-09-22

### Reviewed By: Quinn (Test Architect)

### Story 1.8 健康检查与金丝雀

### Code Quality Assessment

- 未见 `/api/__health_check` 路由与构建信息/时区返回；未见 Canary 页面或路由。

### Refactoring Performed

- 顾问式评审，未改动源文件。

### Compliance Check

- Coding Standards: ✓
- Project Structure: ✓
- Testing Strategy: ✗（缺少健康检查的冒烟测试）
- All ACs Met: ✗

### Improvements Checklist

- [ ] 实现 `/api/__health_check` 返回 200，包含版本（git sha/时间戳）与时区
- [ ] 提供 Canary 页面/路由显示构建信息（环境/版本/时间）
- [ ] 在 CI/CD 发布后执行健康检查冒烟用例

### Security Review

- 限制对外暴露的信息，避免泄露内部细节。

### Performance Considerations

- 健康检查应轻量且无外部依赖阻塞。

### Files Modified During Review

- 无

### Gate Status

Gate: CONCERNS → docs/qa/gates/1.8-health-check-canary.yml
Risk profile: docs/qa/assessments/1.8-risk-20250922.md（如需要可后续补充）
NFR assessment: docs/qa/assessments/1.8-nfr-20250922.md（如需要可后续补充）

### Recommended Status

✗ Changes Required - 完成以上清单后再复审

### Review Date: 2025-09-22

### Reviewed By: Quinn (Test Architect)

### Story 1.4 Prisma 基线与迁移

### Code Quality Assessment

- 发现 `apps/api/prisma/schema.prisma`，已包含核心模型（Requirement/Metric/RbomNode/...）及关键索引，基本符合 AC 的表/索引范围。
- 缺少 `prisma/migrations/` 初始迁移目录与首个迁移记录；未见 CI 中 migrate 与回滚用例执行。
- `DATABASE_URL` 依赖存在，但未见环境变量校验策略（见 1.9）。

### Refactoring Performed

- 顾问式评审，未改动源文件。

### Compliance Check

- Coding Standards: ✓
- Project Structure: ✓（`apps/api/prisma` 目录规范）
- Testing Strategy: ✗（缺少 migrate/rollback 的自动化）
- All ACs Met: ✗（部分达成：schema 存在；迁移与 CI 缺失）

### Improvements Checklist

- [ ] 生成首个迁移：`npx prisma migrate dev -n init`（或 `migrate deploy` 于 CI）
- [ ] CI 中执行：`prisma generate` → `prisma migrate deploy`；准备最小回滚验证（可用 `prisma migrate diff` + 变更回滚演练）
- [ ] 针对 JSONB `extras` 视查询需求评估 GIN 索引（Prisma 需 raw SQL 或迁移脚本）
- [ ] 在 `README/ops` 补充本地迁移/回滚流程与注意事项

### Security Review

- 强制校验 `DATABASE_URL`（与 1.9 的 dotenv-safe/envalid 配合）；确保不泄漏凭证。

### Performance Considerations

- 为高频过滤字段补足索引；评估大型 JSONB 的读写开销与归档策略。

### Files Modified During Review

- 无

### Gate Status

Gate: CONCERNS → docs/qa/gates/1.4-prisma-baseline-migrations.yml
Risk profile: docs/qa/assessments/1.4-risk-20250922.md（如需要可后续补充）
NFR assessment: docs/qa/assessments/1.4-nfr-20250922.md（如需要可后续补充）

### Recommended Status

✗ Changes Required - 完成以上清单后再复审

### Review Date: 2025-09-22

### Reviewed By: Quinn (Test Architect)

### Story 1.5 Swagger/OpenAPI 导出

### Code Quality Assessment

- 存在 `scripts/export-openapi.js`，以及 `docs/openapi.baseline.json`；CI 的 `quality.yml` 已包含导出/光谱（Spectral）/diff/类型与客户端生成步骤。
- 本地仓库尚未见 `docs/openapi.json`（由脚本在 CI 或本地执行时生成）；未见后端路由 `/api/__openapi.json`。
- `packages/api-types`、`packages/api-client` 目录未提交；生成脚本存在（运行时将创建）。

### Refactoring Performed

- 顾问式评审，未改动源文件。

### Compliance Check

- Coding Standards: ✓
- Project Structure: ✓
- Testing Strategy: ✓（契约检测已在 CI 覆盖）
- All ACs Met: ✗（运行时路由未落地；生成产物未纳入构建/发布流程）

### Improvements Checklist

- [ ] 在 API 服务暴露 `/api/__openapi.json`（或 yaml），并与导出脚本对齐版本/服务器信息
- [ ] 将 `api:types`/`api:client` 整合到构建流程或发布工序（避免手动遗漏）
- [ ] 将 Spectral 违规作为失败阈值（必要时以规则例外管理）

### Security Review

- 合同文件不包含敏感信息；注意不要暴露内部路径或调试端点。

### Performance Considerations

- 生成步骤对 CI 时间影响可控；必要时缓存 node_modules 与生成产物。

### Files Modified During Review

- 无

### Gate Status

Gate: CONCERNS → docs/qa/gates/1.5-swagger-openapi-export.yml
Risk profile: docs/qa/assessments/1.5-risk-20250922.md（如需要可后续补充）
NFR assessment: docs/qa/assessments/1.5-nfr-20250922.md（如需要可后续补充）

### Recommended Status

✗ Changes Required - 完成以上清单后再复审

### Review Date: 2025-09-22

### Reviewed By: Quinn (Test Architect)

### Story 1.6 Pino + OpenTelemetry 日志

### Code Quality Assessment

- 未见服务端实现与日志中间件，未配置 Pino/OTEL 相关依赖；未见 `x-trace-id` 回传逻辑。
- 脱敏策略与敏感信息打印禁用未落地。

### Refactoring Performed

- 顾问式评审，未改动源文件。

### Compliance Check

- Coding Standards: ✓（约定存在于文档）
- Project Structure: ✓（待引入中间件与封装模块）
- Testing Strategy: ✗（需提供最小日志/追踪联通用例与禁打印验证）
- All ACs Met: ✗

### Improvements Checklist

- [ ] 引入 Pino 并封装请求日志中间件，注入 `requestId/traceId` 并回传 `x-trace-id`
- [ ] 接入 OpenTelemetry（SDK + 自动/手动埋点），输出到控制台或 OTLP endpoint（dev/ci 可降级）
- [ ] 建立脱敏策略与日志字段白名单；添加禁止打印机密的单元/集成测试

### Security Review

- 风险在于敏感信息泄漏；需建立审计与禁用规则。

### Performance Considerations

- 记录级别与采样率需按环境区分，避免噪声与开销。

### Files Modified During Review

- 无

### Gate Status

Gate: CONCERNS → docs/qa/gates/1.6-pino-opentelemetry-logging.yml
Risk profile: docs/qa/assessments/1.6-risk-20250922.md（如需要可后续补充）
NFR assessment: docs/qa/assessments/1.6-nfr-20250922.md（如需要可后续补充）

### Recommended Status

✗ Changes Required - 完成以上清单后再复审

### Review Date: 2025-09-22

### Reviewed By: Quinn (Test Architect)

### Story 1.3 测试基线（Vitest/Jest）

### Code Quality Assessment

- 当前仓库未检测到 Vitest/Jest 配置、依赖或测试脚本；无覆盖率脚本与 CI 集成。
- 该故事是测试体系落地的起点，建议与 1.1/1.2 同期推进以形成最小质量闭环。

### Refactoring Performed

- 顾问式评审，未改动源文件。

### Compliance Check

- Coding Standards: ✓（不适用/未触达源代码层面）
- Project Structure: ✓（可在 `apps/*`、`packages/*` 下分别配置）
- Testing Strategy: ✗（缺少 runner、脚本与覆盖率配置）
- All ACs Met: ✗（AC 未落地）

### Improvements Checklist

- [ ] 选择方案：web（Vitest）/ api（Jest 或 Vitest）并安装依赖
- [ ] 新增 `scripts`: `test:client`、`test:server`、`coverage`（或分别在各包内定义）
- [ ] 至少 1-2 个示例单元测试与快照/参数化用例
- [ ] CI 集成最小测试矩阵与覆盖率收集

### Security Review

- 无直接安全问题；缺少测试增加回归风险。

### Performance Considerations

- 控制并行与缓存以缩短 CI 时间；对外部依赖使用 mock。

### Files Modified During Review

-

### Gate Status

Gate: CONCERNS → docs/qa/gates/1.3-test-baseline-vitest-jest.yml
Risk profile: docs/qa/assessments/1.3-risk-20250922.md（如需要可后续补充）
NFR assessment: docs/qa/assessments/1.3-nfr-20250922.md（如需要可后续补充）

### Recommended Status

✗ Changes Required - 完成以上清单后再复审
