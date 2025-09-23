import type { Config } from 'jest';
import path from 'node:path';

const config: Config = {
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,js}'],
  coverageDirectory: path.resolve(__dirname, '../../reports/coverage/api'),
  coverageReporters: ['text', 'lcov', 'cobertura', 'json-summary'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};

export default config;
