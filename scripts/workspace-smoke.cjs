#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const workspaceMap = {
  '@cdm/web': 'apps/web/package.json',
  '@cdm/api': 'apps/api/package.json',
  '@cdm/worker': 'apps/worker/package.json',
  '@cdm/shared': 'packages/shared/package.json',
  '@cdm/config': 'packages/config/package.json'
};

const args = process.argv.slice(2);
const workspaceFlagIndex = args.indexOf('--workspace');
const targetWorkspace = workspaceFlagIndex >= 0 ? args[workspaceFlagIndex + 1] : null;

const targets = targetWorkspace ? [targetWorkspace] : Object.keys(workspaceMap);

const failures = [];

targets.forEach((workspace) => {
  const relPath = workspaceMap[workspace];
  if (!relPath) {
    failures.push(`未识别的 workspace: ${workspace}`);
    return;
  }

  const absPath = path.resolve(process.cwd(), relPath);
  if (!fs.existsSync(absPath)) {
    failures.push(`缺少 ${workspace} 的 manifest: ${relPath}`);
    return;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(absPath, 'utf8'));
    if (manifest.name !== workspace) {
      failures.push(`工作区 ${workspace} 的 name 字段不匹配：${manifest.name}`);
    }
    if (manifest.private !== undefined && manifest.private !== true) {
      failures.push(`工作区 ${workspace} 的 private 字段应为 true（当前: ${manifest.private}）`);
    }
  } catch (err) {
    failures.push(`解析 ${relPath} 失败：${err.message}`);
  }
});

if (failures.length > 0) {
  console.error('Workspace smoke 检查失败:');
  failures.forEach((msg) => console.error(` - ${msg}`));
  process.exit(1);
}

if (targets.length === Object.keys(workspaceMap).length) {
  console.log('所有已知 workspace manifest 校验通过');
} else {
  console.log(`Workspace ${targets[0]} 校验通过`);
}
