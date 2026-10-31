import { Award, Cpu, Shield, Zap, type LucideIcon } from "lucide-react";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";

/**
 * Static site copy — no content-model field covers this section (not on
 * `Homepage`, not elsewhere). Kept as a fixed local constant rather than
 * "mock Sanity data", since there's no schema to shape it against yet.
 */
const WHY_US_FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Cpu,
    title: "OEM Diagnosztika",
    description: "Gyári szintű diagnosztikai rendszerek minden márkához",
  },
  {
    icon: Shield,
    title: "Minőség Garancia",
    description: "Munkánkra és az alkatrészekre teljes körű garancia",
  },
  {
    icon: Award,
    title: "Certified Technikusok",
    description: "Képzett és folyamatosan fejlődő szakember csapat",
  },
  {
    icon: Zap,
    title: "Gyors Átfutás",
    description: "Értékeli az idejét — minimális várakozással dolgozunk",
  },
];

export function WhyUsSection() {
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
            <SectionLabel>Miért válasszon minket</SectionLabel>
            <h2 className="mb-6 font-heading text-4xl font-black text-foreground md:text-5xl">
              Precizitás.
              <br />
              <span className="text-gold">Teljesítmény.</span>
              <br />
              Megbízhatóság.
            </h2>
            <p className="mb-8 max-w-md text-sm leading-relaxed text-foreground/50">
              Nem egy átlagos autószerviz vagyunk. Prémium felszerelésünkkel
              és tapasztalt technikusainkkal a legtöbb problémát egyetlen
              látogatással megoldjuk.
            </p>
            <Button href="/rolunk">Rólunk bővebben →</Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {WHY_US_FEATURES.map(({ icon: Icon, title, description }) => (
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
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
