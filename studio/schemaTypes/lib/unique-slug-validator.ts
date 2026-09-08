import type {ValidationContext} from 'sanity'

/**
 * Shared slug-uniqueness check (docs/content-model.md Section 11: "Slug
 * Stability", applies to every slugged type — service, project, blogPost,
 * author). Sanity's `slug` field does not enforce uniqueness on its own;
 * this is the standard Sanity recipe for scoping uniqueness to the same
 * document type, ignoring the current document's own draft/published pair.
 *
 * Typed against the general `ValidationContext` (not the more specific
 * `SlugValidationContext`, which only `options.isUnique` receives) since
 * this runs as a plain `Rule.custom()` validator.
 */
export async function uniqueSlugValidator(
  slug: {current?: string} | undefined,
  context: ValidationContext,
) {
  if (!slug?.current) return true

  const {document, getClient} = context
  if (!document) return true

  const client = getClient({apiVersion: '2024-01-01'})
  const id = document._id.replace(/^drafts\./, '')
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug: slug.current,
    type: document._type,
  }
  const query = `*[_type == $type && slug.current == $slug && !(_id in [$draft, $published])][0]._id`
  const existingId = await client.fetch(query, params)

  return existingId ? 'Ez a slug már foglalt — válasszon másikat.' : true
}
