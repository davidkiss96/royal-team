import {defineField, defineType} from 'sanity'

/** docs/content-model.md Section 1 — used only within Homepage.secondaryCtas and AboutPage.cta. A plain label/url pair, deliberately not a full "smart link" reference-resolver type. */
export const ctaLink = defineType({
  name: 'ctaLink',
  title: 'Gomb / hivatkozás',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Felirat',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Cél (belső útvonal vagy teljes URL)',
      description: 'Pl. "/kapcsolat" vagy "https://..."',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'url'},
  },
})
