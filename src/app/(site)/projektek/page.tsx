import type { Metadata } from "next";
import Image from "next/image";
import { AccentHeading } from "@/components/accent-heading";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import { buildPageMetadata } from "@/lib/seo";
import { getPageCopy } from "@/lib/sanity/queries/page-copy";
import { getProjects } from "@/lib/sanity/queries/projects";
import { ProjectCard } from "./_components/project-card";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getPageCopy("projectsPage");
  return buildPageMetadata({ title: meta.title, description: meta.description, path: "/projektek" });
}

export default async function ProjectsPage() {
  const [projects, { header, cta }] = await Promise.all([getProjects(), getPageCopy("projectsPage")]);

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
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <Container className="relative">
          <SectionLabel>{header.label}</SectionLabel>
          <h1 className="font-heading text-5xl font-black text-foreground md:text-7xl">
            <AccentHeading value={header.title} />
          </h1>
          <GoldDivider className="mt-4" />
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/45">{header.intro}</p>
        </Container>
      </section>

      <section className="bg-background py-20">
        <Container>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} featured={index === 0} />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-foreground/40">
              Jelenleg nincs elérhető projekt — nézzen vissza hamarosan.
            </p>
          )}
        </Container>
      </section>

      <section className="border-t border-gold/8 bg-card/30 py-12">
        <Container className="text-center">
          <h2 className="mb-2 font-heading text-2xl font-black text-foreground">
            {cta.title}
          </h2>
          <p className="mb-5 text-sm text-foreground/40">{cta.text}</p>
          <Button href="/kapcsolat">Kapcsolatfelvétel →</Button>
        </Container>
      </section>
    </>
  );
}
