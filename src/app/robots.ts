import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

/**
 * App Router robots.txt convention (Next.js special file). The whole public
 * site is crawlable — there is no admin/internal surface in this app to
 * disallow (Sanity Studio is a separate app under `studio/`, not served
 * here). Points crawlers at the dynamic sitemap below using the fixed
 * production origin, never the request's own host.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
