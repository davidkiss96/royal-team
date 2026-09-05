import { CheckCircle } from "lucide-react";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import type { Service } from "@/lib/mock/services";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site-config";
import { SERVICE_ICONS } from "@/lib/service-icons";

/**
 * Reuses the same flat `highlights` field as the services index page — the
 * reference's richer title/description benefit pairs on this page aren't
 * reproduced as a second, competing shape (docs/content-model.md Section 0
 * item 8).
 */
export function ServiceHighlightsCta({ service }: { service: Service }) {
  const Icon = SERVICE_ICONS[service.slug];

  return (
    <section className="bg-background py-20">
      <Container>
        <div className="grid items-start gap-16 lg:grid-cols-2">
          <div>
            <SectionLabel>Előnyök</SectionLabel>
            <h2 className="mb-8 font-heading text-4xl font-black text-foreground">
              Miért éri meg?
            </h2>
            {service.highlights.length > 0 && (
              <div className="space-y-3">
                {service.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center gap-3 border-l-2 border-gold/30 p-4"
                  >
                    <CheckCircle size={16} className="flex-shrink-0 text-gold" />
                    <p className="font-heading text-sm font-semibold text-foreground">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border border-gold/20 bg-card p-10 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border-2 border-gold/40">
              {Icon && <Icon size={26} className="text-gold" />}
            </div>
            <h3 className="mb-3 font-heading text-2xl font-black text-foreground">
              {service.title} Ajánlatkérés
            </h3>
            <p className="mb-8 text-sm leading-relaxed text-foreground/45">
              Kérjen ingyenes árajánlatot — előzetes egyeztetés díjmentes.
            </p>
            <Button href="/kapcsolat" className="w-full">
              Érdeklődjön →
            </Button>
            <a
              href={PHONE_HREF}
              className="mt-4 block font-mono-label text-sm text-gold hover:underline"
            >
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
