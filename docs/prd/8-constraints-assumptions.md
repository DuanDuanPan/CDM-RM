# 8. Constraints & Assumptions

## 8.1 Constraints
- Timeline: 单模块试点周期 3–5 天
- Resources: 业务分析/系统工程/后端 各 1（最小配置）
- Technical（技术约束）:
  - 数据库仅支持 Postgres 15（启用 JSONB 与 GIN 索引），不做多方言兼容
  - Node.js 20 LTS；Yarn 3（Berry）Workspaces，启用 Corepack；CI 固定 Node 次要版
  - 仅桌面 Web，不支持移动端适配
  - 暂不对接外部工单；采用手动同步与轻量流程
- Security/Compliance（安全与合规）:
  - 数据“永久保留”，备份加密与日志脱敏必须落实；密钥不入库（env/vault），使用 dotenv-safe/envalid 校验环境变量
  - 禁止打印 PII/密钥；提交前执行密钥扫描（如 gitleaks）
- Observability（可观测性）:
  - 必须使用结构化 JSON 日志（Pino），Prometheus `/metrics` 暴露应用/队列/DB 指标
  - 统一 requestId/traceId 贯穿（OTEL 上下文），错误结构统一
 - Governance（治理）:
   - 视图发布到“组织/角色”范围需审批（至少 1 名 Reviewer）；默认有效期 90 天（可续期）；过期自动下线
   - 导出默认水印与字段脱敏开启；>5k 行导出需审批与限流；导出记录包含视图/traceId/请求者

## 8.2 Assumptions
- 提供 DOORS 导出样本与 RBOM 片段（含必要字段）；可获得 DXL 测试环境或录制样本
- 可快速冻结模板/映射/词典的 MVP 版本
- 站内信/OA 可直接作为通知渠道（MVP 使用 Mock）
- SRS 模板（DOC/DOCX）可提供并允许字段绑定映射
- 提供标杆核心指标样本与初版型谱规则（可先以 CSV/JSON 维护）
- LLM 抽取可使用指定服务或离线模型；策略允许超时/重试/人工复核
- 动态建模初版以 JSON Schema + JSONB 实现（仅覆盖需求实体；不引入额外 NoSQL），后续如需可评估插件式扩展

---
