// @ts-check
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");

module.exports = [
	{
		ignores: ["node_modules/**", "dist/**", "**/*.js"],
	},
	...tseslint.configs["flat/recommended"],
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: "module",
			},
			globals: {
				require: "readonly",
				module: "readonly",
				exports: "readonly",
				__dirname: "readonly",
				__filename: "readonly",
				process: "readonly",
				console: "readonly",
				Buffer: "readonly",
				setTimeout: "readonly",
				clearTimeout: "readonly",
				setInterval: "readonly",
				clearInterval: "readonly",
			},
		},
		rules: {},
	},
];
