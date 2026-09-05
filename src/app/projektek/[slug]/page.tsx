import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_PROJECTS } from "@/lib/mock/projects";
import { ProjectGallery } from "./_components/project-gallery";
import { ProjectHero } from "./_components/project-hero";
import { ProjectOverview } from "./_components/project-overview";
import { ProjectRelatedCta } from "./_components/project-related-cta";
import { ProjectResults } from "./_components/project-results";
import { ProjectWorkPerformed } from "./_components/project-work-performed";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * `Project` has no `isActive` field (docs/content-model.md Section 4 —
 * native draft/publish is the documented visibility mechanism, unlike
 * `Service`). For this mock catalog, presence in `ALL_PROJECTS` **is** the
 * published state, so an invalid slug is simply one not found in the list.
 */
function getProject(slug: string) {
  return ALL_PROJECTS.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return ALL_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: `${project.title} — Royal-Team Autószerviz`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = ALL_PROJECTS.findIndex((p) => p.slug === slug);

  return (
    <>
      <ProjectHero project={project} index={index} />
      <ProjectOverview project={project} />
      <ProjectWorkPerformed project={project} />
      <ProjectGallery project={project} />
      <ProjectResults project={project} />
      <ProjectRelatedCta project={project} />
    </>
  );
}
