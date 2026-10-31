import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * docs/content-model.md Section 10 — fully independent of `Service`, per
 * the explicit approved decision. No currency field (single-market HUF),
 * no formatted price string (derived by the frontend from
 * `priceType`/`amount`), no `PriceList` wrapper document.
 */
export const priceCategory = defineType({
  name: 'priceCategory',
  title: 'Árkategória',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Cím',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Megjelenítési sorrend',
      description: 'Kisebb szám előrébb jelenik meg az árlistán.',
      type: 'number',
    }),
    defineField({
      name: 'isActive',
      title: 'Aktív (megjelenik az árlistán)',
      description:
        'Kapcsolja ki, ha ideiglenesen el szeretné rejteni ezt a kategóriát törlés nélkül.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'items',
      title: 'Tételek',
      type: 'array',
      of: [defineArrayMember({type: 'priceItem'})],
      validation: (Rule) => Rule.required().min(1).error('Legalább egy tétel megadása kötelező.'),
    }),
  ],
  preview: {
    select: {title: 'title', items: 'items', isActive: 'isActive'},
    prepare({title, items, isActive}) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title,
        subtitle: `${count} tétel${isActive === false ? ' · Rejtve' : ''}`,
      }
    },
  },
})
