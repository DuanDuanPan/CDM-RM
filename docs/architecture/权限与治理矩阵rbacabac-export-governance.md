# 权限与治理矩阵（RBAC/ABAC & Export Governance）

## 角色（建议）
- Admin：全资源管理；可配置治理策略
- Configurator：元模型/规则/视图配置（仅“需求实体”）
- Engineer：需求/指标/RBOM 绑定与变更操作
- QA：验证/回归/看板与关闭
- Viewer：只读（遵循列级权限）

## 资源→动作（示例）
- Requirements：read（所有）；write（Engineer/Admin）；delete（仅本地新增，DOORS 同步项禁止）
- Metrics：read；write（抽取/复核后入库）；delete（管理员）
- RBOM Bindings：read/write（Engineer/QA/Admin）
- Diffs/Changes：read；write（Engineer/Admin）
- Notifications：dispatch（Admin/Engineer）
- Exports：read（受治理与审批）；生成走异步 Job

## 列级权限
- 未授权字段不返回（而非空字符串）
- 导出与查询共享同一权限检查

## 导出治理
- 阈值：`> 5000` 行需审批；异步生成，带水印与审计
- 脱敏：遮蔽/哈希/分档/置空；默认拒绝，按字段白名单开放

## 策略表达与执行（Policy Enforcement）
- 策略存储（建议表结构）：
  - `policies`：`id, role, resource, effect(allow|deny), columns(jsonb), createdAt`
  - `export_policies`：`id, role, resource, thresholdRows, watermark(jsonb), masking(jsonb), approvals(jsonb)`
- 执行位置：
  - 读路径：Controller → Guard(`ColumnProjectionGuard`) 根据 `role+resource` 计算列白名单，注入到 Service 查询的 select/projection
  - 写路径：Guard(`ActionGuard`) 校验 `role→resource→action`
  - 导出：同一策略表生效；由 ExportService 合并“列白名单 + 脱敏规则 + 水印模板 + 阈值审批”
- 伪代码（列裁剪）：
```ts
// ColumnProjectionGuard.ts
const policy = await policyRepo.getColumns(role, resource);
req.projection = policy.columns; // ['id','title','priority',...]
await next();

// Service 查询
this.prisma.requirement.findMany({ select: projectionToSelect(req.projection), ...filters });
```
- 伪代码（导出治理）：
```ts
const p = await exportPolicyRepo.get(role, resource);
if (rowCount > p.thresholdRows) enqueueApproval();
const rows = maskColumns(data, p.masking);
const file = addWatermark(csv(rows), p.watermark);
auditLog('export', { viewId, traceId, count: rows.length });
```

---
