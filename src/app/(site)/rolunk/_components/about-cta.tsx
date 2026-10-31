import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { getAboutPage } from "@/lib/sanity/queries/about-page";
import { getPageCopy } from "@/lib/sanity/queries/page-copy";

/** Heading/paragraph come from `AboutPage.ctaSection`, the button from
 * `AboutPage.cta` (`ctaLink`). Hidden entirely when no button is
 * configured, per the task's "hide gracefully" rule for optional sections. */
export async function AboutCta() {
  const [{ cta }, { ctaSection }] = await Promise.all([getAboutPage(), getPageCopy("aboutPage")]);
  if (!cta) return null;

  return (
    <section className="border-t border-gold/8 bg-background py-14">
      <Container className="text-center">
        <h2 className="mb-4 font-heading text-3xl font-black text-foreground">
          {ctaSection.title}
        </h2>
        <p className="mb-8 text-sm text-foreground/40">{ctaSection.text}</p>
        <Button href={cta.url}>{cta.label}</Button>
      </Container>
    </section>
  );
}
