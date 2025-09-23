# Prisma Schema & Migration Guide

## 命名规范
- 表名统一使用 snake_case，通过 Prisma `@@map` 与 `@map` 映射，字段默认 snake_case；ID 采用 `cuid()` 在应用层生成。
- 公共 JSONB 扩展字段命名为 `extras`，用于保存灵活属性；新表需显式说明 JSON 结构与索引策略。
- 索引命名约定：`idx_<table>_<field>`，唯一索引使用 `uq_<table>_<field>`，保持与架构文档一致。

## 迁移流程
1. 设置 `.env` 中的 `DATABASE_URL` 与 `SHADOW_DATABASE_URL`（本地建议使用 `docker-compose.dev.yml` 提供的 Postgres 实例）。
2. 运行 `yarn prisma:migrate` 创建或更新迁移；迁移文件会写入 `apps/api/prisma/migrations/<timestamp>_<name>/migration.sql`。
3. 使用 `yarn prisma:generate` 生成 Prisma Client，生成产物位于 `node_modules/.prisma`。
4. CI/生产环境通过 `yarn workspace @cdm/api prisma migrate deploy` 应用迁移，禁止直接执行 `migrate dev`。

## 回滚策略
- 使用 `yarn prisma:rollback` 生成与当前迁移的 diff SQL，审阅后在数据库中手动执行。
- 如遇高风险 DDL，拆分为多个迁移并在 SQL 中添加注释说明回滚步骤。
- 所有迁移必须在 PR 中附带审核记录，并确保 `db-migrate` CI 任务通过。

## 索引与性能基线
- 高频筛选字段：`requirements.status`、`metrics.name`、`rbom_nodes.code` 均已建立 B-Tree 索引。
- 联合索引：`requirements` 表提供 `(module_id, object_id, baseline_id)` 联合索引用于视图切片查询。
- 如需 JSONB 检索（`extras`），可按需补充 GIN 索引并注明查询场景。

## 目录结构
- `schema.prisma`：Prisma 数据模型定义。
- `migrations/`：迁移 SQL，首个迁移为 `20240923000000_init`。
- `README.md`（本文档）：记录命名、索引、迁移/回滚策略。
