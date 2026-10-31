import {defineField, defineType} from 'sanity'

const EMPTY_HINT = 'Üresen hagyva az eredeti szöveg jelenik meg.'

/** Small gold label + accent heading above a homepage section. */
export const sectionHeading = defineType({
  name: 'sectionHeading',
  title: 'Szekció címe',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({name: 'label', title: 'Kis felirat (arany, a cím felett)', type: 'string', description: EMPTY_HINT}),
    defineField({name: 'title', title: 'Cím', type: 'accentHeading'}),
  ],
})

/** Label + heading + intro paragraph at the top of a page. */
export const pageHeader = defineType({
  name: 'pageHeader',
  title: 'Oldal fejléce',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({name: 'label', title: 'Kis felirat (arany, a cím felett)', type: 'string', description: EMPTY_HINT}),
    defineField({name: 'title', title: 'Cím', type: 'accentHeading'}),
    defineField({name: 'intro', title: 'Bevezető szöveg', type: 'text', rows: 4, description: EMPTY_HINT}),
  ],
})

/** Heading + short text of a call-to-action band (the button stays fixed). */
export const ctaSection = defineType({
  name: 'ctaSection',
  title: 'Felhívás (CTA) sáv',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({name: 'title', title: 'Cím', type: 'string', description: EMPTY_HINT}),
    defineField({name: 'text', title: 'Szöveg', type: 'text', rows: 3, description: EMPTY_HINT}),
  ],
})

/**
 * Search-result title/description for a fixed page. Deliberately not the
 * `seo` object: these pages are always indexable and always in the sitemap,
 * so they get no `noIndex` switch.
 */
export const pageMeta = defineType({
  name: 'pageMeta',
  title: 'Keresőben megjelenő adatok',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      title: 'Cím a keresőben / böngészőfülön',
      type: 'string',
      description: `Kb. 50–60 karakter. ${EMPTY_HINT}`,
      validation: (Rule) => Rule.max(70).warning('70 karakter felett a Google levágja.'),
    }),
    defineField({
      name: 'description',
      title: 'Leírás a keresőben',
      type: 'text',
      rows: 3,
      description: `Kb. 120–160 karakter. ${EMPTY_HINT}`,
      validation: (Rule) => Rule.max(170).warning('170 karakter felett a Google levágja.'),
    }),
  ],
})
