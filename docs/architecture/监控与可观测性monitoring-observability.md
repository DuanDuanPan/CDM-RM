# 监控与可观测性（Monitoring & Observability）

## 环境变量（示例）
```bash
# OpenTelemetry
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
OTEL_RESOURCE_ATTRIBUTES=service.name=cdm-api,service.version=0.1.0,service.namespace=cdm

# 日志
LOGGER_LEVEL=info
LOGGER_FORMAT=json

# Prometheus 指标（/metrics）
PROM_ENABLED=true
```

## 指标建议
- 应用：QPS、P95/99、错误率（4xx/5xx）、并发连接、任务滞留/重试次数
- 数据库：连接池利用率、慢查询计数/耗时分位数
- 作业：队列长度、成功/失败率、任务执行时长 P95/99

---
