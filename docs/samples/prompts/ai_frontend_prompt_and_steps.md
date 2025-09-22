<!-- AI Frontend Prompt & Lovable Steps — CDM UI/UX v0.15 -->

# AI 前端提示词与 Lovable 多步指令

版本: 0.15（对应 docs/front-end-spec.md）

—

## 1) 主提示词（可直接用于 v0 / Lovable）

```
You are an expert Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui (Radix primitives) frontend engineer. Generate a production‑ready, responsive, accessible, data‑dense web app scaffold for “CDM 需求集成 MVP” with mobile‑first layouts and desktop optimizations.

CONTEXT
- Purpose: Integrate DOORS requirements and changes into a coherent, traceable flow. Mainline: requirement accompaniment/metric allocation → part/component implementation → verification. Sideline: change → diff → notification → regression. Close loop with DOORS write-back.
- Primary users: requirements engineers, QA/verification, change/project admins, system admins.
- Tech stack (hard requirement):
  - Next.js 14 App Router + React 18 + TypeScript
  - Tailwind CSS 3.4+, shadcn/ui (Radix). Use TanStack Table + virtualization for large tables; TanStack Query optional for data.
  - Styling via Tailwind + design tokens; dark/high-contrast themes via tokens.
  - A11y: WCAG 2.1 AA baseline, full keyboard paths, “Skip to main”, focus ring ≥2px, aria-live updates.
- Visual system (tokens):
  - Colors: primary #2563EB, secondary #475569, accent #F59E0B, success #16A34A, warning #F59E0B, error #DC2626, neutral gray 50–900.
  - Fonts: Inter, PingFang SC fallback; base 16px; type scale H1 24/600/32, H2 20/600/28, H3 18/600/26, body 14/400/22.
  - Spacing 4/8 scale; grid 12 cols; max container 1280–1440px desktop.
  - Motion: 120–240ms typical; respect prefers-reduced-motion; animate only transform/opacity.
- Responsiveness:
  - Breakpoints: Mobile <768, Tablet 768–1023, Desktop 1024–1439, Wide ≥1440.
  - Mobile: cardified tables, primary actions first; Desktop: list–detail–right ops panel.
- Performance targets:
  - TTI: ≤2.0s cached / ≤3.5s first visit; interactions visible ≤100ms, complete ≤300ms; lists 60fps scroll.
  - Route budgets: JS ≤300KB gzip, CSS ≤120KB gzip.
- Governance:
  - Export governance: minimal visible fields, column-level RBAC, watermark, audited exports.
  - Deep links with context params (from/q/view/return), audited clicks.
- Domain icon mapping: requirement file-text, metric target, RBOM tree, diff git-compare, change package ticket, regression kanban, import upload, write-back download/cloud, audit shield-check, rules hash, dictionary book.

INFORMATION ARCHITECTURE (routes)
- “/” Dashboard: KPI cards (import success rate, regression pass rate, pending diffs), recent jobs, quick links (Import/Review/Bind/Diff).
- “/requirements”: list (server pagination/filter/sort, virtualized), “/requirements/[id]” detail (content/trace/versions/dup-conflicts tabs).
- “/metrics”: extract jobs, dictionary/rules, review queue.
- “/rbom”: binding view, baseline compare.
- “/changes”: diffs list, change packages, routing.
- “/regression”: batches, board/report.
- “/integration”: reqif-import, dxl-mock-sync, doors-writeback, srs-import-export (DOC/DOCX).
- “/audit”: operations log, export governance.
- “/system”: rbac, view/column templates, coding rules, metamodel/field config, environment.

CRITICAL USER FLOWS (initial)
1) REQIF import minimal loop (upload → validate → parse → de-duplicate/sourcing → preview → write minimal baseline → trace generation → done; long job with progress; errors pinpointed row/col; dedupe: merge/skip/new noted).
2) Metric extraction & review (create task → rules/dictionary/LLM config → run → review queue with source snippet + confidence + diff highlight → approve/write + binding; cancel/retry/checkpoint resume; notifications).
3) RBOM binding (open requirement/metric → search/choose part → create binding → update RBOM baseline → verify trace).
4) Benchmark compare & phenotype selection (choose benchmark → pick metrics → compute deltas → risk list & Top‑N recommendations → record selection & rationale → generate todos).
5) SRS import/export minimal loop (import DOC/DOCX with mappings, preview, write baseline; or export by range/template; watermark + audit).

DATA MODELS (TypeScript, for mock/work):
export type ID = string;
export interface Requirement { id: ID; moduleId: ID; baselineId: ID; status: 'new'|'in_review'|'approved'|'deprecated'; title: string; content: string; sourceId?: string; hash?: string; createdAt: string; updatedAt: string; }
export interface Metric { id: ID; requirementId: ID; name: string; unit?: string; value?: number; confidence?: number; sourceSnippet?: string; status: 'suggested'|'approved'|'rejected'; }
export interface RBOMPart { id: ID; name: string; parentId?: ID; baselineId?: ID; }
export interface Diff { id: ID; severity: 'high'|'medium'|'low'; objectType: 'requirement'|'metric'|'rbom'|'other'; objectId: ID; changeType: 'add'|'update'|'delete'; summary: string; createdAt: string; }
export interface ChangePackage { id: ID; severity: 'high'|'medium'|'low'; ownerId?: ID; status: 'open'|'in_progress'|'closed'|'waived'; deadline?: string; }
export interface RegressionBatch { id: ID; level: string; passRate?: number; blockers?: { id: ID; title: string; }[] }
export interface Job { id: ID; type: 'import'|'extract'|'bind'|'export'; status: 'queued'|'running'|'waiting_input'|'failed'|'succeeded'|'canceled'; progress: number; steps: { name: string; status: 'pending'|'running'|'done'|'failed'; }[]; }

API PLACEHOLDERS (mock now, real later)
- POST /api/imports (upload REQIF) → { jobId }
- GET /api/jobs/:id → Job
- POST /api/metrics/extract → { jobId }
- GET /api/requirements, /api/requirements/:id
- POST /api/rbom/bind
- GET /api/diffs, POST /api/changes
- POST /api/srs/import, POST /api/srs/export
Note: implement as mock first; keep contracts typed; wire to components via hooks.

TASK
Create the initial scaffold and core components with mobile‑first layouts, then enhance desktop:
1) Setup
   - Scaffold Next.js 14 App Router + TS; add Tailwind + shadcn/ui; configure base theme tokens (colors above), dark + high‑contrast themes; add ESLint + Prettier.
   - Install Radix UI, @tanstack/react-table, @tanstack/react-virtual, @tanstack/react-query (optional).
2) Global UI
   - Root layout with responsive shell: header (app title, search, global actions), left nav (Dashboard, Requirements, Metrics, RBOM, Changes, Regression, Integration, Audit, System), content area, toasts.
   - Add “Skip to main” link, keyboard shortcuts help modal (“?”).
3) Pages (routes above)
   - Dashboard: KPI cards, recent jobs list (JobProgressPanel), quick links grid. Mobile: stacked cards; Desktop: 3‑column.
   - Requirements list: DataTable wrapper (TanStack + virtualization + server pagination/filter/sort), selection mode, column config persistence; keyboard ops (/, Space, Esc, Shift+Arrows, Enter).
   - Requirement detail: tabs (content, trace, versions, dup‑conflicts), right ops panel; deep link ready (query params from/q/view/return).
   - Integration: REQIF Import Wizard (upload → validate → parse → de‑duplicate → preview → write), job progress with cancel/retry/checkpoint‑resume.
   - Metrics: Review Queue with dual‑pane (source snippet vs extraction), approve/reject with reason; diff highlight; batch actions.
   - RBOM: left tree + right table (candidates/bound), bulk bind/unbind; baseline compare placeholder.
   - Changes: Diffs list with filters/grouping; Diff Viewer skeleton (side‑by‑side/inline toggle, severity/source grouping); derive change package action.
   - Regression: batches board placeholder (pass rate, blockers), deep links to failures.
   - Audit: export governance page (RBAC column‑level, watermark preview, audit logs table).
   - System: RBAC placeholder, View/Column templates page, Coding rules page, Metamodel config page.
4) Components
   - DataTable (virtualized, sticky header/columns, column visibility/order/width persistence; keyboard a11y).
   - JobProgressPanel (steps, progress, cancel/retry, resume).
   - DiffViewer (modes, filters, anchors, copy fragment).
   - ReviewQueueList (dual pane, confidence, batch approve/reject).
   - RBOMTree (lazy load) + BindPanel.
   - ExportControls (format, range, watermark preview) with audit hooks.
5) A11y/Responsive/Performance
   - Ensure WCAG AA (axe pass), keyboard paths; mobile cardified tables; desktop list–detail–ops.
   - Code split per route; lazy heavy widgets; animate only opacity/transform; respect reduced‑motion.
   - Add RUM hooks placeholders (TTFB, TTI, INP, CLS, FCP).
6) Tests/Docs
   - Add basic Playwright/E2E stubs for the four core flows (import, review, bind, diff closure).
   - Storybook for core components (DataTable, ImportWizard, ReviewQueue, DiffViewer, Job panel) with A11y addon.

CONSTRAINTS (do NOT violate)
- Use TypeScript everywhere; App Router only; Tailwind + shadcn/ui as base; for complex forms/tables keep module boundaries if introducing AntD/Formily (do NOT mix in one component).
- Do not change ESLint/Prettier defaults beyond basics.
- Do not implement real API; use typed mocks and clearly separate data layer.
- Keep all work under apps/web (or the root web app) and avoid modifying unrelated packages.

SCOPE
- Create routes, layouts, and above components. Wire to typed mock data and handlers. Provide stubs for API calls.
- Do not implement full business logic; focus on scaffolding, IA, a11y, responsive, performance patterns, and mockable interfaces.

ACCEPTANCE CRITERIA
- Pages render with mobile‑first layouts and pass basic axe checks.
- Requirements table virtualizes and supports keyboard shortcuts and selection mode with persistence.
- Import wizard shows job lifecycle with cancel/retry/checkpoint resume (mocked).
- Deep links propagate context via query params; “return” restores list filters/scroll.
- Export page shows RBAC‑aware column picker, watermark preview, and writes audit entries (mock).
- Storybook stories exist for key components; tests stubs for E2E flows.

Output:
- The full Next.js file structure to be created/modified.
- The content for critical files (layout.tsx, theme/tokens, DataTable, JobProgressPanel, ImportWizard, DiffViewer, ReviewQueue, RBOMTree + BindPanel, ExportControls).
- Notes on where to plug real APIs later.
```

—

## 2) Lovable 多步指令序列

逐步执行，每步生成后先展示变更与预览，再等待确认。每步遵循：目标→动作→文件/范围→验收标准。

1) 项目初始化与依赖
- 目标: 创建基础工程与依赖，启用设计令牌与主题切换
- 动作:
  - 初始化 Next.js 14 + TS 应用 `apps/web`（或根目录 web 应用）
  - 安装 Tailwind、shadcn/ui、Radix、@tanstack/react-table、@tanstack/react-virtual、@tanstack/react-query（可选）
  - 配置 Tailwind 与 shadcn；新增暗色与高对比主题切换占位
- 文件/范围: `apps/web/*`（或根 web 应用），Tailwind 与 shadcn 配置
- 验收: dev 可运行；首页渲染；暗色切换占位存在

2) 全局布局与外壳
- 目标: 布局外壳（头部/侧边栏/内容区/吐司）与可达性基线
- 动作:
  - `app/layout.tsx` 实现 shell：Header（标题、搜索、全局动作）、Left Nav（Dashboard、Requirements、Metrics、RBOM、Changes、Regression、Integration、Audit、System）、Content
  - 添加 “Skip to main” 链接、焦点环（≥2px）、“?” 快捷键帮助模态
- 文件/范围: `app/layout.tsx`, `components/ui/*`
- 验收: 响应式、键盘可达、帮助模态可打开

3) 设计令牌与主题
- 目标: 颜色/字体/间距/动效令牌；暗色与高对比主题
- 动作: 配置 tokens 与 Tailwind 主题扩展，prefers-reduced-motion 支持
- 文件/范围: `styles/tokens.css` 或 `lib/tokens.ts`
- 验收: AA 对比、主题切换可用

4) 类型与 Mock 数据层
- 目标: 提供 TS 数据模型与 API 占位
- 动作: 定义类型与 mock hooks
- 文件/范围: `lib/types.ts`, `lib/api-mock/*`
- 验收: 编译通过，hook 返回数据

5) Dashboard 路由
- 目标: KPI 卡片、最近作业、快捷入口
- 动作: `app/page.tsx` 与 `components/JobProgressPanel.tsx`
- 验收: 移动堆叠/桌面三列；axe 通过

6) Requirements 列表（DataTable）
- 目标: 虚拟滚动、服务端分页筛选、列配置持久化、选择模式、快捷键
- 动作: TanStack Table + react-virtual 封装 `DataTable`
- 验收: 10万行流畅；`?` 快捷键帮助可达

7) Requirement 详情与深链
- 目标: tabs（内容/追溯/版本/查重冲突）、右侧操作、深链上下文
- 验收: 返回恢复筛选与滚动位置

8) Integration：REQIF Import Wizard + Job
- 目标: 上传→校验→解析→去重/溯源→预览→写入；取消/重试/断点续跑
- 验收: 行/列错误定位；生命周期完整（mock）

9) Metrics：抽取任务与复核队列
- 目标: 双栏复核、置信度、批量通过/退回、修正规则回路
- 验收: 键盘操作与差异高亮

10) RBOM：绑定与基线对比
- 目标: 左树右表、批量绑定/撤销、建议绑定
- 验收: 懒加载树不阻塞；操作可撤销

11) Changes：差异列表 + Diff Viewer
- 目标: 并排/行内切换、过滤/分组、范围收敛、批量派生更改单、导出
- 验收: j/k 导航、o/Enter 展开；导出水印预览

12) Regression：回归批次与看板
- 目标: 批次、通过率、阻塞项、深链
- 验收: 过滤与跳转可用

13) Audit & Export Governance
- 目标: 列级 RBAC、最小可见字段、水印、审计、节流
- 验收: 导出与审计 mock 全通

14) System：管理页
- 目标: RBAC、视图/列模板、编码规则、元模型配置、环境
- 验收: 表单提交/回显

15) A11y/Responsive/Performance 收尾
- 目标: WCAG AA、移动卡片化、代码分割/懒加载、RUM hooks 占位
- 验收: 无高严重 A11y；TTI/INP 占位存在

16) Storybook 与 E2E
- 目标: 核心组件故事 + 4 条 E2E 骨架
- 验收: 故事可运行；E2E 跑通 mock 流

—

审阅与验证：配合 `docs/samples/checklists/dev_ux_landing_checklist.md` 执行与留证。

