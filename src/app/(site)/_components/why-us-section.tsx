import { Award, Cpu, Shield, Zap, type LucideIcon } from "lucide-react";
import { AccentHeading } from "@/components/accent-heading";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import { getPageCopy } from "@/lib/sanity/queries/page-copy";

/** Card icons by position — the copy (`whyUsSection.features`) is in
 * Sanity, the icons stay a design decision; extra cards reuse them in order. */
const FEATURE_ICONS: LucideIcon[] = [Cpu, Shield, Award, Zap];

export async function WhyUsSection() {
  const { whyUsSection } = await getPageCopy("homepage");

  return (
    <section
      className="bg-secondary py-24"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg,rgba(255,255,255,0.015) 0,rgba(255,255,255,0.015) 1px,transparent 1px,transparent 12px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.015) 0,rgba(255,255,255,0.015) 1px,transparent 1px,transparent 12px)",
      }}
    >
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionLabel>{whyUsSection.label}</SectionLabel>
            <h2 className="mb-6 font-heading text-4xl font-black text-foreground md:text-5xl">
              <AccentHeading value={whyUsSection.title} />
            </h2>
            <p className="mb-8 max-w-md text-sm leading-relaxed text-foreground/50">{whyUsSection.text}</p>
            <Button href="/rolunk">Rólunk bővebben →</Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {whyUsSection.features.map(({ title, description }, index) => {
              const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length] ?? Cpu;
              return (
              <div
                key={title}
                className="border border-gold/10 bg-background/60 p-6 transition-all duration-300 hover:border-gold/35"
              >
                <Icon size={22} className="mb-4 text-gold" />
                <h3 className="mb-2 font-heading text-sm font-bold text-foreground">
                  {title}
                </h3>
                <p className="text-xs leading-relaxed text-foreground/40">
                  {description}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
