import { Container } from "@/components/container";
import { getAboutPage } from "@/lib/sanity/queries/about-page";

export async function StatsSection() {
  const { stats } = await getAboutPage();
  if (stats.length === 0) return null;

  return (
    <section className="bg-background py-20">
      <Container>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="border border-gold/10 p-8 text-center transition-all hover:border-gold/30"
            >
              <div className="mb-2 font-heading text-4xl font-black text-gold">{value}</div>
              <div className="text-[10px] tracking-widest text-foreground/50 uppercase">
                {label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
