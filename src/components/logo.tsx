import Image from "next/image";

// Native aspect ratios (height / width), one per distinct artwork geometry in
// public/logos/ — taken directly from each SVG's viewBox, not guessed. Variants
// that share the same underlying artwork (only color/background differs) share
// the same ratio constant below.
const ICON_ASPECT_RATIO = 150 / 149.693985; // icon-*.svg — viewBox 0 0 149.693985 150
const FULL_ASPECT_RATIO = 193.5 / 235.232025; // full-*.svg — viewBox 0 0 235.232025 193.5
const TEXT_TAGLINE_ASPECT_RATIO = 35.739384 / 315; // text-tagline-gradient-light.svg — viewBox 0 0 315 35.739384
const TEXT_LOGONAME_ASPECT_RATIO = 20.144535 / 315; // text-logoname-gradient-light.svg — viewBox 0 0 315 20.144535

/**
 * Every logo asset in public/logos/ (design-reference/figma-app/brand-assets/generated/README.md
 * has the full source analysis). Each entry pairs the asset with the aspect
 * ratio of its own artwork, so adding a variant here without its real ratio
 * is a type error rather than a silently distorted image.
 */
const LOGO_VARIANTS = {
  "icon-gradient-light": { src: "/logos/icon-gradient-light.svg", aspectRatio: ICON_ASPECT_RATIO },
  "icon-black-light": { src: "/logos/icon-black-light.svg", aspectRatio: ICON_ASPECT_RATIO },
  "icon-white-dark": { src: "/logos/icon-white-dark.svg", aspectRatio: ICON_ASPECT_RATIO },
  "full-gradient-light": { src: "/logos/full-gradient-light.svg", aspectRatio: FULL_ASPECT_RATIO },
  "full-black-light": { src: "/logos/full-black-light.svg", aspectRatio: FULL_ASPECT_RATIO },
  "full-white-dark": { src: "/logos/full-white-dark.svg", aspectRatio: FULL_ASPECT_RATIO },
  "text-tagline-gradient-light": {
    src: "/logos/text-tagline-gradient-light.svg",
    aspectRatio: TEXT_TAGLINE_ASPECT_RATIO,
  },
  "text-logoname-gradient-light": {
    src: "/logos/text-logoname-gradient-light.svg",
    aspectRatio: TEXT_LOGONAME_ASPECT_RATIO,
  },
} as const satisfies Record<string, { src: string; aspectRatio: number }>;

export type LogoVariant = keyof typeof LOGO_VARIANTS;

interface LogoProps {
  /**
   * Which reviewed asset from public/logos/ to render (design-reference/figma-app/
   * brand-assets/generated/README.md). Defaults to the icon-only mark — the full
   * circular badge (ring + arc tagline + ribbon wordmark) is too fine-lined to
   * read at small nav sizes, so it's opt-in via an explicit "full-*" variant for
   * contexts with real room (e.g. a hero section), not the default.
   */
  variant?: LogoVariant;
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
export function Logo({
  variant = "icon-gradient-light",
  size = 44,
  priority = false,
  className = "",
}: LogoProps) {
  const { src, aspectRatio } = LOGO_VARIANTS[variant];
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={Math.round(size * aspectRatio)}
      priority={priority}
      className={className}
    />
  );
}
