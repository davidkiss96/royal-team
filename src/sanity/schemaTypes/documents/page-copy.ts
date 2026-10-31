import {defineField, defineType, type FieldDefinition} from 'sanity'

/**
 * One singleton per fixed page (`_id` = type name) holding that page's
 * header and closing-band copy plus its search-result title/description.
 * Defaults and rendering contract: `src/lib/copy/defaults.ts`.
 */
function definePageCopy(name: string, title: string, extraFields: FieldDefinition[] = []) {
  return defineType({
    name,
    title,
    type: 'document',
    fields: [
      defineField({name: 'header', title: 'Oldal fejléce', type: 'pageHeader'}),
      ...extraFields,
      defineField({name: 'meta', title: 'Keresőben megjelenő adatok', type: 'pageMeta'}),
    ],
    preview: {prepare: () => ({title})},
  })
}

export const servicesPage = definePageCopy('servicesPage', 'Szolgáltatások oldal', [
  defineField({
    name: 'priceListCta',
    title: 'Árlista-ajánló sáv',
    description: 'Csak akkor látszik, ha az Árlista oldal be van kapcsolva (Üzleti adatok → Weboldal).',
    type: 'ctaSection',
  }),
])

export const blogPage = definePageCopy('blogPage', 'Blog oldal')

export const contactPage = definePageCopy('contactPage', 'Kapcsolat oldal')

export const priceListPage = definePageCopy('priceListPage', 'Árlista oldal', [
  defineField({name: 'footnote', title: 'Lábjegyzet az árak alatt', type: 'text', rows: 3}),
  defineField({name: 'cta', title: 'Arany felhívás sáv', type: 'ctaSection'}),
])

export const projectsPage = definePageCopy('projectsPage', 'Projektek oldal', [
  defineField({name: 'cta', title: 'Záró felhívás sáv', type: 'ctaSection'}),
])

/** Copy shared by every page. */
export const siteCopy = defineType({
  name: 'siteCopy',
  title: 'Közös elemek',
  type: 'document',
  fields: [
    defineField({
      name: 'footerTagline',
      title: 'Lábléc bemutatkozó szövege',
      type: 'text',
      rows: 4,
      description: 'Üresen hagyva az eredeti szöveg jelenik meg.',
    }),
    defineField({
      name: 'notFound',
      title: '„Az oldal nem található” (404) oldal',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'label', title: 'Kis felirat', type: 'string'}),
        defineField({name: 'title', title: 'Cím', type: 'string'}),
        defineField({name: 'text', title: 'Szöveg', type: 'text', rows: 3}),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Közös elemek'})},
})
