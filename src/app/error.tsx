"use client";

import { useEffect } from "react";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";

/**
 * Route-level error boundary (App Router convention) — catches an error
 * thrown by any Server/Client Component below the root layout (e.g. a
 * page-specific Sanity fetch failing), while the root layout itself
 * (Header/Footer, fonts, globals.css) keeps rendering normally around it.
 * `getBusinessSettings()` failing in the root layout is a *different* case,
 * handled by `global-error.tsx` — this file cannot catch that, since the
 * error boundary a page renders inside is always a descendant of its layout.
 *
 * The real error is logged (visible in Cloudflare Workers' runtime logs) and
 * never rendered to the visitor — same convention as
 * `src/app/kapcsolat/_components/submit-contact-form.ts`'s error handling:
 * a safe, generic Hungarian message only, no stack trace, no provider
 * detail.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route-error]", error);
  }, [error]);

  return (
    <section className="flex min-h-screen items-center pt-40 pb-24">
      <Container className="w-full text-center">
        <div className="mx-auto max-w-xl">
          <SectionLabel>Hiba</SectionLabel>
          <h1 className="mt-6 font-heading text-3xl font-black text-foreground sm:text-4xl">
            Váratlan hiba történt
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-foreground/50">
            Az oldal betöltése közben hiba történt. Próbálja meg újra, vagy térjen vissza a
            főoldalra.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button onClick={reset}>Újrapróbálkozás →</Button>
            <Button href="/" variant="outline">
              Vissza a főoldalra
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
