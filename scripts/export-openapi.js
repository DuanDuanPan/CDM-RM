#!/usr/bin/env node
// Minimal OpenAPI export helper
// - If docs/openapi.baseline.json exists, copy and patch version/servers into docs/openapi.json
// - Otherwise, write a minimal skeleton spec to docs/openapi.json

const fs = require('fs');
const path = require('path');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function main() {
  const root = path.resolve(__dirname, '..');
  const docsDir = path.join(root, 'docs');
  const baselinePath = path.join(docsDir, 'openapi.baseline.json');
  const outPath = path.join(docsDir, 'openapi.json');
  ensureDir(docsDir);

  const version = process.env.APP_VERSION || new Date().toISOString().slice(0, 10);
  const baseURL = process.env.API_BASE_URL; // optional override

  let spec;
  if (fs.existsSync(baselinePath)) {
    spec = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  } else {
    spec = {
      openapi: '3.0.3',
      info: {
        title: 'CDM 需求集成 MVP API',
        version,
        description: '自动生成的最小 OpenAPI 规格（未发现 baseline）',
      },
      servers: [{ url: 'http://localhost:4000/api', description: '本地' }],
      paths: {},
      components: {},
    };
  }

  // Patch version and servers
  spec.info = spec.info || {};
  spec.info.version = version;
  if (baseURL) {
    spec.servers = Array.isArray(spec.servers) ? spec.servers : [];
    // Put override at first position
    spec.servers = [{ url: baseURL, description: 'override' }, ...spec.servers.filter(s => s.url !== baseURL)];
  }

  fs.writeFileSync(outPath, JSON.stringify(spec, null, 2));
  console.log(`[openapi] Exported to ${path.relative(root, outPath)} (version=${version})`);
}

try { main(); } catch (err) {
  console.error('[openapi] export failed:', err);
  process.exit(1);
}

