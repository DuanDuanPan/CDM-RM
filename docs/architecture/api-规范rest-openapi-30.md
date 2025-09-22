# API 规范（REST + OpenAPI 3.0）

## 基本约定
- 基础路径：`/api`（可选版本前缀 `/api/v1`）
- 认证：`Authorization: Bearer <Supabase JWT>`；后端验证 JWKS/Issuer/Audience
- 追踪：可选传入 `x-trace-id`，服务端回传同名响应头
- 分页：`page`（默认 1），`pageSize`（默认 20，最大 200）
- 错误：统一结构 `{ error: { code, message, details?, timestamp, requestId } }`

## 主要端点（节选）
- `POST /import/reqif`：导入 REQIF（multipart，异步作业，返回 `{ jobId }`）
- `GET /requirements`：分页查询系统需求
- `GET /rbom/nodes`：查询 RBOM 节点（支持 `parentId`）
- `POST /rbom/bindings`：绑定需求与 RBOM 节点
- `POST /diffs` / `GET /diffs`：触发/查询差异
- `POST /changes/packages`：基于差异创建变更包
- `POST /notifications/dispatch`：派发通知（站内信/OA，可合并）
- `POST /work-packages/{id}/ack`：工作包确认
- `POST /verifications` / `POST /deliverables` / `POST /closure`：验证/交付物/闭环
- `GET /metrics`：Prometheus 指标文本

## 请求/响应示例（节选）
```bash
curl -H "Authorization: Bearer $TOKEN" -F file=@sample.reqif \
  -X POST https://api.example.com/api/import/reqif
# 202
{ "jobId": "job_abc123", "status": "queued" }
```

```bash
curl -H "Authorization: Bearer $TOKEN" \
  'https://api.example.com/api/requirements?page=1&pageSize=20&status=frozen'
# 200
{ "items": [{"id":"SR-001","title":"…"}], "page":1, "pageSize":20, "total":312 }
```

## 枚举码值与 i18n 映射（展示）
- Requirement.status：draft→草拟；in_review→评审中；frozen→冻结；changing→变更中；closed→关闭
- Requirement.verificationMethod：test→试验；analysis→分析；inspection→检验；demonstration→演示
- Diff.severity：high→高；medium→中；low→低
- ChangePackage.status：draft→草拟；in_progress→进行中；pending_verification→待验证；completed→完成；closed→关闭
- WorkPackage.status（建议）：issued→已下发；in_progress→进行中；done→完成；closed→关闭
- Acknowledgement.status：acknowledged→已确认；rejected→已拒绝
- Verification.outcome：passed→通过；failed→失败；blocked→阻塞
- Closure.result：passed→通过；partially_passed→部分通过；failed→失败

> 契约基线：详见 `docs/openapi.baseline.json`（CI 将对 `docs/openapi.json` 执行 Lint & Diff）。

---
