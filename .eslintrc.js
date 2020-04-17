module.exports = {
  env: {
    browser: true,
  },
  extends: ['strict'],
  parserOptions: {
    ecmaVersion: 2019
  },
  globals: {
    rollADie: 'readonly',
  },
  rules: {
    'array-element-newline': 'off',
    'class-methods-use-this': 'off',
    'filenames/match-regex': [2, '^[a-z-.0-9]+$', true],
    'global-require': 'off',
    'id-blacklist': 'off',
    'id-length': 'off',
    'id-match': 'off',
    'line-comment-position': 'off',
    'max-len': 'off',
    'no-console': 'off',
    'no-magic-numbers': 'off',
    'no-inline-comments': 'off',
    'no-use-before-define': 'off',
    'no-warning-comments': 'off',
    'prefer-destructuring': 'off',
  },
};
