 # UX 规格评审简报（CDM UI/UX v0.16）

 ## 1. 背景与目标
 - 场景：航空发动机研制（涡扇/涡喷）
 - 目标：以最小改造打通主线/支线闭环，保证可演示、可复核、可追溯

 ## 2. IA 与主/支线
 - 主线：需求伴随/指标分配 → 对象/组件实现 → 验证
 - 支线：变更 → 差异 → 通知 → 回归；DOORS 反写
 - 新增：标杆对比、型谱选用、SRS 导入/导出

 ## 3. 关键用户流
 - REQIF 导入最小闭环、指标抽取与复核、RBOM 绑定
 - 差异→更改单→路由→通知→SLA 关闭、SRS 导入/导出

 ## 4. 组件与令牌
 - DataTable/ReviewQueue/DiffViewer/RBOMTree/JobPanel/ExportControls
 - 设计令牌：明/暗/高对比；A11y：WCAG 2.1 AA；性能预算：TTI/INP 等

 ## 5. 治理与深链
 - 导出治理：最小可见字段、列级 RBAC、水印、审计、节流
 - 深链：from/q/view/return 上下文与审计

 ## 6. 样例与 i18n
 - 样例数据/REQIF/SRS、领域 Storybook 数据、zh-CN/en-US 词典

 ## 7. 待决关键项（投票）
 - D1…D10（见 `docs/ops/ux_review_decisions.md`）

 ## 8. 下一步
 - Figma 线框、Storybook 基座、E2E 骨架、i18n Provider、小步实现

