import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Singleton (docs/content-model.md Section 8) — curated homepage
 * marketing/presentation content, kept structurally separate from
 * BusinessSettings. Featured-content curation lives here as reference
 * arrays rather than `isFeatured` flags scattered across Service/Project/
 * Review. Reproduces exactly the approved field set — no new fields added.
 */
export const homepage = defineType({
  name: 'homepage',
  title: 'Kezdőlap',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'intro', title: 'Bevezető'},
    {name: 'featured', title: 'Kiemelt tartalom'},
    {name: 'cta', title: 'Gombok'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero cím',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero alcím',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero kép',
      type: 'imageWithAlt',
      group: 'hero',
    }),
    defineField({
      name: 'introText',
      title: 'Bevezető szöveg',
      description: 'Rövid pozicionáló szöveg a hero alatt.',
      type: 'text',
      rows: 4,
      group: 'intro',
    }),
    defineField({
      name: 'featuredServices',
      title: 'Kiemelt szolgáltatások',
      description: 'A kezdőlapon megjelenő, kézzel válogatott és sorrendezett szolgáltatások.',
      type: 'array',
      group: 'featured',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Kiemelt projektek',
      type: 'array',
      group: 'featured',
      of: [defineArrayMember({type: 'reference', to: [{type: 'project'}]})],
    }),
    defineField({
      name: 'featuredReviews',
      title: 'Kiemelt vélemények',
      type: 'array',
      group: 'featured',
      of: [defineArrayMember({type: 'reference', to: [{type: 'review'}]})],
    }),
    defineField({
      name: 'secondaryCtas',
      title: 'További gombok',
      description: 'Legfeljebb 2–3 fő gomb javasolt — több gomb hígítja az üzenetet.',
      type: 'array',
      group: 'cta',
      of: [defineArrayMember({type: 'ctaLink'})],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Kezdőlap'}
    },
  },
})
