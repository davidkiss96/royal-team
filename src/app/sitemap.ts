import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { getActiveServiceSlugs } from "@/lib/sanity/queries/services";
import { getProjectSlugs } from "@/lib/sanity/queries/projects";
import { getBlogPostSlugs } from "@/lib/sanity/queries/blog-posts";

/**
 * Every static, always-indexable route. Dynamic detail routes are appended
 * below from Sanity rather than hardcoded here.
 */
const STATIC_ROUTES = [
  "/",
  "/szolgaltatasok",
  "/rolunk",
  "/arlista",
  "/projektek",
  "/kapcsolat",
  "/blog",
  "/impresszum",
  "/adatvedelem",
];

/**
 * App Router sitemap.xml convention (Next.js special file). Dynamic slugs
 * are fetched with the exact same query functions each `[slug]` route
 * already uses for `generateStaticParams` (`getActiveServiceSlugs`,
 * `getProjectSlugs`, `getBlogPostSlugs`) — these already enforce this
 * project's visibility rules (`Service.isActive` filtering in GROQ; `Project`/
 * `BlogPost` have no such field and rely on Sanity's own publish state,
 * which the unauthenticated `sanityClient` only ever resolves for published
 * documents — see `src/lib/sanity/client.ts`). Reusing them means the
 * sitemap can never list a URL that isn't actually reachable/indexable.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceSlugs, projectSlugs, blogPostSlugs] = await Promise.all([
    getActiveServiceSlugs(),
    getProjectSlugs(),
    getBlogPostSlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...serviceSlugs.map((slug) => ({ url: `${SITE_URL}/szolgaltatasok/${slug}` })),
    ...projectSlugs.map((slug) => ({ url: `${SITE_URL}/projektek/${slug}` })),
    ...blogPostSlugs.map((slug) => ({ url: `${SITE_URL}/blog/${slug}` })),
  ];

  return [...staticEntries, ...dynamicEntries];
}
