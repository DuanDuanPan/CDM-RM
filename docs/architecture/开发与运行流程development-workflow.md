# 开发与运行流程（Development Workflow）

## 前置环境与初始化
```bash
# 固定 Node 版本并启用 Corepack（Yarn 3）
curl https://get.volta.sh | bash
volta install node@20.14.0
corepack enable

# 安装依赖（严格锁定）
yarn --version
yarn install --immutable

# 本地依赖栈（如需）：Postgres/Redis
#（建议提供 docker-compose.dev.yml）
docker compose -f docker-compose.dev.yml up -d postgres redis
```

## 常用脚本（建议在根 package.json 提供）
```json
{
  "scripts": {
    "dev": "turbo run dev --parallel",
    "dev:web": "turbo run dev --filter=web",
    "dev:api": "turbo run dev --filter=api",
    "build": "turbo run build",
    "lint": "eslint . --ext .ts,.tsx",
    "prettier:check": "prettier -c .",
    "prettier:write": "prettier -w .",
    "type-check": "tsc -b -v --pretty false",
    "test:web": "vitest run --dir apps/web",
    "test:api": "jest --config apps/api/jest.config.ts",
    "api:openapi": "node scripts/export-openapi.js",
    "api:spectral": "spectral lint docs/openapi.json",
    "api:diff": "openapi diff docs/openapi.baseline.json docs/openapi.json || true",
    "api:types": "openapi-typescript http://localhost:$APP_PORT/api/__openapi.json -o packages/api-types/src/index.ts",
    "api:client": "openapi-typescript-codegen --input http://localhost:$APP_PORT/api/__openapi.json --output packages/api-client --client axios --useOptions"
  }
}
```

## 本地开发流程
- 启动依赖（如使用 Compose）：`docker compose -f docker-compose.dev.yml up -d postgres redis`
- 启动应用：`yarn dev`（并行启动 web/api/worker）
- 变更 API 后：`yarn api:openapi && yarn api:spectral && yarn api:types && yarn api:client`
- 提交前：`yarn lint && yarn prettier:check && yarn type-check && yarn test:web && yarn test:api`

---
