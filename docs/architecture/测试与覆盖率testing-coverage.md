# 测试与覆盖率（Testing & Coverage）
- 前端：Vitest + Testing Library；目录 `apps/web/__tests__`；快照仅用于稳定 UI
- 后端：Jest + supertest；目录 `apps/api/__tests__`；集成测试覆盖核心路由与错误路径
- E2E：Playwright（手动工作流触发），输出截图/trace；默认路径 `storage/playwright`
- 覆盖率：前后端分别产出覆盖率并在 CI 上传（或使用 nyc/istanbul 合并后上传）

---
