import { defineConfig } from "eslint/config";
import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import parser from "astro-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  { ignores: [".astro/", "dist/", "node_modules/"] },
  {
    extends: compat.extends(
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:astro/recommended",
    ),

    plugins: {
      react,
      "@typescript-eslint": typescriptEslint,
    },

    settings: {
      react: { version: "detect" },
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^Props$" },
      ],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { minimumDescriptionLength: 3 },
      ],
    },
  },
  {
    files: ["**/*.astro"],

    languageOptions: {
      parser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^Props$" },
      ],
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
]);
