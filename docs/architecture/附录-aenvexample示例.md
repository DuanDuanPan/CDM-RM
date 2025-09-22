# 附录 A：.env.example（示例）
```env
APP_ENV=dev
APP_PORT=4000
API_BASE_URL=http://localhost:4000/api

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=cdm

REDIS_URL=redis://localhost:6379

EXPORT_WATERMARK=on
EXPORT_LIMIT_DEFAULT=5000
EXPORT_RATE_LIMIT=3/day

SUPABASE_JWKS_URL=https://YOUR-SUPABASE-PROJ.auth.supabase.com/.well-known/jwks.json
SUPABASE_ISSUER=https://YOUR-SUPABASE-PROJ.auth.supabase.com/
SUPABASE_AUD=authenticated

OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
LOGGER_LEVEL=info
LOGGER_FORMAT=json
```

---
