# 技术栈（Tech Stack）

| 类别 | 技术 | 版本 | 用途 | 选型理由 |
|---|---|---|---|---|
| 前端语言 | TypeScript | 5.4.x | 统一类型 | 生态成熟，与 Next/Nest 兼容 |
| 前端框架 | Next.js + React | 14.2.x / 18.2.x | SSR/ISR | PRD 指定，Vercel 适配最佳 |
| UI 组件库 | shadcn/ui（Radix） | 1.x | A11y 组件 | 与 Tailwind 搭配、按需引入 |
| CSS 框架 | Tailwind CSS | 3.4.x | 样式 | 原子化高效、配套完善 |
| 状态管理 | TanStack Query + Zustand | 5.x / 4.x | 数据/本地状态 | 数据密集、避免过度全局状态 |
| 后端语言 | TypeScript | 5.4.x | 一致性 | 前后端共享类型 |
| 后端框架 | NestJS | 10.3.x | REST API | 模块化、可测试性强 |
| API 风格 | OpenAPI 3.0（REST） | - | 契约/生成 | 契约先行，前后端一致 |
| 数据库 | PostgreSQL（Supabase） | 15.x | 业务与元模型 | JSONB/GIN，托管省运维 |
| 队列/缓存 | BullMQ + Redis（Upstash） | 4.x / 托管 | 长任务 | Serverless 友好，成熟生态 |
| 存储 | Supabase Storage | - | 附件/导出 | 与 Auth/DB 一体化 |
| 鉴权 | Supabase Auth | 2.x | 身份/JWT | MVP 快速落地，可后续替换 |
| 前端测试 | Vitest + Testing Library | 1.5.x / 14.x | 单元/组件 | 速度快，生态广 |
| 后端测试 | Jest + supertest | 29.7.x / 6.3.x | 单元/集成 | Nest 生态完善 |
| E2E 测试 | Playwright | 1.45.x | 端到端 | 跨浏览器稳定，CI 友好 |
| 构建编排 | Turborepo + Yarn 3 | 1.12.x / 3.6.x | Monorepo | 缓存与任务编排 |
| 打包 | Next 内置 / tsup | - / 7.3.x | 应用/库 | 与 Next 兼容；库构建轻量 |
| CI/CD | GitHub Actions | - | 流水线 | 与 ci-security 文档对齐 |
| 监控 | OpenTelemetry + Prometheus | - | 指标/追踪 | 契约/观测目标一致 |
| 日志 | pino | 8.x | 结构化 | 低开销，字段化日志 |

> 版本锁定策略：初始化脚手架时固定至具体补丁版并生成锁文件；OpenAPI/Prisma/OTEL 等子包按兼容矩阵精确锁定。

---
