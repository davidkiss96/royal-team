import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { AccentHeading } from "@/components/accent-heading";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import { SiteNoticeBadge } from "@/components/site-notice";
import { getBusinessSettings } from "@/lib/sanity/queries/business-settings";
import { getHomepageContent } from "@/lib/sanity/queries/homepage";
import { getPageCopy } from "@/lib/sanity/queries/page-copy";

export async function HeroSection() {
  const [{ heroSubheadline, heroImage, secondaryCtas }, { siteNotice }, copy] = await Promise.all([
    getHomepageContent(),
    getBusinessSettings(),
    getPageCopy("homepage"),
  ]);

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
          {siteNotice && <SiteNoticeBadge notice={siteNotice} />}
          <SectionLabel>{copy.heroLabel}</SectionLabel>
          <h1 className="mb-6 font-heading text-5xl leading-[1.0] font-black text-foreground sm:text-6xl lg:text-[clamp(4.5rem,0.5rem+8.9svh,5.5rem)] lg:[@media(max-height:850px)]:mb-4">
            <AccentHeading value={copy.heroHeadline} />
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
            {copy.heroStats.map(({ value, label }) => (
              <div key={`${value}-${label}`}>
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

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-svh">
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-gold/50">
          <div className="h-10 w-px bg-gradient-to-b from-transparent to-gold/50" />
          <ChevronDown size={14} className="animate-bounce" />
        </div>
      </div>
    </section>
  );
}
