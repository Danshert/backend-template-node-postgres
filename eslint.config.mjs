import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		ignores: ['tests/**/*.test.ts'],
		rules: {
			'no-unused-vars': 'warn',
			'no-undef': 'warn',
		},
	},
];
