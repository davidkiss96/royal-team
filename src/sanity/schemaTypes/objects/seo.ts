import {defineField, defineType} from 'sanity'

/** docs/content-model.md Section 1 — used on Homepage, AboutPage, Service, Project, BlogPost. Not exposed on BusinessSettings, Author, or Review. */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({name: 'metaTitle', title: 'Meta cím', type: 'string'}),
    defineField({name: 'metaDescription', title: 'Meta leírás', type: 'text', rows: 3}),
    defineField({
      name: 'noIndex',
      title: 'Kihagyás a keresőkből',
      description:
        'Csak akkor kapcsolja be, ha kifejezetten szeretné, hogy ez az oldal ne jelenjen meg a Google-ben. Ez szokatlan — hagyja kikapcsolva, hacsak nem tudja pontosan, miért van rá szüksége.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
