import { defineCliConfig } from "sanity/cli";

/**
 * Sanity CLI config (`npx sanity cors add`, `npx sanity dataset ...`, etc.).
 * Not used to build or host Studio — Studio is served by this Next.js app at
 * `/studio` (sanity.config.ts), never via `sanity deploy`.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
