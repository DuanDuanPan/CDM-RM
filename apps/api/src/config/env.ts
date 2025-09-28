/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'node:path';

type DotenvSafeModule = {
  config: (options?: {
    cwd?: string;
    path?: string;
    example?: string;
    allowEmptyValues?: boolean;
    override?: boolean;
    optional?: string[];
  }) => {
    parsed: Record<string, string>;
    sample: Record<string, string>;
  };
};

function loadDotenvSafe(): DotenvSafeModule {
  try {
    return require('dotenv-safe') as DotenvSafeModule;
  } catch (error) {
    return require('../../../../vendor/dotenv-safe') as DotenvSafeModule;
  }
}

const { config } = loadDotenvSafe();

const REQUIRED_KEYS = ['DATABASE_URL', 'OPENAPI_SERVICE_KEY'] as const;
const OPTIONAL_KEYS = [
  'SHADOW_DATABASE_URL',
  'REDIS_URL',
  'OPENAPI_ALLOWED_TAGS',
  'OPENAPI_EXCLUDED_TAGS',
  'OPENAPI_HIDE_SERVERS',
  'OPENAPI_PUBLIC_SERVER_URL'
] as const;

function loadEnvironment(): void {
  const rootDir = path.resolve(__dirname, '../../../../');

  config({
    path: path.join(rootDir, '.env'),
    example: path.join(rootDir, '.env.example'),
    allowEmptyValues: true,
    optional: [...OPTIONAL_KEYS]
  });

  const missing = REQUIRED_KEYS.filter((key) => {
    const value = process.env[key];
    return typeof value !== 'string' || value.trim() === '';
  });

  if (missing.length > 0) {
    throw new Error(`环境变量缺失: ${missing.join(', ')}`);
  }

  const invalidOptional = OPTIONAL_KEYS.filter((key) => {
    if (typeof process.env[key] !== 'string') {
      return false;
    }
    return process.env[key]!.trim() === '';
  });

  if (invalidOptional.length > 0) {
    throw new Error(`可选变量若提供则不可为空: ${invalidOptional.join(', ')}`);
  }
}

loadEnvironment();

export const environment = {
  databaseUrl: process.env.DATABASE_URL!,
  shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL ?? null,
  redisUrl: process.env.REDIS_URL ?? null
};

export { loadEnvironment as validateEnv };
