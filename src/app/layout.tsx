import type { Metadata } from "next";
import { Rajdhani, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getBusinessSettings } from "@/lib/sanity/queries/business-settings";
import { SITE_URL } from "@/lib/site-config";
import { buildLocalBusinessJsonLd } from "@/lib/seo";
import "./globals.css";

/**
 * The three-typeface system from docs/design-system.md Section 3, self-hosted
 * via next/font (not a render-blocking Google Fonts <link>, per
 * docs/development-guidelines.md Section 12's font-loading requirement).
 *
 * Each font exposes a CSS variable, referenced from globals.css's @theme
 * block (--font-heading / --font-mono-label / --font-body) rather than
 * applied via inline style props — the exact pattern
 * docs/design-system.md Section 3 recommended against inheriting from the
 * reference app.
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

// Site-wide fallback — every real page overrides title/description via its
// own `metadata`/`generateMetadata` (docs/development-guidelines.md Section
// 10). `metadataBase` is the one place this resolves: every page's relative
// `alternates.canonical`/OG image URL is resolved against it, from the same
// `SITE_URL` `sitemap.ts`/`robots.ts` already use — never a second domain
// source, never localhost.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Royal-Team Autószerviz",
  description: "Prémium autószerviz — Ercsi",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetched here (rather than inside Header) because Header is a Client
  // Component (scroll/menu state) and getBusinessSettings() is server-only.
  const settings = await getBusinessSettings();
  const phoneHref = `tel:${settings.phone.replace(/\s+/g, "")}`;
  const localBusinessJsonLd = buildLocalBusinessJsonLd(
    settings,
    SITE_URL,
    `${SITE_URL}/logos/icon-gradient-light.svg`,
  );

  return (
    <html
      lang="hu"
      className={`${rajdhani.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-screen flex-col font-body antialiased">
        <script
          type="application/ld+json"
          // Server-generated from Sanity BusinessSettings only, no user
          // input — `<` is still escaped so no field value can prematurely
          // close this script tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Header phone={settings.phone} phoneHref={phoneHref} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
