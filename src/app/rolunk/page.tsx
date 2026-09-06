import type { Metadata } from "next";
import { ABOUT_PAGE_CONTENT } from "@/lib/mock/about-page";
import { AboutCta } from "./_components/about-cta";
import { AboutHero } from "./_components/about-hero";
import { OwnerStorySection } from "./_components/owner-story-section";
import { PhilosophySection } from "./_components/philosophy-section";
import { PhotoGallerySection } from "./_components/photo-gallery-section";
import { StatsSection } from "./_components/stats-section";

export const metadata: Metadata = {
  title: ABOUT_PAGE_CONTENT.seo.metaTitle,
  description: ABOUT_PAGE_CONTENT.seo.metaDescription,
};

export default function AboutPage() {
  return (
    <>
      <AboutHero content={ABOUT_PAGE_CONTENT} />
      <OwnerStorySection content={ABOUT_PAGE_CONTENT} />
      <PhilosophySection content={ABOUT_PAGE_CONTENT} />
      <StatsSection content={ABOUT_PAGE_CONTENT} />
      <PhotoGallerySection content={ABOUT_PAGE_CONTENT} />
      <AboutCta content={ABOUT_PAGE_CONTENT} />
    </>
  );
}
