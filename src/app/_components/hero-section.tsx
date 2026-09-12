import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import { getHomepageContent } from "@/lib/sanity/queries/homepage";

/**
 * The approved hero headline's per-line breaks and gold-accent words
 * ("Autószerviz." / "Teljesítmény.") are a fixed presentational rule tied
 * to this specific curated copy — `Homepage.heroHeadline` is a plain
 * string field with no per-line/inline-highlight structure
 * (docs/content-model.md Section 8), so this multi-line treatment can't be
 * data-driven any more than it could from the pre-Sanity mock. Kept as a
 * local constant, same treatment as `WHY_US_FEATURES`/`WORKSHOP_EQUIPMENT`
 * (`why-us-section.tsx`/`workshop-tech-section.tsx`) for design elements
 * with no matching content-model shape — see the migration report's
 * content-model gap note.
 */
const HERO_HEADLINE_LINES = [
  "Prémium",
  "Autószerviz.",
  "Precíz Munka.",
  "Maximális",
  "Teljesítmény.",
];
const GOLD_LINE_INDEXES = new Set([1, 4]);

/** Same rationale as `HERO_HEADLINE_LINES` above — no content-model field
 * covers these trust stats (not on `Homepage`, not on `BusinessSettings`).
 * A "4.9★ Google értékelés" stat previously appeared here too — removed
 * alongside the matching fake aggregate rating in `reviews-section.tsx`
 * (same issue: an unverified rating attributed to a named third-party
 * platform, not the kind of generic stat this list is otherwise used for). */
const HERO_STATS = [
  { value: "15+", label: "Év tapasztalat" },
  { value: "3000+", label: "Elégedett ügyfél" },
  { value: "100%", label: "Garancia" },
];

export async function HeroSection() {
  const { heroSubheadline, heroImage, secondaryCtas } = await getHomepageContent();

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden">
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
          <h1 className="mb-6 font-heading text-5xl leading-[1.0] font-black text-foreground sm:text-6xl lg:text-[clamp(4.5rem,0.5rem+8.9svh,5.5rem)] lg:[@media(max-height:850px)]:mb-4">
            {HERO_HEADLINE_LINES.map((line, index) => (
              <span key={line}>
                {GOLD_LINE_INDEXES.has(index) ? (
                  <span className="text-gold">{line}</span>
                ) : (
                  line
                )}
                {index < HERO_HEADLINE_LINES.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="mb-10 max-w-md text-base leading-relaxed text-foreground/55 lg:[@media(min-height:781px)_and_(max-height:850px)]:mb-7 lg:[@media(max-height:780px)]:mb-6">
            {heroSubheadline}
          </p>
          <div className="flex flex-wrap gap-4">
            {secondaryCtas.map((cta, index) =>
              index === 0 ? (
                <Button key={cta.url} href={cta.url}>
                  {cta.label} →
                </Button>
              ) : (
                <Button key={cta.url} href={cta.url} variant="outline">
                  {cta.label}
                </Button>
              ),
            )}
          </div>

          <div className="mt-12 flex flex-wrap gap-8 border-t border-gold/20 pt-10 lg:[@media(min-height:781px)_and_(max-height:850px)]:mt-7 lg:[@media(min-height:781px)_and_(max-height:850px)]:pt-6 lg:[@media(max-height:780px)]:mt-4 lg:[@media(max-height:780px)]:pt-4">
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

      <div className="pointer-events-none absolute inset-x-0 top-0 h-svh">
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-gold/50">
          <div className="h-10 w-px bg-gradient-to-b from-transparent to-gold/50" />
          <ChevronDown size={14} className="animate-bounce" />
        </div>
      </div>
    </section>
  );
}
