import type { Metadata } from "next";
import { buildPageMetadata, isRealImage } from "@/lib/seo";
import { getAboutPage } from "@/lib/sanity/queries/about-page";
import { AboutCta } from "./_components/about-cta";
import { AboutHero } from "./_components/about-hero";
import { OwnerStorySection } from "./_components/owner-story-section";
import { PhilosophySection } from "./_components/philosophy-section";
import { PhotoGallerySection } from "./_components/photo-gallery-section";
import { StatsSection } from "./_components/stats-section";

const FALLBACK_META_TITLE = "Rólunk — Royal-Team Autószerviz";
const FALLBACK_META_DESCRIPTION =
  "Ismerje meg a Royal-Team Autószervizt — 15 év tapasztalat, teljesítmény-orientált szemlélet és igényesség minden munkában.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, heroImage } = await getAboutPage();

  return buildPageMetadata({
    title: seo?.metaTitle || FALLBACK_META_TITLE,
    description: seo?.metaDescription || FALLBACK_META_DESCRIPTION,
    path: "/rolunk",
    noIndex: seo?.noIndex,
    image: isRealImage(heroImage) ? heroImage : undefined,
  });
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OwnerStorySection />
      <PhilosophySection />
      <StatsSection />
      <PhotoGallerySection />
      <AboutCta />
    </>
  );
}
