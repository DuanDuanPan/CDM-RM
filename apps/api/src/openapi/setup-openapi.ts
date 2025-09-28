import fs from 'node:fs';
import path from 'node:path';

import type { INestApplication } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type {
  ComponentsObject,
  OpenAPIObject,
  OperationObject,
  PathsObject,
  SecurityRequirementObject,
  TagObject
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { OpenApiStateService } from './openapi-state.service';

interface BaselineSpec {
  info?: {
    title?: string;
    description?: string;
    version?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  paths?: PathsObject;
  components?: ComponentsObject;
}

const OPENAPI_ROUTE = '/api/__openapi.json';
const SWAGGER_UI_ROUTE = '/api/docs';
const OPENAPI_ACCESS_HEADER_NAME = 'x-openapi-key';
const OPENAPI_SERVICE_KEY_ENV = 'OPENAPI_SERVICE_KEY';
const OPENAPI_ALLOWED_TAGS_ENV = 'OPENAPI_ALLOWED_TAGS';
const OPENAPI_EXCLUDED_TAGS_ENV = 'OPENAPI_EXCLUDED_TAGS';
const OPENAPI_HIDE_SERVERS_ENV = 'OPENAPI_HIDE_SERVERS';
const OPENAPI_PUBLIC_SERVER_URL_ENV = 'OPENAPI_PUBLIC_SERVER_URL';

function ensureServiceKey(): string {
  const configured = process.env[OPENAPI_SERVICE_KEY_ENV];
  if (!configured || configured.trim().length === 0) {
    throw new Error('OPENAPI_SERVICE_KEY 未配置，无法保护 OpenAPI 导出端点。');
  }

  return configured.trim();
}

function extractToken(candidate: unknown): string | null {
  if (typeof candidate === 'string') {
    return candidate;
  }

  if (Array.isArray(candidate)) {
    return candidate[0] ?? null;
  }

  return null;
}

type RequestLike = {
  headers?: Record<string, unknown> | undefined;
};

type ResponseLike = {
  status?: (code: number) => void;
  set?: (field: string, value: string) => void;
  type?: (type: string) => void;
  send?: (body: unknown) => void;
  json?: (body: unknown) => void;
};

type NextFunctionLike = () => void;

function isAuthorized(request: RequestLike | undefined, expectedToken: string): boolean {
  const headers = request?.headers ?? {};
  const headerToken = extractToken(headers[OPENAPI_ACCESS_HEADER_NAME]);

  if (headerToken && headerToken === expectedToken) {
    return true;
  }

  const authorization = extractToken(headers.authorization);
  if (authorization) {
    const [scheme, token] = authorization.split(' ');
    if (scheme?.toLowerCase() === 'bearer' && token === expectedToken) {
      return true;
    }
  }

  return false;
}

function denyAccess(response: ResponseLike): void {
  response.status?.(401);
  response.set?.('Cache-Control', 'no-store');
  response.json?.({
    error: {
      code: 'OPENAPI_UNAUTHORIZED',
      message: `缺少或无效的 ${OPENAPI_ACCESS_HEADER_NAME} header`
    }
  });
}

function parseList(value: string | undefined): string[] | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (normalized === '*') {
    return [];
  }

  const segments = normalized
    .split(',')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  return segments.length > 0 ? segments : null;
}

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(normalized)
    ? true
    : ['0', 'false', 'no', 'off'].includes(normalized)
      ? false
      : defaultValue;
}

function applyScopeToDocument(
  document: OpenAPIObject,
  allowedTags: string[],
  excludedTags: string[],
  hideServers: boolean,
  publicServerUrl: string | null
): void {
  const allowedSet = new Set(allowedTags.map((tag) => tag.toLowerCase()));
  const excludedSet = new Set(excludedTags.map((tag) => tag.toLowerCase()));
  const retainedTags = new Set<string>();

  const paths = document.paths ?? {};
  const operationHttpMethods = new Set(['get', 'put', 'post', 'delete', 'patch', 'options', 'head', 'trace']);
  for (const [pathKey, pathValue] of Object.entries(paths)) {
    const pathItem = (pathValue ?? {}) as Record<string, OperationObject | undefined | unknown>;
    for (const methodKey of Object.keys(pathItem)) {
      const normalizedMethod = methodKey.toLowerCase();
      if (!operationHttpMethods.has(normalizedMethod)) {
        continue;
      }

      const operation = pathItem[methodKey] as OperationObject | undefined;
      if (!operation) {
        delete pathItem[methodKey];
        continue;
      }

      const tags: string[] = Array.isArray(operation.tags)
        ? operation.tags.filter((tag): tag is string => typeof tag === 'string' && tag.length > 0)
        : [];
      const normalized = tags.map((tag) => tag.toLowerCase());
      const isExcluded = normalized.some((tag) => excludedSet.has(tag));
      const isAllowed = normalized.some((tag) => allowedSet.has(tag));

      if (isExcluded || (allowedSet.size > 0 && !isAllowed)) {
        delete pathItem[methodKey];
        continue;
      }

      const filteredTags = tags.filter((tag) => !allowedSet.size || allowedSet.has(tag.toLowerCase()));
      operation.tags = filteredTags;
      filteredTags.forEach((tag) => retainedTags.add(tag));
    }

    const hasOperations = Object.keys(pathItem).some((methodKey) => operationHttpMethods.has(methodKey.toLowerCase()));

    if (!hasOperations) {
      delete paths[pathKey];
    }
  }

  const existingTags = Array.isArray(document.tags) ? document.tags : [];
  document.tags = existingTags
    .filter((tag) => {
      const name = tag?.name?.toLowerCase();
      if (!name) {
        return false;
      }
      if (excludedSet.has(name)) {
        return false;
      }
      return allowedSet.size === 0 || allowedSet.has(name);
    })
    .map((tag) => ({ name: tag.name, description: tag.description }));

  if (document.tags.length === 0 && retainedTags.size > 0) {
    document.tags = Array.from(retainedTags).map((name) => ({ name }));
  }

  if (hideServers) {
    const sanitizedUrl = publicServerUrl && publicServerUrl.length > 0 ? publicServerUrl : '/api';
    document.servers = [
      {
        url: sanitizedUrl,
        description: 'Public API surface'
      }
    ];
  }
}

function readBaseline(): BaselineSpec | null {
  const baselinePath = path.resolve(__dirname, '../../../../docs/openapi.baseline.json');

  if (!fs.existsSync(baselinePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(baselinePath, 'utf8');
    return JSON.parse(content) as BaselineSpec;
  } catch (error) {
    Logger.warn('读取 docs/openapi.baseline.json 失败，将使用默认 OpenAPI 元数据', 'OpenAPI');
    Logger.debug(error, 'OpenAPI');
    return null;
  }
}

export async function setupOpenApi(app: INestApplication): Promise<{
  document: OpenAPIObject;
  jsonRoute: string;
  uiRoute: string;
}> {
  const serviceKey = ensureServiceKey();
  const allowedTags = parseList(process.env[OPENAPI_ALLOWED_TAGS_ENV]) ?? ['health'];
  const excludedTags = parseList(process.env[OPENAPI_EXCLUDED_TAGS_ENV]) ?? [];
  const hideServers = parseBoolean(process.env[OPENAPI_HIDE_SERVERS_ENV], true);
  const publicServerUrl = process.env[OPENAPI_PUBLIC_SERVER_URL_ENV]?.trim() ?? null;
  const baseline = readBaseline();
  const version = process.env.APP_VERSION ?? baseline?.info?.version ?? '0.1.0';
  const title = baseline?.info?.title ?? 'CDM 需求集成 MVP API';
  const description = baseline?.info?.description ?? 'CDM 需求集成 MVP API 契约';

  const builder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Supabase JWT，通过 Authorization: Bearer <token> 传递'
      },
      'supabaseJwt'
    )
    .addSecurityRequirements('supabaseJwt');
  if (hideServers) {
    const sanitizedUrl = publicServerUrl && publicServerUrl.length > 0 ? publicServerUrl : '/api';
    builder.addServer(sanitizedUrl, 'Public API surface');
  } else {
    const servers = baseline?.servers ?? [
      {
        url: 'http://localhost:4000/api',
        description: '本地开发'
      }
    ];
    servers.forEach((server) => {
      builder.addServer(server.url, server.description);
    });
  }

  const document = SwaggerModule.createDocument(app, builder.build(), {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey.replace(/Controller$/, '')}_${methodKey}`
  });

  if (baseline?.paths) {
    document.paths = {
      ...(baseline.paths ?? {}),
      ...(document.paths ?? {})
    } as PathsObject;
  }

  if (baseline?.components) {
    const baselineComponents = baseline.components ?? {};
    const generatedComponents = document.components ?? {};

    document.components = {
      ...baselineComponents,
      ...generatedComponents,
      schemas: {
        ...(baselineComponents.schemas ?? {}),
        ...(generatedComponents.schemas ?? {})
      },
      responses: {
        ...(baselineComponents.responses ?? {}),
        ...(generatedComponents.responses ?? {})
      },
      parameters: {
        ...(baselineComponents.parameters ?? {}),
        ...(generatedComponents.parameters ?? {})
      },
      requestBodies: {
        ...(baselineComponents.requestBodies ?? {}),
        ...(generatedComponents.requestBodies ?? {})
      },
      headers: {
        ...(baselineComponents.headers ?? {}),
        ...(generatedComponents.headers ?? {})
      },
      securitySchemes: {
        ...(baselineComponents.securitySchemes ?? {}),
        ...(generatedComponents.securitySchemes ?? {})
      },
      links: {
        ...(baselineComponents.links ?? {}),
        ...(generatedComponents.links ?? {})
      },
      callbacks: {
        ...(baselineComponents.callbacks ?? {}),
        ...(generatedComponents.callbacks ?? {})
      }
    } as typeof document.components;
  }

  applyScopeToDocument(document, allowedTags, excludedTags, hideServers, publicServerUrl);

  if (baseline?.tags?.length) {
    const mergedTags = new Map<string, { name: string; description?: string }>();
    baseline.tags.forEach((tag) => {
      if (tag?.name) {
        mergedTags.set(tag.name, tag);
      }
    });
    (document.tags ?? []).forEach((tag) => {
      if (tag?.name) {
        mergedTags.set(tag.name, tag);
      }
    });
    document.tags = Array.from(mergedTags.values());
  }

  if (baseline?.security?.length && (!document.security || document.security.length === 0)) {
    document.security = baseline.security as SecurityRequirementObject[];
  }

  const adapter = app.getHttpAdapter();
  const openApiState = app.get(OpenApiStateService, { strict: false });

  if (openApiState) {
    openApiState.setAccessControl({
      headerName: OPENAPI_ACCESS_HEADER_NAME,
      tokenConfigured: true,
      requiresAuth: true
    });
  }

  const guard = (req: RequestLike, res: ResponseLike, next: NextFunctionLike) => {
    if (isAuthorized(req, serviceKey)) {
      next();
      return;
    }

    denyAccess(res);
  };

  const httpAdapter = app.getHttpAdapter();
  const httpServer = typeof httpAdapter.getHttpServer === 'function' ? httpAdapter.getHttpServer() : null;
  const expressInstance = typeof httpAdapter.getInstance === 'function' ? httpAdapter.getInstance() : null;

  if (expressInstance?.use) {
    expressInstance.use(SWAGGER_UI_ROUTE, guard);
  } else if (httpServer?.use) {
    httpServer.use(SWAGGER_UI_ROUTE, guard);
  }

  if (typeof adapter?.get === 'function') {
    adapter.get(OPENAPI_ROUTE, (request: RequestLike, response: ResponseLike) => {
      if (!isAuthorized(request, serviceKey)) {
        denyAccess(response);
        return;
      }

      response.set?.('Cache-Control', 'no-store');
      response.type?.('application/json');
      response.send?.(document);
    });
  }

  SwaggerModule.setup(SWAGGER_UI_ROUTE, app, document, {
    jsonDocumentUrl: OPENAPI_ROUTE,
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  if (openApiState) {
    openApiState.setDocument(document);
  }

  return {
    document,
    jsonRoute: OPENAPI_ROUTE,
    uiRoute: SWAGGER_UI_ROUTE
  };
}

export const OPENAPI_JSON_ROUTE = OPENAPI_ROUTE;
export const OPENAPI_UI_ROUTE = SWAGGER_UI_ROUTE;
export const OPENAPI_ACCESS_HEADER = OPENAPI_ACCESS_HEADER_NAME;
