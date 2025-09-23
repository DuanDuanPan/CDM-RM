#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const args = process.argv.slice(2);
const vitestArgs = ['run', '--coverage'];
const forwardedArgs = [];

let disableThreads = false;

for (const arg of args) {
  if (arg === '--no-threads') {
    disableThreads = true;
    continue;
  }
  forwardedArgs.push(arg);
}

if (disableThreads) {
  vitestArgs.push('--pool', 'forks', '--maxWorkers', '1', '--minWorkers', '1', '--no-file-parallelism');
}

const result = spawnSync('vitest', [...vitestArgs, ...forwardedArgs], {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..')
});

process.exit(result.status ?? 1);
