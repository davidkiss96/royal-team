import type { Metadata } from "next";
import Image from "next/image";
import { AccentHeading } from "@/components/accent-heading";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import { buildPageMetadata } from "@/lib/seo";
import { getBusinessSettings } from "@/lib/sanity/queries/business-settings";
import { getPageCopy } from "@/lib/sanity/queries/page-copy";
import { getServices } from "@/lib/sanity/queries/services";
import { ServiceRow } from "./_components/service-row";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getPageCopy("servicesPage");
  return buildPageMetadata({ title: meta.title, description: meta.description, path: "/szolgaltatasok" });
}

export default async function ServicesPage() {
  const [activeServices, { siteFeatures }, { header, priceListCta }] = await Promise.all([
    getServices(),
    getBusinessSettings(),
    getPageCopy("servicesPage"),
  ]);

  return (
    <>
      <section className="relative pt-40 pb-24">
        <Image src="/placeholders/photo-placeholder.svg" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-background/92" />
        <Container className="relative">
          <SectionLabel>{header.label}</SectionLabel>
          <h1 className="font-heading text-5xl font-black text-foreground md:text-7xl">
            <AccentHeading value={header.title} />
          </h1>
          <GoldDivider className="mt-4" />
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-foreground/45">{header.intro}</p>
        </Container>
      </section>

      <section className="bg-background py-20">
        <Container className="space-y-6">
          {activeServices.length > 0 ? (
            activeServices.map((service, index) => (
              <ServiceRow
                key={service.slug}
                service={service}
                reverse={index % 2 === 1}
                delayMs={Math.min(index, 4) * 50}
              />
            ))
          ) : (
            <p className="text-center text-sm text-foreground/40">
              Jelenleg nincs elérhető szolgáltatás — nézzen vissza hamarosan.
            </p>
          )}
        </Container>
      </section>

      {siteFeatures.priceList && (
        <section className="border-t border-gold/8 bg-card/40 py-12">
          <Container className="text-center">
            <h2 className="mb-2 font-heading text-xl font-black text-foreground">{priceListCta.title}</h2>
            <p className="mb-5 text-sm text-foreground/40">{priceListCta.text}</p>
            <Button href="/arlista">Árlista megtekintése →</Button>
          </Container>
        </section>
      )}
    </>
  );
}
