import type { Metadata, Viewport } from "next";
import { StudioLoader } from "./studio-loader";

/**
 * Embedded Sanity Studio (docs/architecture.md Section 6). The optional
 * catch-all lets Studio's own client-side router own every `/studio/*` path.
 * Fully static: the page is just an empty shell that loads Studio in the
 * browser (see studio-loader.tsx) — all login, content loading and editing
 * happen client-side against Sanity's API, so nothing here needs ISR or
 * per-request rendering.
 */
export const dynamic = "force-static";

// Same values as next-sanity/studio's `metadata`/`viewport` exports, inlined
// so this Server Component never imports next-sanity/studio (and with it the
// `sanity` package) into the server bundle.
export const metadata: Metadata = {
  title: "Royal-Team Autószerviz — Studio",
  referrer: "same-origin",
  robots: "noindex",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioPage() {
  return <StudioLoader />;
}
