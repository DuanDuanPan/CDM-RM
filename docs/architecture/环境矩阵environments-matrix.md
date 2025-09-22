# 环境矩阵（Environments Matrix）
| 环境 | 域名 | 数据库 | Redis | 说明 |
|---|---|---|---|---|
| dev | localhost | 本地/容器 | 本地/容器 | 开发联调 |
| staging | stg.example.com | 托管 PG（小规格） | 托管 Redis | 预发验证 |
| prod | api.example.com | 托管 PG（生产） | 托管 Redis | 生产流量 |

---
