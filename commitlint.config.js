module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat','fix','perf','refactor','docs','test','build','ci','chore','style','revert'
    ]],
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', ['kebab-case','lower-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 120],
    // 建议但不强制的常用 scope（可按需调整为 2）
    'scope-enum': [1, 'always', [
      'core','server','client','cli','ui','presets','infra','devops','release',
      'plugins','plugins-auth','plugins-workflow','docs','i18n','deps','examples','e2e'
    ]]
  }
};

