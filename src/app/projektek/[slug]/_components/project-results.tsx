import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import type { ProjectDetail } from "@/lib/sanity/queries/projects";

export function ProjectResults({ project }: { project: ProjectDetail }) {
  const quote = project.resultsQuote;

  if (!project.results?.length && !quote) return null;

  return (
    <section className="bg-secondary py-20">
      <Container>
        <div className="mb-12 text-center">
          <SectionLabel>Eredmény</SectionLabel>
          <h2 className="font-heading text-4xl font-black text-foreground">
            A munka <span className="text-gold">eredménye.</span>
          </h2>
        </div>

        {project.results && project.results.length > 0 && (
          <div className="mx-auto mb-10 grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-3">
            {project.results.map(({ value, label, description }) => (
              <div key={label} className="border border-gold/15 bg-background/50 p-8 text-center">
                <div className="mb-1 font-heading text-5xl font-black text-gold">{value}</div>
                <div className="mb-0.5 font-heading text-sm font-semibold text-foreground">
                  {label}
                </div>
                <div className="text-xs text-foreground/35">{description}</div>
              </div>
            ))}
          </div>
        )}

        {quote && (
          <div className="mx-auto max-w-2xl border border-gold/15 bg-background/50 p-8 text-center">
            <p className="text-sm leading-relaxed text-foreground/60 italic">
              &ldquo;{quote.text}&rdquo;
            </p>
            {quote.attribution && (
              <p className="mt-4 font-mono-label text-[10px] text-gold">{quote.attribution}</p>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
