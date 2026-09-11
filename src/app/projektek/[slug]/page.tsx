import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata, isRealImage } from "@/lib/seo";
import { getProjectBySlug, getProjectSlugs } from "@/lib/sanity/queries/projects";
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
 * All projects are pre-rendered at build time — `Project` has no
 * `isActive`-style filter to exclude any of them (docs/content-model.md
 * Section 4), unlike `Service`'s `getActiveServiceSlugs`. A project added
 * after the last build still resolves correctly on first request via
 * `dynamicParams`'s default `true` (docs/development-guidelines.md Section
 * 3), the same behavior already established for `Service`.
 */
export async function generateStaticParams() {
  const entries = await getProjectSlugs();
  return entries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return buildPageMetadata({
    title: project.seo?.metaTitle || `${project.title} — Royal-Team Autószerviz`,
    description: project.seo?.metaDescription || project.summary,
    path: `/projektek/${slug}`,
    noIndex: project.seo?.noIndex,
    image: isRealImage(project.heroImage) ? project.heroImage : undefined,
  });
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const entries = await getProjectSlugs();
  const index = entries.findIndex((entry) => entry.slug === slug);

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
