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

/**
 * A deliberately minimal stand-in for a Portable Text `body` field — not
 * real Portable Text JSON. Sanity's actual rich-text block format is far
 * richer than this; this shape only needs to support what the mock content
 * actually renders (paragraphs and a bullet list), since real Portable Text
 * rendering (`@portabletext/react`) is Sanity-integration work, out of
 * scope until Sanity itself is introduced.
 */
export type BodyBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };
