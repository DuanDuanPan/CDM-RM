#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const supertest = require('supertest');

const rootDir = path.resolve(__dirname, '..');
const tsconfigPath = path.join(rootDir, 'tsconfig.json');

require('ts-node').register({
  project: tsconfigPath,
  transpileOnly: true,
  compilerOptions: {
    module: 'CommonJS',
    moduleResolution: 'Node',
    experimentalDecorators: true,
    emitDecoratorMetadata: true
  }
});

function ensureEnvironmentDefaults() {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://example:example@127.0.0.1:5432/cdm';
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }
}

ensureEnvironmentDefaults();

const { createApp } = require('../apps/api/src/bootstrap');
const {
  OPENAPI_ACCESS_HEADER,
  setupOpenApi
} = require('../apps/api/src/openapi/setup-openapi');

function ensureDir(targetPath) {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
}

function ensureOpenApiServiceKey() {
  if (!process.env.OPENAPI_SERVICE_KEY) {
    process.env.OPENAPI_SERVICE_KEY = 'local-openapi-key';
  }

  return process.env.OPENAPI_SERVICE_KEY;
}

async function main() {
  const docsDir = path.join(rootDir, 'docs');
  const outPath = path.join(docsDir, 'openapi.json');

  ensureDir(docsDir);
  ensureEnvironmentDefaults();
  const serviceKey = ensureOpenApiServiceKey();

  const app = await createApp();

  try {
    const { document } = await setupOpenApi(app);

    if (!app.isInitialized) {
      await app.init();
    }

    const version = document?.info?.version ?? '0.0.0';

    if (process.env.API_BASE_URL) {
      const baseUrl = process.env.API_BASE_URL;
      const servers = Array.isArray(document.servers) ? document.servers : [];
      document.servers = [
        { url: baseUrl, description: 'override' },
        ...servers.filter((server) => server.url !== baseUrl)
      ];
    }

    fs.writeFileSync(outPath, JSON.stringify(document, null, 2));
    console.log(`[openapi] Exported to ${path.relative(rootDir, outPath)} (version=${version})`);

    const httpServer = app.getHttpServer();
    await supertest(httpServer)
      .get('/api/__openapi.json')
      .set(OPENAPI_ACCESS_HEADER, serviceKey)
      .expect(200);
  } finally {
    await app.close();
  }
}

main().catch((error) => {
  console.error('[openapi] export failed:', error);
  process.exit(1);
});
