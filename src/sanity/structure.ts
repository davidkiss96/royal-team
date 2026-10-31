import type {StructureResolver} from 'sanity/structure'
import {singletonTypes} from './singleton-types'

/**
 * Pins the singletons as single, directly-editable entries at the top of
 * the desk — no "create new" list, no risk of an editor accidentally
 * creating a second one: business settings, then one entry per page in
 * site order, then the shared copy. Every other (non-singleton) document
 * type is listed below a divider.
 */
const singleton = (S: Parameters<StructureResolver>[0], id: string, title: string) =>
  S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Tartalom')
    .items([
      singleton(S, 'businessSettings', 'Üzleti adatok'),
      S.divider(),
      singleton(S, 'homepage', 'Kezdőlap'),
      singleton(S, 'servicesPage', 'Szolgáltatások oldal'),
      singleton(S, 'priceListPage', 'Árlista oldal'),
      singleton(S, 'projectsPage', 'Projektek oldal'),
      singleton(S, 'aboutPage', 'Rólunk oldal'),
      singleton(S, 'blogPage', 'Blog oldal'),
      singleton(S, 'contactPage', 'Kapcsolat oldal'),
      singleton(S, 'siteCopy', 'Közös elemek (lábléc, 404)'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !singletonTypes.has(listItem.getId() ?? ''),
      ),
    ])
