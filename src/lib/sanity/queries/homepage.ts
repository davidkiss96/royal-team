import type { ImageWithAlt, SeoFields } from "@/lib/types";
import { sanityClient } from "../client";
import { IMAGE_WITH_ALT_PROJECTION, SEO_PROJECTION } from "./fragments";
import { resolveImage, type SanityImageWithAlt } from "../image";

/**
 * Homepage query module (docs/development-guidelines.md Section 19).
 * `Homepage` is a singleton (docs/content-model.md Section 8) whose
 * `featuredServices`/`featuredProjects`/`featuredReviews` are the only
 * curation mechanism for what appears on the homepage — resolved here via
 * GROQ `->` dereferencing, never re-derived in React (e.g. never
 * `getServices()` sliced to the first N). `Review` has no dedicated query
 * module yet (no standalone reviews listing exists) — `featuredReviews` is
 * resolved inline here instead, exactly like `relatedServices` is resolved
 * inline on `Project`/`BlogPost`, not by introducing a premature
 * `reviews.ts` module for a single reference field.
 *
 * The homepage's "latest posts" blog preview has no `Homepage` field
 * (docs/content-model.md Section 8 has no blog reference) — per the task's
 * explicit fallback rule, it's a plain "latest N posts" query, ordered the
 * same way `BLOG_POSTS_LIST_QUERY` (`blog-posts.ts`) orders `/blog`:
 * `publishedAt desc`.
 *
 * Both are fetched in one request via a single object-shaped GROQ query
 * (`{ "homepage": ..., "latestBlogPosts": ... }`) — one network round trip,
 * not two.
 */
const REVALIDATE_SECONDS = 300;

const HOMEPAGE_ID = "homepage";

/** How many latest posts to show in the homepage Blog preview — matches
 * the current design (`BlogPreview`, a 3-column card grid). */
const LATEST_POSTS_LIMIT = 3;

const FEATURED_SERVICE_PROJECTION = `{
  "slug": slug.current,
  title,
  summary,
  heroImage${IMAGE_WITH_ALT_PROJECTION},
  isActive
}`;

const FEATURED_PROJECT_PROJECTION = `{
  "slug": slug.current,
  title,
  summary,
  projectDate,
  heroImage${IMAGE_WITH_ALT_PROJECTION},
  "relatedServiceTitles": relatedServices[]->title
}`;

const FEATURED_REVIEW_PROJECTION = `{
  authorName,
  rating,
  text,
  reviewDate,
  sourceDetail,
  isActive
}`;

const LATEST_BLOG_POST_PROJECTION = `{
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  heroImage${IMAGE_WITH_ALT_PROJECTION}
}`;

const HOMEPAGE_QUERY = `{
  "homepage": *[_id == "${HOMEPAGE_ID}"][0]{
    heroSubheadline,
    heroImage${IMAGE_WITH_ALT_PROJECTION},
    secondaryCtas[]{label, url},
    "featuredServices": (featuredServices[]->${FEATURED_SERVICE_PROJECTION})[isActive == true],
    "featuredProjects": featuredProjects[]->${FEATURED_PROJECT_PROJECTION},
    "featuredReviews": (featuredReviews[]->${FEATURED_REVIEW_PROJECTION})[isActive == true],
    seo${SEO_PROJECTION}
  },
  "latestBlogPosts": *[_type == "blogPost"] | order(publishedAt desc) [0...${LATEST_POSTS_LIMIT}] ${LATEST_BLOG_POST_PROJECTION}
}`;

export interface HomepageFeaturedService {
  slug: string;
  title: string;
  summary: string;
  heroImage: ImageWithAlt;
}

export interface HomepageFeaturedProject {
  slug: string;
  title: string;
  summary: string;
  projectDate: string | null;
  heroImage: ImageWithAlt;
  relatedServiceTitles: string[];
}

export interface HomepageFeaturedReview {
  authorName: string;
  /** 1–5, integer — `Review.rating` is Studio-required and range-validated
   * (`studio/schemaTypes/documents/review.ts`); still clamped when mapped
   * below as a minimal defensive guard, not a validation framework. */
  rating: number;
  text: string;
  reviewDate: string | null;
  sourceDetail?: string;
}

export interface HomepageBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
  heroImage: ImageWithAlt;
}

/** The homepage's full data shape — mirrors the fields `HeroSection`,
 * `ServicesOverview`, `ProjectsPreview`, `ReviewsSection`, and
 * `BlogPreview` actually read. `heroHeadline` is intentionally not
 * included — see the migration report's content-model gap note: the
 * schema's plain-string field can't carry the approved hero's per-line /
 * per-word gold-accent treatment, so that headline stays presentational
 * copy in `HeroSection`, same as `HERO_STATS`. `introText` is also
 * omitted — no current homepage section renders it. */
export interface HomepageData {
  heroSubheadline: string;
  heroImage: ImageWithAlt;
  secondaryCtas: { label: string; url: string }[];
  featuredServices: HomepageFeaturedService[];
  featuredProjects: HomepageFeaturedProject[];
  featuredReviews: HomepageFeaturedReview[];
  latestBlogPosts: HomepageBlogPost[];
  seo?: SeoFields;
}

interface RawHomepage {
  heroSubheadline: string | null;
  heroImage: SanityImageWithAlt | null;
  secondaryCtas: { label: string; url: string }[] | null;
  featuredServices:
    | { slug: string; title: string; summary: string | null; heroImage: SanityImageWithAlt | null }[]
    | null;
  featuredProjects:
    | {
        slug: string;
        title: string;
        summary: string | null;
        projectDate: string | null;
        heroImage: SanityImageWithAlt | null;
        relatedServiceTitles: (string | null)[] | null;
      }[]
    | null;
  featuredReviews:
    | {
        authorName: string;
        rating: number;
        text: string;
        reviewDate: string | null;
        sourceDetail: string | null;
      }[]
    | null;
  seo: SeoFields | null;
}

interface RawLatestBlogPost {
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  heroImage: SanityImageWithAlt | null;
}

interface RawHomepageQueryResult {
  homepage: RawHomepage | null;
  latestBlogPosts: RawLatestBlogPost[];
}

function toHomepageData(raw: RawHomepageQueryResult): HomepageData {
  const h = raw.homepage;

  return {
    heroSubheadline: h?.heroSubheadline ?? "",
    heroImage: resolveImage(h?.heroImage, "Royal-Team szerviz műhelye"),
    secondaryCtas: h?.secondaryCtas ?? [],
    featuredServices: (h?.featuredServices ?? []).map((s) => ({
      slug: s.slug,
      title: s.title,
      summary: s.summary ?? "",
      heroImage: resolveImage(s.heroImage, s.title),
    })),
    featuredProjects: (h?.featuredProjects ?? []).map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary ?? "",
      projectDate: p.projectDate,
      heroImage: resolveImage(p.heroImage, p.title),
      relatedServiceTitles: (p.relatedServiceTitles ?? []).filter(
        (title): title is string => Boolean(title),
      ),
    })),
    featuredReviews: (h?.featuredReviews ?? []).map((r) => ({
      authorName: r.authorName,
      rating: Math.min(5, Math.max(1, Math.round(r.rating))),
      text: r.text,
      reviewDate: r.reviewDate,
      sourceDetail: r.sourceDetail ?? undefined,
    })),
    latestBlogPosts: raw.latestBlogPosts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt ?? "",
      publishedAt: post.publishedAt,
      heroImage: resolveImage(post.heroImage, post.title),
    })),
    seo: h?.seo ?? undefined,
  };
}

/**
 * Fetches the `Homepage` singleton plus the latest blog posts in a single
 * request. Called independently from each homepage section component
 * (`HeroSection`, `ServicesOverview`, etc. — same self-fetching pattern
 * already established by `ContactStrip` for `BusinessSettings`) and from
 * `generateMetadata`; Next.js's fetch memoization collapses these into one
 * actual network request per render, so this isn't an N+1 in practice.
 *
 * Missing/empty featured arrays or an absent hero image are expected,
 * resilient states (task requirement — an editor may temporarily have
 * nothing curated), not errors: every array defaults to `[]` and
 * `heroImage` falls back to the local placeholder, same as `Service`/
 * `Project` already do via `resolveImage()`.
 */
export async function getHomepageContent(): Promise<HomepageData> {
  const result = await sanityClient.fetch<RawHomepageQueryResult>(
    HOMEPAGE_QUERY,
    {},
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  return toHomepageData(result);
}
