import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/button";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import type { ServiceListItem } from "@/lib/sanity/queries/services";
import { SERVICE_ICONS } from "@/lib/service-icons";

interface ServiceRowProps {
  service: ServiceListItem;
  reverse: boolean;
  delayMs: number;
}

/**
 * Alternating image/content row (docs/design-system.md Section 8). The
 * reference achieves the alternation with a `[direction:rtl]` CSS trick,
 * explicitly flagged as fragile and not to be copied (Section 5/7/14 #7);
 * this uses an explicit `reverse` prop + CSS `order` instead, exactly the
 * mechanism the doc recommends in its place.
 */
export function ServiceRow({ service, reverse, delayMs }: ServiceRowProps) {
  const Icon = SERVICE_ICONS[service.slug];

  return (
    <RevealOnScroll delayMs={delayMs}>
      <div className="group grid overflow-hidden border border-gold/8 transition-all duration-500 hover:border-gold/30 lg:grid-cols-2">
        <div className={`h-64 overflow-hidden lg:h-auto ${reverse ? "lg:order-2" : ""}`}>
          <Image
            src={service.heroImage.url}
            alt={service.heroImage.alt}
            width={800}
            height={550}
            className="h-full w-full object-cover brightness-[0.65] transition-all duration-700 group-hover:scale-[1.03] group-hover:brightness-75"
          />
        </div>

        <div
          className={`flex flex-col justify-center bg-card p-8 lg:p-12 ${reverse ? "lg:order-1" : ""}`}
        >
          <div className="mb-5 flex items-center gap-3">
            {Icon && <Icon size={20} className="text-gold" />}
            <span className="font-mono-label text-[10px] tracking-[0.3em] text-gold uppercase">
              {service.tagline}
            </span>
          </div>
          <h2 className="mb-4 font-heading text-2xl font-black text-foreground md:text-3xl">
            {service.title}
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-foreground/50">
            {service.summary}
          </p>

          {service.highlights.length > 0 && (
            <div className="mb-8">
              <p className="mb-3 text-[10px] tracking-widest text-foreground/35 uppercase">
                Főbb előnyök
              </p>
              <div className="space-y-2">
                {service.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center gap-2 text-sm text-foreground/60"
                  >
                    <CheckCircle size={13} className="flex-shrink-0 text-gold" />
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {service.isActive && (
              <div className="flex items-center gap-1.5 font-mono-label text-[10px] text-emerald-400">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                ELÉRHETŐ
              </div>
            )}
            <Button href="/kapcsolat" className="px-6 py-2.5">
              Ajánlatkérés
            </Button>
            <Button
              href={`/szolgaltatasok/${service.slug}`}
              variant="outline"
              className="px-6 py-2.5"
            >
              Részletek
            </Button>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
