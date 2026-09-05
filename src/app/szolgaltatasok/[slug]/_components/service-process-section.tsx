import { Container } from "@/components/container";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { SectionLabel } from "@/components/section-label";
import type { Service } from "@/lib/mock/services";

/** The only section of the reference DPF page that used scroll-triggered
 * entrance animation (a left-slide fade-in, staggered per step) — the only
 * place RevealOnScroll is used on this page, matching that. */
export function ServiceProcessSection({ service }: { service: Service }) {
  if (!service.process || service.process.length === 0) return null;

  return (
    <section className="bg-secondary py-20">
      <Container>
        <div className="mb-14 text-center">
          <SectionLabel>A folyamat</SectionLabel>
          <h2 className="font-heading text-4xl font-black text-foreground">
            Hogyan <span className="text-gold">dolgozunk?</span>
          </h2>
        </div>

        <div className="mx-auto max-w-2xl space-y-4">
          {service.process.map((step, index) => (
            <RevealOnScroll key={step.title} delayMs={Math.min(index, 5) * 60}>
              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-gold font-mono-label text-sm font-black text-black">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 border border-gold/10 bg-background/50 p-5 transition-all hover:border-gold/30">
                  <h3 className="mb-1 font-heading text-lg font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/45">
                    {step.description}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
