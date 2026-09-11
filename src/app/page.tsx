import type { Metadata } from "next";
import { BlogPreview } from "./_components/blog-preview";
import { ContactStrip } from "./_components/contact-strip";
import { CtaBanner } from "./_components/cta-banner";
import { HeroSection } from "./_components/hero-section";
import { ProjectsPreview } from "./_components/projects-preview";
import { ReviewsSection } from "./_components/reviews-section";
import { ServicesOverview } from "./_components/services-overview";
import { WhyUsSection } from "./_components/why-us-section";
import { WorkshopTechSection } from "./_components/workshop-tech-section";
import { getHomepageContent } from "@/lib/sanity/queries/homepage";

const FALLBACK_META_TITLE = "Royal-Team Autószerviz — Prémium autószerviz Ercsiben";
const FALLBACK_META_DESCRIPTION =
  "Prémium, teljesítmény-orientált autószerviz Ercsiben. DPF tisztítás, diagnosztika, futómű- és fékszerviz, karbantartás — OEM technológiával.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomepageContent();

  return {
    title: seo?.metaTitle || FALLBACK_META_TITLE,
    description: seo?.metaDescription || FALLBACK_META_DESCRIPTION,
    ...(seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

/**
 * No FAQ section here — the reference design's homepage FAQ set is a
 * confirmed-resolved item (docs/design-system.md revision notes): FAQ
 * content lives strictly on `Service.faq`, not as a generic homepage-level
 * set, so it isn't reproduced here.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesOverview />
      <WhyUsSection />
      <WorkshopTechSection />
      <ReviewsSection />
      <ProjectsPreview />
      <BlogPreview />
      <CtaBanner />
      <ContactStrip />
    </>
  );
}
