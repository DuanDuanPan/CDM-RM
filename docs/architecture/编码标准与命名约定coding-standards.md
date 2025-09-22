# 编码标准与命名约定（Coding Standards）

## 关键规则（Fullstack Critical Rules）
- 类型共享：公共类型统一放在 `packages/shared`，API 类型使用 `packages/api-types`
- 服务层：前端禁止直接手写 HTTP 调用，统一通过 `packages/api-client`
- 环境变量：仅通过集中配置读取，禁止随处访问 `process.env`
- 错误处理：后端必须使用统一异常过滤器；前端统一错误拦截与用户级提示映射
- 状态管理：查询用 TanStack Query；全局/页面局部状态用 Zustand；避免不必要的全局状态
- RBAC/列级权限：所有返回字段均经过服务端裁剪；导出与查询共享同一权限检查
- 迁移策略：Prisma Migrate 变更必须可回滚/幂等；高风险操作拆分执行
- 日志/追踪：所有入口记录 `traceId/reqId`；响应头回传 `x-trace-id`

## 命名建议（示例）
- 组件/文件：组件 `PascalCase`，变量/函数 `camelCase`，常量 `SCREAMING_SNAKE_CASE`
- API 路由：kebab-case（如 `/work-packages`）
- 数据库：snake_case 表名与字段名（Prisma 层统一映射）

---
