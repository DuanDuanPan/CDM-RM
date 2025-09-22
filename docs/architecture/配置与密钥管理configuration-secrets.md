# 配置与密钥管理（Configuration & Secrets）
- 配置来源：`.env`（dotenv-safe/envalid 校验）→ 进程环境变量 → 只读配置对象
- 命名规范：`APP_*` 应用、`DB_*` 数据库、`REDIS_*` 队列、`EXPORT_*` 导出治理、`OTEL_*` 观测
- 秘密管理：生产环境建议使用托管密钥服务或 Vault；严禁将密钥写入代码/镜像
- 多环境：`dev/staging/prod` 独立 `.env`，CI 仅注入需要的公开变量

---
