import { NotFoundContent } from "@/components/not-found-content";

/**
 * 404 for `notFound()` calls from public pages (unknown `[slug]`s, routes
 * switched off in `src/lib/features.ts`). Already inside the `(site)`
 * layout's `SiteShell`, so it renders the bare content (the root
 * `app/not-found.tsx` would nest a second `SiteShell`).
 */
export default function SiteNotFound() {
  return <NotFoundContent />;
}
