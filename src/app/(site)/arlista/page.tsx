import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AccentHeading } from "@/components/accent-heading";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import { buildPageMetadata } from "@/lib/seo";
import { getPageCopy } from "@/lib/sanity/queries/page-copy";
import { getPriceCategories } from "@/lib/sanity/queries/price-categories";
import { PriceCategorySection } from "./_components/price-category-section";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getPageCopy("priceListPage");
  return buildPageMetadata({ title: meta.title, description: meta.description, path: "/arlista" });
}

export default async function PriceListPage() {
  const [categories, { header, footnote, cta }] = await Promise.all([
    getPriceCategories(),
    getPageCopy("priceListPage"),
  ]);

  return (
    <>
      <section className="relative pt-40 pb-24">
        <Image
          src="/placeholders/photo-placeholder.svg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/92" />
        <Container className="relative">
          <SectionLabel>{header.label}</SectionLabel>
          <h1 className="font-heading text-5xl font-black text-foreground md:text-7xl">
            <AccentHeading value={header.title} />
          </h1>
          <GoldDivider className="mt-4" />
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/45">{header.intro}</p>
        </Container>
      </section>

      <section className="bg-background py-16">
        <Container className="max-w-5xl space-y-12">
          {categories.map((category, index) => (
            <PriceCategorySection
              key={category.title}
              category={category}
              delayMs={Math.min(index, 6) * 50}
            />
          ))}

          <div className="mt-10 border border-gold/15 bg-card p-6 text-xs leading-relaxed text-foreground/45">
            {footnote}
          </div>
        </Container>
      </section>

      <section className="bg-gold py-14">
        <Container className="text-center">
          <h2 className="mb-3 font-heading text-3xl font-black text-black">
            {cta.title}
          </h2>
          <p className="mb-7 text-sm text-black/55">{cta.text}</p>
          <Link
            href="/kapcsolat"
            className="inline-block bg-black px-10 py-4 font-heading text-xs font-black tracking-[0.2em] text-gold uppercase transition-all duration-300 hover:bg-[#111111]"
          >
            Kapcsolatfelvétel →
          </Link>
        </Container>
      </section>
    </>
  );
}
