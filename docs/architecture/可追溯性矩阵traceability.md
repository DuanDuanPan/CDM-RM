# 可追溯性矩阵（Traceability）
| PRD 功能 | 模块/端点 | 数据模型 | 备注 |
|---|---|---|---|
| REQIF 导入 | POST /import/reqif | Requirement/Metric | 作业化、预检/溯源/去重 |
| 指标抽取 | queue:extract、/metrics（API） | Metric | 规则/词典/LLM + 复核 |
| RBOM 绑定 | POST /rbom/bindings | RequirementRbomBinding/RbomNode | 基线化 |
| 差异/变更 | POST/GET /diffs, /changes/packages | Diff/Change* | 驱动通知与回归 |
| 通知/Ack | /notifications/dispatch, /work-packages/* | Notification/WorkPackage | 合并/送达/确认 |
| 验证/闭环 | /verifications, /closure | Verification/Closure | 看板聚合 |

---
