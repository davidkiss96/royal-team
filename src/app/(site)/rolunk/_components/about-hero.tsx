import Image from "next/image";
import { AccentHeading } from "@/components/accent-heading";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import { getAboutPage } from "@/lib/sanity/queries/about-page";
import { getPageCopy } from "@/lib/sanity/queries/page-copy";

export async function AboutHero() {
  const [{ heroSubheadline, heroImage }, copy] = await Promise.all([getAboutPage(), getPageCopy("aboutPage")]);

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
        <SectionLabel>{copy.heroLabel}</SectionLabel>
        <h1 className="mb-6 font-heading text-5xl font-black text-foreground md:text-7xl">
          <AccentHeading value={copy.heroHeadline} />
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
