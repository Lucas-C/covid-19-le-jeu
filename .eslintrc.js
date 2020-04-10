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
    'id-blacklist': 'off',
    'id-length': 'off',
    'line-comment-position': 'off',
    'max-len': 'off',
    'no-magic-numbers': 'off',
    'no-inline-comments': 'off',
    'no-use-before-define': 'off',
    'prefer-destructuring': 'off',
  },
};
