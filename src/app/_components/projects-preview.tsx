import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import { getIsoYear } from "@/lib/format-date";
import { ALL_PROJECTS } from "@/lib/mock/projects";
import { getServicesBySlugs } from "@/lib/mock/services";

export function ProjectsPreview() {
  const [featured, ...rest] = ALL_PROJECTS;
  if (!featured) return null;

  return (
    <section className="bg-secondary py-20">
      <Container>
        <div className="mb-12 flex items-end justify-between">
          <div>
            <SectionLabel>Automotive portfolio</SectionLabel>
            <h2 className="font-heading text-3xl font-black text-foreground md:text-4xl">
              Kiemelt <span className="text-gold">projektek.</span>
            </h2>
          </div>
          <Button href="/projektek" variant="outline" className="hidden md:inline-flex">
            Összes projekt →
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Link
            href={`/projektek/${featured.slug}`}
            className="group relative overflow-hidden border border-gold/15"
          >
            <div className="h-72 overflow-hidden lg:h-[360px]">
              <Image
                src={featured.heroImage.url}
                alt={featured.heroImage.alt}
                width={900}
                height={700}
                className="h-full w-full object-cover brightness-55 transition-all duration-700 group-hover:scale-105 group-hover:brightness-70"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute top-0 right-0 h-10 w-10 border-t-2 border-r-2 border-gold/60" />
            <div className="absolute right-0 bottom-0 left-0 p-7">
              <span className="font-mono-label text-[10px] tracking-[0.3em] text-gold">
                PROJEKT #001 · {getIsoYear(featured.projectDate)}
              </span>
              <h3 className="mt-1 mb-1 font-heading text-2xl font-black text-white">
                {featured.title}
              </h3>
              <p className="mb-4 text-xs text-white/45">
                {getServicesBySlugs(featured.relatedServices)
                  .map((service) => service.title)
                  .join(" · ")}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-gold transition-all group-hover:gap-3">
                <span className="font-heading font-bold tracking-wider uppercase">
                  Projekt megtekintése
                </span>
                <ArrowRight size={12} />
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-5">
            {rest.map((project, index) => (
              <Link
                key={project.slug}
                href={`/projektek/${project.slug}`}
                className="group relative flex-1 overflow-hidden border border-gold/10"
              >
                <div className="h-44 overflow-hidden">
                  <Image
                    src={project.heroImage.url}
                    alt={project.heroImage.alt}
                    width={700}
                    height={380}
                    className="h-full w-full object-cover brightness-50 transition-all duration-700 group-hover:scale-105 group-hover:brightness-65"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 p-5">
                  <span className="font-mono-label text-[10px] tracking-[0.25em] text-gold">
                    PROJEKT #{String(index + 2).padStart(3, "0")}
                  </span>
                  <h3 className="mt-0.5 font-heading text-lg font-black text-white">
                    {project.title}
                  </h3>
                  <p className="text-xs text-white/35">{project.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button href="/projektek" variant="outline">
            Összes projekt →
          </Button>
        </div>
      </Container>
    </section>
  );
}
