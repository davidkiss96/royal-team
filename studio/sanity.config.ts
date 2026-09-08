import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {singletonActions, singletonTypes} from './singleton-types'

/**
 * Local Sanity Studio for Royal-Team Autószerviz (docs/architecture.md
 * Section 6). Deliberately a separate, standalone app rather than an
 * embedded `/studio` route in the Next.js project — the embedded-vs-
 * separate deployment topology is still an explicitly open decision there;
 * this keeps that decision open rather than assuming an answer.
 *
 * Project ID/dataset come from env vars only (never hardcoded) — see
 * studio/.env.example. Not deployed yet (`sanity deploy`); this step is
 * local-only, per this implementation step's scope.
 */
const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'royal-team',
  title: 'Royal-Team Autószerviz',

  projectId: projectId ?? '',
  dataset,

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // Singletons don't get a "create new" template — there's only ever one.
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    // Singletons keep only publish/discard/restore — no delete, no duplicate,
    // no unpublish (docs/content-model.md Sections 7–8's "remove the Delete
    // action" recommendation, applied consistently to all three singletons).
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({action}) => action && singletonActions.has(action))
        : input,
    // Keeps singletons out of the global "+ Create" menu entirely.
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((templateItem) => !singletonTypes.has(templateItem.templateId))
      }
      return prev
    },
  },
})
