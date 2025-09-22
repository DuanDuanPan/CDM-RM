# 高层架构（High Level Architecture）

## 技术摘要（Technical Summary）
- 架构风格：单体内模块化分层，Monorepo 多包协作；前端 Next.js SSR/ISR，后端 NestJS REST；长任务以 BullMQ 队列异步化
- 前后端：Next.js 14（App Router）+ Tailwind + shadcn/ui + TanStack Table；NestJS 10 + Prisma/Postgres + BullMQ/Redis + DuckDB（就地分析）
- 集成契约：Swagger/OpenAPI 生成类型与客户端；统一鉴权与错误模型；列级权限/导出治理在服务端强制
- 可观测：Pino + OpenTelemetry + Prometheus /metrics；CI 含 OpenAPI Lint & Diff、安全扫描
- PRD 对齐：以 DOORS→系统→指标→RBOM→差异→变更→通知→验证/回归 的最小闭环为主轴，强调可演示、可复核、可追溯

## 平台与基础设施（方案 A）
- 前端：Vercel（Next.js 部署、CDN/边缘缓存）
- 数据层：Supabase Postgres（主库）与对象存储（如需附件）
- 队列：Upstash Redis（Serverless 友好）
- API 与队列 Worker：Render/Railway 单容器部署（NestJS HTTP 服务 + 独立 Worker 进程）
- 理由：MVP 演示最快路径，全球可用，成本低；Worker 需常驻进程，因此放置于 Render/Railway 更稳妥

## 仓库结构（Monorepo）
- Structure: Monorepo（apps + packages）
- Monorepo Tool: Yarn 3 Workspaces + Turborepo（任务编排与缓存）
- Package Organization：
  - `apps/web`：Next.js 14
  - `apps/api`：NestJS 10（HTTP 服务）
  - `apps/worker`：BullMQ 队列 Worker（独立进程）
  - `packages/shared`：共享类型/常量/工具
  - `packages/config`：ESLint/TSConfig/Prettier/commitlint 等共享配置
  - `infrastructure/`：部署脚本/IaC（可后续补充）

## 高层架构图
```mermaid
graph LR
  U[用户/浏览器] --> W[Next.js 14@Vercel<br/>SSR/ISR+CDN]
  W -->|OpenAPI 客户端| A[NestJS 10 REST API<br/>Render/Railway]
  subgraph Backend (Render/Railway)
    A --> P[(Supabase Postgres)]
    A --> R[(Upstash Redis)]
    A --> D[(DuckDB)]
    A --> J[Jobs/BullMQ<br/>导入/抽取/差异/通知]
    J --> R
    J --> P
  end
  subgraph Integrations
    J --> DOORS[DOORS 适配器<br/>Mock/Real 切换]
    J --> NOTI[通知适配器<br/>站内信/OA]
  end
  subgraph Observability
    A --> M[/metrics/ Prometheus]
    A --> O[OpenAPI /__openapi.json]
    A --> L[Pino+OTEL 日志/追踪]
  end
```

## 架构与设计模式（已选）
- 契约先行（OpenAPI 生成类型/客户端）
- Repository + Service 分层
- 队列驱动异步流水线（BullMQ）
- 环境集中校验（dotenv-safe/envalid）
- 统一错误模型/拦截器
- 服务端列级权限/导出治理（审批/水印/脱敏/审计）

---
