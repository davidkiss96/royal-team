import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

/**
 * eslint-config-next's native flat-config export (includes TypeScript
 * support already) — used directly rather than via @eslint/eslintrc's
 * FlatCompat shim, which throws ("Converting circular structure to JSON")
 * with this eslint-config-next/eslint version combination.
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  {
    // Read-only Figma reference app (README.md) — not our code, not built
    // with this project's own conventions or dependencies.
    // studio/ is a separate, standalone Sanity Studio app with its own
    // package.json/tsconfig (docs/architecture.md Section 6) — not part of
    // the Next.js app this config is written for.
    ignores: ["design-reference/**", "studio/**"],
  },
];

export default eslintConfig;
