import type { MetadataRoute } from "next";
import { IS_PRODUCTION, SITE_URL } from "@/lib/site-config";

/**
 * App Router robots.txt convention (Next.js special file). Crawling is
 * allowed only for a genuine production build (`IS_PRODUCTION`,
 * `src/lib/site-config.ts`) — there is no admin/internal surface in this app
 * to disallow there (Sanity Studio is a separate app under `studio/`, not
 * served here). A Cloudflare preview or local build disallows everything
 * instead: it has no way to distinguish "safe to publicly index" from "not
 * yet reviewed by the business owner" other than this explicit flag (release
 * audit Section 2 — a preview must never be silently crawlable). The sitemap
 * link is omitted outside production, since a sitemap has nothing useful to
 * offer a crawler that's already been told to stay out.
 */
export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
