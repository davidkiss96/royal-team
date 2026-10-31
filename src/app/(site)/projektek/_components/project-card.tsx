import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { getIsoYear } from "@/lib/format-date";
import type { ProjectListItem } from "@/lib/sanity/queries/projects";

interface ProjectCardProps {
  project: ProjectListItem;
  index: number;
  featured: boolean;
}

/**
 * Project card for the `/projektek` grid. Tag pills are `relatedServices`'
 * real titles, already resolved from Sanity references by
 * `getProjects()` (`src/lib/sanity/queries/projects.ts`), not a separate
 * `tags` field or a second UI-specific model.
 */
export function ProjectCard({ project, index, featured }: ProjectCardProps) {
  const { relatedServices } = project;

  return (
    <RevealOnScroll delayMs={Math.min(index, 6) * 60} className={featured ? "md:col-span-2" : ""}>
      <Link
        href={`/projektek/${project.slug}`}
        className="group relative block overflow-hidden border border-gold/10 transition-all duration-500 hover:border-gold/40"
      >
        <div className={`overflow-hidden ${featured ? "h-80 md:h-[420px]" : "h-64"}`}>
          <Image
            src={project.heroImage.url}
            alt={project.heroImage.alt}
            width={900}
            height={600}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover brightness-50 transition-all duration-700 group-hover:scale-105 group-hover:brightness-65"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />

        {relatedServices.length > 0 && (
          <div className="absolute top-5 left-5 flex flex-wrap gap-2">
            {relatedServices.map((service) => (
              <span
                key={service.slug}
                className="border border-gold/25 bg-black/60 px-2.5 py-1 font-mono-label text-[9px] tracking-wider text-gold"
              >
                {service.title}
              </span>
            ))}
          </div>
        )}

        <div className="absolute top-0 right-0 h-8 w-8 border-t border-r border-gold/50" />

        <div className="absolute right-0 bottom-0 left-0 p-7">
          <span className="font-mono-label text-[10px] tracking-[0.3em] text-gold">
            PROJEKT #{String(index + 1).padStart(3, "0")}
            {project.projectDate && ` · ${getIsoYear(project.projectDate)}`}
          </span>
          <h3 className={`mt-1 mb-1 font-heading font-black text-white ${featured ? "text-3xl" : "text-xl"}`}>
            {project.title}
          </h3>
          <p className="text-xs text-white/40">{project.summary}</p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-gold opacity-0 transition-opacity group-hover:opacity-100">
            <span className="font-heading text-[10px] font-bold tracking-wider uppercase">
              Projekt megtekintése
            </span>
            <ArrowRight size={12} />
          </div>
        </div>
      </Link>
    </RevealOnScroll>
  );
}
