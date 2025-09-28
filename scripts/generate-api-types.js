#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const fsPromises = require('fs/promises');
const path = require('path');
const ts = require('typescript');

async function ensureCustomExportsFile(filePath) {
  try {
    await fsPromises.access(filePath);
  } catch {
    const placeholder = `// 自定义类型与辅助导出可放置在此文件，并由 index.ts 自动 re-export\n`;
    await fsPromises.writeFile(filePath, placeholder, 'utf8');
  }
}

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const schemaPath = path.join(rootDir, 'docs/openapi.json');
  const outputPath = path.join(rootDir, 'packages/api-types/src/index.ts');
  const customExportsPath = path.join(rootDir, 'packages/api-types/src/custom-exports.ts');

  const schema = await fsPromises.readFile(schemaPath, 'utf8');
  const parsed = JSON.parse(schema);
  const { default: openapiTS } = await import('openapi-typescript');
  const nodes = await openapiTS(parsed, {
    alphabetize: true,
    prettierConfig: {
      parser: 'typescript'
    }
  });
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const sourceFile = ts.createSourceFile('openapi-types.ts', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
  const generatedSource = nodes.map((node) => printer.printNode(ts.EmitHint.Unspecified, node, sourceFile)).join('\n');

  await ensureCustomExportsFile(customExportsPath);

  const banner = `/* eslint-disable */\n/* tslint:disable */\n// 本文件由 scripts/generate-api-types.js 自动生成\n`;
  const footer = `\nexport * from './custom-exports';\n`;
  const content = `${banner}${generatedSource.trim()}${footer}`;

  await fsPromises.mkdir(path.dirname(outputPath), { recursive: true });
  await fsPromises.writeFile(outputPath, `${content}\n`, 'utf8');

  console.log(`[api:types] Generated ${path.relative(rootDir, outputPath)}`);
}

main().catch((error) => {
  console.error('[api:types] generation failed:', error);
  process.exit(1);
});
