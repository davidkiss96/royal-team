import {defineField, defineType} from 'sanity'

/** docs/content-model.md Section 1 — used only as `Service.faq`, always edited together with its parent service. */
export const faqItem = defineType({
  name: 'faqItem',
  title: 'GYIK elem',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Kérdés',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Válasz',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'question'},
  },
})
