import type { PortableTextBlock } from "@portabletext/types";
import type { ImageWithAlt, SeoFields } from "@/lib/types";
import { sanityClient } from "../client";
import { IMAGE_WITH_ALT_PROJECTION, SEO_PROJECTION } from "./fragments";
import { resolveImage, type SanityImageWithAlt } from "../image";

/**
 * `AboutPage` query module (docs/development-guidelines.md Section 19).
 * Singleton with a deterministic `_id` (docs/content-model.md Section 9,
 * `studio/schemaTypes/documents/about-page.ts`), fetched directly by `_id`
 * exactly like `Homepage`/`BusinessSettings` — never queried as "the first
 * `aboutPage` document".
 *
 * `heroHeadline` is deliberately not queried: same content-model gap already
 * resolved for `Homepage.heroHeadline` (`src/app/_components/hero-section.tsx`)
 * — a plain string field can't carry the approved design's per-line/gold-accent
 * headline treatment, so that headline stays local presentational copy in
 * `AboutHero`, not Sanity-driven.
 *
 * Missing/empty optional fields (no hero image, empty gallery, no owner
 * story, no CTA) are expected, resilient states, not errors — same
 * leniency as `Homepage`, unlike `BusinessSettings`' hard-required legal
 * facts. Each section component hides itself when its data is empty.
 */
const REVALIDATE_SECONDS = 300;

const ABOUT_PAGE_ID = "aboutPage";

const ABOUT_PAGE_QUERY = `*[_id == "${ABOUT_PAGE_ID}"][0]{
  heroSubheadline,
  heroImage${IMAGE_WITH_ALT_PROJECTION},
  ownerStory,
  philosophyValues[]{icon, title, description},
  stats[]{label, value},
  photoGallery[]${IMAGE_WITH_ALT_PROJECTION},
  cta{label, url},
  seo${SEO_PROJECTION}
}`;

/** `philosophyValues[].icon` is a fixed string key (docs/content-model.md
 * Section 9) resolved to a component in `PhilosophySection`. */
export type PhilosophyIconKey = "precision" | "reliability" | "growth";

export interface AboutPagePhilosophyValue {
  icon: PhilosophyIconKey;
  title: string;
  description: string;
}

export interface AboutPageStat {
  label: string;
  value: string;
}

/** The `/rolunk` page shape — mirrors the fields `AboutHero`,
 * `OwnerStorySection`, `PhilosophySection`, `StatsSection`,
 * `PhotoGallerySection`, and `AboutCta` actually read. */
export interface AboutPageData {
  heroSubheadline?: string;
  heroImage: ImageWithAlt;
  ownerStory: PortableTextBlock[];
  philosophyValues: AboutPagePhilosophyValue[];
  stats: AboutPageStat[];
  photoGallery: ImageWithAlt[];
  cta?: { label: string; url: string };
  seo?: SeoFields;
}

interface RawAboutPage {
  heroSubheadline: string | null;
  heroImage: SanityImageWithAlt | null;
  ownerStory: PortableTextBlock[] | null;
  philosophyValues: AboutPagePhilosophyValue[] | null;
  stats: AboutPageStat[] | null;
  photoGallery: SanityImageWithAlt[] | null;
  cta: { label: string; url: string } | null;
  seo: SeoFields | null;
}

function toAboutPageData(raw: RawAboutPage | null): AboutPageData {
  return {
    heroSubheadline: raw?.heroSubheadline ?? undefined,
    heroImage: resolveImage(raw?.heroImage, "Royal-Team szerviz csapata munka közben"),
    ownerStory: raw?.ownerStory ?? [],
    philosophyValues: raw?.philosophyValues ?? [],
    stats: raw?.stats ?? [],
    photoGallery: (raw?.photoGallery ?? []).map((image) =>
      resolveImage(image, "Royal-Team szerviz műhely"),
    ),
    cta: raw?.cta?.label && raw?.cta?.url ? raw.cta : undefined,
    seo: raw?.seo ?? undefined,
  };
}

/**
 * Fetches the `AboutPage` singleton. Called independently from each
 * `/rolunk` section component and from `generateMetadata` — same
 * self-fetching pattern as `Homepage` — collapsed into one network request
 * per render by Next.js's fetch memoization.
 */
export async function getAboutPage(): Promise<AboutPageData> {
  const result = await sanityClient.fetch<RawAboutPage | null>(
    ABOUT_PAGE_QUERY,
    {},
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  return toAboutPageData(result);
}
