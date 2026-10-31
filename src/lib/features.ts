/**
 * On/off switches for whole pages/sections whose content isn't launch-ready
 * (AI-placeholder prices, no real project photos, no real reviews). The
 * values live in Sanity (`BusinessSettings.siteFeatures`, Studio group
 * "Weboldal") so the owner can flip them without a deploy; this module only
 * holds the shape and the route rules derived from it.
 *
 * Turning a feature off removes: its route(s) — `src/middleware.ts` rewrites them
 * to the 404 —, its `NAV_LINKS` entry (Header, mobile menu, Footer), its
 * `sitemap.xml` URLs, and every homepage section/CTA that links to it. The
 * middleware and the ISR-rendered pages each pick up a change within ~60s, so
 * for up to about a minute they can disagree (e.g. a nav link to a page
 * that already 404s).
 */
export interface SiteFeatures {
  /** `/arlista`. */
  priceList: boolean;
  /** `/projektek`, `/projektek/[slug]` and the homepage projects preview. */
  projects: boolean;
  /** The homepage reviews section (no standalone reviews page exists). */
  reviews: boolean;
}

/** Fallback when Sanity can't be read — fail closed, never show unready content. */
export const ALL_FEATURES_OFF: SiteFeatures = {
  priceList: false,
  projects: false,
  reviews: false,
};

function disabledRoutePrefixes(features: SiteFeatures): string[] {
  return [
    ...(features.priceList ? [] : ["/arlista"]),
    ...(features.projects ? [] : ["/projektek"]),
  ];
}

/** False for a disabled route or anything below it (e.g. `/projektek/foo`). */
export function isRouteEnabled(path: string, features: SiteFeatures): boolean {
  return !disabledRoutePrefixes(features).some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

/**
 * Where `src/middleware.ts` rewrites disabled routes and unknown slugs to.
 * `_`-prefixed folders are private in the App Router, so this never matches
 * a page: the request is an ordinary unmatched URL, which Next server-renders
 * as the root `app/not-found.tsx`. (A `notFound()` thrown by a page is only
 * client-rendered, from an empty HTML shell — see docs/architecture.md
 * Section 17.2a.)
 */
export const NOT_FOUND_REWRITE_DESTINATION = "/_not-found-rewrite";
