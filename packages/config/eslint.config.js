/* eslint-disable @typescript-eslint/no-var-requires */
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const promisePlugin = require('eslint-plugin-promise');
const prettierPlugin = require('eslint-plugin-prettier');

const mergeRules = (...configs) =>
  configs.reduce((rules, config) => {
    if (config && config.rules) {
      return { ...rules, ...config.rules };
    }
    return rules;
  }, {});

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      '.turbo/**',
      '.yarn/**',
      'web-bundles/**',
      'dist/**',
      'coverage/**',
      'packages/api-client/**',
      'packages/api-types/**'
    ]
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      promise: promisePlugin,
      prettier: prettierPlugin
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {
          project: ['tsconfig.json', 'apps/*/tsconfig.json', 'packages/*/tsconfig.json'],
          alwaysTryTypes: true
        }
      }
    },
    rules: {
      ...mergeRules(
        tsPlugin.configs.recommended,
        reactPlugin.configs.recommended,
        reactHooksPlugin.configs.recommended,
        promisePlugin.configs.recommended,
        prettierPlugin.configs.recommended
      ),
      'import/no-unresolved': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'promise/always-return': 'off',
      'prettier/prettier': 'error'
    }
  }
];
