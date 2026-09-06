import { Button } from "@/components/button";
import { Container } from "@/components/container";
import type { AboutPageContent } from "@/lib/mock/about-page";

/** The heading/paragraph are static template copy, not modeled fields —
 * `AboutPage.cta` (docs/content-model.md Section 9) is a single `ctaLink`
 * (label + url only), matching how every other page's closing CTA band in
 * this project already works (Services, Projects, Price List — none pull
 * their heading/paragraph copy from Sanity either). */
export function AboutCta({ content }: { content: AboutPageContent }) {
  return (
    <section className="border-t border-gold/8 bg-background py-14">
      <Container className="text-center">
        <h2 className="mb-4 font-heading text-3xl font-black text-foreground">
          Ismerje meg szervizünket személyesen
        </h2>
        <p className="mb-8 text-sm text-foreground/40">
          Kérdése van, vagy ajánlatot szeretne? Vegyük fel a kapcsolatot.
        </p>
        <Button href={content.cta.url}>{content.cta.label}</Button>
      </Container>
    </section>
  );
}
