# 监控与检查清单结果（CI 自动化）

本节定义“契约/安全/观测”三类强制检查在 CI 中的自动化执行与报告产物约定。

## GitHub Actions 工作流（示例：.github/workflows/quality.yml）
```yml
name: Quality Gates
on:
  pull_request:
    branches: [main, next, develop]
  push:
    branches: [main, next, develop]
concurrency:
  group: quality-${{ github.ref }}
  cancel-in-progress: true

jobs:
  contracts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node & Corepack
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'
      - run: corepack enable
      - run: yarn install --immutable
      - name: Build API & export OpenAPI
        run: |
          yarn build || true  # 如需
          yarn api:openapi     # 生成 docs/openapi.json
      - name: Spectral lint
        run: npx @stoplight/spectral-cli lint docs/openapi.json --format sarif -o reports/spectral.sarif
      - name: OpenAPI diff (vs baseline)
        run: |
          if [ -f docs/openapi.baseline.json ]; then \
            npx @redocly/openapi-cli@latest diff docs/openapi.baseline.json docs/openapi.json > reports/openapi-diff.txt || true; \
          else \
            echo 'No baseline found' > reports/openapi-diff.txt; \
          fi
      - name: Generate Types & Client
        run: |
          yarn api:types
          yarn api:client
      - name: Upload contract artifacts
        uses: actions/upload-artifact@v4
        with:
          name: contracts
          path: |
            docs/openapi.json
            reports/spectral.sarif
            reports/openapi-diff.txt

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: gitleaks scan
        uses: gitleaks/gitleaks-action@v2
        with:
          args: detect --no-git -v --report-path reports/gitleaks.sarif --format sarif
      - name: OSV scan (lockfile + workspace)
        uses: google/osv-scanner-action@v1
        with:
          scan-args: >-
            --lockfile=./yarn.lock
            --recursive .
      - name: Upload security artifacts
        uses: actions/upload-artifact@v4
        with:
          name: security
          path: reports/

  observability:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports: ['5432:5432']
        options: >-
          --health-cmd "pg_isready -U postgres" --health-interval 10s --health-timeout 5s --health-retries 5
      redis:
        image: redis:7
        ports: ['6379:6379']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'
      - run: corepack enable
      - run: yarn install --immutable
      - name: Start API (background)
        run: |
          APP_PORT=4000 yarn dev:api &
          sleep 8
      - name: Check /metrics
        run: |
          curl -fsSL http://localhost:4000/metrics | tee metrics/snapshot.txt
      - name: Upload metrics snapshot
        uses: actions/upload-artifact@v4
        with:
          name: metrics
          path: metrics/snapshot.txt
```

## 报告产物与路径约定
- 契约类：`docs/openapi.json`、`reports/spectral.sarif`、`reports/openapi-diff.txt`
- 安全类：`reports/gitleaks.sarif`、（OSV 扫描标准输出保存为 `reports/osv.txt` 可选）
- 观测类：`metrics/snapshot.txt`（Prometheus 文本）

## 检查清单结果（最新一次 CI）
| 类别 | 项目 | 结果 | 备注 |
|---|---|---|---|
| 契约 | Spectral Lint | 待生成 | reports/spectral.sarif |
| 契约 | OpenAPI Diff | 待生成 | reports/openapi-diff.txt |
| 安全 | gitleaks | 待生成 | reports/gitleaks.sarif |
| 安全 | OSV-Scanner | 待生成 | reports/osv.txt（可选） |
| 观测 | /metrics 快照 | 待生成 | metrics/snapshot.txt |

---
