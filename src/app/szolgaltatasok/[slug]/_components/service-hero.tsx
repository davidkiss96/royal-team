import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import type { Service } from "@/lib/mock/services";

/** Puts the title's last word on its own line, in gold — matches the
 * reference's "DPF Szűrő / Tisztítás" treatment, generalized to any title
 * rather than a per-service curated split (no field exists for that, and
 * this convention works cleanly for every current service title). */
function splitTitleForAccent(title: string): { lead: string; accent: string } {
  const words = title.trim().split(/\s+/);
  const accent = words.pop() ?? title;
  return { lead: words.join(" "), accent };
}

export function ServiceHero({ service }: { service: Service }) {
  const { lead, accent } = splitTitleForAccent(service.title);

  return (
    <section className="relative overflow-hidden pt-40 pb-32">
      <Image
        src={service.heroImage.url}
        alt={service.heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
      <Container className="relative">
        <Link
          href="/szolgaltatasok"
          className="mb-8 inline-flex items-center gap-2 font-mono-label text-[10px] tracking-wider text-gold/50 transition-colors hover:text-gold"
        >
          ← Vissza a szervizekhez
        </Link>
        <SectionLabel>{service.tagline}</SectionLabel>
        <h1 className="mb-6 font-heading text-5xl font-black text-foreground md:text-7xl">
          {lead}
          <br />
          <span className="text-gold">{accent}</span>
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-foreground/50">
          {service.summary}
        </p>
      </Container>
    </section>
  );
}
