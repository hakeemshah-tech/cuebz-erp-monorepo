import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// Only `next/core-web-vitals`: the `next/typescript` preset pulls in
// @typescript-eslint v8 rules, which need ESLint 9, while this hoisted
// workspace resolves ESLint 8.57.
export default [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
];
