# Epic 7：标杆对比与型谱选用

---

## Story 7.1 标杆库导入与治理
As a Data Steward,
I want benchmark catalog import,
so that 标杆指标可维护与溯源。

Acceptance Criteria
- 导入/更新标杆核心指标（CSV/JSON）；来源/版本记录
- 字段映射到内部模型；对比报告

---

## Story 7.2 指标对比与风险识别
As an Analyst,
I want compare actual vs benchmark,
so that 识别风险与差距。

Acceptance Criteria
- 对比计算与可视化；超阈值项标记风险
- 导出对比报告；写审计

---

## Story 7.3 型谱规则配置
As a Configurator,
I want phenotype rules (weights/thresholds),
so that 推荐可配置。

Acceptance Criteria
- 规则管理：权重/阈值/筛选条件；版本审计
- 与导入样本联动演练

---

## Story 7.4 Top‑N 推荐与解释
As a User,
I want Top‑N product recommendations with explanations,
so that 选择更有依据。

Acceptance Criteria
- 输入：选中的需求指标/条目
- 输出：Top‑N + 匹配度 + 解释（命中/缺口/权重贡献）
- 结果可导出；可复现（审计与版本）

