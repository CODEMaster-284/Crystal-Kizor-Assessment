import js from "@eslint/js";
import ts from "typescript-eslint";
import globals from "globals";
import hooks from "eslint-plugin-react-hooks";
export default ts.config(
  { ignores: ["dist", "node_modules", "qa", ".npm-cache", ".browser-cache"] },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": hooks },
    rules: { ...hooks.configs.recommended.rules },
  },
  {
    files: ["*.js", "scripts/**/*.mjs"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
);
