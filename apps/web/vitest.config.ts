import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: path.resolve(__dirname, '../../reports/coverage/web'),
      reporter: ['text', 'lcov', 'cobertura', 'json-summary'],
      exclude: ['scripts/**', 'global.d.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  },
  resolve: {
    alias: {
      '@cdm/web': path.resolve(__dirname, './src')
    }
  }
});
