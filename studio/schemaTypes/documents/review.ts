import {defineField, defineType} from 'sanity'

/**
 * docs/content-model.md Section 5, with one deliberate extension:
 * `isActive` and `displayOrder`, explicitly requested for this schema step
 * (mirroring the same hide-without-delete pattern already established for
 * `Service`/`PriceCategory`). The originally-documented model relied on
 * native draft/publish alone plus `Homepage.featuredReviews` for
 * curation — that homepage-curation mechanism is unchanged and still the
 * only way a review reaches the homepage. `isActive`/`displayOrder` instead
 * serve a full, standalone reviews listing (`docs/product.md` Section 8:
 * "Reviews can be a dedicated page and/or a surfaced section"), where a
 * review needs to be temporarily hidden or manually ordered independent of
 * homepage curation. Flagged here as a recorded content-model addition, not
 * a silent change — see the final implementation report for this step.
 */
export const review = defineType({
  name: 'review',
  title: 'Vélemény',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Értékelő neve',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Értékelés (1–5)',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1).max(5),
    }),
    defineField({
      name: 'text',
      title: 'Szöveg',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reviewDate',
      title: 'Értékelés dátuma',
      type: 'date',
    }),
    defineField({
      name: 'source',
      title: 'Forrás',
      type: 'string',
      options: {
        list: [
          {title: 'Google', value: 'google'},
          {title: 'Személyesen', value: 'in_person'},
          {title: 'Telefon', value: 'phone'},
          {title: 'E-mail', value: 'email'},
          {title: 'Egyéb', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sourceDetail',
      title: 'Forrás kiegészítés',
      description: 'Szabad szöveg, pl. az érintett jármű típusa.',
      type: 'string',
    }),
    defineField({
      name: 'isActive',
      title: 'Aktív (megjelenik a weboldalon)',
      description:
        'Kapcsolja ki, ha ideiglenesen el szeretné rejteni ezt a véleményt törlés nélkül. Bármikor visszakapcsolható.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Megjelenítési sorrend',
      description: 'Kisebb szám előrébb jelenik meg egy teljes vélemény-listázásban.',
      type: 'number',
    }),
  ],
  preview: {
    select: {title: 'authorName', rating: 'rating', source: 'source', isActive: 'isActive'},
    prepare({title, rating, source, isActive}) {
      const stars = '★'.repeat(typeof rating === 'number' ? rating : 0)
      return {
        title,
        subtitle: `${stars} · ${source}${isActive === false ? ' · Rejtve' : ''}`,
      }
    },
  },
})
