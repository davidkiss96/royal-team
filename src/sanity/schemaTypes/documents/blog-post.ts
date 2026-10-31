import {defineArrayMember, defineField, defineType} from 'sanity'
import {uniqueSlugValidator} from '../lib/unique-slug-validator'

/**
 * docs/content-model.md Section 3. Draft/published state is native Sanity,
 * no custom field. `tags` and `relatedServices` are approved additions
 * (Section 0, item 11) — added once the approved Figma reference's
 * `blog-article` design surfaced them as real, repeated design elements
 * (an end-of-article tag list and a related-service sidebar CTA) with no
 * existing field to source them from, the same "extract on proven need"
 * process already used for `Service.tagline`/`highlights`/`process` and
 * `Project.specs`/`results`.
 */
export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blogbejegyzés',
  type: 'document',
  groups: [
    {name: 'content', title: 'Tartalom'},
    {name: 'media', title: 'Média'},
    {name: 'publishing', title: 'Közzététel'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Cím',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL azonosító (slug)',
      description:
        'Ez lesz a cikk webcíme. Élő cikk slugjának megváltoztatása törheti a meglévő linkeket és ronthatja a keresési helyezést — csak akkor változtassa meg, ha biztos benne.',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      group: 'content',
      validation: (Rule) => Rule.required().custom(uniqueSlugValidator),
    }),
    defineField({
      name: 'excerpt',
      title: 'Kivonat',
      description: 'A lista nézetben és a meta leírás alapértékeként jelenik meg.',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Törzsszöveg',
      description: 'Szövegközi képek beszúrhatók — a cikk narratívája lineáris, egy kép egy adott ponthoz kapcsolódik.',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'block'}), defineArrayMember({type: 'imageWithAlt'})],
      validation: (Rule) => Rule.warning('Érdemes kitölteni a nyilvános oldalhoz.'),
    }),
    defineField({
      name: 'tags',
      title: 'Címkék',
      description:
        'Rövid kulcsszavak a cikkhez (pl. "DPF", "Diagnosztika"). Az első címke jelenik meg kiemelt kategóriaként a lista nézetben és a cikk fejlécében; az összes címke megjelenik a cikk végén.',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'relatedServices',
      title: 'Kapcsolódó szolgáltatások',
      description: 'A cikk oldalsávjában megjelenő szolgáltatás-ajánlás.',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
    }),
    defineField({
      name: 'heroImage',
      title: 'Borítókép',
      type: 'imageWithAlt',
      group: 'media',
      validation: (Rule) => Rule.warning('Ajánlott a lista nézethez és a cikk fejlécéhez.'),
    }),
    defineField({
      name: 'author',
      title: 'Szerző',
      type: 'reference',
      to: [{type: 'author'}],
      group: 'publishing',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Megjelenés dátuma',
      description:
        'Az olvasóknak megjelenő dátum. Nem kell ma legyen — állítsa be, hogy mikorra szeretné, hogy megjelentnek tűnjön.',
      type: 'datetime',
      group: 'publishing',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', author: 'author.name', publishedAt: 'publishedAt', media: 'heroImage'},
    prepare({title, author, publishedAt, media}) {
      const dateLabel = publishedAt
        ? new Date(publishedAt).toLocaleDateString('hu-HU')
        : 'Piszkozat'
      return {
        title,
        subtitle: [author, dateLabel].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
