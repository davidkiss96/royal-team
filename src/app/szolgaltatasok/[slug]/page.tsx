import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { FaqAccordion } from "@/components/faq-accordion";
import { getBusinessSettings } from "@/lib/sanity/queries/business-settings";
import { getActiveServiceSlugs, getServiceBySlug } from "@/lib/sanity/queries/services";
import { ServiceBodySection } from "./_components/service-body-section";
import { ServiceHero } from "./_components/service-hero";
import { ServiceHighlightsCta } from "./_components/service-highlights-cta";
import { ServiceProcessSection } from "./_components/service-process-section";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Only active-service slugs are pre-rendered at build time. A service
 * created or reactivated afterward isn't statically generated until the
 * next build, but still resolves correctly: `dynamicParams` defaults to
 * `true`, so Next.js renders it on demand on first request (using
 * `getServiceBySlug` below, same as any pre-rendered path) and caches that
 * result per the route's ISR window — no on-demand revalidation/webhook
 * needed for this to work (docs/architecture.md Section 6.1/13, task Section
 * 8/9). `dynamicParams` is intentionally left at its default rather than
 * set explicitly, since the default is exactly the desired behavior here.
 */
export async function generateStaticParams() {
  const slugs = await getActiveServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.seo?.metaTitle || `${service.title} — Royal-Team Autószerviz`,
    description: service.seo?.metaDescription || service.summary,
    ...(service.seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const { phone } = await getBusinessSettings();
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <>
      <ServiceHero service={service} />
      <ServiceBodySection service={service} />
      <ServiceProcessSection service={service} />
      <ServiceHighlightsCta service={service} phone={phone} phoneHref={phoneHref} />

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
