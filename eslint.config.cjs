const prettierPlugin = require('eslint-plugin-prettier')
const prettierConfig = require('eslint-config-prettier')

// eslint.config.cjs
module.exports = [
  {
    ignores: ['dist/**/*', 'node_modules/**/*'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        // project: './tsconfig.json',
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
      },
      globals: {
        // 예: 'window': 'readonly', 'process': 'readonly', 'console': 'readonly'
        // env: browser, es2021, node 등 설정을 globals로 직접 표현
        window: 'readonly',
        process: 'readonly',
        console: 'readonly',
        // 필요하면 추가
      },
      // env 대신 globals와 parserOptions 조합으로 설정
    },
    plugins: {
      react: require('eslint-plugin-react'),
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      'jsx-a11y': require('eslint-plugin-jsx-a11y'),
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      'prettier/prettier': ['error', require('./.prettierrc.json')],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
]
