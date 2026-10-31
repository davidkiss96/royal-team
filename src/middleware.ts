import { NextResponse, type NextRequest } from "next/server";
import { isRouteEnabled, NOT_FOUND_REWRITE_DESTINATION } from "@/lib/features";
import { getRouteVisibility, type RouteVisibility } from "@/lib/sanity/queries/route-visibility";

/** `[slug]` routes whose slugs the middleware checks, keyed by their parent path. */
const SLUG_ROUTES = {
  "/blog": "blog",
  "/szolgaltatasok": "services",
  "/projektek": "projects",
} as const satisfies Record<string, keyof NonNullable<RouteVisibility["slugs"]>>;

function isUnknownSlug(pathname: string, slugs: RouteVisibility["slugs"]): boolean {
  if (!slugs) return false;
  const [, parent, slug] = /^(\/[^/]+)\/([^/]+)$/.exec(pathname) ?? [];
  if (!parent || !slug) return false;
  const kind = SLUG_ROUTES[parent as keyof typeof SLUG_ROUTES];
  if (!kind) return false;
  try {
    return !slugs[kind].has(decodeURIComponent(slug));
  } catch {
    return true; // malformed percent-encoding can't be a real slug
  }
}

/**
 * Deliberately the deprecated `middleware` convention (Edge runtime), not
 * Next 16's `proxy.ts`: `proxy` is Node-only, which OpenNext supports on
 * Cloudflare only experimentally and which adds ~600–800 KB (gzip) to the
 * Worker — at or over the 3 MB Workers Free limit. Edge middleware is
 * OpenNext's supported path and adds ~60 KB. Rename (codemod
 * `middleware-to-proxy`) once OpenNext supports Node proxy officially.
 *
 * Turns "this page shouldn't exist" into an ordinary unmatched URL, so Next
 * server-renders the root 404 (status 404, full HTML). Covers pages switched
 * off in Sanity (`src/lib/features.ts`) and unknown `[slug]`s — letting
 * those reach the page's own `notFound()` produces Next 16's client-rendered
 * recovery shell, which can stay blank (docs/architecture.md Section 17.2a).
 * New Sanity documents still go live without a deploy: the slug lists are
 * refreshed every 60s.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, "") || "/";
  const { features, slugs } = await getRouteVisibility();

  if (!isRouteEnabled(pathname, features) || isUnknownSlug(pathname, slugs)) {
    return NextResponse.rewrite(new URL(NOT_FOUND_REWRITE_DESTINATION, request.url));
  }
  return NextResponse.next();
}

// Only the routes this can affect — everything else (and all static
// assets) never pays for it.
export const config = {
  matcher: ["/arlista/:path*", "/projektek/:path*", "/blog/:slug", "/szolgaltatasok/:slug"],
};
