import {defineArrayMember, defineField, defineType} from 'sanity'
import {uniqueSlugValidator} from '../lib/unique-slug-validator'

/** docs/content-model.md Section 2. */
export const service = defineType({
  name: 'service',
  title: 'Szolgáltatás',
  type: 'document',
  groups: [
    {name: 'content', title: 'Tartalom'},
    {name: 'media', title: 'Média'},
    {name: 'display', title: 'Megjelenítés'},
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
        'Ez lesz az oldal webcíme. Élő oldal slugjának megváltoztatása törheti a meglévő linkeket és ronthatja a keresési helyezést — csak akkor változtassa meg, ha biztos benne.',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      group: 'content',
      validation: (Rule) => Rule.required().custom(uniqueSlugValidator),
    }),
    defineField({
      name: 'tagline',
      title: 'Alcím (rövid)',
      description: 'Rövid, specifikusabb alcím a cím alatt, pl. "Részecskeszűrő regenerálás".',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'summary',
      title: 'Összefoglaló',
      description: 'A lista nézetekben és a meta leírás alapértékeként jelenik meg.',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Törzsszöveg',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'block'})],
      validation: (Rule) => Rule.warning('Érdemes kitölteni a nyilvános oldalhoz.'),
    }),
    defineField({
      name: 'highlights',
      title: 'Főbb előnyök',
      description: 'Rövid, önálló kifejezések listája. 3–4 elem javasolt.',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'process',
      title: 'Munkafolyamat lépései',
      description: 'A "hogyan dolgozunk" számozott lépései. A sorszámot a lista sorrendje adja.',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'processStep',
          fields: [
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
              rows: 2,
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),
    defineField({
      name: 'faq',
      title: 'Gyakori kérdések',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'faqItem'})],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero kép',
      type: 'imageWithAlt',
      group: 'media',
      validation: (Rule) => Rule.warning('Ajánlott a szolgáltatás oldalhoz.'),
    }),
    defineField({
      name: 'gallery',
      title: 'Galéria',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({type: 'imageWithAlt'})],
    }),
    defineField({
      name: 'isActive',
      title: 'Aktív (megjelenik a weboldalon)',
      description:
        'Kapcsolja ki, ha ideiglenesen el szeretné távolítani ezt a szolgáltatást a weboldalról törlés nélkül. Bármikor visszakapcsolható.',
      type: 'boolean',
      initialValue: true,
      group: 'display',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Megjelenítési sorrend',
      description: 'Kisebb szám előrébb jelenik meg a szolgáltatások listájában.',
      type: 'number',
      group: 'display',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'summary', media: 'heroImage', isActive: 'isActive'},
    prepare({title, subtitle, media, isActive}) {
      return {
        title,
        subtitle: `${isActive === false ? 'Rejtve · ' : ''}${subtitle ?? ''}`,
        media,
      }
    },
  },
})
