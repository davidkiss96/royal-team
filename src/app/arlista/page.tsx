import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import { ALL_PRICE_CATEGORIES } from "@/lib/mock/price-categories";
import { PriceCategorySection } from "./_components/price-category-section";

export const metadata: Metadata = {
  title: "Árlista — Royal-Team Autószerviz",
  description:
    "Áttekinthető, tájékoztató jellegű árlista — DPF tisztítás, diagnosztika, futómű- és fékszerviz, karbantartás.",
};

export default function PriceListPage() {
  const categories = ALL_PRICE_CATEGORIES.filter((category) => category.isActive).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <>
      <section className="relative pt-40 pb-24">
        <Image
          src="/placeholders/photo-placeholder.svg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/92" />
        <Container className="relative">
          <SectionLabel>Átlátható árazás</SectionLabel>
          <h1 className="font-heading text-5xl font-black text-foreground md:text-7xl">
            Árlista
          </h1>
          <GoldDivider className="mt-4" />
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/45">
            Az alábbi árak tájékoztató jellegűek és a megjelölt összegtől
            kezdődő díjakat jelölnek. A pontos ár az elvégzett munkától, az
            alkatrész igénytől és a jármű típusától függ.
          </p>
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
            * Az árak tájékoztató jellegűek és az ÁFÁ-t nem tartalmazzák. A
            végső ár az elvégzett munkától, a felhasznált alkatrészektől és a
            jármű típusától függően eltérhet. Alkatrészek ára külön
            számítódik.
          </div>
        </Container>
      </section>

      <section className="bg-gold py-14">
        <Container className="text-center">
          <h2 className="mb-3 font-heading text-3xl font-black text-black">
            Pontos árajánlatért keressen minket
          </h2>
          <p className="mb-7 text-sm text-black/55">
            Ingyenes előzetes helyszíni felmérés — rejtett költségek nélkül.
          </p>
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
