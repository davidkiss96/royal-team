import type { Metadata } from "next";
import type { BusinessSettings } from "@/lib/sanity/queries/business-settings";

export const SITE_NAME = "Royal-Team Autószerviz";

const SANITY_CDN_HOST = "cdn.sanity.io";

export interface SocialImage {
  url: string;
  alt: string;
}

/**
 * The sitewide default social image (`src/app/opengraph-image.tsx`,
 * re-exported by `twitter-image.tsx`). Next.js's file-convention images only
 * auto-attach to the exact route segment they live in (verified: `/` and
 * the root `not-found.tsx` pick it up automatically, but `/rolunk`,
 * `/szolgaltatasok/[slug]`, and every other nested route do not) — so
 * `buildPageMetadata` references it explicitly for every page instead of
 * relying on that inheritance, guaranteeing every page's `og:image`/
 * `twitter:image` actually resolves.
 */
const DEFAULT_SOCIAL_IMAGE: SocialImage = {
  url: "/opengraph-image",
  alt: `${SITE_NAME} — Prémium autószerviz Ercsiben`,
};

/**
 * True only for a real, Sanity-hosted photo — never the local placeholder
 * SVG `resolveImage()` (`src/lib/sanity/image.ts`) falls back to when no
 * asset has been uploaded yet. A placeholder is never a usable social-share
 * image, so callers use this to decide whether to override the sitewide
 * default (`opengraph-image.tsx`) with a page's own content photo.
 */
export function isRealImage(image: { url: string }): boolean {
  return image.url.includes(SANITY_CDN_HOST);
}

export interface PageMetadataInput {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/szolgaltatasok/dpf-szuro-tisztitas" — resolved against the root layout's `metadataBase`. */
  path: string;
  noIndex?: boolean;
  /** A real content photo to use instead of the sitewide default social image. */
  image?: SocialImage;
  ogType?: "website" | "article";
  /** Blog articles only — reuses the already-fetched `publishedAt`, never a new fetch. */
  publishedTime?: string;
}

/**
 * Builds the canonical/OpenGraph/Twitter/robots block shared by every page's
 * metadata, from the same title/description/noIndex each page already
 * computes (docs/development-guidelines.md Section 8's "centralize repeated
 * fragments", applied to metadata the same way `SEO_PROJECTION` centralizes
 * the GROQ shape). `path` and `image.url` (when relative) are resolved
 * against the root layout's `metadataBase`. `image` overrides the sitewide
 * default (`DEFAULT_SOCIAL_IMAGE`) when a route has a real content photo.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  noIndex,
  image = DEFAULT_SOCIAL_IMAGE,
  ogType = "website",
  publishedTime,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: ogType,
      locale: "hu_HU",
      images: [{ url: image.url, alt: image.alt }],
      ...(ogType === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

interface OpeningHoursRow {
  day: string;
  closed?: boolean | null;
  opens?: string | null;
  closes?: string | null;
}

const DAY_TO_SCHEMA_ORG: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

/**
 * Converts `BusinessSettings.openingHours` (`studio/schemaTypes/documents/business-settings.ts`:
 * `{ day, closed, opens, closes }` rows, `opens`/`closes` already validated
 * `HH:MM` in Studio) into Schema.org `OpeningHoursSpecification` — a format
 * that genuinely maps 1:1, so this is a direct field translation, not
 * invented parsing. A closed day has no Schema.org equivalent property, so
 * it's simply omitted rather than represented some other way. Returns
 * `undefined` when there's nothing safely representable yet (the field is
 * currently unpopulated in the seed dataset) — no JSON-LD property is better
 * than a guessed one.
 */
function buildOpeningHoursSpecification(rows: OpeningHoursRow[] | null | undefined) {
  const openRows = (rows ?? []).filter(
    (row): row is Required<Pick<OpeningHoursRow, "day" | "opens" | "closes">> =>
      !row.closed && Boolean(row.opens) && Boolean(row.closes) && Boolean(DAY_TO_SCHEMA_ORG[row.day]),
  );

  if (openRows.length === 0) return undefined;

  return openRows.map((row) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${DAY_TO_SCHEMA_ORG[row.day]}`,
    opens: row.opens,
    closes: row.closes,
  }));
}

/**
 * `AutoRepair` (a Schema.org `LocalBusiness` subtype — the correct type for
 * a car-service workshop) JSON-LD, sourced entirely from the existing
 * `BusinessSettings` singleton (docs/content-model.md Section 7) — no second
 * hardcoded business-data source. Deliberately uses `settings.address` (the
 * workshop customers actually visit), never `settings.registeredOffice`
 * (the legal/"székhely" address, a different fact — see that field's own
 * description in the Studio schema). Only includes properties this
 * project's data can actually support: no `priceRange`, `geo`, ratings, or
 * review counts, since none of that exists here and inventing any of it
 * would be fake structured data.
 */
export function buildLocalBusinessJsonLd(
  settings: BusinessSettings,
  siteUrl: string,
  logoUrl: string,
) {
  const openingHoursSpecification = buildOpeningHoursSpecification(settings.openingHours);

  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: settings.businessName,
    url: siteUrl,
    logo: logoUrl,
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.addressLine1,
      addressLocality: settings.address.city,
      postalCode: settings.address.postalCode,
      addressCountry: "HU",
    },
    ...(openingHoursSpecification ? { openingHoursSpecification } : {}),
  };
}
