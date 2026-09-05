import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import { HERO_STATS, HOMEPAGE_CONTENT } from "@/lib/mock/homepage";

// Which headline lines get the gold accent — a fixed presentational rule
// tied to this specific curated copy (see docs/content-model.md Section 8:
// `heroHeadline` is a plain string, with no inline-highlight support),
// matching the approved design's "Autószerviz." / "Teljesítmény." emphasis.
const GOLD_LINE_INDEXES = new Set([1, 4]);

export function HeroSection() {
  const { heroHeadlineLines, heroSubheadline, heroImage, secondaryCtas } =
    HOMEPAGE_CONTENT;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <Image
        src={heroImage.url}
        alt={heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
      <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-gold/70 to-transparent" />

      <Container className="relative w-full pt-32 pb-24">
        <div className="max-w-xl">
          <SectionLabel>Prémium Autószerviz · Ercsi</SectionLabel>
          <h1 className="mb-6 font-heading text-5xl leading-[1.0] font-black text-foreground sm:text-6xl lg:text-[5.5rem]">
            {heroHeadlineLines.map((line, index) => (
              <span key={line}>
                {GOLD_LINE_INDEXES.has(index) ? (
                  <span className="text-gold">{line}</span>
                ) : (
                  line
                )}
                {index < heroHeadlineLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="mb-10 max-w-md text-base leading-relaxed text-foreground/55">
            {heroSubheadline}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href={secondaryCtas[0]!.url}>
              {secondaryCtas[0]!.label} →
            </Button>
            <Button href={secondaryCtas[1]!.url} variant="outline">
              {secondaryCtas[1]!.label}
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-8 border-t border-gold/20 pt-10">
            {HERO_STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="font-heading text-2xl leading-none font-black text-gold">
                  {value}
                </div>
                <div className="mt-1 text-[10px] tracking-widest text-foreground/40 uppercase">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-gold/50">
        <div className="h-10 w-px bg-gradient-to-b from-transparent to-gold/50" />
        <ChevronDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
}
