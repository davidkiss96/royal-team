/**
 * The three singleton document types (docs/content-model.md Sections 7–9).
 * Used by sanity.config.ts to restrict their document actions/creation and
 * by structure.ts to pin each to a single, fixed document ID in the desk.
 */
export const singletonTypes = new Set(['homepage', 'businessSettings', 'aboutPage'])

/**
 * Allow-list of actions singletons keep. Everything else (create, delete,
 * duplicate, unpublish) is removed — content-model.md explicitly
 * recommends removing "Delete" for BusinessSettings/Homepage since there's
 * no legitimate reason a non-technical editor should delete the one
 * business-settings/homepage document; the same reasoning is applied
 * consistently to AboutPage here.
 */
export const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
