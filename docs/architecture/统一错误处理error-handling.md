# 统一错误处理（Error Handling）

## 前端错误模型与拦截
```ts
// apps/web/lib/api/errors.ts
export interface ApiError { error: { code: string; message: string; details?: Record<string, any>; timestamp: string; requestId: string; }; }

export function handleApiError(e: unknown): string {
  const any = e as any;
  if (any?.response?.data?.error?.message) return any.response.data.error.message as string;
  return '网络或系统异常，请稍后重试';
}
```

## 后端异常过滤器（NestJS）
```ts
// apps/api/src/shared/filters/http-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? (exception.getResponse() as any)?.message ?? exception.message : 'Internal Server Error';
    const requestId = req.headers['x-trace-id'] || req.id;
    res.status(status).json({ error: { code: String(status), message, timestamp: new Date().toISOString(), requestId } });
  }
}
```

---
