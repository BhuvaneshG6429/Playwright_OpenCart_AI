import js from '@eslint/js';
import playwright from 'eslint-plugin-playwright';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: [
            'node_modules/**',
            'reports/**',
            'test-results/**',
            'allure-results/**',
            'allure-report/**',
            'custom-report/**',
            'dist/**',
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts', '**/*.mjs'],
        languageOptions: {
            globals: { ...globals.node },
            parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
        },
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', caughtErrors: 'none' },
            ],
        },
    },
    {
        files: ['tests/**/*.ts'],
        plugins: { playwright },
        rules: {
            ...playwright.configs['flat/recommended'].rules,
            'playwright/no-focused-test': 'error',
            'playwright/no-skipped-test': 'error',
            'playwright/no-wait-for-timeout': 'error',
            'playwright/no-conditional-in-test': 'error',
            'playwright/no-force-option': 'error',
            'playwright/expect-expect': 'error',
            'playwright/no-networkidle': 'error',
            'playwright/prefer-web-first-assertions': 'error',
        },
    }
);
