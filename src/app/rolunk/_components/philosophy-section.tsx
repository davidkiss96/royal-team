import { Shield, Target, TrendingUp, type LucideIcon } from "lucide-react";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import type { AboutPageContent, PhilosophyIconKey } from "@/lib/mock/about-page";

/** `philosophyValues[].icon` is a fixed string key (docs/content-model.md
 * Section 9) resolved to a component here — the same presentation-layer
 * icon-mapping approach already used for `Service` (`SERVICE_ICONS`), kept
 * local since this page-specific 3-value icon set isn't used elsewhere. */
const PHILOSOPHY_ICONS: Record<PhilosophyIconKey, LucideIcon> = {
  precision: Target,
  reliability: Shield,
  growth: TrendingUp,
};

export function PhilosophySection({ content }: { content: AboutPageContent }) {
  if (content.philosophyValues.length === 0) return null;

  return (
    <section className="bg-secondary py-20">
      <Container>
        <div className="mb-12 text-center">
          <SectionLabel>Filozofiánk</SectionLabel>
          <h2 className="font-heading text-4xl font-black text-foreground">Értékeink</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {content.philosophyValues.map(({ icon, title, description }) => {
            const Icon = PHILOSOPHY_ICONS[icon];
            return (
              <div
                key={title}
                className="border border-gold/10 bg-background/60 p-8 text-center transition-all hover:border-gold/35"
              >
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-gold/30">
                  {Icon && <Icon size={22} className="text-gold" />}
                </div>
                <h3 className="mb-3 font-heading text-xl font-black text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-foreground/45">{description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
