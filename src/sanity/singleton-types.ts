/**
 * The singleton document types (docs/content-model.md Sections 7–9, plus
 * the per-page copy documents in `schemaTypes/documents/page-copy.ts`).
 * Used by sanity.config.ts to restrict their document actions/creation and
 * by structure.ts to pin each to a single, fixed document ID in the desk.
 */
export const singletonTypes = new Set([
  'homepage',
  'businessSettings',
  'aboutPage',
  'servicesPage',
  'blogPage',
  'contactPage',
  'priceListPage',
  'projectsPage',
  'siteCopy',
])

/**
 * Allow-list of actions singletons keep. Everything else (create, delete,
 * duplicate, unpublish) is removed — content-model.md explicitly
 * recommends removing "Delete" for BusinessSettings/Homepage since there's
 * no legitimate reason a non-technical editor should delete the one
 * business-settings/homepage document; the same reasoning is applied
 * consistently to AboutPage here.
 */
export const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
