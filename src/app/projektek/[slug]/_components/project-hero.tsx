import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import type { Project } from "@/lib/mock/projects";
import { getIsoYear } from "@/lib/format-date";
import { getServicesBySlugs } from "@/lib/mock/services";

/** Same generic "last word gold" heading convention as the Service detail
 * page's hero — no field exists (or should exist) for per-title curated
 * highlighting of a plain string field. */
function splitTitleForAccent(title: string): { lead: string; accent: string } {
  const words = title.trim().split(/\s+/);
  const accent = words.pop() ?? title;
  return { lead: words.join(" "), accent };
}

export function ProjectHero({ project, index }: { project: Project; index: number }) {
  const { lead, accent } = splitTitleForAccent(project.title);
  const relatedServices = getServicesBySlugs(project.relatedServices);

  return (
    <section className="relative flex min-h-[72vh] items-end overflow-hidden">
      <Image
        src={project.heroImage.url}
        alt={project.heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <Container className="relative w-full pt-40 pb-16">
        <Link
          href="/projektek"
          className="mb-8 inline-flex items-center gap-2 font-mono-label text-[10px] tracking-wider text-gold/50 transition-colors hover:text-gold"
        >
          ← Vissza a projektekhez
        </Link>

        {relatedServices.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {relatedServices.map((service) => (
              <span
                key={service.slug}
                className="border border-gold/30 bg-gold/15 px-3 py-1.5 font-mono-label text-[9px] tracking-wider text-gold"
              >
                {service.title}
              </span>
            ))}
          </div>
        )}

        <span className="font-mono-label text-xs tracking-[0.3em] text-gold">
          PROJEKT #{String(index + 1).padStart(3, "0")} · {getIsoYear(project.projectDate)}
        </span>
        <h1 className="mt-2 mb-4 font-heading text-5xl font-black text-white md:text-7xl">
          {lead}
          <br />
          <span className="text-gold">{accent}</span>
        </h1>
        <p className="max-w-lg text-base leading-relaxed text-white/55">{project.summary}</p>
      </Container>
    </section>
  );
}
