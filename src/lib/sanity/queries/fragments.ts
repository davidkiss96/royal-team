/**
 * Shared GROQ projection fragments (docs/development-guidelines.md Section 8:
 * "Centralize repeated query fragments — the `imageWithAlt` projection and
 * the `seo` object projection ... should be defined once as reusable GROQ
 * fragments"). `Service` is the first content-type query module to actually
 * need these (docs/content-model.md Section 1 defines both object types,
 * but `BusinessSettings` doesn't query images or `seo`) — defined here so
 * `Project`/`BlogPost`/`Homepage`/`AboutPage` query modules can reuse the
 * same fragments later instead of re-fragmenting them per module.
 */

/**
 * Projects an `imageWithAlt` field with everything `urlForImage()`
 * (`src/lib/sanity/image.ts`) needs to build a correctly cropped URL
 * (`asset`, `hotspot`, `crop`) plus the required `alt` text and optional
 * `caption`. Interpolate directly after the field name, e.g.
 * `` `heroImage${IMAGE_WITH_ALT_PROJECTION}` ``.
 */
export const IMAGE_WITH_ALT_PROJECTION = `{
  asset,
  hotspot,
  crop,
  alt,
  caption
}`;

/**
 * Projects a `seo` object field's fields explicitly, per Section 8's "query
 * only the fields actually used" rule. Interpolate directly after the field
 * name, e.g. `` `seo${SEO_PROJECTION}` ``.
 */
export const SEO_PROJECTION = `{
  metaTitle,
  metaDescription,
  noIndex
}`;
