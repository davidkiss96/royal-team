import {defineField, defineType} from 'sanity'

interface PriceItemParent {
  priceType?: 'fixed' | 'from' | 'quote'
}

/**
 * The embedded price-line-item object (docs/content-model.md Section 10) —
 * used only within `priceCategory.items`, never a standalone document.
 *
 * `amount` is conditionally required: mandatory for `fixed`/`from`, not
 * applicable for `quote` (a quote-only item has no number to validate).
 * The frontend derives the display string ("12 900 Ft" / "35 000 Ft-tól" /
 * "Ingyenes") from `priceType` + `amount` — editors never hand-type a
 * formatted price string.
 */
export const priceItem = defineType({
  name: 'priceItem',
  title: 'Tétel',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Megnevezés',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'note',
      title: 'Megjegyzés',
      description: 'Rövid, egysoros kiegészítés, pl. "Személyautó, szűrőmérettől függően".',
      type: 'string',
    }),
    defineField({
      name: 'priceType',
      title: 'Ártípus',
      type: 'string',
      options: {
        list: [
          {title: 'Fix ár', value: 'fixed'},
          {title: '"-tól" ár', value: 'from'},
          {title: 'Egyedi árajánlat (nincs összeg)', value: 'quote'},
        ],
        layout: 'radio',
      },
      initialValue: 'from',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amount',
      title: 'Összeg (Ft)',
      type: 'number',
      hidden: ({parent}: {parent?: PriceItemParent}) => parent?.priceType === 'quote',
      validation: (Rule) =>
        Rule.custom((amount: number | undefined, context) => {
          const priceType = (context.parent as PriceItemParent | undefined)?.priceType
          if (priceType === 'fixed' || priceType === 'from') {
            if (amount === undefined || amount === null) {
              return 'Fix vagy "-tól" ár esetén az összeg megadása kötelező.'
            }
            if (!Number.isInteger(amount) || amount <= 0) {
              return 'Az összegnek pozitív egész számnak kell lennie.'
            }
          }
          return true
        }),
    }),
    defineField({
      name: 'isActive',
      title: 'Aktív (megjelenik az árlistán)',
      description: 'Kapcsolja ki, ha ideiglenesen el szeretné rejteni ezt a tételt törlés nélkül.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'name', priceType: 'priceType', amount: 'amount', isActive: 'isActive'},
    prepare({
      title,
      priceType,
      amount,
      isActive,
    }: {
      title?: string
      priceType?: string
      amount?: number
      isActive?: boolean
    }) {
      const priceLabel =
        priceType === 'quote' ? 'Ingyenes (árajánlat)' : amount ? `${amount} Ft` : '— nincs összeg —'
      return {
        title,
        subtitle: `${priceLabel}${isActive === false ? ' · Rejtve' : ''}`,
      }
    },
  },
})
