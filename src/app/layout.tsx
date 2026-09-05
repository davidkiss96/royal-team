import type { Metadata } from "next";
import { Rajdhani, DM_Sans, JetBrains_Mono } from "next/font/google";
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

// Placeholder metadata — real per-page metadata is generated from Sanity
// content per page (docs/development-guidelines.md Section 10), once content
// fetching exists. This is only the site-wide fallback.
export const metadata: Metadata = {
  title: "Royal-Team Autószerviz",
  description: "Prémium autószerviz — Ercsi",
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
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
