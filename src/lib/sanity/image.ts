import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import type { ImageWithAlt } from "@/lib/types";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

/**
 * Builds a Sanity image CDN URL builder from a Sanity image reference
 * (docs/architecture.md Section 12) — e.g.
 * `urlForImage(source).width(800).url()`. Returns the chainable builder
 * rather than a bare string so callers can apply the transforms their
 * specific usage context needs (hero vs. card vs. gallery — see
 * docs/development-guidelines.md Section 9) before reading `.url()`, which
 * is then passed to `next/image`'s `src`.
 */
export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

const PLACEHOLDER_IMAGE_URL = "/placeholders/photo-placeholder.svg";

/** Shape of an `imageWithAlt` field as returned by the
 * `IMAGE_WITH_ALT_PROJECTION` GROQ fragment (`src/lib/sanity/queries/fragments.ts`). */
export interface SanityImageWithAlt {
  asset?: SanityImageSource | null;
  hotspot?: unknown;
  crop?: unknown;
  alt?: string;
  caption?: string;
}

/**
 * Resolves a Sanity `imageWithAlt` field into the display-ready shape every
 * image-consuming component already expects (`src/lib/types.ts`'s
 * `ImageWithAlt`). The migrated `Service` documents currently have no
 * `heroImage`/`gallery` asset (the mock data only ever referenced a generic
 * placeholder, so nothing real existed to migrate — see
 * `src/scripts/seed-sanity.ts`), so `image` is commonly `null`/absent right
 * now; this falls back to the same local placeholder graphic every mock
 * service image already pointed at, preserving the pages' current
 * placeholder behavior (rather than crashing or rendering a broken `<img>`)
 * until real photography is uploaded in Sanity Studio.
 */
export function resolveImage(
  image: SanityImageWithAlt | null | undefined,
  fallbackAlt: string,
  width = 1200,
): ImageWithAlt {
  if (!image?.asset) {
    return { url: PLACEHOLDER_IMAGE_URL, alt: fallbackAlt };
  }

  return {
    url: urlForImage(image).width(width).url(),
    alt: image.alt || fallbackAlt,
    caption: image.caption,
  };
}
