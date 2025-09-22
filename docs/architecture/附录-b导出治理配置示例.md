# 附录 B：导出治理配置（示例）
```yaml
export:
  threshold_rows: 5000
  approvals:
    required: true
    reviewers: ['data-admin','security']
  watermark:
    enabled: true
    fields: ['user','timestamp','viewId','traceId','filters']
  masking:
    ownerEmail: { type: mask, keepHead: 3, keepTail: 2, char: '*' }
    supplierName: { type: hash, algo: sha256 }
    costEstimate: { type: bucket, ranges: ['1-5','6-10','>10'] }
```

---
