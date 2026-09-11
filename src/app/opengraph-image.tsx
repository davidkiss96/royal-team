import { ImageResponse } from "next/og";

export const alt = "Royal-Team Autószerviz — Prémium autószerviz Ercsiben";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BACKGROUND = "#080808";
const FOREGROUND = "#f0ede5";
const GOLD = "#c9a84c";

/**
 * Sitewide default social-share image (docs/design-system.md Section 2's
 * gold/near-black palette, header.tsx's exact two-line wordmark treatment —
 * gold "ROYAL-TEAM" + muted "AUTÓSZERVIZ"). Built with `next/og`'s
 * Satori-based `ImageResponse` from plain text/color primitives only —
 * deterministic, no font/network fetch, no external runtime dependency. The
 * vector logo mark itself isn't embedded here: Satori's `<img>` support is
 * limited to raster formats, so reproducing the brand via its actual
 * colors/typography (not a rasterized SVG) is the safe choice rather than a
 * risk of a broken/blank mark in the generated image. Per-page routes with a
 * real Sanity photo override this via their own `openGraph.images` (see
 * `src/lib/seo.ts`'s `isRealImage`); every other page inherits this file
 * automatically through the Next.js metadata file convention.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: BACKGROUND,
          padding: "88px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: "6px",
            height: "100%",
            background: `linear-gradient(to bottom, ${BACKGROUND}, ${GOLD}, ${BACKGROUND})`,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              color: GOLD,
              letterSpacing: "-0.02em",
            }}
          >
            ROYAL-TEAM
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 12,
              fontSize: 30,
              fontWeight: 600,
              color: FOREGROUND,
              opacity: 0.55,
              letterSpacing: "0.35em",
            }}
          >
            AUTÓSZERVIZ
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 52,
            fontSize: 32,
            color: FOREGROUND,
            opacity: 0.7,
            maxWidth: 860,
          }}
        >
          Prémium autószerviz Ercsiben
        </div>
      </div>
    ),
    { ...size },
  );
}
