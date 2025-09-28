#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const { generate } = require('openapi-typescript-codegen');

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const schemaPath = path.join(rootDir, 'docs/openapi.json');
  const outputDir = path.join(rootDir, 'packages/api-client/src');

  await generate({
    input: schemaPath,
    output: outputDir,
    httpClient: 'axios',
    useOptions: true,
    useUnionTypes: true,
    exportCore: true,
    exportServices: true,
    exportModels: true,
    exportSchemas: true
  });

  const aggregatorPath = path.join(rootDir, 'packages/api-client/index.ts');
  const aggregatorContent = "export * from './src';\n";

  if (!fs.existsSync(aggregatorPath) || fs.readFileSync(aggregatorPath, 'utf8') !== aggregatorContent) {
    fs.writeFileSync(aggregatorPath, aggregatorContent, 'utf8');
  }

  const indexPath = path.join(outputDir, 'index.ts');
  if (fs.existsSync(indexPath)) {
    const original = fs.readFileSync(indexPath, 'utf8');
    const adjusted = original.replace(
      "export type { ApiError } from './models/ApiError';",
      "export type { ApiError as ApiErrorPayload } from './models/ApiError';"
    );

    if (adjusted !== original) {
      fs.writeFileSync(indexPath, adjusted, 'utf8');
    }
  }

  console.log(`[api:client] Generated ${path.relative(rootDir, outputDir)}`);
}

main().catch((error) => {
  console.error('[api:client] generation failed:', error);
  process.exit(1);
});
