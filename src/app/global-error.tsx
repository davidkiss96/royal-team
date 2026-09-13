"use client";

import { useEffect } from "react";

/**
 * Root-layout error boundary (App Router convention) — the one fallback
 * used when `layout.tsx` itself fails to render, e.g. `getBusinessSettings()`
 * throwing because Sanity is unreachable or the `BusinessSettings` singleton
 * is missing (`src/lib/sanity/queries/business-settings.ts`). Next.js
 * replaces the *entire* document with this component in that case, so —
 * unlike `error.tsx` — it must render its own `<html>`/`<body>` and cannot
 * depend on anything the root layout would normally provide: not
 * `globals.css` (only imported by `layout.tsx`), not `next/font`, not
 * Header/Footer, not any Sanity-sourced data. Kept dependency-free and
 * inline-styled on purpose — reusing a component that also fetches data
 * would risk failing the same way as the thing it's meant to recover from.
 *
 * Same safety convention as `error.tsx`/the contact form: the real error is
 * logged (visible in Cloudflare Workers' runtime logs), never shown to the
 * visitor — only a generic, safe message plus a retry action.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="hu">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          backgroundColor: "#080808",
          color: "#f0ede5",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "32rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#c9a84c",
              margin: "0 0 1rem",
            }}
          >
            Royal-Team Autószerviz
          </p>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 1rem" }}>
            Váratlan hiba történt
          </h1>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.6, opacity: 0.7, margin: "0 0 2rem" }}>
            Az oldal jelenleg nem elérhető. Próbálja meg újra, vagy keressen minket telefonon.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              border: "1px solid #c9a84c",
              background: "transparent",
              color: "#c9a84c",
              padding: "0.75rem 1.75rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Újrapróbálkozás
          </button>
        </div>
      </body>
    </html>
  );
}
