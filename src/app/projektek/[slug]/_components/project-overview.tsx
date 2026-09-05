import { BodyBlocks } from "@/components/body-blocks";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import type { Project } from "@/lib/mock/projects";

/** Only paragraph/list blocks render here — `numberedSteps`/`quote` blocks
 * get their own dedicated sections elsewhere on the page. */
export function ProjectOverview({ project }: { project: Project }) {
  const overviewBlocks = project.body.filter(
    (block) => block.type === "paragraph" || block.type === "list",
  );

  return (
    <section className="bg-background py-20">
      <Container>
        <div className="grid gap-16 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SectionLabel>Projekt áttekintés</SectionLabel>
            <h2 className="mb-6 font-heading text-3xl font-black text-foreground">
              A <span className="text-gold">feladat</span>
            </h2>
            <BodyBlocks blocks={overviewBlocks} />
          </div>

          <div className="lg:col-span-2">
            <div className="border border-gold/15 bg-card p-7">
              <h3 className="mb-5 font-heading text-sm font-black tracking-widest text-foreground uppercase">
                Műszaki adatok
              </h3>
              <div className="space-y-3">
                {project.specs.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 border-b border-gold/8 py-2.5 last:border-0"
                  >
                    <span className="font-mono-label text-xs text-foreground/35">{label}</span>
                    <span className="text-right font-heading text-sm font-semibold text-foreground">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
