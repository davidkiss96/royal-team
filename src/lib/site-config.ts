export interface NavLink {
  label: string;
  href: string;
}

const PRODUCTION_SITE_URL = "https://royalteamszerviz.hu";

/**
 * Explicit, never-guessed production flag. Deliberately not inferred from
 * hostname/request data (a preview can sit behind a custom domain, a proxy,
 * or plain `localhost` — none of that reliably proves "this is production").
 * Cloudflare's **Production** environment is the only place this should be
 * set to `"production"` (Pages/Workers dashboard → Production environment
 * variables, never the Preview environment). Unset — the default for local
 * dev and for Preview unless someone deliberately flips it — is always
 * treated as non-production, so accidental indexing requires an explicit
 * opt-in, not an explicit opt-out.
 */
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_SITE_ENV === "production";

/**
 * The single absolute origin every SEO surface reads from — `robots.ts`,
 * `sitemap.ts`, the root layout's `metadataBase` (which every page's
 * relative `alternates.canonical`/OG/Twitter URL in `src/lib/seo.ts`
 * resolves against). Production always uses the real domain, never
 * overridable by an env var. Every other environment uses
 * `NEXT_PUBLIC_SITE_URL` if the deployment set one (e.g. a stable Cloudflare
 * preview URL — set per-preview in the Cloudflare dashboard, never
 * hardcoded here), or falls back to `localhost:3000` — never the production
 * domain, so a preview or local build can never silently claim to *be*
 * royalteamszerviz.hu.
 */
export const SITE_URL = IS_PRODUCTION
  ? PRODUCTION_SITE_URL
  : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Primary navigation, matching the confirmed Hungarian route list
 * (README.md, docs/design-system.md Section 8) and the reference app's
 * NAV_LINKS/FOOTER_NAV arrays, which are identical lists.
 */
export const NAV_LINKS: NavLink[] = [
  { label: "Főoldal", href: "/" },
  { label: "Szolgáltatások", href: "/szolgaltatasok" },
  { label: "Árlista", href: "/arlista" },
  { label: "Projektek", href: "/projektek" },
  { label: "Rólunk", href: "/rolunk" },
  { label: "Blog", href: "/blog" },
  { label: "Kapcsolat", href: "/kapcsolat" },
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: "Impresszum", href: "/impresszum" },
  { label: "Adatvédelem", href: "/adatvedelem" },
];
