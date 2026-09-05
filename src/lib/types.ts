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
 * scope until Sanity itself is introduced. Used by `Service.body`
 * (src/lib/mock/services.ts) — see `ProjectBodyBlock` below for `Project`'s
 * wider variant, kept as a separate type rather than widening this one, so
 * the Services pages' existing block-rendering code (out of scope for this
 * change) doesn't need to handle variants it never receives.
 */
export type BodyBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

/**
 * `Project.body`'s block set — a superset of `BodyBlock`. `numberedSteps`
 * and `quote` exist because `Project.body` is documented to cover a
 * project's full narrative arc, including "work performed" (a numbered
 * list of short steps) and a customer pull-quote (docs/content-model.md
 * Section 0 item 9) — both standard Portable Text block shapes (a numbered
 * list, a blockquote), not invented structure.
 */
export type ProjectBodyBlock =
  | BodyBlock
  | { type: "numberedSteps"; items: { title: string; description: string }[] }
  | { type: "quote"; text: string; attribution?: string };
