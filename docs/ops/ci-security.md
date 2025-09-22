# CI 安全检查样例（Yarn 3 / OpenAPI / gitleaks / 依赖巡检）

本文件提供可复制的 GitHub Actions 片段与本地脚本建议。与 PRD 的契约/治理要求一致。

---

## 1) GitHub Actions 工作流片段（.github/workflows/security.yml）

```yml
name: Security
on:
  pull_request:
    branches: [main, next, develop]
  push:
    branches: [main, next, develop]
concurrency:
  group: security-${{ github.ref }}
  cancel-in-progress: true
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node & Corepack (Yarn 3)
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: corepack enable
      - run: yarn --version

      # 1) 密钥扫描：gitleaks
      - name: gitleaks scan
        uses: gitleaks/gitleaks-action@v2
        with:
          args: detect --no-git -v

      # 2) 依赖安全：OSV-Scanner（或 npm audit / audit-ci）
      - name: OSV scan (lockfile + workspace)
        uses: google/osv-scanner-action@v1
        with:
          scan-args: >-
            --lockfile=./yarn.lock
            --recursive .

      # 3) 生成 OpenAPI（以 Nest Swagger 为例）
      - name: Install deps
        run: yarn install --immutable
      - name: Build API & export OpenAPI
        run: |
          yarn build:api # 你们的构建脚本
          node scripts/export-openapi.js # 输出到 ./docs/openapi.json

      # 4) OpenAPI 契约 Lint（Spectral）
      - name: Spectral lint
        run: npx @stoplight/spectral-cli lint docs/openapi.json

      # 5) OpenAPI 契约差异（当前 vs 基线）
      - name: API contract diff
        if: ${{ hashFiles('docs/openapi.json') != '' }}
        run: |
          # 假设有基线文件 docs/openapi.baseline.json
          if [ -f docs/openapi.baseline.json ]; then \
            npx @redocly/openapi-cli@latest diff docs/openapi.baseline.json docs/openapi.json; \
          else \
            echo "No baseline found, skipping diff"; \
          fi
```

---

## 2) package.json 脚本建议

```json
{
  "scripts": {
    "security:leaks": "gitleaks detect --no-git -v",
    "security:osv": "osv-scanner --lockfile=./yarn.lock --recursive .",
    "api:openapi": "node scripts/export-openapi.js",
    "api:spectral": "spectral lint docs/openapi.json",
    "api:diff": "openapi diff docs/openapi.baseline.json docs/openapi.json || true"
  },
  "devDependencies": {
    "@stoplight/spectral-cli": "^6",
    "@redocly/openapi-cli": "^1",
    "gitleaks": "^8",
    "osv-scanner": "^1"
  }
}
```

---

## 3) 基线管理建议
- 将稳定版本的 OpenAPI 存入 `docs/openapi.baseline.json`，PR 中生成 `docs/openapi.json` 并执行 diff
- 对 diff 的 breaking change 设为必需 Reviewer 审批
- Spectral 规则可根据团队规范扩展（命名/分页/错误码/安全）

---

## 4) 本地快速校验

```bash
# 依赖安装
corepack enable
yarn install --immutable

# 密钥扫描
yarn security:leaks

# 依赖安全（或改用 npm audit / audit-ci）
yarn security:osv

# OpenAPI 生成 + Lint + Diff
yarn api:openapi
yarn api:spectral
yarn api:diff
```

