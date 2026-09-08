import Image from "next/image";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";

export function ContactHero() {
  return (
    <section className="relative pt-40 pb-16">
      <Image
        src="/placeholders/photo-placeholder.svg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-background/92" />
      <Container className="relative">
        <SectionLabel>Lépjen kapcsolatba velünk</SectionLabel>
        <h1 className="font-heading text-5xl font-black text-foreground md:text-6xl">
          Kapcsolat
        </h1>
        <GoldDivider className="mt-4" />
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/45">
          Kérdése van, vagy árajánlatot kérne? Keressen minket telefonon,
          e-mailben, vagy töltse ki az alábbi űrlapot — hamarosan
          jelentkezünk.
        </p>
      </Container>
    </section>
  );
}
