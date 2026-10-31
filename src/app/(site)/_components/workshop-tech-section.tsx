import Image from "next/image";
import { AccentHeading } from "@/components/accent-heading";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import { getPageCopy } from "@/lib/sanity/queries/page-copy";

export async function WorkshopTechSection() {
  const { workshopSection } = await getPageCopy("homepage");

  return (
    <section className="bg-background py-24">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative">
            <Image
              src="/placeholders/photo-placeholder.svg"
              alt="Royal-Team műhely diagnosztikai és szervizberendezései"
              width={800}
              height={620}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-[480px] w-full object-cover brightness-80"
            />
            <div className="absolute top-0 right-0 h-16 w-16 border-t-2 border-r-2 border-gold" />
            <div className="absolute bottom-0 left-0 h-16 w-16 border-b-2 border-l-2 border-gold" />
            <div className="absolute right-6 bottom-6 border border-gold/30 bg-background/95 px-5 py-4">
              <div className="font-heading text-2xl font-black text-gold">{workshopSection.badgeValue}</div>
              <div className="text-[10px] tracking-wider text-foreground/50 uppercase">
                {workshopSection.badgeLabel}
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>{workshopSection.label}</SectionLabel>
            <h2 className="mb-6 font-heading text-4xl font-black text-foreground md:text-5xl">
              <AccentHeading value={workshopSection.title} />
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-foreground/50">{workshopSection.text}</p>
            <div className="space-y-3">
              {workshopSection.equipment.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-foreground/60"
                >
                  <div className="h-1.5 w-1.5 flex-shrink-0 bg-gold" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
