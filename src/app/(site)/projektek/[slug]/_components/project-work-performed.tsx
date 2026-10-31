import { Container } from "@/components/container";
import { NumberedStepsList } from "@/components/numbered-steps";
import { SectionLabel } from "@/components/section-label";
import type { ProjectDetail } from "@/lib/sanity/queries/projects";

export function ProjectWorkPerformed({ project }: { project: ProjectDetail }) {
  if (project.workPerformedSteps.length === 0) return null;

  return (
    <section className="bg-secondary py-20">
      <Container>
        <div className="mb-14 text-center">
          <SectionLabel>Elvégzett munkák</SectionLabel>
          <h2 className="font-heading text-4xl font-black text-foreground">
            Mit <span className="text-gold">csináltunk?</span>
          </h2>
        </div>
        <div className="mx-auto max-w-4xl">
          <NumberedStepsList steps={project.workPerformedSteps} columns={2} />
        </div>
      </Container>
    </section>
  );
}
