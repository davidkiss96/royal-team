import {defineField, defineType} from 'sanity'
import {uniqueSlugValidator} from '../lib/unique-slug-validator'

/**
 * docs/content-model.md Section 6 — deliberately minimal, decoupled from
 * Sanity project membership/authentication. `BlogPost`/`Project` reference
 * this document; author details are never embedded directly into them.
 */
export const author = defineType({
  name: 'author',
  title: 'Szerző',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Név',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL azonosító (slug)',
      description: 'Nincs önálló szerzői oldal a weboldalon ma — ez a mező egy jövőbeli oldalhoz van fenntartva.',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.custom(uniqueSlugValidator),
    }),
    defineField({
      name: 'photo',
      title: 'Fénykép',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'bio',
      title: 'Bemutatkozás',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'role',
      title: 'Beosztás',
      description: 'Pl. "Tulajdonos & vezető szerelő".',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo'},
  },
})
