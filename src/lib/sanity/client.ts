import { createClient } from "@sanity/client";

/**
 * Pinned to a fixed date rather than "latest" — this selects the shape of
 * Sanity's Content API responses, which should change deliberately, not
 * silently on every deploy. Not an env var: it's a code-level decision
 * that doesn't vary per environment, unlike project ID/dataset below.
 */
const SANITY_API_VERSION = "2025-01-01";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable — see .env.example.",
  );
}

/**
 * Read-only Sanity client for Server Components and other server-side data
 * fetching (docs/architecture.md Section 15 — no write-capable token
 * belongs here, or anywhere this public app's code runs).
 *
 * `useCdn: true` serves published content from Sanity's CDN. Combined with
 * Next.js's own fetch-based ISR — pass `{ next: { revalidate } }` as the
 * third argument to `.fetch()` per query, with a revalidation window
 * chosen deliberately per content type once real queries exist — this is
 * the full v1 caching strategy (docs/architecture.md Section 13): no
 * on-demand webhook revalidation yet, time-based ISR is sufficient for a
 * low-frequency-publishing content site.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
});
