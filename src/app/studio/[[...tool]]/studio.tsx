"use client";

import { Studio as SanityStudio } from "sanity";
import config from "../../../../sanity.config";

/**
 * Renders `sanity`'s own `<Studio>` directly rather than next-sanity's
 * `<NextStudio>`: NextStudio lazy-loads its implementation a second time
 * internally, and that inner lazy import never resolves when the whole
 * component is itself client-only (studio-loader.tsx) — the page stays
 * blank. The wrapper div mirrors NextStudio's own layout styles.
 */
export default function Studio() {
  return (
    <div
      style={{
        height: "100vh",
        maxHeight: "100dvh",
        overscrollBehavior: "none",
        WebkitFontSmoothing: "antialiased",
        overflow: "auto",
      }}
    >
      <SanityStudio config={config} unstable_globalStyles />
    </div>
  );
}
