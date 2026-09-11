import type { PortableTextBlock } from "@portabletext/types";
import type { ImageWithAlt, SeoFields } from "@/lib/types";
import { sanityClient } from "../client";
import { IMAGE_WITH_ALT_PROJECTION, SEO_PROJECTION } from "./fragments";
import { resolveImage, type SanityImageWithAlt } from "../image";

/**
 * Fourth content-type query module (docs/development-guidelines.md Section
 * 19), following the `Project` pattern (`projects.ts`): an editorially
 * curated, non-singleton document type with no `isActive`-style field
 * (docs/content-model.md Section 3 — native draft/publish is the only
 * visibility mechanism for `BlogPost`, same reasoning as `Project`), so
 * there's no active-filtering in GROQ.
 */

/** Same 300s window as `Service`/`Project` — the established default for
 * editorially-curated, low-volatility content types. */
const REVALIDATE_SECONDS = 300;

/** How many "other posts" to surface in the detail page's related-articles
 * sidebar (docs/content-model.md Section 0 item 11 — a generic "recent
 * posts" strategy, not an editor-curated relationship). */
const RELATED_POSTS_LIMIT = 2;

/**
 * `BlogPost.author` is a reference to an independent `Author` document
 * (docs/content-model.md Section 6). Dereferenced via GROQ's `->` and
 * re-projected to only the fields the detail page's author bar renders —
 * not the full `Author` document. `Author.slug` is omitted: nothing in
 * this feature links to a dedicated author page (none exists — see the
 * migration report).
 */
const AUTHOR_PROJECTION = `{
  name,
  role,
  photo${IMAGE_WITH_ALT_PROJECTION}
}`;

/**
 * `BlogPost.relatedServices` mirrors `Project.relatedServices` (same field
 * name/shape, docs/content-model.md Section 0 item 11) — dereferenced and
 * reprojected to only what the sidebar CTA card renders. `summary` (not
 * `tagline`) is used for the card's description line: it's the field
 * `Service` already designed for concise, external-facing card copy
 * (`docs/content-model.md` Section 2), a better fit here than the shorter
 * `tagline`.
 */
const RELATED_SERVICE_PROJECTION = `{
  "slug": slug.current,
  title,
  summary
}`;

/** Mirrors `BlogPostListItem` below — `getBlogPostBySlug`'s "related
 * articles" sub-query reuses this exact projection so the sidebar card can
 * reuse `BlogPostListItem` directly rather than a second, near-identical
 * type. */
const RELATED_POSTS_PROJECTION = `{
  title,
  "slug": slug.current,
  excerpt,
  tags,
  publishedAt,
  heroImage${IMAGE_WITH_ALT_PROJECTION}
}`;

export interface BlogPostAuthor {
  name: string;
  role?: string;
  photo?: ImageWithAlt;
}

export interface BlogPostRelatedService {
  slug: string;
  title: string;
  summary: string;
}

interface RawAuthor {
  name: string;
  role: string | null;
  photo: SanityImageWithAlt | null;
}

interface RawRelatedService {
  slug: string;
  title: string;
  summary: string | null;
}

interface RawBlogPostListItem {
  title: string;
  slug: string;
  excerpt: string | null;
  tags: string[] | null;
  publishedAt: string | null;
  heroImage: SanityImageWithAlt | null;
}

interface RawBlogPostDetail {
  title: string;
  slug: string;
  excerpt: string | null;
  body: PortableTextBlock[] | null;
  tags: string[] | null;
  publishedAt: string | null;
  heroImage: SanityImageWithAlt | null;
  author: RawAuthor | null;
  relatedServices: RawRelatedService[] | null;
  relatedPosts: RawBlogPostListItem[] | null;
  seo: SeoFields | null;
}

/** The `/blog` listing shape — mirrors the fields `BlogPostCard`
 * (`src/app/blog/_components/blog-post-card.tsx`) actually reads. Also
 * reused for the detail page's "related articles" sidebar entries — same
 * card-like fields, same source query shape (the sidebar just doesn't
 * render `tags`). */
export interface BlogPostListItem {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: string | null;
  heroImage: ImageWithAlt;
}

/** The `/blog/[slug]` detail shape — mirrors the fields `BlogPostHero`,
 * `BlogPostAuthorBar`, and the detail page's body/tags/sidebar sections
 * actually read. */
export interface BlogPostDetail {
  slug: string;
  title: string;
  excerpt: string;
  body: PortableTextBlock[];
  tags: string[];
  publishedAt: string | null;
  heroImage: ImageWithAlt;
  author?: BlogPostAuthor;
  relatedServices: BlogPostRelatedService[];
  relatedPosts: BlogPostListItem[];
  seo?: SeoFields;
}

/**
 * Ordered newest-first — the standard, expected reading order for a
 * blog/knowledge-center listing (docs/product.md Section 8's "Blog /
 * Knowledge Center"), and the only ordering field `BlogPost` actually has
 * (no `displayOrder`-style manual curation field exists on this type, per
 * `studio/schemaTypes/documents/blog-post.ts`).
 */
const BLOG_POSTS_LIST_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  excerpt,
  tags,
  publishedAt,
  heroImage${IMAGE_WITH_ALT_PROJECTION}
}`;

/**
 * `relatedPosts` is resolved as a GROQ sub-query in the same request
 * (docs/development-guidelines.md Section 8 / this migration's "avoid N+1
 * fetching" requirement) — "other recent posts," not an editor-curated
 * relationship (docs/content-model.md Section 0 item 11).
 */
const BLOG_POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  excerpt,
  body,
  tags,
  publishedAt,
  heroImage${IMAGE_WITH_ALT_PROJECTION},
  author->${AUTHOR_PROJECTION},
  relatedServices[]->${RELATED_SERVICE_PROJECTION},
  "relatedPosts": *[_type == "blogPost" && slug.current != $slug] | order(publishedAt desc) [0...${RELATED_POSTS_LIMIT}] ${RELATED_POSTS_PROJECTION},
  seo${SEO_PROJECTION}
}`;

const BLOG_POST_SLUGS_QUERY = `*[_type == "blogPost"]{
  "slug": slug.current,
  "noIndex": seo.noIndex
}`;

function toAuthor(raw: RawAuthor | null): BlogPostAuthor | undefined {
  if (!raw) return undefined;

  return {
    name: raw.name,
    role: raw.role ?? undefined,
    // Unlike `resolveImage()`'s usual placeholder fallback (right for a
    // hero/card image slot), a missing author photo just means no avatar
    // renders at all — a generic placeholder graphic in a small round
    // avatar slot would look like a content bug, not a "photo coming
    // soon" state.
    photo: raw.photo?.asset ? resolveImage(raw.photo, raw.name) : undefined,
  };
}

function toRelatedService(raw: RawRelatedService): BlogPostRelatedService {
  return {
    slug: raw.slug,
    title: raw.title,
    summary: raw.summary ?? "",
  };
}

function toBlogPostListItem(raw: RawBlogPostListItem): BlogPostListItem {
  return {
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt ?? "",
    tags: raw.tags ?? [],
    publishedAt: raw.publishedAt,
    heroImage: resolveImage(raw.heroImage, raw.title),
  };
}

function toBlogPostDetail(raw: RawBlogPostDetail): BlogPostDetail {
  return {
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt ?? "",
    body: raw.body ?? [],
    tags: raw.tags ?? [],
    publishedAt: raw.publishedAt,
    heroImage: resolveImage(raw.heroImage, raw.title),
    author: toAuthor(raw.author),
    relatedServices: raw.relatedServices?.map(toRelatedService) ?? [],
    relatedPosts: raw.relatedPosts?.map(toBlogPostListItem) ?? [],
    seo: raw.seo ?? undefined,
  };
}

/** Fetches all blog posts for `/blog`, newest-first (see
 * `BLOG_POSTS_LIST_QUERY` above). */
export async function getBlogPosts(): Promise<BlogPostListItem[]> {
  const posts = await sanityClient.fetch<RawBlogPostListItem[]>(
    BLOG_POSTS_LIST_QUERY,
    {},
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  return posts.map(toBlogPostListItem);
}

/**
 * Fetches one blog post by slug for `/blog/[slug]`, including its resolved
 * author, related services, and related-posts sidebar in a single request.
 * Returns `null` for an unknown slug, which the page turns into
 * `notFound()`.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const post = await sanityClient.fetch<RawBlogPostDetail | null>(
    BLOG_POST_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  return post ? toBlogPostDetail(post) : null;
}

export interface BlogPostSlugEntry {
  slug: string;
  noIndex: boolean;
}

/**
 * Fetches all blog post slugs (plus each one's `seo.noIndex`), for
 * `generateStaticParams` and for `sitemap.ts` (which excludes any post
 * explicitly marked `noIndex`).
 */
export async function getBlogPostSlugs(): Promise<BlogPostSlugEntry[]> {
  const raw = await sanityClient.fetch<{ slug: string; noIndex: boolean | null }[]>(
    BLOG_POST_SLUGS_QUERY,
    {},
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  return raw.map(({ slug, noIndex }) => ({ slug, noIndex: noIndex ?? false }));
}
