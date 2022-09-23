module.exports = {
  extends: [
    // 'serverless-stack',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    'dist/*.js',
    '@app/finicity/finicity-lib',
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/return-await': 'off', // lambdas don't respond to request if redundant "await" is omitted
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'max-classes-per-file': 'off',
    'no-param-reassign': [2, {'props': false}],
  },
};
