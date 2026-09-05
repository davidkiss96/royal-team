import {
  AlertTriangle,
  ArrowRight,
  Cpu,
  Droplets,
  Filter,
  Settings,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import { FEATURED_SERVICES } from "@/lib/mock/services";

/**
 * Per-service icon, keyed by the real `slug` field. `Service` has no icon
 * field in the approved schema (docs/content-model.md Section 2) — this
 * mirrors design-system.md Section 12's recommendation to keep icon
 * selection a presentation-layer mapping maintained in code, not content.
 */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  "dpf-szuro-tisztitas": Filter,
  "elektronikai-diagnosztika": Cpu,
  "futomu-beallitas": Settings,
  "altalanos-karbantartas": Wrench,
  "fekrendszer-szerviz": AlertTriangle,
  "olajcsere-szerviz": Droplets,
};

export function ServicesOverview() {
  const activeServices = FEATURED_SERVICES.filter((service) => service.isActive);

  return (
    <section className="bg-background py-24">
      <Container>
        <div className="mb-14">
          <SectionLabel>Szolgáltatásaink</SectionLabel>
          <h2 className="font-heading text-4xl font-black text-foreground md:text-5xl">
            Minden, amit
            <br />
            autójának szüksége van.
          </h2>
          <GoldDivider className="mt-4" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeServices.map((service) => {
            const Icon = SERVICE_ICONS[service.slug];
            return (
              <Link
                key={service.slug}
                href={`/szolgaltatasok/${service.slug}`}
                className="group relative overflow-hidden border border-gold/8 bg-card transition-all duration-500 hover:border-gold/40"
              >
                <div className="h-44 overflow-hidden">
                  <Image
                    src={service.heroImage.url}
                    alt={service.heroImage.alt}
                    width={600}
                    height={380}
                    className="h-full w-full object-cover brightness-[0.65] transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
                  />
                </div>
                <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {service.title}
                    </h3>
                    {Icon && (
                      <Icon
                        size={18}
                        className="mt-0.5 flex-shrink-0 text-gold/40 transition-colors group-hover:text-gold"
                      />
                    )}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-foreground/50">
                    {service.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-label text-[10px] tracking-wider text-gold">
                      RÉSZLETEK
                    </span>
                    <ArrowRight
                      size={15}
                      className="text-gold/30 transition-all group-hover:translate-x-1 group-hover:text-gold"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button href="/szolgaltatasok" variant="outline">
            Összes Szolgáltatás →
          </Button>
        </div>
      </Container>
    </section>
  );
}
