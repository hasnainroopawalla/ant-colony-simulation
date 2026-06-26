import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  {
    ignores: ["build", "dist", "node_modules"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    rules: {
      // The codebase uses short-circuit calls (`cond && fn()`) as a deliberate idiom.
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
      "no-magic-numbers": "off",
      "no-console": "warn",
      "no-warning-comments": [
        "warn",
        {
          terms: ["TODO"],
          location: "start",
        },
      ],
      "no-alert": "error",
      "no-duplicate-imports": "error",
      "no-unused-private-class-members": "error",
      camelcase: "error",
      eqeqeq: "error",
    },
  },
  {
    // Ambient module shim for p5 requires `import = require()` syntax.
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  }
);
