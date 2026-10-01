import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      configPrettier, // 🔑 desactiva reglas que chocan con Prettier
    ],
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          semi: true,
          singleQuote: false, // 👈 comillas dobles
          tabWidth: 2,
          trailingComma: "es5",
          endOfLine: "lf", // 👈 evita el error de ␍
        },
      ],
      "react/react-in-jsx-scope": "off",
    },
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
