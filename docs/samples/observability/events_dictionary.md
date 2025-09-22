 # 事件与观测字典（CDM UI/UX v0.15）

 说明
 - 包含 RUM 指标与领域事件的名称、触发时机、载荷字段与隐私注意。

 ## A. RUM 指标（性能）

 | 指标 | 目标 | 触发 | 载荷 | 备注 |
 |---|---|---|---|---|
 | TTFB | < 200ms | 首次响应 | url, ttfb | 首字节时间 |
 | FCP | < 1.8s | 首次绘制 | url, fcp | 首次内容绘制 |
 | TTI | ≤ 2.0s（缓存）/ ≤ 3.5s（首访） | 可交互 | url, tti | 可交互时间 |
 | INP | p75 < 200ms | 用户交互 | url, inp, interactionType | 交互到下一次绘制 |
 | CLS | < 0.1 | 布局变化 | url, cls | 布局偏移 |

 ## B. 领域事件（Domain Events）

 通用字段
 - requestId, sessionId, userId (哈希), role, ts (ISO), url, from, view, q, return

 事件清单
 - import_started
   - when: 用户上传 REQIF 后、开始校验
   - payload: fileName, fileSize, moduleHint?, jobId
 - import_failed
   - when: 导入失败
   - payload: jobId, step, errorCode, row?, col?
 - import_succeeded
   - when: 写入最小基线成功
   - payload: jobId, moduleCount, objectCount, baselineId
 - extraction_task_created
   - when: 提交抽取任务
   - payload: ruleSetId, useLLM, estimatedCount, jobId
 - metric_review_decision
   - when: 复核通过/退回
   - payload: metricId, decision (approve|reject), confidence, reason?
 - binding_created
   - when: 需求/指标与部件绑定
   - payload: objectType, objectId, partId, baselineId
 - diff_created
   - when: 产生差异
   - payload: diffId, severity, objectType, changeType
 - change_package_routed
   - when: 变更包派发至责任人
   - payload: changeId, severity, ownerId, deadline
 - regression_batch_created
   - when: 新回归批次
   - payload: batchId, level, caseCount?
 - export_performed
   - when: 发起导出
   - payload: resource, columns, format, rowCount, watermark, approved, auditId
 - deep_link_clicked
   - when: 点击深链
   - payload: target, context {from,q,view,return}, result (success|forbidden|missing)

 隐私与合规
 - userId 需哈希化；导出与深链事件写入审计；遵循数据保留策略

