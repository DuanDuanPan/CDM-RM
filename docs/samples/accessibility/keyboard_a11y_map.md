 # 键盘操作与可达性地图（CDM UI/UX v0.15）

 说明
 - 本文档列出关键页面的焦点顺序、常用快捷键与 A11y 要点。
 - 目标：完整键盘路径、axe 无高严重问题，WCAG 2.1 AA。

 全局快捷键（建议）
 - `/` 聚焦全局搜索
 - `?` 打开快捷键帮助
 - `Alt+Shift+D` 切换暗色；`Alt+Shift+H` 切换高对比
 - `g r` 转到 Requirements；`g m` 转到 Metrics；`g c` 转到 Changes

 表格（DataTable）快捷键
 - `Space`/`Esc` 进入/退出选择模式
 - `Shift+↑/↓` 连续选择；`Enter` 打开详情
 - `PgUp/PgDn` 翻页；`Home/End` 首/尾
 - `Cmd/Ctrl+E` 导出（RBAC 检查）；`Cmd/Ctrl+Backspace` 批量删除（危险态）

 焦点顺序（示例）
 1. Skip to main → 左侧导航 → 页标题 → 筛选区 → 数据表 → 右侧操作区 → 页脚
 2. 数据表内：行 → 单元格 → 行操作 → 外置操作区（保持 row key 稳定，虚拟滚动不丢焦点）

 A11y 要点
 - 焦点环≥2px，禁用态不吞焦点；对话框使用 `role=dialog` 与 `aria-modal=true`
 - 动态更新（作业进度、导入结果）使用 `aria-live=polite`；错误使用 `aria-live=assertive`
 - 图标需文本替代；状态以颜色+形状双编码（避免仅靠颜色）
 - 200% 缩放不破版；`prefers-reduced-motion` 降低/禁用动效

 回归走查清单（每版本）
 - [ ] 全局键盘路径通过；快捷键帮助可达
 - [ ] 表格行/单元格聚焦、批量操作与可撤销验证
 - [ ] 模态/抽屉/菜单 A11y 语义与陷阱焦点处理正确
 - [ ] 高对比与暗色对比度达标；Reduced Motion 生效

