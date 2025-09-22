# 12. Next Steps
1) 工具链/CI：Yarn 3 配置（.yarnrc.yml/nodeLinker）、Husky/lint-staged/commitlint、ESLint/Prettier、Vitest/Jest、GitHub Actions 工作流；分支保护
2) 契约/观测：Nest Swagger 暴露 /api/__openapi.json；脚本 `api:types`/`api:client`；Pino+OTEL 中间件；Prometheus /metrics
3) 数据与迁移：Prisma 基线（requirements/metrics/rbom_nodes/...）；meta_requirements* 与 JSONB extras；索引策略（GIN）
4) 适配器：doors-adapter（REQIF 解析 + DXL Mock 客户端 + 切换开关）；notifications-adapter（站内信/OA Mock）
5) 导入/预检：REQIF 预检规则与报告；SRS DOC/DOCX 映射模板与导出格式；编码规则配置与批量重编码
6) 元模型与表单/表格：需求字段模型配置、字段/列级权限与审计；表单/表格（动态表格视图）与视图设计器（含共享设置）最小实现；导出映射与预设；触发器（字段变更→通知/任务）
6.1) 治理落地：视图审批流（Reviewer 审批→发布→到期自动下线/续期）；导出水印与脱敏策略；>5k 行导出审批与限流；共享视图周报
7) 抽取与差异：规则/正则/词典 + LLM 抽取 Job；RBOM 绑定与差异生成；导出（CSV/Markdown）
8) 变更/通知/闭环：更改单/变更包与路由；Ack 收件箱；通知合并与留痕；回归批次/看板与闭环状态
9) 标杆/型谱：导入样本数据与规则；Top‑N 推荐与解释
10) 合规：dotenv-safe/envalid 校验；gitleaks；日志脱敏策略与备份加密预案

---
