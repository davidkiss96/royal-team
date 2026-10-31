import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Singleton (docs/content-model.md Section 9), mirroring Homepage's
 * pattern. `stats` reuses the same label/value shape as `Project.specs`
 * (defined inline here rather than as a shared object type — per
 * content-model.md's own note, promoting a two-occurrence shape to a
 * formal shared type would be premature abstraction).
 */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Rólunk oldal',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'story', title: 'Történet'},
    {name: 'philosophy', title: 'Filozófia'},
    {name: 'stats', title: 'Statisztikák'},
    {name: 'gallery', title: 'Galéria'},
    {name: 'cta', title: 'Gomb'},
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
      name: 'ownerStory',
      title: 'A tulajdonos / cég története',
      type: 'array',
      group: 'story',
      of: [defineArrayMember({type: 'block'})],
      validation: (Rule) => Rule.warning('Érdemes kitölteni a nyilvános oldalhoz.'),
    }),
    defineField({
      name: 'philosophyValues',
      title: 'Értékek / filozófia',
      type: 'array',
      group: 'philosophy',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'philosophyValue',
          fields: [
            defineField({
              name: 'icon',
              title: 'Ikon',
              type: 'string',
              options: {
                list: [
                  {title: 'Precizitás', value: 'precision'},
                  {title: 'Megbízhatóság', value: 'reliability'},
                  {title: 'Folyamatos fejlődés', value: 'growth'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Cím',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Leírás',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'icon'}},
        }),
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Statisztikák',
      description:
        'Pl. "15+ / Év tapasztalat" — ugyanaz a címke/érték szerkezet, mint a Projekt műszaki adatainál.',
      type: 'array',
      group: 'stats',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({
              name: 'label',
              title: 'Címke',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Érték',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
    }),
    defineField({
      name: 'photoGallery',
      title: 'Fotógaléria',
      type: 'array',
      group: 'gallery',
      of: [defineArrayMember({type: 'imageWithAlt'})],
    }),
    defineField({
      name: 'cta',
      title: 'Záró gomb',
      type: 'ctaLink',
      group: 'cta',
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
      return {title: 'Rólunk oldal'}
    },
  },
})
