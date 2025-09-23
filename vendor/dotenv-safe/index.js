const fs = require('fs');
const path = require('path');

function parse(content) {
  const result = {};
  if (!content) {
    return result;
  }

  const lines = content.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) {
      result[line] = '';
      continue;
    }

    const key = line.slice(0, eqIndex).trim();
    const value = line.slice(eqIndex + 1).trim();
    result[key] = stripQuotes(value);
  }

  return result;
}

function stripQuotes(value) {
  if (!value) {
    return '';
  }

  const singleQuoted = value.startsWith("'") && value.endsWith("'");
  const doubleQuoted = value.startsWith('"') && value.endsWith('"');

  if (singleQuoted || doubleQuoted) {
    return value.slice(1, -1);
  }

  return value;
}

function readFile(filePath) {
  if (!filePath) {
    return {};
  }

  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf8');
  return parse(content);
}

function config(options = {}) {
  const cwd = options.cwd ? path.resolve(options.cwd) : process.cwd();
  const dotenvPath = options.path ? path.resolve(cwd, options.path) : path.resolve(cwd, '.env');
  const examplePath = options.example ? path.resolve(cwd, options.example) : path.resolve(cwd, '.env.example');
  const allowEmptyValues = Boolean(options.allowEmptyValues);
  const override = Boolean(options.override);
  const optional = new Set(options.optional || []);

  const parsed = readFile(dotenvPath);
  for (const [key, value] of Object.entries(parsed)) {
    if (override || typeof process.env[key] === 'undefined') {
      process.env[key] = value;
    }
  }

  const sample = readFile(examplePath);
  const missing = [];

  for (const key of Object.keys(sample)) {
    if (optional.has(key)) {
      continue;
    }

    const current = process.env[key];
    if (typeof current !== 'string' || (!allowEmptyValues && current.trim() === '')) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  return { parsed, sample };
}

module.exports = { config };
