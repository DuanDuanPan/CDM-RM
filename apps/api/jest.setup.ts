import 'reflect-metadata';

if (!process.env.OPENAPI_SERVICE_KEY) {
  process.env.OPENAPI_SERVICE_KEY = 'test-openapi-key';
}

let envLoaded = false;

try {
  require('./src/config/env');
  envLoaded = true;
} catch (error) {
  if (process.env.NODE_ENV !== 'test') {
    throw error;
  }
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://example:example@127.0.0.1:5432/cdm-test';
}

if (!envLoaded) {
  try {
    require('./src/config/env');
  } catch {
    // ignore when fallback values are used exclusively for tests
  }
}
