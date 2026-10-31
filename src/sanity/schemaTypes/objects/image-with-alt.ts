import {defineField, defineType} from 'sanity'

/**
 * The reusable image field (docs/content-model.md Section 1) — extends
 * Sanity's native `image` type (asset + hotspot) with the fields the
 * content model requires alongside it. No custom media document exists;
 * every content image uses this type directly.
 */
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Kép',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternatív szöveg',
      description:
        'Írja le, mi látható a képen — képernyőolvasók és keresőmotorok számára. Ne a fájlnevet adja meg, hanem valódi leírást (pl. "DPF szűrő tisztítás előtt, erősen kormos").',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Képaláírás',
      type: 'string',
    }),
  ],
})
