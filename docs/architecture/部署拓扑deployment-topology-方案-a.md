# 部署拓扑（Deployment Topology · 方案 A）

```mermaid
graph LR
  User((用户)) --> V[Vercel Next.js]
  V -->|HTTPS| API[(Render/Railway Nest API)]
  API -->|SQL| PG[(Supabase Postgres)]
  API -->|TLS| RED[(Upstash Redis)]
  API -->|HTTP| W[Worker(队列消费)]
  W --> PG
  W --> RED
  W --> AD1[DOORS 适配器]
  W --> AD2[通知适配器]
  API --> METRICS[/metrics/]
  API --> OPENAPI[OpenAPI]
```

环境：生产/预发/开发多环境隔离；区域与现有基础设施一致。

---
