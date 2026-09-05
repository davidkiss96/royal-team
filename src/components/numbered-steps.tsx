import { RevealOnScroll } from "./reveal-on-scroll";

export interface NumberedStepItem {
  title: string;
  description: string;
}

interface NumberedStepsListProps {
  steps: NumberedStepItem[];
  columns?: 1 | 2;
  className?: string;
}

/**
 * The numbered "how we work" process pattern (docs/design-system.md
 * Section 7's explicit `<NumberedSteps>` recommendation) — a step number
 * box plus a title/description card, revealed on scroll. Used by the
 * Project detail page's body-derived "work performed" narrative
 * (docs/content-model.md Section 0 item 9). The Service detail page has
 * its own, separately-implemented version of this same visual pattern
 * (out of scope to touch here) — a natural future consolidation, not done
 * in this change.
 */
export function NumberedStepsList({ steps, columns = 1, className = "" }: NumberedStepsListProps) {
  return (
    <div className={`grid gap-4 ${columns === 2 ? "md:grid-cols-2" : ""} ${className}`}>
      {steps.map((step, index) => (
        <RevealOnScroll key={step.title} delayMs={Math.min(index, 5) * 60}>
          <div className="flex h-full items-start gap-5 border border-gold/10 bg-background/50 p-5 transition-all hover:border-gold/30">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-gold font-mono-label text-xs font-black text-black">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div>
              <h3 className="mb-1 font-heading text-base font-bold text-foreground">{step.title}</h3>
              <p className="text-xs leading-relaxed text-foreground/45">{step.description}</p>
            </div>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
