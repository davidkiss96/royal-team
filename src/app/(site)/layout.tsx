import { SiteShell } from "@/components/site-shell";
import "../globals.css";

/**
 * Layout for every public page — nested under the one root layout
 * (`src/app/layout.tsx`, which holds the document shell and fonts), so the
 * embedded Studio at `/studio` gets none of this: no globals.css, no
 * Header/Footer, no Sanity-fetched JSON-LD.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteShell>{children}</SiteShell>;
}
