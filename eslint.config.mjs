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
    // .open-next/ and .wrangler/ are `opennextjs-cloudflare build`'s
    // generated Worker bundle/local state (gitignored, docs/architecture.md
    // Section 17.1) — the same kind of build output `.next/` already is,
    // just not covered by eslint-config-next's default ignores since it
    // predates the Cloudflare adapter.
    ignores: ["design-reference/**", "studio/**", ".open-next/**", ".wrangler/**"],
  },
];

export default eslintConfig;
