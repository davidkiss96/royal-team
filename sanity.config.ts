"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";
import { singletonActions, singletonTypes } from "@/sanity/singleton-types";

/**
 * Sanity Studio for Royal-Team Autószerviz, embedded in this Next.js app at
 * `/studio` (src/app/studio/[[...tool]]/page.tsx, docs/architecture.md
 * Section 6). `"use client"` because the config is passed straight into
 * `<NextStudio>`, a Client Component.
 *
 * Project ID/dataset come from the same NEXT_PUBLIC_ env vars the public
 * site's read client uses (src/lib/sanity/client.ts) — one app, one source,
 * so Studio can never drift onto a different project/dataset than the site.
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "royal-team",
  title: "Royal-Team Autószerviz",
  basePath: "/studio",

  projectId: projectId ?? "",
  dataset,

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
    // Singletons don't get a "create new" template — there's only ever one.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    // Singletons keep only publish/discard/restore — no delete, no duplicate,
    // no unpublish (docs/content-model.md Sections 7–8's "remove the Delete
    // action" recommendation, applied consistently to all three singletons).
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
    // Keeps singletons out of the global "+ Create" menu entirely.
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter((templateItem) => !singletonTypes.has(templateItem.templateId));
      }
      return prev;
    },
  },
});
