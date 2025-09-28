import fs from 'node:fs';
import path from 'node:path';

import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { OPENAPI_ACCESS_HEADER, OPENAPI_JSON_ROUTE, setupOpenApi } from '../src/openapi/setup-openapi';
import { OpenApiStateService } from '../src/openapi/openapi-state.service';

const repoRoot = path.resolve(__dirname, '../../..');
const resolveFromRoot = (...segments: string[]) => path.resolve(repoRoot, ...segments);
const SERVICE_KEY = 'test-openapi-service-key';

const ORIGINAL_ENV = {
  allowedTags: process.env.OPENAPI_ALLOWED_TAGS,
  excludedTags: process.env.OPENAPI_EXCLUDED_TAGS,
  hideServers: process.env.OPENAPI_HIDE_SERVERS,
  publicServerUrl: process.env.OPENAPI_PUBLIC_SERVER_URL
};

function getExpressRouteSignatures(app: INestApplication): string[] {
  type ExpressRouteLayer = {
    route?: {
      path?: string;
      methods?: Record<string, boolean>;
    };
  };

  const httpAdapter = app.getHttpAdapter() as { getInstance?: () => unknown };
  const expressInstance = typeof httpAdapter?.getInstance === 'function' ? httpAdapter.getInstance() : undefined;
  const router = (expressInstance as { _router?: { stack?: ExpressRouteLayer[] } } | undefined)?._router;
  const stack = router?.stack ?? [];

  return stack
    .filter((layer) => layer?.route)
    .flatMap((layer) => {
      const route = layer.route;
      if (!route || typeof route.path !== 'string') {
        return [];
      }
      const methods = Object.keys(route.methods ?? {});
      return methods.map((method) => `${method.toUpperCase()} ${route.path}`);
    });
}

describe('OpenAPI 契约导出', () => {
  let app: INestApplication;
  const originalServiceKey = process.env.OPENAPI_SERVICE_KEY;

  beforeAll(async () => {
    process.env.OPENAPI_SERVICE_KEY = SERVICE_KEY;
    process.env.OPENAPI_ALLOWED_TAGS = 'health';
    process.env.OPENAPI_EXCLUDED_TAGS = 'internal';
    process.env.OPENAPI_HIDE_SERVERS = 'true';
    delete process.env.OPENAPI_PUBLIC_SERVER_URL;
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await setupOpenApi(app);
    await app.init();
  });

  afterAll(async () => {
    if (typeof originalServiceKey === 'string') {
      process.env.OPENAPI_SERVICE_KEY = originalServiceKey;
    } else {
      delete process.env.OPENAPI_SERVICE_KEY;
    }
    process.env.OPENAPI_ALLOWED_TAGS = ORIGINAL_ENV.allowedTags ?? undefined;
    process.env.OPENAPI_EXCLUDED_TAGS = ORIGINAL_ENV.excludedTags ?? undefined;
    process.env.OPENAPI_HIDE_SERVERS = ORIGINAL_ENV.hideServers ?? undefined;
    process.env.OPENAPI_PUBLIC_SERVER_URL = ORIGINAL_ENV.publicServerUrl ?? undefined;
    await app.close();
  });

  it(`GET ${OPENAPI_JSON_ROUTE} 不携带密钥返回 401`, async () => {
    const response = await request(app.getHttpServer()).get(OPENAPI_JSON_ROUTE).expect(401);

    expect(response.body).toMatchObject({
      error: {
        code: 'OPENAPI_UNAUTHORIZED'
      }
    });
  });

  it(`GET ${OPENAPI_JSON_ROUTE} 携带密钥返回 200 与 OpenAPI 元数据`, async () => {
    const response = await request(app.getHttpServer())
      .get(OPENAPI_JSON_ROUTE)
      .set(OPENAPI_ACCESS_HEADER, SERVICE_KEY)
      .expect(200);

    expect(response.body.openapi).toMatch(/^3\.0/);
    expect(response.body.info).toMatchObject({
      title: expect.any(String),
      version: expect.any(String)
    });
    expect(response.body.security).toEqual([{ supabaseJwt: [] }]);
    expect(response.headers['cache-control']).toBe('no-store');
  });

  it(`GET ${OPENAPI_JSON_ROUTE} 携带 Authorization Bearer 返回 200`, async () => {
    const response = await request(app.getHttpServer())
      .get(OPENAPI_JSON_ROUTE)
      .set('Authorization', `Bearer ${SERVICE_KEY}`)
      .expect(200);

    expect(response.body.openapi).toMatch(/^3\.0/);
  });

  it('生成的类型与客户端目录存在', () => {
    expect(fs.existsSync(resolveFromRoot('packages/api-types/src/index.ts'))).toBe(true);
    expect(fs.existsSync(resolveFromRoot('packages/api-client/src/core/OpenAPI.ts'))).toBe(true);
    expect(fs.existsSync(resolveFromRoot('packages/api-client/src/services/HealthService.ts'))).toBe(true);
  });

  it('健康检查包含 OpenAPI 状态与鉴权提示', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.body.checks.openapi).toMatchObject({
      status: 'pass',
      version: expect.any(String),
      requiresAuth: true,
      tokenConfigured: true
    });
    expect(response.body.links.openapi).toMatchObject({
      url: OPENAPI_JSON_ROUTE,
      header: OPENAPI_ACCESS_HEADER,
      tokenConfigured: true,
      requiresAuth: true
    });
  });

  it('生成的文档仅包含允许的标签与脱敏后的 servers', () => {
    const state = app.get(OpenApiStateService);
    const document = state.getDocument();

    expect(document?.tags?.map((tag) => tag?.name)).toEqual(['health']);
    expect(Object.keys(document?.paths ?? {})).toContain('/health');
    expect(document?.servers).toEqual([
      {
        url: '/api',
        description: 'Public API surface'
      }
    ]);
  });

  it('OpenAPI paths 覆盖已注册的控制器 GET 路由', () => {
    const state = app.get(OpenApiStateService);
    const document = state.getDocument();
    const documentPaths = new Set(Object.keys(document?.paths ?? {}));
    const routes = getExpressRouteSignatures(app).filter((signature) => signature.toLowerCase() === 'get /health');

    expect(routes.length).toBeGreaterThan(0);
    expect(documentPaths.has('/health')).toBe(true);
  });

  it('Swagger UI 路由在无鉴权头时返回 401，携带密钥时 200', async () => {
    await request(app.getHttpServer()).get('/api/docs').expect(401);

    await request(app.getHttpServer()).get('/api/docs').set(OPENAPI_ACCESS_HEADER, SERVICE_KEY).expect(200);
  });
});

describe('OpenAPI 标签过滤行为', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.OPENAPI_SERVICE_KEY = SERVICE_KEY;
    process.env.OPENAPI_ALLOWED_TAGS = 'health,internal';
    process.env.OPENAPI_EXCLUDED_TAGS = 'health';
    process.env.OPENAPI_HIDE_SERVERS = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await setupOpenApi(app);
    await app.init();
  });

  afterAll(async () => {
    process.env.OPENAPI_ALLOWED_TAGS = ORIGINAL_ENV.allowedTags ?? undefined;
    process.env.OPENAPI_EXCLUDED_TAGS = ORIGINAL_ENV.excludedTags ?? undefined;
    process.env.OPENAPI_HIDE_SERVERS = ORIGINAL_ENV.hideServers ?? undefined;
    process.env.OPENAPI_PUBLIC_SERVER_URL = ORIGINAL_ENV.publicServerUrl ?? undefined;
    await app.close();
  });

  it('排除标签后不再暴露 health 路由', () => {
    const state = app.get(OpenApiStateService);
    const document = state.getDocument();
    expect(Object.keys(document?.paths ?? {})).not.toContain('/health');
    expect(document?.tags ?? []).toHaveLength(0);
  });
});

describe('OpenAPI 服务器配置', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.OPENAPI_SERVICE_KEY = SERVICE_KEY;
    process.env.OPENAPI_ALLOWED_TAGS = 'health';
    process.env.OPENAPI_HIDE_SERVERS = 'false';
    process.env.OPENAPI_PUBLIC_SERVER_URL = 'https://public.example/api';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await setupOpenApi(app);
    await app.init();
  });

  afterAll(async () => {
    process.env.OPENAPI_ALLOWED_TAGS = ORIGINAL_ENV.allowedTags ?? undefined;
    process.env.OPENAPI_HIDE_SERVERS = ORIGINAL_ENV.hideServers ?? undefined;
    process.env.OPENAPI_PUBLIC_SERVER_URL = ORIGINAL_ENV.publicServerUrl ?? undefined;
    await app.close();
  });

  it('保留基线服务器信息', () => {
    const state = app.get(OpenApiStateService);
    const document = state.getDocument();
    expect(document?.servers ?? []).toEqual(
      expect.arrayContaining([expect.objectContaining({ url: 'http://localhost:4000/api' })])
    );
  });
});

describe('OpenAPI 公共 server 定制', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.OPENAPI_SERVICE_KEY = SERVICE_KEY;
    process.env.OPENAPI_ALLOWED_TAGS = 'health';
    process.env.OPENAPI_HIDE_SERVERS = 'true';
    process.env.OPENAPI_PUBLIC_SERVER_URL = 'https://public.example/api';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await setupOpenApi(app);
    await app.init();
  });

  afterAll(async () => {
    process.env.OPENAPI_ALLOWED_TAGS = ORIGINAL_ENV.allowedTags ?? undefined;
    process.env.OPENAPI_HIDE_SERVERS = ORIGINAL_ENV.hideServers ?? undefined;
    process.env.OPENAPI_PUBLIC_SERVER_URL = ORIGINAL_ENV.publicServerUrl ?? undefined;
    await app.close();
  });

  it('使用自定义公共 server URL', () => {
    const state = app.get(OpenApiStateService);
    const document = state.getDocument();
    expect(document?.servers).toEqual([
      {
        url: 'https://public.example/api',
        description: 'Public API surface'
      }
    ]);
  });
});

describe('OpenAPI 标签全量暴露', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.OPENAPI_SERVICE_KEY = SERVICE_KEY;
    process.env.OPENAPI_ALLOWED_TAGS = '*';
    process.env.OPENAPI_EXCLUDED_TAGS = '';
    process.env.OPENAPI_HIDE_SERVERS = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await setupOpenApi(app);
    await app.init();
  });

  afterAll(async () => {
    process.env.OPENAPI_ALLOWED_TAGS = ORIGINAL_ENV.allowedTags ?? undefined;
    process.env.OPENAPI_EXCLUDED_TAGS = ORIGINAL_ENV.excludedTags ?? undefined;
    process.env.OPENAPI_HIDE_SERVERS = ORIGINAL_ENV.hideServers ?? undefined;
    process.env.OPENAPI_PUBLIC_SERVER_URL = ORIGINAL_ENV.publicServerUrl ?? undefined;
    await app.close();
  });

  it('保留所有标签对应的路径', () => {
    const state = app.get(OpenApiStateService);
    const document = state.getDocument();
    expect(Object.keys(document?.paths ?? {})).toContain('/health');
  });
});

describe('OpenAPI 基线读取分支', () => {
  let app: INestApplication;
  const originalServiceKey = process.env.OPENAPI_SERVICE_KEY;

  beforeAll(async () => {
    process.env.OPENAPI_SERVICE_KEY = SERVICE_KEY;
    process.env.OPENAPI_ALLOWED_TAGS = 'health';
    process.env.OPENAPI_HIDE_SERVERS = 'true';
    const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    try {
      const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
      app = moduleRef.createNestApplication();
      await setupOpenApi(app);
      await app.init();
    } finally {
      existsSpy.mockRestore();
    }
  });

  afterAll(async () => {
    if (typeof originalServiceKey === 'string') {
      process.env.OPENAPI_SERVICE_KEY = originalServiceKey;
    } else {
      delete process.env.OPENAPI_SERVICE_KEY;
    }
    process.env.OPENAPI_ALLOWED_TAGS = ORIGINAL_ENV.allowedTags ?? undefined;
    process.env.OPENAPI_HIDE_SERVERS = ORIGINAL_ENV.hideServers ?? undefined;
    await app.close();
  });

  it('在没有基线文件时仍能生成文档并提供路由', async () => {
    await request(app.getHttpServer()).get(OPENAPI_JSON_ROUTE).set(OPENAPI_ACCESS_HEADER, SERVICE_KEY).expect(200);
  });
});

describe('OpenAPI baseline fallback', () => {
  const originalServiceKey = process.env.OPENAPI_SERVICE_KEY;

  afterEach(() => {
    jest.restoreAllMocks();
    if (typeof originalServiceKey === 'string') {
      process.env.OPENAPI_SERVICE_KEY = originalServiceKey;
    } else {
      delete process.env.OPENAPI_SERVICE_KEY;
    }
    process.env.OPENAPI_ALLOWED_TAGS = ORIGINAL_ENV.allowedTags ?? undefined;
    process.env.OPENAPI_EXCLUDED_TAGS = ORIGINAL_ENV.excludedTags ?? undefined;
    process.env.OPENAPI_HIDE_SERVERS = ORIGINAL_ENV.hideServers ?? undefined;
  });

  it('在基线读取失败时仍可完成初始化', async () => {
    process.env.OPENAPI_SERVICE_KEY = SERVICE_KEY;
    process.env.OPENAPI_ALLOWED_TAGS = 'health';
    process.env.OPENAPI_HIDE_SERVERS = 'true';
    const warnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => undefined);
    const debugSpy = jest.spyOn(Logger, 'debug').mockImplementation(() => undefined);
    const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readSpy = jest.spyOn(fs, 'readFileSync').mockImplementation(() => '{ invalid json');

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    const app = moduleRef.createNestApplication();

    await setupOpenApi(app);
    await app.close();

    expect(warnSpy).toHaveBeenCalled();
    expect(debugSpy).toHaveBeenCalled();

    existsSpy.mockRestore();
    readSpy.mockRestore();
  });
});
