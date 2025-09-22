# 引言（Introduction）
本文件为 CDM 需求集成 MVP 的全栈架构说明，覆盖后端系统、前端实现及两者间的集成契约，作为 AI 驱动开发的唯一可信来源，确保技术栈、模式与治理的一致性。

本文件将前后端架构合并为统一视图，适配现代全栈协作与契约先行的工程方式，减少割裂与重复沟通。

## 起始模板 / 既有项目
- 现状：仓库为文档优先（未存在 `apps/*`、`package.json` 等代码/工程文件）
- PRD 期望：Yarn 3 Workspaces Monorepo（Next.js 14 App Router + NestJS 10 + Prisma/Postgres + BullMQ/Redis）
- 决策：无外部 starter；按本文档推荐结构从零脚手架搭建；Monorepo 工具采用 Yarn 3 + Turborepo

## 变更日志（Change Log）
| 日期       | 版本 | 描述             | 作者    |
|------------|------|------------------|---------|
| 2025-09-22 | 1.1  | 安全/输入校验、熔断/扩缩容、测试与依赖策略增补 | Winston |
| 2025-09-22 | 0.1  | 初始创建（草案） | Winston |

---
