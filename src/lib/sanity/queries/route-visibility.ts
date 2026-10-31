import { ALL_FEATURES_OFF, type SiteFeatures } from "@/lib/features";

/**
 * Everything `src/middleware.ts` needs to decide whether a URL exists, in
 * one request: the `siteFeatures` switches plus the slugs each `[slug]`
 * route would resolve.
 *
 * Deliberately a plain `fetch` with its own copy of the filters, not
 * `sanityClient` + the content modules' slug queries: importing those pulls
 * `@sanity/client` into the middleware bundle, which pushes the Worker past
 * the 3 MB (gzip) Workers Free limit. Keep these filters in step with
 * `BUSINESS_SETTINGS_QUERY`'s `siteFeatures` projection and the
 * `*_SLUGS_QUERY` constants in `blog-posts.ts`/`services.ts`/`projects.ts`
 * (e.g. inactive services don't exist).
 */
const ROUTE_VISIBILITY_QUERY = `{
  "settings": *[_id == "businessSettings"][0]{ "siteFeatures": { "priceList": coalesce(siteFeatures.priceList, false), "projects": coalesce(siteFeatures.projects, false), "reviews": coalesce(siteFeatures.reviews, false) } },
  "blog": *[_type == "blogPost"]{ "slug": slug.current },
  "services": *[_type == "service" && isActive == true]{ "slug": slug.current },
  "projects": *[_type == "project"]{ "slug": slug.current }
}`;

/** Same window as `BusinessSettings`' ISR revalidate, so the middleware and the
 * rendered nav/sitemap converge on a change at about the same time. */
const TTL_MS = 60_000;

export interface RouteVisibility {
  features: SiteFeatures;
  /** `null` = slugs couldn't be loaded; callers must not 404 on that basis. */
  slugs: { blog: Set<string>; services: Set<string>; projects: Set<string> } | null;
}

interface RawSlugEntry {
  slug: string | null;
}

interface RawRouteVisibility {
  settings: { siteFeatures: SiteFeatures } | null;
  blog: RawSlugEntry[];
  services: RawSlugEntry[];
  projects: RawSlugEntry[];
}

function toSlugSet(entries: RawSlugEntry[]): Set<string> {
  return new Set(entries.flatMap(({ slug }) => (slug ? [slug] : [])));
}

let cached: { value: RouteVisibility; fetchedAt: number } | null = null;
let inFlight: Promise<RouteVisibility> | null = null;

async function fetchRouteVisibility(): Promise<RouteVisibility> {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
    // Same API version as `sanityClient`; `apicdn` = its `useCdn: true`.
    const url = new URL(`https://${projectId}.apicdn.sanity.io/v2025-01-01/data/query/${dataset}`);
    url.searchParams.set("query", ROUTE_VISIBILITY_QUERY);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = ((await res.json()) as { result: RawRouteVisibility }).result;
    const value: RouteVisibility = {
      features: raw.settings?.siteFeatures ?? ALL_FEATURES_OFF,
      slugs: {
        blog: toSlugSet(raw.blog),
        services: toSlugSet(raw.services),
        projects: toSlugSet(raw.projects),
      },
    };
    cached = { value, fetchedAt: Date.now() };
    return value;
  } catch (error) {
    console.error("route-visibility: Sanity fetch failed", error);
    // Keep serving the last good answer; with none, hide unready pages but
    // let slugs through (the page's own lookup still 404s a missing one).
    return cached?.value ?? { features: ALL_FEATURES_OFF, slugs: null };
  } finally {
    inFlight = null;
  }
}

/**
 * Cached per Worker isolate for `TTL_MS` (best effort — an isolate can be
 * recycled at any time, which just means one extra Sanity CDN request).
 * Concurrent misses share one request.
 */
export function getRouteVisibility(): Promise<RouteVisibility> {
  if (cached && Date.now() - cached.fetchedAt < TTL_MS) return Promise.resolve(cached.value);
  inFlight ??= fetchRouteVisibility();
  return inFlight;
}
