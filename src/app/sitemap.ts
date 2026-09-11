import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { getAboutPage } from "@/lib/sanity/queries/about-page";
import { getBlogPostSlugs } from "@/lib/sanity/queries/blog-posts";
import { getHomepageContent } from "@/lib/sanity/queries/homepage";
import { getProjectSlugs } from "@/lib/sanity/queries/projects";
import { getActiveServiceSlugs } from "@/lib/sanity/queries/services";

/**
 * Static routes with no per-document `noIndex` concept — their `metadata`
 * is a plain literal object (see each page.tsx), so they're always
 * indexable. `/` and `/rolunk` are excluded here: both are CMS-driven and
 * carry an editor-controlled `seo.noIndex` flag, handled separately below.
 */
const ALWAYS_INDEXABLE_STATIC_ROUTES = [
  "/szolgaltatasok",
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
 *
 * Each of those three query functions, plus `getHomepageContent`/
 * `getAboutPage` for `/` and `/rolunk`, now also carries `seo.noIndex` — the
 * exact same flag each route's own `generateMetadata` already turns into a
 * `robots: { index: false }` tag (`src/lib/seo.ts`'s `buildPageMetadata`).
 * A page marked `noIndex` is filtered out here too, so the sitemap can never
 * disagree with a page's own robots meta tag.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [homepage, aboutPage, serviceEntries, projectEntries, blogPostEntries] =
    await Promise.all([
      getHomepageContent(),
      getAboutPage(),
      getActiveServiceSlugs(),
      getProjectSlugs(),
      getBlogPostSlugs(),
    ]);

  const staticEntries: MetadataRoute.Sitemap = [
    ...(homepage.seo?.noIndex ? [] : [{ url: `${SITE_URL}/` }]),
    ...(aboutPage.seo?.noIndex ? [] : [{ url: `${SITE_URL}/rolunk` }]),
    ...ALWAYS_INDEXABLE_STATIC_ROUTES.map((path) => ({ url: `${SITE_URL}${path}` })),
  ];

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...serviceEntries
      .filter((entry) => !entry.noIndex)
      .map(({ slug }) => ({ url: `${SITE_URL}/szolgaltatasok/${slug}` })),
    ...projectEntries
      .filter((entry) => !entry.noIndex)
      .map(({ slug }) => ({ url: `${SITE_URL}/projektek/${slug}` })),
    ...blogPostEntries
      .filter((entry) => !entry.noIndex)
      .map(({ slug }) => ({ url: `${SITE_URL}/blog/${slug}` })),
  ];

  return [...staticEntries, ...dynamicEntries];
}
