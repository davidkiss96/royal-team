import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Singleton (docs/content-model.md Section 8) — curated homepage
 * marketing/presentation content, kept structurally separate from
 * BusinessSettings. Featured-content curation lives here as reference
 * arrays rather than `isFeatured` flags scattered across Service/Project/
 * Review. Also holds every homepage section's copy (group "Szekciók") —
 * defaults and rendering contract in `src/lib/copy/defaults.ts`.
 */
export const homepage = defineType({
  name: 'homepage',
  title: 'Kezdőlap',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'intro', title: 'Bevezető'},
    {name: 'sections', title: 'Szekciók szövegei'},
    {name: 'featured', title: 'Kiemelt tartalom'},
    {name: 'cta', title: 'Gombok'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'heroLabel',
      title: 'Hero kis felirat (arany, a cím felett)',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero cím',
      type: 'accentHeading',
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
      name: 'heroStats',
      title: 'Hero számok',
      description: 'A hero alján megjelenő számok (pl. „15+ / Év tapasztalat”). 3 elem fér ki jól.',
      type: 'array',
      group: 'hero',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'heroStat',
          fields: [
            defineField({name: 'value', title: 'Szám', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'label', title: 'Felirat', type: 'string', validation: (Rule) => Rule.required()}),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
    }),
    defineField({
      name: 'servicesSection',
      title: 'Szolgáltatások szekció',
      type: 'sectionHeading',
      group: 'sections',
    }),
    defineField({
      name: 'whyUsSection',
      title: '„Miért válasszon minket” szekció',
      type: 'object',
      group: 'sections',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'label', title: 'Kis felirat', type: 'string'}),
        defineField({name: 'title', title: 'Cím', type: 'accentHeading'}),
        defineField({name: 'text', title: 'Szöveg', type: 'text', rows: 4}),
        defineField({
          name: 'features',
          title: 'Előnyök (kártyák)',
          description: 'Az ikonok sorrendben: diagnosztika, pajzs, díj, villám — 4 kártya javasolt.',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'whyUsFeature',
              fields: [
                defineField({name: 'title', title: 'Cím', type: 'string', validation: (Rule) => Rule.required()}),
                defineField({name: 'description', title: 'Leírás', type: 'string', validation: (Rule) => Rule.required()}),
              ],
              preview: {select: {title: 'title', subtitle: 'description'}},
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'workshopSection',
      title: 'Felszerelés szekció',
      type: 'object',
      group: 'sections',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'label', title: 'Kis felirat', type: 'string'}),
        defineField({name: 'title', title: 'Cím', type: 'accentHeading'}),
        defineField({name: 'text', title: 'Szöveg', type: 'text', rows: 4}),
        defineField({
          name: 'equipment',
          title: 'Eszközlista',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
        }),
        defineField({name: 'badgeValue', title: 'Képen lévő jelvény – nagy szöveg', type: 'string'}),
        defineField({name: 'badgeLabel', title: 'Képen lévő jelvény – kis felirat', type: 'string'}),
      ],
    }),
    defineField({
      name: 'reviewsSection',
      title: 'Vélemények szekció',
      type: 'sectionHeading',
      group: 'sections',
    }),
    defineField({
      name: 'projectsSection',
      title: 'Projektek szekció',
      type: 'sectionHeading',
      group: 'sections',
    }),
    defineField({
      name: 'blogSection',
      title: 'Blog szekció',
      type: 'sectionHeading',
      group: 'sections',
    }),
    defineField({
      name: 'ctaSection',
      title: 'Arany felhívás sáv (az oldal alján)',
      type: 'ctaSection',
      group: 'sections',
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
