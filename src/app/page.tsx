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
import { HOMEPAGE_CONTENT } from "@/lib/mock/homepage";

export const metadata: Metadata = {
  title: HOMEPAGE_CONTENT.seo.metaTitle,
  description: HOMEPAGE_CONTENT.seo.metaDescription,
};

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
