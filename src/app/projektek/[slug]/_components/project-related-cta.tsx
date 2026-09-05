import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import type { Project } from "@/lib/mock/projects";
import { getServicesBySlugs } from "@/lib/mock/services";
import { SERVICE_ICONS } from "@/lib/service-icons";

export function ProjectRelatedCta({ project }: { project: Project }) {
  const relatedServices = getServicesBySlugs(project.relatedServices);

  return (
    <section className="bg-background py-20">
      <Container>
        <div className="grid items-start gap-16 lg:grid-cols-2">
          <div>
            <SectionLabel>Kapcsolódó szervizek</SectionLabel>
            <h2 className="mb-7 font-heading text-3xl font-black text-foreground">
              Ehhez a projekthez
              <br />
              <span className="text-gold">kapcsolódó munkák</span>
            </h2>
            {relatedServices.length > 0 && (
              <div className="space-y-3">
                {relatedServices.map((service) => {
                  const Icon = SERVICE_ICONS[service.slug];
                  return (
                    <Link
                      key={service.slug}
                      href={`/szolgaltatasok/${service.slug}`}
                      className="group flex items-center gap-4 border border-gold/10 p-4 transition-all hover:border-gold/35"
                    >
                      {Icon && <Icon size={18} className="flex-shrink-0 text-gold" />}
                      <div className="flex-1">
                        <p className="font-heading text-sm font-semibold text-foreground">
                          {service.title}
                        </p>
                        <p className="text-xs text-foreground/35">{service.tagline}</p>
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-gold/30 transition-all group-hover:translate-x-1 group-hover:text-gold"
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border border-gold/20 bg-card p-10 text-center">
            <h3 className="mb-3 font-heading text-2xl font-black text-foreground">
              Hasonló projektet szeretne?
            </h3>
            <p className="mb-8 text-sm leading-relaxed text-foreground/45">
              Mondja el mit keres — megbeszéljük a részleteket és ingyenes
              árajánlatot adunk.
            </p>
            <Button href="/kapcsolat" className="w-full">
              Kapcsolatfelvétel →
            </Button>
            <Button href="/projektek" variant="outline" className="mt-3 w-full">
              Összes projekt
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
