import type { SiteNotice } from "@/lib/sanity/queries/business-settings";

const FALLBACK_LABEL = "Új weboldal";

/** The small gold square marker — square, not round (docs/design-system.md Section 1). */
function NoticeMarker() {
  return (
    <span aria-hidden="true" className="relative flex h-1.5 w-1.5 shrink-0">
      <span className="absolute inset-0 animate-ping bg-gold/60 motion-reduce:animate-none" />
      <span className="relative h-1.5 w-1.5 bg-gold" />
    </span>
  );
}

/**
 * Homepage hero variant of `BusinessSettings.siteNotice` — a gold-outlined
 * badge above the hero label. Every other page shows `SiteNoticeBar`
 * instead (rendered by `Header`, which hides it on `/`).
 */
export function SiteNoticeBadge({ notice }: { notice: SiteNotice }) {
  return (
    <p className="mb-6 inline-flex max-w-full items-center gap-3 border border-gold/25 bg-gold/[0.04] px-3.5 py-2 backdrop-blur-sm">
      <NoticeMarker />
      <span className="font-mono-label text-[10px] font-medium tracking-[0.25em] whitespace-nowrap text-gold uppercase">
        {notice.label || FALLBACK_LABEL}
      </span>
      <span aria-hidden="true" className="h-3 w-px shrink-0 bg-gold/25" />
      <span className="text-xs leading-snug text-foreground/60">{notice.text}</span>
    </p>
  );
}

/** Slim site-wide bar above the header row (non-homepage pages). */
export function SiteNoticeBar({ notice }: { notice: SiteNotice }) {
  return (
    <div className="border-b border-gold/12 bg-secondary/80">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-6 py-2 text-center lg:px-8">
        <NoticeMarker />
        <span className="hidden font-mono-label text-[10px] font-medium tracking-[0.25em] whitespace-nowrap text-gold uppercase sm:inline">
          {notice.label || FALLBACK_LABEL}
        </span>
        <span aria-hidden="true" className="hidden h-3 w-px shrink-0 bg-gold/25 sm:block" />
        <span className="text-[11px] leading-snug text-foreground/60 sm:text-xs">{notice.text}</span>
      </p>
    </div>
  );
}
