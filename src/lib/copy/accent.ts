import type { PortableTextBlock } from "@portabletext/types";

/**
 * A heading with gold-accented words and manual line breaks — the
 * `accentHeading` Sanity type (`src/sanity/schemaTypes/objects/accent-heading.ts`):
 * Portable Text limited to plain blocks plus one `gold` decorator, where a
 * Shift+Enter line break arrives as `\n` inside a span.
 */
export type AccentHeading = PortableTextBlock[];

/**
 * Builds an `AccentHeading` from a tiny markup — `*gold*` for accented text,
 * `\n` for a line break — so code defaults and the seed script can state
 * headings readably (`accent("Legújabb *cikkeink.*")`). Keys are positional;
 * they only need to be unique within the array.
 */
export function accent(markup: string): AccentHeading {
  const children = markup
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((part, index) => {
      const gold = part.startsWith("*") && part.endsWith("*");
      return {
        _type: "span",
        _key: `s${index}`,
        text: gold ? part.slice(1, -1) : part,
        marks: gold ? ["gold"] : [],
      };
    });

  return [{ _type: "block", _key: "b0", style: "normal", markDefs: [], children }];
}

/** Plain-text version (gold marks dropped, line breaks as spaces) — for alt text, metadata, etc. */
export function accentToPlainText(value: AccentHeading): string {
  return value
    .flatMap((block) => block.children.map((child) => ("text" in child ? String(child.text) : "")))
    .join("")
    .replace(/\s*\n\s*/g, " ")
    .trim();
}
