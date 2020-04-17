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
    'filenames/match-regex': [2, '^[a-z-0-9]+$', true],
    'id-blacklist': 'off',
    'id-length': 'off',
    'id-match': 'off',
    'line-comment-position': 'off',
    'max-len': 'off',
    'new-cap': 'off', // because of Math.seedrandom
    'no-magic-numbers': 'off',
    'no-inline-comments': 'off',
    'no-use-before-define': 'off',
    'no-warning-comments': 'off',
    'prefer-destructuring': 'off',
  },
};
