import js from '@eslint/js';
import css from "@eslint/css";
import svelte from 'eslint-plugin-svelte';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import ts from 'typescript-eslint';
import { customTsPlugin } from './eslint/customTsPlugin.js';
import { defineConfig } from 'eslint/config';

export const extraFileExtensions = ['.svelte'];

const tsRules = {
	'no-bitwise': 'error',
	'no-cond-assign': 'error',
	'no-useless-return': 'error',
	'no-console': ['warn', { allow: ['warn', 'error'] }],
	'no-undef': 'off',
	'no-useless-escape': 'off',
	'no-warning-comments': 'warn',
	'@typescript-eslint/no-unused-vars': ['error', {
		vars: 'all',
		args: 'after-used',
		caughtErrors: 'all',
		ignoreRestSiblings: true,
		reportUsedIgnorePattern: false,
		varsIgnorePattern: '^_$',
		argsIgnorePattern: '^_',
	}],
	'@typescript-eslint/sort-type-constituents': 'error',
	'@typescript-eslint/no-empty-object-type': 'off',
	'@typescript-eslint/no-explicit-any': 'off',
	/*
	* I want to use this rule, but it requires the use of projectService
	* which for some reason makes linting take over 50x longer
	 */
	'@typescript-eslint/no-misused-promises': [
		'error',
		{ checksVoidReturn: false },
	],
	'@stylistic/indent': ['error', 'tab'],
	'@stylistic/no-extra-semi': 'error',
	'@stylistic/semi': ['warn', 'always', {
		omitLastInOneLineBlock: true,
	}],
	'@stylistic/quotes': [
		'off',
		'single',
		{ avoidEscape: true, allowTemplateLiterals: true },
	],
	'@stylistic/type-annotation-spacing': 'error',
	'@stylistic/keyword-spacing': 'error',
	'@stylistic/function-call-spacing': 'error',
	'@stylistic/space-before-blocks': 'error',
	'@stylistic/no-multi-spaces': 'error',
	'@stylistic/no-mixed-spaces-and-tabs': 'error',
	'@stylistic/eol-last': 'error',
	'@stylistic/no-tabs': ["error", { allowIndentationTabs: true }],
	'@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
	'@stylistic/member-delimiter-style': ['error', {
		multiline: {
			delimiter: 'semi',
			requireLast: true,
		},
		singleline: {
			delimiter: "semi",
			requireLast: false,
		},
		multilineDetection: "brackets",
	}],
	'@stylistic/multiline-ternary': 'off',
	'@stylistic/quote-props': ['error', 'consistent-as-needed', {
		keywords: false,
		unnecessary: true,
		numbers: true,
	}],
	'@stylistic/comma-dangle': ['error', 'always-multiline'],
};

export default defineConfig(
	{
		files: ['**/*.css'],
		plugins: {
			css,
		},
		language: "css/css",
		rules: {
			'css/no-duplicate-imports': 'error',
			'css/no-empty-blocks': 'error',
			'css/no-important': 'error',
			'css/no-invalid-at-rules': 'error',
			// This does not work for some reason, try to enable again sometime in the future
			// 'css/no-invalid-properties': ['error', { allowUnknownVariables: false }],
		},
		languageOptions: {
			parserOptions: {
				extraFileExtensions,
			},
		},
	},
	{
		plugins: {
			custom: customTsPlugin,
		},
		files: ['**/*.ts', '**/*.js'],
		extends: [
			js.configs.recommended,
			ts.configs.recommended,
			stylistic.configs.recommended,
		],
		languageOptions: {
			globals: {
				...globals.node,
			},
			parserOptions: {
				projectService: true,
				parser: ts.parser,
				extraFileExtensions,
			},
		},
		// @ts-expect-error Because TS doesn't type the above object correctly, which is annoying
		rules: {
			...tsRules,
			'custom/no-redirect-in-try': 'error',
			'custom/no-error-in-try': 'error',
		},
		ignores: [
			'**/*.svelte.ts',
			'**/*.svelte.js',
		],
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		plugins: {
			'@stylistic': stylistic,
		},
		extends: [
			js.configs.recommended,
			ts.configs.recommended,
			svelte.configs.recommended,
		],
		// See more details at: https://typescript-eslint.io/packages/parser/
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				projectService: true,
				extraFileExtensions,
				parser: ts.parser,
			},
		},
		rules: {
			...tsRules,
			'prefer-const': 'off',
			'svelte/no-at-html-tags': 'off',
			'svelte/button-has-type': 'error',
			'svelte/indent': ['warn', { indent: 'tab' }],
			'svelte/mustache-spacing': 'warn',
			'svelte/no-useless-mustaches': 'warn',
			'svelte/spaced-html-comment': 'warn',
			'svelte/html-quotes': [
				'warn',
				{
					prefer: 'double',
				},
			],
			// '@typescript-eslint/no-unused-expressions': 'off', // This doesn't work in Svelte 4 files specifically
			'sort-imports': 'off',
			'svelte/require-each-key': 'off',
			'svelte/no-navigation-without-resolve': 'off',
		},
	},
	{
		ignores: [
			'**/build',
			'**/.svelte-kit',
			'**/storybook-static',
			'**/dist',
			'**/.DS_Store',
			'**/node_modules',
			'**/package-lock.json',
			'**/package.json',
		],
	},
);
