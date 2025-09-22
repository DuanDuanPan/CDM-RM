# 队列与可靠性策略（Queues & Reliability）
- BullMQ 通用配置：`attempts=3`、`backoff=exponential(1000ms)`、`timeout` 按任务设定
- DLQ：失败进入死信队列并告警；提供“重放”脚本
- 幂等：作业 `idempotencyKey` = 输入摘要；重复提交直接返回上次结果
- 去重：同一来源文件+基线哈希在导入阶段直接拒绝或转为覆盖策略

---
