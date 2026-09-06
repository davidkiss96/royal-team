import { Container } from "@/components/container";
import type { AboutPageContent } from "@/lib/mock/about-page";

export function StatsSection({ content }: { content: AboutPageContent }) {
  if (content.stats.length === 0) return null;

  return (
    <section className="bg-background py-20">
      <Container>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {content.stats.map(({ label, value }) => (
            <div
              key={label}
              className="border border-gold/10 p-8 text-center transition-all hover:border-gold/30"
            >
              <div className="mb-2 font-heading text-4xl font-black text-gold">{value}</div>
              <div className="text-[10px] tracking-widest text-foreground/35 uppercase">
                {label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
