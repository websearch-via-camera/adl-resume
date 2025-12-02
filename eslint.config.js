import js from "@eslint/js"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"

export default tseslint.config(
  { ignores: ["dist", "node_modules", "*.config.js", "*.config.ts", "functions/**"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-console": "off",
      "prefer-const": "warn",
      "no-empty": "warn",
      "no-case-declarations": "warn",
      // Preact uses different patterns that trigger false positives
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "warn",
      // Disable overly strict React rules that flag common patterns
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off", 
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
    },
  }
)
