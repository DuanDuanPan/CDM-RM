#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const coverageTargets = [
  { name: 'web', file: path.resolve(__dirname, '../reports/coverage/web/coverage-summary.json') },
  { name: 'api', file: path.resolve(__dirname, '../reports/coverage/api/coverage-summary.json') }
];

const rows = [];

for (const target of coverageTargets) {
  if (!fs.existsSync(target.file)) {
    console.error(`未找到 ${target.name} 的覆盖率摘要文件：${target.file}`);
    console.error('请先运行 `yarn test:client && yarn test:server` 生成覆盖率报告。');
    process.exitCode = 1;
    continue;
  }

  const summary = JSON.parse(fs.readFileSync(target.file, 'utf8'));
  const total = summary.total;

  rows.push({
    target: target.name,
    lines: `${total.lines.pct}%`,
    statements: `${total.statements.pct}%`,
    branches: `${total.branches.pct}%`,
    functions: `${total.functions.pct}%`
  });
}

if (rows.length > 0) {
  console.log('\n覆盖率汇总');
  console.table(rows);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}
