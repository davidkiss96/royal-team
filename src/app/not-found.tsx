import { NotFoundContent } from "@/components/not-found-content";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

/**
 * Root App Router 404 (docs/development-guidelines.md Section on
 * `not-found.tsx`) — handles unmatched URLs. Renders inside the minimal
 * root layout only — outside the `(site)` group's layout — so it wraps
 * itself in the same `SiteShell` (Header/Footer) and globals.css that
 * layout uses. No data fetching of its own (no Sanity content applies to a
 * page that doesn't exist).
 *
 * `notFound()` calls from public pages are caught by `(site)/not-found.tsx`
 * instead — without that closer boundary this file was used for them too,
 * nesting a second `SiteShell` (Header/Footer) inside the `(site)` layout's.
 * Those 404s are client-rendered by Next 16 from an empty "recovery shell";
 * see the note on the logo in `header.tsx` for why they used to stay blank.
 */
export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}
