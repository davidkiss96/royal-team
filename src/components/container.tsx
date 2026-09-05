import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * The `max-w-7xl mx-auto px-6 lg:px-8` wrapper repeated across nearly every
 * section in the reference design (docs/design-system.md Section 4/7).
 */
export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-7xl px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
