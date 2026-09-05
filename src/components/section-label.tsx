import type { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

/**
 * The gold, JetBrains Mono section eyebrow label ("— LABEL TEXT") used
 * throughout the reference design (docs/design-system.md Section 7).
 */
export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <p
      className={`font-mono-label text-xs font-medium uppercase tracking-[0.3em] text-gold ${className}`}
    >
      — {children}
    </p>
  );
}
