# 前端架构（Frontend Architecture）

## 组件组织（目录约定）
```text
apps/web/
├── app/                      # App Router
│   ├── (auth)/sign-in/page.tsx
│   ├── (dashboard)/page.tsx
│   ├── import/page.tsx
│   ├── requirements/page.tsx
│   ├── requirements/[id]/page.tsx
│   ├── diffs/page.tsx
│   ├── changes/page.tsx
│   ├── work-packages/page.tsx
│   ├── verifications/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                   # shadcn/ui 原子组件
│   └── shared/               # 复合组件（按域）
├── lib/
│   ├── api/                  # OpenAPI 客户端封装
│   ├── auth/
│   ├── store/                # Zustand stores
│   └── utils/
├── styles/
└── tests/
```

## 组件模板（示例）
```tsx
// apps/web/components/shared/ImportCard.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = { onUpload: (f: File) => Promise<void> };
export function ImportCard({ onUpload }: Props) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="rounded-lg border p-4">
      <input type="file" accept=".reqif,.zip,.doc,.docx" onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setBusy(true);
        try { await onUpload(f); } finally { setBusy(false); }
      }} />
      <Button disabled={busy} className="ml-2">{busy ? '上传中…' : '选择文件'}</Button>
    </div>
  );
}
```

## 状态管理（TanStack Query + Zustand）
```ts
// apps/web/lib/store/import.ts
import { create } from 'zustand';

type ImportState = { jobId?: string; setJobId: (id?: string) => void };
export const useImportStore = create<ImportState>((set) => ({
  jobId: undefined,
  setJobId: (id) => set({ jobId: id }),
}));

// apps/web/lib/api/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 2 } },
});
```

## 状态管理模式（约定）
- 查询统一走 Query；写操作成功后执行精确失效（invalidateQueries）
- Ack/导入进度等适用乐观更新；失败回滚
- 表格默认服务端分页/排序/过滤；超大列表开启虚拟化

## 路由与受保护页面
```text
apps/web/app/
├── (auth)/sign-in/page.tsx   # 公开
├── (protected)/layout.tsx    # 受保护路由组
└── (protected)/requirements/page.tsx
```
```ts
// apps/web/app/(protected)/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('sb-access-token')?.value; // Supabase JWT（示例）
  if (!token) redirect('/sign-in');
  return <>{children}</>;
}
```

## 前端服务层（OpenAPI 客户端封装）
```ts
// apps/web/lib/api/client.ts
import { Api } from '@project/api-client'; // packages/api-client 生成产物
import { cookies } from 'next/headers';

export function serverApi() {
  const c = cookies();
  const token = c.get('sb-access-token')?.value;
  return new Api({
    baseURL: process.env.NEXT_PUBLIC_API_BASE,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// 示例：发起导入
export async function startReqifImport(file: File) {
  const api = serverApi();
  const form = new FormData();
  form.append('file', file);
  const res = await api.import.reqifCreate(form);
  return res.jobId as string;
}
```

---
