# 11. Epics Plan（MVP 草案，待确认）

- Epic 1: 基础设施 / 契约 / 观测
  - 目标：Yarn 3 Workspaces、ESLint/Prettier/Husky、Vitest/Jest；Pino+OTEL、Prometheus /metrics；Nest Swagger + OpenAPI 生成脚本；Prisma 基线；gitleaks + dotenv-safe/envalid；健康检查/金丝雀路由

- Epic 2: 集成与导入（REQIF / DXL / SRS / 编码）
  - 目标：REQIF 导入与预检（兼容 CSV）；DXL 同步（Mock，可切换真实端点，增量+幂等）；SRS DOC/DOCX 导入/导出最小实现；编码规则管理与批量重编码；MDM/词典装载

- Epic 3: 需求元模型与动态表单（仅需求实体）
  - 目标：meta_requirements* 元数据表与 JSONB 扩展；/meta/requirements* API；字段/列级权限与审计；表单与表格（动态表格视图）与视图设计器（含共享设置）；导出映射与预设；最小触发器（字段变更→通知/任务）

- Epic 4: 指标抽取与 RBOM 绑定
  - 目标：规则/正则/词典 + LLM 抽取（异步 Job、超时/重试/人工复核、审计）；RBOM 基线与 Part 级绑定；差异生成与导出

- Epic 5: 变更编排与通知
  - 目标：差异→更改单/变更包；责任人路由与 Ack 流；站内信/OA 通知（合并、送达/阅读/确认留痕）；工作包下发与追踪

- Epic 6: 验证与回归闭环
  - 目标：影响≥中用例失效与任务派生；按变更包生成回归批次；RBOM 层级看板与闭环状态/覆盖计算

- Epic 7: 标杆对比与型谱选用
  - 目标：标杆库导入/维护与对比（风险识别与解释）；型谱规则配置；Top‑N 推荐与匹配度解释

> 注：故事与验收标准将在后续故事化阶段拆解，保持单次执行可完成（2–4 小时粒度）。

---
