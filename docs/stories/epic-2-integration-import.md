# Epic 2：集成与导入（REQIF / DXL / SRS / 编码）

---

## Story 2.1 REQIF 导入与预检
As an Integrator,
I want REQIF import with precheck,
so that 输入质量可控且可复核。

Acceptance Criteria
- 支持上传 REQIF（兼容 CSV）；解析模块/对象/字段
- 预检报告：字段完备度、非法/缺失值、枚举映射差异、大小/重复
- 错误与警告分级；可导出预检报告（CSV/Markdown）

---

## Story 2.2 CSV 兼容与映射向导
As a User,
I want CSV mapping wizard,
so that 无 REQIF 时也能导入。

Acceptance Criteria
- 字段映射到内部模板；保存映射模板并复用
- 支持中英字段匹配与 MDM 词典校验

---

## Story 2.3 DXL 同步（Mock + 可切换）
As an Integrator,
I want DXL sync (mock to real switch),
so that 同步可逐步落地。

Acceptance Criteria
- 提供 `doors-adapter`：Mock 客户端 + 切换真实端点的配置
- 支持增量同步与幂等（基于来源ID/更新时间戳）
- 全量/增量同步均写审计

---

## Story 2.4 需求反写 DOORS（Mock）
As an Integrator,
I want DOORS reverse write (mock),
so that 状态/交付物回传可联调。

Acceptance Criteria
- 支持回写状态/交付物链接/结论；记录失败并可重试
- 统一审计字段；可切换真实端点

---

## Story 2.5 SRS 导入/导出（DOC/DOCX）
As a BA,
I want import/export SRS (DOC/DOCX),
so that 规格说明书与系统数据互通。

Acceptance Criteria
- 导入：模板字段绑定映射；错误报告；不破坏未识别字段
- 导出：多语言表头与模板选择；与导出预设一致

---

## Story 2.6 编码规则与批量重编码
As an Admin,
I want coding rules & bulk re-code,
so that 编码可配置且可治理。

Acceptance Criteria
- 规则：前缀/序列/位数/校验；预览与模拟
- 批量重编码任务；回滚脚本；审计

---

## Story 2.7 MDM/词典加载
As a Data Steward,
I want MDM lookups loader,
so that 字段/枚举统一口径。

Acceptance Criteria
- 加载/更新枚举与词典表；提供对比报告
- 变更热加载；落盘版本

---

## Story 2.8 审计与幂等
As an Auditor,
I want full audit & idempotency,
so that 导入同步可追溯可重放。

Acceptance Criteria
- 导入/同步/反写均写审计（who/when/traceId）
- 重放策略：按来源ID/时间戳去重；失败可重试

