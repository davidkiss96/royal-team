import Image from "next/image";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import type { AboutPageContent } from "@/lib/mock/about-page";

export function AboutHero({ content }: { content: AboutPageContent }) {
  return (
    <section className="relative overflow-hidden pt-40 pb-32">
      <Image
        src={content.heroImage.url}
        alt={content.heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/30" />
      <Container className="relative">
        <SectionLabel>Rólunk</SectionLabel>
        <h1 className="mb-6 font-heading text-5xl font-black text-foreground md:text-7xl">
          {content.heroHeadlineLines.map((line, index) => (
            <span key={line}>
              {index === content.heroHeadlineLines.length - 1 ? (
                <span className="text-gold">{line}</span>
              ) : (
                line
              )}
              {index < content.heroHeadlineLines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <GoldDivider />
        {content.heroSubheadline && (
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/45">
            {content.heroSubheadline}
          </p>
        )}
      </Container>
    </section>
  );
}
