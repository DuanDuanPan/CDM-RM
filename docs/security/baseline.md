# 安全基线附录（导出水印 / 脱敏规则 / 审批状态机）

适用范围：需求动态表格/视图与导出（CSV/Excel），与 PRD NFR11–NFR14 对齐。

---

## 1. 导出水印模板

目标：确保导出可追溯，不可否认。

- 通用字段
  - 导出者：`{{user.name}} <{{user.email}}>`
  - 导出时间：`{{iso_ts}} (Asia/Shanghai)`
  - 视图与追踪：`viewId={{view.id}} traceId={{trace.id}}`
  - 数据概览：`rows={{count}} filters={{filters_hash}}`

- CSV 水印（头部注释）示例
  ```csv
  # exported_by=alice@example.com exported_at=2025-09-22T10:05:00+08:00 viewId=V123 traceId=abcd1234 rows=312 filters=7fae...
  # columns=id,title,priority,owner,...
  id,title,priority,owner
  ...
  ```

- Excel 水印（页眉/页脚 + 封面 Sheet）
  - 页脚：`导出者: {{user}} | {{iso_ts}} | view={{view.id}} | trace={{trace.id}}`
  - 新增“导出信息”工作表写入同样字段（便于存档系统检索）

---

## 2. 脱敏规则（示例）

策略：默认拒绝；按字段配置脱敏；导出与查询复用同一权限检查。

- 规则类型
  - 遮蔽：`mask(value, keepHead=3, keepTail=2, char='*')`
  - 哈希：`sha256(value + pepper)`（不可逆）
  - 截断/范围化：`clamp(value, min, max)` 或映射到分档
  - 置空：对未授权字段/列直接不返回（而非空字符串）

- 规则示意表
  - `ownerEmail`：遮蔽（显示域名）：`a***@example.com`
  - `supplierName`：哈希
  - `costEstimate`：按范围分档（如：1–5, 6–10）
  - `attachmentUrl`：未授权则置空并不返回该列

---

## 3. 视图发布/导出审批状态机

### 3.1 视图共享审批（组织/角色）
States：`Draft → PendingReview → Approved → Published → Expired/Revoked`

- 进入 PendingReview：Owner 提交，需至少 1 名 Reviewer 审批
- Approved：通过后可发布为组织/角色级；同时设置 TTL（默认 90 天）
- Expired：到期自动下线；可续期重走审批
- Revoked：Owner/Admin 可撤销，记录原因

### 3.2 大体量导出审批（>5k 行）
States：`Requested → PendingReview → Approved → Generated → Delivered/Rejected`

- 限流：每账户/日默认 3 次（可配）
- 审批：Reviewer 审核后触发异步导出 Job；生成含水印文件与审计记录

---

## 4. 审计要求

- 必备字段：`who, when, action, target, before, after, traceId, viewId, clientIp`
- 导出记录保存：≥ 1 年（可配置），含下载链接/校验和（SHA256）
- 视图审计：版本、审批人、变更 diff、有效期

---

## 5. 环境与配置建议

- 开关：`EXPORT_WATERMARK=on` `EXPORT_LIMIT_DEFAULT=5000` `EXPORT_RATE_LIMIT=3/day`
- 审批：`APPROVAL_REQUIRED_FOR=views:org,views:role,export:gt5k`
- 脱敏 pepper：`SECRETS_PEPPER`（Vault/ENV，禁止入库）

