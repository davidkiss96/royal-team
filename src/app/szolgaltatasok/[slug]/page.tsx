import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { FaqAccordion } from "@/components/faq-accordion";
import { ALL_SERVICES } from "@/lib/mock/services";
import { ServiceBodySection } from "./_components/service-body-section";
import { ServiceHero } from "./_components/service-hero";
import { ServiceHighlightsCta } from "./_components/service-highlights-cta";
import { ServiceProcessSection } from "./_components/service-process-section";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

function getService(slug: string) {
  return ALL_SERVICES.find((service) => service.slug === slug && service.isActive);
}

export function generateStaticParams() {
  return ALL_SERVICES.filter((service) => service.isActive).map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: `${service.title} — Royal-Team Autószerviz`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <ServiceHero service={service} />
      <ServiceBodySection service={service} />
      <ServiceProcessSection service={service} />
      <ServiceHighlightsCta service={service} />

      {service.faq && service.faq.length > 0 && (
        <section className="bg-card/30 py-16">
          <Container className="max-w-3xl">
            <h2 className="mb-8 text-center font-heading text-3xl font-black text-foreground">
              {service.title} — Gyakori kérdések
            </h2>
            <FaqAccordion items={service.faq} />
          </Container>
        </section>
      )}
    </>
  );
}
