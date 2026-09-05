interface GoldDividerProps {
  className?: string;
}

/**
 * The thin gold gradient divider used under section labels throughout the
 * reference design (docs/design-system.md Section 7). Margin/spacing is left
 * to the consumer via `className` since usage context varies per section.
 */
export function GoldDivider({ className = "" }: GoldDividerProps) {
  return (
    <div
      className={`h-px w-20 bg-gradient-to-r from-gold via-gold/60 to-transparent ${className}`}
    />
  );
}
