import Image from "next/image";

// Real logo's native viewBox is 315x259 (public/logo.svg).
const LOGO_ASPECT_RATIO = 259 / 315;

interface LogoProps {
  size?: number;
  priority?: boolean;
  className?: string;
}

/**
 * The real Royal-Team logo asset (docs/design-system.md Section 9, replacing
 * the reference app's procedurally-generated placeholder component). Alt
 * text is empty because every usage sits directly beside the visible
 * "Royal-Team" wordmark, which already names it — the enclosing link (in
 * Header) carries the accessible name instead.
 */
export function Logo({ size = 46, priority = false, className = "" }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt=""
      width={size}
      height={Math.round(size * LOGO_ASPECT_RATIO)}
      priority={priority}
      className={className}
    />
  );
}
