 # 决议记录（CDM UI/UX v0.16）

 说明：评审会形成的关键决策记录，按编号维护。状态：Pending/Approved/Rejected/Deferred。

 | ID | 决策主题 | 选项 | 决议 | Owner | Due | 状态 |
 |---|---|---|---|---|---|---|
 | D1 | 技术基线：Tailwind+shadcn 主导，是否允许模块级 AntD/Formily | 允许/禁止（限定页面级，不混用组件） |  |  |  | Pending |
 | D2 | PTR 分段口径（PTR0/PTR1/PTR2）及度量关联 | 采用组织口径/自定义 |  |  |  | Pending |
 | D3 | 导出最小可见字段白名单（角色×资源×列） | 见 export_matrix.csv |  |  |  | Pending |
 | D4 | 数据保留：导出/审计保留期与告警阈值 | 30/60/180/365 天 |  |  |  | Pending |
 | D5 | KPI 门槛：TTI/INP/A11y | TTI≤2.0s/3.5s，INP p75<200ms，WCAG AA |  |  |  | Pending |
 | D6 | SRS/REQIF 映射与单位精度/四舍五入规则 | 见映射清单 |  |  |  | Pending |
 | D7 | 深链策略：允许参数与返回锚点恢复范围 | from/q/view/return |  |  |  | Pending |
 | D8 | 单位与量纲词典覆盖范围（TSFC/T4/NOx 等） | 全量/增量 |  |  |  | Pending |
 | D9 | Job 生命周期：取消/重试/断点续跑策略与 RACI | 见作业化说明 |  |  |  | Pending |
 | D10 | 导出治理：水印信息、频率限制与审批流 | 见治理章节 |  |  |  | Pending |

