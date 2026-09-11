import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import { buildPageMetadata } from "@/lib/seo";
import { getProjects } from "@/lib/sanity/queries/projects";
import { ProjectCard } from "./_components/project-card";

export const metadata: Metadata = buildPageMetadata({
  title: "Projektek — Royal-Team Autószerviz",
  description:
    "Válogatott szervizprojektek — részletes dokumentációval, technikai leírással és valódi eredményekkel.",
  path: "/projektek",
});

export default async function ProjectsPage() {
  const projects = await getProjects();

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
          <SectionLabel>Automotive portfolio</SectionLabel>
          <h1 className="font-heading text-5xl font-black text-foreground md:text-7xl">
            Projektek
          </h1>
          <GoldDivider className="mt-4" />
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/45">
            Válogatott szervizprojektek — részletes dokumentációval, technikai
            leírással és valódi eredményekkel.
          </p>
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
            Hasonló munkát szeretne elvégeztetni?
          </h2>
          <p className="mb-5 text-sm text-foreground/40">
            Keressen minket — szívesen megbeszéljük az Ön autójához szükséges
            munkát.
          </p>
          <Button href="/kapcsolat">Kapcsolatfelvétel →</Button>
        </Container>
      </section>
    </>
  );
}
