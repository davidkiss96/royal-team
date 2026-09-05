import { Container } from "@/components/container";
import { NumberedStepsList } from "@/components/numbered-steps";
import { SectionLabel } from "@/components/section-label";
import type { Project } from "@/lib/mock/projects";

export function ProjectWorkPerformed({ project }: { project: Project }) {
  const stepsBlock = project.body.find((block) => block.type === "numberedSteps");
  if (!stepsBlock || stepsBlock.type !== "numberedSteps") return null;

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
          <NumberedStepsList steps={stepsBlock.items} columns={2} />
        </div>
      </Container>
    </section>
  );
}
