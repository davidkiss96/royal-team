import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { SectionLabel } from "@/components/section-label";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

/**
 * Root App Router 404 (docs/development-guidelines.md Section on
 * `not-found.tsx`) — catches both unmatched routes and any `notFound()` call
 * without a closer route-level boundary. Renders inside the minimal root
 * layout only — outside the `(site)` group's layout — so it wraps itself in
 * the same `SiteShell` (Header/Footer) and globals.css that layout uses. No
 * data fetching of its own (no Sanity content applies to a page that
 * doesn't exist).
 */
export default function NotFound() {
  return (
    <SiteShell>
      <section className="flex min-h-screen items-center pt-40 pb-24">
        <Container className="w-full text-center">
          <div className="mx-auto max-w-xl">
            <SectionLabel>Hiba</SectionLabel>
            <p className="mt-4 font-heading text-8xl leading-none font-black text-gold sm:text-9xl">404</p>
            <h1 className="mt-6 font-heading text-3xl font-black text-foreground sm:text-4xl">
              Az oldal nem található
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-foreground/50">
              A keresett oldal nem létezik, vagy időközben megváltozott a címe. Ellenőrizze, hogy jól írta-e be, vagy
              térjen vissza a főoldalra.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button href="/">Vissza a főoldalra →</Button>
              <Button href="/szolgaltatasok" variant="outline">
                Szolgáltatásaink
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
