module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'plugin:react/recommended',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'import'
  ],
  rules: {
    semi: [2, 'never'],
    '@typescript-eslint/semi': [2, 'never'],
    'comma-dangle': [2, 'always-multiline'],
    'eol-last': 1,
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 1
      }
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always'
      }
    ],
    '@typescript-eslint/no-unused-expressions': ['off']
  }
}
