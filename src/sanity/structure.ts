import type {StructureResolver} from 'sanity/structure'
import {singletonTypes} from './singleton-types'

/**
 * Pins the three singletons (Kezdőlap / Üzleti adatok / Rólunk oldal) as
 * single, directly-editable entries at the top of the desk — no "create
 * new" list, no risk of an editor accidentally creating a second one — then
 * lists every other (non-singleton) document type below a divider.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Tartalom')
    .items([
      S.listItem()
        .title('Kezdőlap')
        .id('homepage')
        .child(S.document().schemaType('homepage').documentId('homepage')),
      S.listItem()
        .title('Üzleti adatok')
        .id('businessSettings')
        .child(S.document().schemaType('businessSettings').documentId('businessSettings')),
      S.listItem()
        .title('Rólunk oldal')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !singletonTypes.has(listItem.getId() ?? ''),
      ),
    ])
