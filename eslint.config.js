import tsParser from '@typescript-eslint/parser';

const config = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module'
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
];

export default config;
