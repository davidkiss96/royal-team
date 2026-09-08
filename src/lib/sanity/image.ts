import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
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
