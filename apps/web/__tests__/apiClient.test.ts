import type { OpenAPIConfig } from '@cdm/api-client';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

type MutableOpenApiState = Partial<OpenAPIConfig> & Record<string, unknown>;

const hoisted = vi.hoisted(() => {
  const openApiState: MutableOpenApiState = {
    BASE: 'http://localhost:4000/api',
    VERSION: '0.0.0',
    WITH_CREDENTIALS: false
  };
  const defaultServiceCalls: Array<{ name: string; args: unknown[]; snapshot: Record<string, unknown> }> = [];
  const callTracker =
    (name: string) =>
    async (...args: unknown[]) => {
      defaultServiceCalls.push({ name, args, snapshot: { ...openApiState } });
      return { ok: true, name, args } as const;
    };
  return { openApiState, defaultServiceCalls, callTracker };
});

vi.mock('@cdm/api-client', () => {
  const { openApiState, callTracker } = hoisted;
  return {
    OpenAPI: openApiState,
    HealthService: {
      appGetHealth: callTracker('appGetHealth')
    }
  };
});

import { browserApi, createApiClient, serverApi } from '../lib/api/client';

const { openApiState, defaultServiceCalls } = hoisted;

describe('lib/api/client', () => {
  beforeEach(() => {
    defaultServiceCalls.length = 0;
    openApiState.BASE = 'http://localhost:4000/api';
    openApiState.VERSION = '0.0.0';
    openApiState.WITH_CREDENTIALS = false;
    delete (globalThis as { window?: unknown }).window;
  });

  afterEach(() => {
    defaultServiceCalls.length = 0;
  });

  it('wraps DefaultService with temporary OpenAPI overrides', async () => {
    const client = createApiClient({ baseUrl: 'https://example.test/api', version: '1.2.3' });
    await client.getHealth();

    expect(defaultServiceCalls).toHaveLength(1);
    const [call] = defaultServiceCalls;
    expect(call.snapshot.BASE).toBe('https://example.test/api');
    expect(call.snapshot.VERSION).toBe('1.2.3');
    expect(openApiState.BASE).toBe('http://localhost:4000/api');
    expect(openApiState.VERSION).toBe('0.0.0');
  });

  it('browserApi defaults to window runtime base and enables credentials', async () => {
    (globalThis as { window?: unknown }).window = { __CDM_API_BASE__: 'https://browser.example/api' };

    const api = browserApi();
    await api.getHealth();

    expect(defaultServiceCalls[0].snapshot.BASE).toBe('https://browser.example/api');
    expect(defaultServiceCalls[0].snapshot.WITH_CREDENTIALS).toBe(true);
  });

  it('serverApi preserves provided overrides without mutating global state', async () => {
    const api = serverApi({ baseUrl: 'https://server.example/api', token: 'token-123' });
    await api.getHealth();

    expect(defaultServiceCalls[0].snapshot.BASE).toBe('https://server.example/api');
    expect(defaultServiceCalls[0].snapshot.TOKEN).toBe('token-123');
    expect(openApiState.TOKEN).toBeUndefined();
  });

  it('createApiClient applies headers, encodePath, and basic auth fields', async () => {
    const headers = { 'x-test': '1' };
    const encodePath = (p: string) => `encoded:${p}`;
    const client = createApiClient({
      baseUrl: 'https://h.example/api',
      headers,
      encodePath,
      username: 'u',
      password: 'p'
    });
    await client.getHealth();

    const snap = defaultServiceCalls[0].snapshot as Record<string, unknown>;
    expect(snap.HEADERS).toEqual(headers);
    expect(snap.ENCODE_PATH).toBe(encodePath);
    expect(snap.USERNAME).toBe('u');
    expect(snap.PASSWORD).toBe('p');
  });

  it('browserApi can disable credentials and set credential mode', async () => {
    (globalThis as { window?: unknown }).window = { __CDM_API_BASE__: 'https://browser.example/api' };
    const api = browserApi({ withCredentials: false, credentials: 'omit' });
    await api.getHealth();

    const snap = defaultServiceCalls[0].snapshot as Record<string, unknown>;
    expect(snap.WITH_CREDENTIALS).toBe(false);
    expect(snap.CREDENTIALS).toBe('omit');
  });
});
