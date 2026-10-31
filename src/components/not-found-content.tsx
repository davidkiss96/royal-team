import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";

/**
 * The branded 404 body, shared by the root `app/not-found.tsx` (unmatched
 * URLs — wraps this in its own `SiteShell`) and `(site)/not-found.tsx`
 * (`notFound()` calls from public pages — already inside the `(site)`
 * layout's `SiteShell`, so it renders this bare).
 */
export function NotFoundContent() {
  return (
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
  );
}
