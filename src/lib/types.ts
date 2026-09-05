/**
 * Hand-written types mirroring the approved Sanity content model
 * (docs/content-model.md Section 1). Temporary — once Sanity is
 * introduced, these should be replaced by generated types (Sanity
 * typegen), per docs/development-guidelines.md Section 4.
 */

export interface ImageWithAlt {
  url: string;
  alt: string;
  caption?: string;
}

export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  noIndex?: boolean;
}
