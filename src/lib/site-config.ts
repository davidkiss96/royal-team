export interface NavLink {
  label: string;
  href: string;
}

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

/**
 * Placeholder only — the real phone number belongs to the future
 * BusinessSettings singleton (docs/architecture.md Section 6,
 * docs/content-model.md Section 7) and hasn't been confirmed anywhere in
 * the approved docs. Kept in this one place so wiring in the real value
 * later is a one-line change, not a find-and-replace.
 */
export const PHONE_DISPLAY = "+36 1 234 5678";
export const PHONE_HREF = "tel:+3612345678";
