import {createElement, type ReactNode} from 'react'
import {defineArrayMember, defineType} from 'sanity'

/** How the `gold` decorator looks inside the Studio editor. */
function GoldPreview(props: {children: ReactNode}) {
  return createElement('span', {style: {color: '#C9A84C', fontWeight: 600}}, props.children)
}

/**
 * A heading with gold-accented words (the site's signature "Legújabb
 * *cikkeink.*" look) and manual line breaks: Portable Text limited to plain
 * paragraphs and one "Arany" decorator. Rendered by
 * `src/components/accent-heading.tsx`; code defaults are built with
 * `accent()` (`src/lib/copy/accent.ts`).
 */
export const accentHeading = defineType({
  name: 'accentHeading',
  title: 'Kiemelt cím',
  type: 'array',
  description:
    'Jelölje ki a kiemelendő szavakat, és kattintson az „Arany” gombra. Új sor: Shift + Enter. Üresen hagyva az eredeti szöveg jelenik meg.',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Normál', value: 'normal'}],
      lists: [],
      marks: {
        decorators: [{title: 'Arany', value: 'gold', component: GoldPreview}],
        annotations: [],
      },
    }),
  ],
  validation: (Rule) => Rule.max(1).error('Egy bekezdés legyen; új sorhoz használja a Shift + Enter-t.'),
})
