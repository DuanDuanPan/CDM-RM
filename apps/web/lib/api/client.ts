/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OpenAPIConfig } from '@cdm/api-client';
import { HealthService, OpenAPI } from '@cdm/api-client';

type ApiClientOptions = {
  baseUrl?: string;
  version?: string;
  withCredentials?: boolean;
  credentials?: OpenAPIConfig['CREDENTIALS'];
  token?: OpenAPIConfig['TOKEN'];
  username?: OpenAPIConfig['USERNAME'];
  password?: OpenAPIConfig['PASSWORD'];
  headers?: OpenAPIConfig['HEADERS'];
  encodePath?: OpenAPIConfig['ENCODE_PATH'];
};

type ServiceMethods = Record<string, (...args: any[]) => unknown>;

type ServiceProxy<T extends ServiceMethods> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R ? (...args: A) => Promise<Awaited<R>> : never;
};

const DEFAULT_SERVER_BASE = process.env.API_BASE_URL ?? OpenAPI.BASE;
const DEFAULT_BROWSER_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? OpenAPI.BASE;

async function callWithOpenApiConfig<T>(overrides: Partial<OpenAPIConfig>, operation: () => Promise<T>): Promise<T> {
  const previous: OpenAPIConfig = { ...OpenAPI };
  const hadKey: Record<string, boolean> = {};

  for (const [key, value] of Object.entries(overrides)) {
    if (value !== undefined) {
      hadKey[key] = Object.prototype.hasOwnProperty.call(previous, key);
      (OpenAPI as Record<string, unknown>)[key] = value;
    }
  }

  try {
    return await operation();
  } finally {
    Object.assign(OpenAPI, previous);
    for (const key of Object.keys(overrides)) {
      if (!hadKey[key]) {
        delete (OpenAPI as Record<string, unknown>)[key];
      }
    }
  }
}

function buildOverrides(options: ApiClientOptions, fallbackBase: string): Partial<OpenAPIConfig> {
  const overrides: Partial<OpenAPIConfig> = {
    BASE: options.baseUrl ?? fallbackBase,
    VERSION: options.version ?? OpenAPI.VERSION
  };

  if (typeof options.withCredentials === 'boolean') {
    overrides.WITH_CREDENTIALS = options.withCredentials;
  }

  if (options.credentials) {
    overrides.CREDENTIALS = options.credentials;
  }

  if (options.token !== undefined) {
    overrides.TOKEN = options.token;
  }

  if (options.username !== undefined) {
    overrides.USERNAME = options.username;
  }

  if (options.password !== undefined) {
    overrides.PASSWORD = options.password;
  }

  if (options.headers !== undefined) {
    overrides.HEADERS = options.headers;
  }

  if (options.encodePath) {
    overrides.ENCODE_PATH = options.encodePath;
  }

  return overrides;
}

function buildServiceFacade(service: ServiceMethods): ServiceMethods {
  const facade: ServiceMethods = {};

  for (const [name, candidate] of Object.entries(service)) {
    if (typeof candidate !== 'function') {
      continue;
    }

    const invoke = (...args: unknown[]) => (candidate as (...fnArgs: unknown[]) => unknown)(...args);
    facade[name] = invoke;

    if (name.startsWith('app') && name.length > 3) {
      const alias = name.charAt(3).toLowerCase() + name.slice(4);
      if (!facade[alias]) {
        facade[alias] = invoke;
      }
    }
  }

  return facade;
}

function createServiceProxy<T extends ServiceMethods>(service: T, overrides: Partial<OpenAPIConfig>): ServiceProxy<T> {
  const proxy: Record<string, unknown> = {};

  for (const method of Object.keys(service)) {
    const fn = service[method];
    proxy[method] = async (...args: unknown[]) => {
      const execute = () => Promise.resolve(fn(...args)) as Promise<unknown>;
      return callWithOpenApiConfig(overrides, execute);
    };
  }

  return proxy as ServiceProxy<T>;
}

const generatedService = buildServiceFacade(HealthService as unknown as ServiceMethods);

export function createApiClient(options: ApiClientOptions = {}): ServiceProxy<typeof generatedService> {
  const overrides = buildOverrides(options, options.baseUrl ?? DEFAULT_SERVER_BASE);
  return createServiceProxy(generatedService, overrides);
}

export function serverApi(options: ApiClientOptions = {}): ServiceProxy<typeof generatedService> {
  const baseUrl = options.baseUrl ?? DEFAULT_SERVER_BASE;
  return createApiClient({ ...options, baseUrl });
}

export function browserApi(options: ApiClientOptions = {}): ServiceProxy<typeof generatedService> {
  const runtimeBase =
    options.baseUrl ??
    (typeof window !== 'undefined' && typeof (window as { __CDM_API_BASE__?: string }).__CDM_API_BASE__ === 'string'
      ? (window as { __CDM_API_BASE__?: string }).__CDM_API_BASE__
      : DEFAULT_BROWSER_BASE);

  return createApiClient({
    ...options,
    baseUrl: runtimeBase,
    withCredentials: options.withCredentials ?? true,
    credentials: options.credentials ?? 'include'
  });
}

export type ApiClient = ReturnType<typeof createApiClient>;
