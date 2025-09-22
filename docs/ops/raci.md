# 责任分工与账号计划（RACI）

版本：v0.1（草案）  
状态：待评审（PO）

## 目的
明确关键外部服务与安全相关动作的责任归属，避免开发阶段出现账号/凭据阻塞。

## 角色定义
- PO（产品负责人）
- Maintainer（仓库维护/合并守门人）
- Dev（开发）
- DevOps（CI/CD 与部署）
- Security（安全与合规）
- SRE（可观测与运行）

## 外部服务与资源
- Vercel（Next.js 托管）
- Supabase（Postgres/对象存储）
- Upstash（Redis/队列）
- Render/Railway（NestJS API/Worker）

## 账号与凭据（RACI）

| 事项 | 负责人 (R) | 批准人 (A) | 咨询 (C) | 知会 (I) |
|---|---|---|---|---|
| 服务账号创建（Vercel） | DevOps | PO | Security | Maintainer |
| 服务账号创建（Supabase） | DevOps | PO | Security | Maintainer |
| 服务账号创建（Upstash） | DevOps | PO | Security | Maintainer |
| 服务账号创建（Render/Railway） | DevOps | PO | Security | Maintainer |
| 计费/采购审批 | PO | 业务Owner | Security | Maintainer |
| 环境变量清单维护 | DevOps | Maintainer | Security | Dev |
| 密钥轮换策略 | Security | Maintainer | DevOps | Dev |
| CI 密钥注入（GitHub Secrets） | DevOps | Maintainer | Security | Dev |
| 权限模型（最小权限） | Security | Maintainer | DevOps | Dev |
| 事故响应与回滚 | SRE | Maintainer | DevOps | PO |

注：实际人名与联系方式在批准后补充到本表下方“联系人”段落。

## 环境划分与密钥表
- 环境：`dev` / `staging` / `prod`
- 密钥来源：服务控制台生成（禁止本地生成后共享）
- 存储：GitHub Environments + Secrets（按环境悬吊审批），本地仅 `.env`（不入库）
- 最小密钥表（示例）：
  - `DATABASE_URL`（Supabase Postgres）
  - `REDIS_URL`（Upstash）
  - `API_BASE_URL`（环境 API 基址）
  - `NEXT_PUBLIC_*`（前端公开只读变量）
  - `OTEL_EXPORTER_OTLP_ENDPOINT`（可观测采集端点，可后置）

## 审批与变更记录
- 所有账号创建/权限变更需记录：操作人、时间、范围、审批单号
- 密钥轮换最小周期：季度/触发式（事故/泄露/人员变动）

## 联系人（占位）
- PO：TBD
- Maintainer：TBD
- DevOps：TBD
- Security：TBD
- SRE：TBD

