const fs = require('node:fs');
const path = require('node:path');

function loadDotenvSafe() {
  try {
    return require('dotenv-safe');
  } catch (error) {
    return require('../vendor/dotenv-safe');
  }
}

const { config } = loadDotenvSafe();

const REQUIRED_KEYS = ['DATABASE_URL', 'OPENAPI_SERVICE_KEY'];
const OPTIONAL_KEYS = [
  'SHADOW_DATABASE_URL',
  'REDIS_URL',
  'OPENAPI_ALLOWED_TAGS',
  'OPENAPI_EXCLUDED_TAGS',
  'OPENAPI_HIDE_SERVERS',
  'OPENAPI_PUBLIC_SERVER_URL'
];

function validateEnv() {
  const rootDir = path.resolve(__dirname, '..');
  const dotenvPath = path.join(rootDir, '.env');
  const examplePath = path.join(rootDir, '.env.example');

  if (!fs.existsSync(examplePath)) {
    throw new Error(`环境示例文件不存在: ${examplePath}`);
  }

  config({
    path: dotenvPath,
    example: examplePath,
    allowEmptyValues: true,
    optional: OPTIONAL_KEYS
  });

  const missing = REQUIRED_KEYS.filter((key) => {
    const value = process.env[key];
    return typeof value !== 'string' || value.trim() === '';
  });

  if (missing.length > 0) {
    throw new Error(`缺少必需的环境变量: ${missing.join(', ')}`);
  }

  const invalidOptional = OPTIONAL_KEYS.filter((key) => {
    if (typeof process.env[key] !== 'string') {
      return false;
    }
    return process.env[key].trim() === '';
  });

  if (invalidOptional.length > 0) {
    throw new Error(`可选变量若提供则不可为空: ${invalidOptional.join(', ')}`);
  }
}

if (require.main === module) {
  try {
    validateEnv();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`环境变量校验失败: ${message}`);
    process.exit(1);
  }
}

module.exports = { validateEnv };
