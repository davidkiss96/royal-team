import Image from "next/image";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import { getAboutPage } from "@/lib/sanity/queries/about-page";

/**
 * The approved hero headline's per-line break and gold-accent second line
 * ("Prémium szerviz." / "Szenvedéllyel.") are a fixed presentational rule
 * tied to this specific curated copy — `AboutPage.heroHeadline` is a plain
 * string field with no per-line/inline-highlight structure
 * (docs/content-model.md Section 9), so this can't be data-driven any more
 * than `Homepage.heroHeadline` could (`src/app/_components/hero-section.tsx`).
 * Kept as a local constant for the same reason.
 */
const HERO_HEADLINE_LINES = ["Prémium szerviz.", "Szenvedéllyel."];

export async function AboutHero() {
  const { heroSubheadline, heroImage } = await getAboutPage();

  return (
    <section className="relative overflow-hidden pt-40 pb-32">
      <Image
        src={heroImage.url}
        alt={heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/30" />
      <Container className="relative">
        <SectionLabel>Rólunk</SectionLabel>
        <h1 className="mb-6 font-heading text-5xl font-black text-foreground md:text-7xl">
          {HERO_HEADLINE_LINES.map((line, index) => (
            <span key={line}>
              {index === HERO_HEADLINE_LINES.length - 1 ? (
                <span className="text-gold">{line}</span>
              ) : (
                line
              )}
              {index < HERO_HEADLINE_LINES.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <GoldDivider />
        {heroSubheadline && (
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/45">
            {heroSubheadline}
          </p>
        )}
      </Container>
    </section>
  );
}
