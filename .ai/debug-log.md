# Debug Log

## 2025-09-23

- `yarn test:client -- --no-threads`：Vitest CLI 不识别 `--no-threads` 参数，报 `Unknown option --threads`，确认需要改用默认并发设置或通过配置禁用线程。
- `yarn test:client`：在 `apps/web` 成功执行 Vitest 覆盖率，报告写入 `reports/coverage/web`（行/分支/函数/语句 100%）。
- `yarn test:server`：成功执行 Jest 覆盖率，报告写入 `reports/coverage/api`（全量 100% 覆盖）。
- `yarn coverage`：`scripts/coverage-summary.cjs` 输出 Web/API 覆盖率摘要，验证覆盖率产物存在。

- `corepack yarn install` / `corepack yarn install --immutable`：Yarn 3.6.1 环境下均成功，仅存在已知 peer dependency 警告（ts-node / typescript），不影响安装。
- `corepack yarn lint`：在配置 `import/resolver` 后通过。
- `corepack yarn test:client -- --no-threads`：通过自定义脚本 `apps/web/scripts/run-vitest.cjs` 兼容该参数并使用 `--pool forks`，测试与覆盖率 100%。
- `corepack yarn test:server`：Jest 在 Node 20 + Yarn 3 环境运行正常，覆盖率 100%。
