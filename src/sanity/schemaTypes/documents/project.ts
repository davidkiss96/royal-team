import {defineArrayMember, defineField, defineType} from 'sanity'
import {uniqueSlugValidator} from '../lib/unique-slug-validator'

/**
 * docs/content-model.md Section 4. No `isActive` field — a project's
 * existence/publication state (native Sanity draft/publish) is the only
 * visibility mechanism, per the documented decision that a project doesn't
 * have Service's "temporarily pause" operational need.
 *
 * `body` supports inline images alongside standard Portable Text blocks —
 * the "work performed" numbered list and the customer pull-quote both
 * render using Portable Text's own standard list/blockquote block styles,
 * not dedicated custom block types (docs/content-model.md Section 0, item 9).
 */
export const project = defineType({
  name: 'project',
  title: 'Projekt',
  type: 'document',
  groups: [
    {name: 'content', title: 'Tartalom'},
    {name: 'media', title: 'Média'},
    {name: 'details', title: 'Részletek'},
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
      name: 'summary',
      title: 'Összefoglaló',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Törzsszöveg',
      description:
        'A projekt teljes története — kiindulási állapot, célok, elvégzett munka, tesztelés, eredmények. Használja a Portable Text beépített számozott lista és idézetblokk formázását a munkafázisokhoz, illetve az ügyfél-visszajelzéshez.',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'block'}), defineArrayMember({type: 'imageWithAlt'})],
      validation: (Rule) => Rule.warning('Érdemes kitölteni a nyilvános oldalhoz.'),
    }),
    defineField({
      name: 'specs',
      title: 'Műszaki adatok',
      description: 'Pl. "Motor / 4.0L V8 Biturbo" — szabadon bővíthető lista.',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'projectSpec',
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
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({
      name: 'results',
      title: 'Eredmények',
      description: 'A projekt kiemelt eredmény-mutatói, nagy számokkal megjelenítve. Opcionális.',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'projectResult',
          fields: [
            defineField({
              name: 'value',
              title: 'Érték (nagy szám)',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Címke',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Leírás',
              type: 'string',
            }),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
    }),
    defineField({
      name: 'projectDate',
      title: 'Projekt dátuma',
      description: 'A tényleges munka időpontja — nem a szerkesztői/publikálási dátum.',
      type: 'date',
      group: 'details',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero kép',
      type: 'imageWithAlt',
      group: 'media',
      validation: (Rule) => Rule.warning('Ajánlott a projekt oldalhoz.'),
    }),
    defineField({
      name: 'gallery',
      title: 'Galéria',
      description: 'Kiegészítő fotók a törzsszövegben szereplő képek mellett.',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({type: 'imageWithAlt'})],
    }),
    defineField({
      name: 'relatedServices',
      title: 'Kapcsolódó szolgáltatások',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
    }),
    defineField({
      name: 'displayOrder',
      title: 'Megjelenítési sorrend',
      description: 'Kisebb szám előrébb jelenik meg a projektek listájában.',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', media: 'heroImage', projectDate: 'projectDate'},
    prepare({title, media, projectDate}) {
      return {
        title,
        subtitle: projectDate ? String(projectDate) : undefined,
        media,
      }
    },
  },
})
