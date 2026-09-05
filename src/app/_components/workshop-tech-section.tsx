import Image from "next/image";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";

/**
 * Static site copy — no content-model field covers the workshop-equipment
 * list or badge (not on `Homepage`, not elsewhere). Kept as a fixed local
 * constant, not "mock Sanity data".
 */
const WORKSHOP_EQUIPMENT = [
  "LAUNCH X431 PRO multirendszer diagnosztika",
  "3D kerékbeállító (Hunter Hawkeye Elite)",
  "DPF ultrahangos tisztítórendszer",
  "Kétoszlopos hidraulikus emelők",
  "Nitrogén abroncs-töltő rendszer",
  "Klímarendszer töltőállomás",
];

export function WorkshopTechSection() {
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
              className="h-[480px] w-full object-cover brightness-80"
            />
            <div className="absolute top-0 right-0 h-16 w-16 border-t-2 border-r-2 border-gold" />
            <div className="absolute bottom-0 left-0 h-16 w-16 border-b-2 border-l-2 border-gold" />
            <div className="absolute right-6 bottom-6 border border-gold/30 bg-background/95 px-5 py-4">
              <div className="font-heading text-2xl font-black text-gold">
                OEM+
              </div>
              <div className="text-[10px] tracking-wider text-foreground/50 uppercase">
                Technológiai szint
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>Felszerelésünk</SectionLabel>
            <h2 className="mb-6 font-heading text-4xl font-black text-foreground md:text-5xl">
              Prémium eszközök.
              <br />
              <span className="text-gold">Precíz eredmények.</span>
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-foreground/50">
              Legmodernebb diagnosztikai és szervizberendezésekkel dolgozunk —
              autóját ugyanolyan vagy annál fejlettebb eszközökkel kezeljük,
              mint a márkaszervizek.
            </p>
            <div className="space-y-3">
              {WORKSHOP_EQUIPMENT.map((item) => (
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
