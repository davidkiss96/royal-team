import type { Metadata } from "next";
import { Rajdhani, DM_Sans, JetBrains_Mono } from "next/font/google";
import { IS_PRODUCTION, SITE_URL } from "@/lib/site-config";

/**
 * The one root layout, shared by the public site (`(site)/layout.tsx`) and
 * the embedded Studio (`studio/`). Deliberately minimal — only what both
 * need: the document shell, font variables and site-wide metadata defaults.
 * Everything site-specific (globals.css, `SiteShell`'s Header/Footer and
 * Sanity-fetched JSON-LD) is added by `(site)/layout.tsx` and `not-found.tsx`,
 * so Studio never gets it. A single root layout (rather than one per route
 * group) is what keeps `not-found.tsx` working as the app-wide 404.
 *
 * The three-typeface system from docs/design-system.md Section 3, self-hosted
 * via next/font (not a render-blocking Google Fonts <link>, per
 * docs/development-guidelines.md Section 12's font-loading requirement).
 *
 * Each font exposes a CSS variable, referenced from globals.css's
 * @theme block (--font-heading / --font-mono-label / --font-body) rather
 * than applied via inline style props — the exact pattern
 * docs/design-system.md Section 3 recommended against inheriting from the
 * reference app. The body's utility classes are inert on `/studio`, which
 * doesn't load globals.css.
 */
const rajdhani = Rajdhani({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Site-wide fallback — every real page overrides title/description (and
// robots — src/lib/seo.ts's buildPageMetadata) via its own `metadata`/
// `generateMetadata` (docs/development-guidelines.md Section 10). Pages that
// don't (not-found.tsx, error.tsx) inherit this `robots` default, so it's
// environment-aware too — never indexable outside a genuine production
// build (`IS_PRODUCTION`, src/lib/site-config.ts). `metadataBase` is the one
// place this resolves: every page's relative `alternates.canonical`/OG image
// URL is resolved against it, from the same `SITE_URL` `sitemap.ts`/
// `robots.ts` already use — never a second domain source.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Royal-Team Autószerviz",
  description: "Prémium autószerviz — Ercsi",
  robots: { index: IS_PRODUCTION, follow: IS_PRODUCTION },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hu"
      className={`${rajdhani.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-screen flex-col font-body antialiased">
        {children}
      </body>
    </html>
  );
}
