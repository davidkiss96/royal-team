export interface NavLink {
  label: string;
  href: string;
}

/**
 * The single canonical production origin — read by `robots.ts` and
 * `sitemap.ts` so both agree on one absolute URL for every route, never a
 * second hardcoded domain and never `localhost` in generated output.
 */
export const SITE_URL = "https://royalteamszerviz.hu";

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
