module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/prefer-enum-initializers': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        // PascalCase for variables is added to allow exporting a singleton, function library, or bare object as in
        // section 23.8 of the AirBnB style guide
        format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case']
      },
      {
        selector: 'typeLike',
        format: ['PascalCase', 'camelCase'],
        filter: {
          regex: '^_',
          match: false
        }
      },
      {
        selector: 'typeProperty',
        format: ['snake_case', 'camelCase']
      },
      {
        selector: ['enumMember'],
        format: ['PascalCase']
      }
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    'no-console': 'error'
  },
  overrides: [
    {
      files: ['*.spec.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'no-console': 'off'
      }
    }
  ]
};
