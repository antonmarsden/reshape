import pluginJs from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tsPlugin from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'func-style': ['error', 'expression'],
      'no-restricted-syntax': ['off', 'ForOfStatement'],
      'no-console': ['error'],
      'prefer-template': 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
    },
  },
  // TypeScript Eslint
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },
  // Prettier
  {
    files: ['src/**/*.ts'],
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': [
        1,
        {
          endOfLine: 'lf',
          printWidth: 180,
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'es5',
        },
      ],
    },
  },
  {
    ...pluginJs.configs.recommended,
    files: ['src/**/*.ts']
  },
  ...tsPlugin.configs.recommended.map((cfg) => ({ ...cfg, files: ['src/**/*.ts'] }))
];
