import type { PortableTextBlock } from "@portabletext/types";
import type { FaqItem } from "@/components/faq-accordion";
import type { ImageWithAlt, SeoFields } from "@/lib/types";
import { sanityClient } from "../client";
import { IMAGE_WITH_ALT_PROJECTION, SEO_PROJECTION } from "./fragments";
import { resolveImage, type SanityImageWithAlt } from "../image";

/**
 * Second content-type query module (docs/development-guidelines.md Section
 * 19), following the `BusinessSettings` pattern (`business-settings.ts`)
 * where it fits and diverging where `Service` genuinely differs: `Service`
 * is a queried document type (not a singleton fetched by `_id`), has two
 * distinct shapes (a listing projection and a fuller detail projection —
 * docs/development-guidelines.md Section 8's "query only the fields a page
 * actually uses"), and needs `isActive`/`displayOrder` filtering and
 * ordering done in GROQ rather than in JavaScript.
 */

/**
 * A lower-volatility, editorially-curated content type than
 * `BusinessSettings` (60s, `business-settings.ts`) — services are added,
 * paused, or reworded occasionally by the owner, not the kind of
 * operational fact (phone/address) that needs near-instant propagation.
 * Five minutes balances "a Studio edit is visible without a redeploy"
 * against not refetching on every request. This is the second ISR window
 * chosen for this project (`architecture.md` Section 6.1) — a reasonable
 * default for other similarly low-volatility, editor-curated content types
 * (e.g. `Project`, `BlogPost`) once they're migrated, not a one-off.
 */
const REVALIDATE_SECONDS = 300;

interface RawServiceListItem {
  title: string;
  slug: string;
  tagline: string | null;
  summary: string;
  highlights: string[] | null;
  heroImage: SanityImageWithAlt | null;
}

interface RawServiceDetail {
  title: string;
  slug: string;
  tagline: string | null;
  summary: string;
  body: PortableTextBlock[] | null;
  highlights: string[] | null;
  process: { title: string; description: string }[] | null;
  faq: FaqItem[] | null;
  heroImage: SanityImageWithAlt | null;
  gallery: SanityImageWithAlt[] | null;
  seo: SeoFields | null;
}

/**
 * The `/szolgaltatasok` listing shape — mirrors the fields `ServiceRow`
 * (`src/app/szolgaltatasok/_components/service-row.tsx`) actually reads.
 * `isActive` is included because `ServiceRow` renders the "ELÉRHETŐ" badge
 * off it (docs/content-model.md Section 2); every result is already
 * filtered to `isActive == true` by `SERVICES_LIST_QUERY` below, so it's
 * always `true` here — kept as a real fetched field rather than a
 * hardcoded literal so the type honestly reflects the underlying document.
 */
export interface ServiceListItem {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  highlights: string[];
  heroImage: ImageWithAlt;
  isActive: true;
}

/** The `/szolgaltatasok/[slug]` detail shape — mirrors the fields
 * `ServiceHero`, `ServiceBodySection`, `ServiceProcessSection`, and
 * `ServiceHighlightsCta` actually read. `slug` is included because
 * `ServiceHighlightsCta` keys `SERVICE_ICONS` off it
 * (`src/lib/service-icons.ts`). */
export interface ServiceDetail {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  body: PortableTextBlock[];
  highlights: string[];
  process?: { title: string; description: string }[];
  faq?: FaqItem[];
  heroImage: ImageWithAlt;
  gallery?: ImageWithAlt[];
  seo?: SeoFields;
}

const SERVICES_LIST_QUERY = `*[_type == "service" && isActive == true] | order(displayOrder asc) {
  title,
  "slug": slug.current,
  tagline,
  summary,
  highlights,
  heroImage${IMAGE_WITH_ALT_PROJECTION}
}`;

const SERVICE_BY_SLUG_QUERY = `*[_type == "service" && isActive == true && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  tagline,
  summary,
  body,
  highlights,
  process,
  faq,
  heroImage${IMAGE_WITH_ALT_PROJECTION},
  gallery[]${IMAGE_WITH_ALT_PROJECTION},
  seo${SEO_PROJECTION}
}`;

const ACTIVE_SERVICE_SLUGS_QUERY = `*[_type == "service" && isActive == true]{
  "slug": slug.current,
  "noIndex": seo.noIndex
}`;

function toServiceListItem(raw: RawServiceListItem): ServiceListItem {
  return {
    slug: raw.slug,
    title: raw.title,
    tagline: raw.tagline ?? "",
    summary: raw.summary,
    highlights: raw.highlights ?? [],
    heroImage: resolveImage(raw.heroImage, raw.title),
    isActive: true,
  };
}

function toServiceDetail(raw: RawServiceDetail): ServiceDetail {
  return {
    slug: raw.slug,
    title: raw.title,
    tagline: raw.tagline ?? "",
    summary: raw.summary,
    body: raw.body ?? [],
    highlights: raw.highlights ?? [],
    process: raw.process ?? undefined,
    faq: raw.faq ?? undefined,
    heroImage: resolveImage(raw.heroImage, raw.title),
    gallery: raw.gallery?.map((image) => resolveImage(image, raw.title)),
    seo: raw.seo ?? undefined,
  };
}

/**
 * Fetches all active services for `/szolgaltatasok`, ordered and filtered
 * in GROQ (docs/development-guidelines.md Section 8) — not fetched
 * unfiltered/unsorted and handled client-side, per the task's explicit
 * requirement.
 */
export async function getServices(): Promise<ServiceListItem[]> {
  const services = await sanityClient.fetch<RawServiceListItem[]>(
    SERVICES_LIST_QUERY,
    {},
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  return services.map(toServiceListItem);
}

/**
 * Fetches one service by slug for `/szolgaltatasok/[slug]`. Only an active
 * service can resolve here — an inactive or nonexistent slug both return
 * `null`, which the page turns into `notFound()` (docs/content-model.md
 * Section 2's `isActive` must never be bypassable via direct URL access).
 */
export async function getServiceBySlug(slug: string): Promise<ServiceDetail | null> {
  const service = await sanityClient.fetch<RawServiceDetail | null>(
    SERVICE_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  return service ? toServiceDetail(service) : null;
}

export interface ServiceSlugEntry {
  slug: string;
  noIndex: boolean;
}

/**
 * Fetches active-service slugs (plus each one's `seo.noIndex`), for
 * `generateStaticParams` (docs/development-guidelines.md Section 3) and for
 * `sitemap.ts`. A service that's currently `isActive: false` is deliberately
 * excluded entirely, consistent with it never resolving publicly (see
 * `getServiceBySlug` above) — `noIndex` is a separate, narrower concern
 * (still a real, reachable page, just excluded from the sitemap/search
 * indexing), so it's returned alongside the slug rather than filtered here.
 */
export async function getActiveServiceSlugs(): Promise<ServiceSlugEntry[]> {
  const raw = await sanityClient.fetch<{ slug: string; noIndex: boolean | null }[]>(
    ACTIVE_SERVICE_SLUGS_QUERY,
    {},
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  return raw.map(({ slug, noIndex }) => ({ slug, noIndex: noIndex ?? false }));
}
