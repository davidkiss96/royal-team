import {defineArrayMember, defineField, defineType, type StringRule} from 'sanity'

const POSTAL_CODE_REGEX = /^\d{4}$/
const HHMM_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/

const addressFields = (title: string) => [
  defineField({
    name: 'addressLine1',
    title: 'Utca, házszám',
    type: 'string',
    validation: (Rule: StringRule) => Rule.required(),
  }),
  defineField({
    name: 'addressLine2',
    title: 'Cím kiegészítés',
    type: 'string',
  }),
  defineField({
    name: 'city',
    title: 'Település',
    type: 'string',
    validation: (Rule: StringRule) => Rule.required(),
  }),
  defineField({
    name: 'postalCode',
    title: 'Irányítószám',
    type: 'string',
    validation: (Rule: StringRule) =>
      Rule.required()
        .regex(POSTAL_CODE_REGEX)
        .error(`${title}: 4 számjegyű irányítószámot adjon meg.`),
  }),
]

/**
 * Singleton (docs/content-model.md Section 7) — operational/business facts
 * only. Extends the documented shape with `registeredOffice`,
 * `legalTaxNumber` and `managingDirector` — the same legal-data extension
 * already approved and implemented in the mock
 * (src/lib/mock/business-settings.ts) during the legal-pages step. Each
 * value is stored in exactly one field; the frontend derives `tel:`/
 * `https://` links and display formatting, so nothing is duplicated here.
 *
 * `address` = the workshop/service location (where customers visit).
 * `registeredOffice` = the company's official legal address ("székhely").
 * These are deliberately separate fields/objects so they can never be
 * confused with each other in the Studio UI — see each field's description.
 */
export const businessSettings = defineType({
  name: 'businessSettings',
  title: 'Üzleti adatok',
  type: 'document',
  groups: [
    {name: 'contact', title: 'Kapcsolat és helyszín'},
    {name: 'hours', title: 'Nyitvatartás'},
    {name: 'branding', title: 'Márka'},
    {name: 'legal', title: 'Jogi adatok'},
    {name: 'social', title: 'Közösségi média'},
  ],
  fields: [
    defineField({
      name: 'businessName',
      title: 'Cégnév (megjelenő)',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Telefonszám',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'E-mail cím',
      description: 'Ez a cím kapja a kapcsolatfelvételi űrlap üzeneteit is.',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'website',
      title: 'Weboldal (domain)',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Telephely / szolgáltatás címe (műhely)',
      description:
        'Ez a cím jelenik meg a Kapcsolat oldalon és a térképen — ahol a vevők ténylegesen felkeresik a szervizt.',
      type: 'object',
      group: 'contact',
      fields: addressFields('Telephely'),
    }),
    defineField({
      name: 'registeredOffice',
      title: 'Székhely (cégjegyzék szerint)',
      description:
        'A cég hivatalos, cégjegyzékben bejegyzett székhelye — ez NEM a műhely címe. Ne keverje össze a fenti telephellyel.',
      type: 'object',
      group: 'contact',
      fields: addressFields('Székhely'),
    }),
    defineField({
      name: 'openingHours',
      title: 'Nyitvatartás',
      type: 'array',
      group: 'hours',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'openingHoursRow',
          fields: [
            defineField({
              name: 'day',
              title: 'Nap',
              type: 'string',
              options: {
                list: [
                  {title: 'Hétfő', value: 'mon'},
                  {title: 'Kedd', value: 'tue'},
                  {title: 'Szerda', value: 'wed'},
                  {title: 'Csütörtök', value: 'thu'},
                  {title: 'Péntek', value: 'fri'},
                  {title: 'Szombat', value: 'sat'},
                  {title: 'Vasárnap', value: 'sun'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'closed',
              title: 'Zárva',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'opens',
              title: 'Nyitás (ÓÓ:PP)',
              type: 'string',
              hidden: ({parent}) => Boolean((parent as {closed?: boolean} | undefined)?.closed),
              validation: (Rule) =>
                Rule.regex(HHMM_REGEX).error('Formátum: ÓÓ:PP, például 08:00.'),
            }),
            defineField({
              name: 'closes',
              title: 'Zárás (ÓÓ:PP)',
              type: 'string',
              hidden: ({parent}) => Boolean((parent as {closed?: boolean} | undefined)?.closed),
              validation: (Rule) =>
                Rule.regex(HHMM_REGEX).error('Formátum: ÓÓ:PP, például 18:00.'),
            }),
          ],
          preview: {
            select: {day: 'day', opens: 'opens', closes: 'closes', closed: 'closed'},
            prepare({day, opens, closes, closed}) {
              return {
                title: day,
                subtitle: closed ? 'Zárva' : `${opens ?? '—'}–${closes ?? '—'}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Logó',
      type: 'imageWithAlt',
      group: 'branding',
    }),
    defineField({
      name: 'brandColorPrimary',
      title: 'Elsődleges márkaszín (hex)',
      type: 'string',
      group: 'branding',
    }),
    defineField({
      name: 'brandColorSecondary',
      title: 'Másodlagos márkaszín (hex)',
      type: 'string',
      group: 'branding',
    }),
    defineField({
      name: 'legalCompanyName',
      title: 'Hivatalos cégnév',
      type: 'string',
      group: 'legal',
    }),
    defineField({
      name: 'legalRegistrationNumber',
      title: 'Cégjegyzékszám',
      type: 'string',
      group: 'legal',
    }),
    defineField({
      name: 'legalTaxNumber',
      title: 'Adószám',
      type: 'string',
      group: 'legal',
    }),
    defineField({
      name: 'managingDirector',
      title: 'Ügyvezető',
      type: 'string',
      group: 'legal',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Közösségi média linkek',
      type: 'array',
      group: 'social',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'Egyéb', value: 'other'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {select: {title: 'platform', subtitle: 'url'}},
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Üzleti adatok'}
    },
  },
})
