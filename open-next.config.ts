import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Minimal OpenNext config for the Cloudflare Workers adapter (replaces the
 * deprecated `@cloudflare/next-on-pages` path). No incremental-cache override
 * is configured: ISR (`{ next: { revalidate } }`, used throughout
 * `src/lib/sanity/queries/`) falls back to OpenNext's default in-memory
 * cache, which is correct for this app's read-mostly Sanity content but does
 * not persist across Worker restarts/redeploys. Revisit with the R2-backed
 * incremental cache override (`@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache`)
 * only if stale-content-after-restart becomes an observed problem in
 * production — not needed for the preview deployment this configures now.
 */
export default defineCloudflareConfig();
