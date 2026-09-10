import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

/**
 * Shared Portable Text renderer (docs/development-guidelines.md Section 8 —
 * `Service.body` is real Sanity Portable Text, not the mock's simplified
 * `BodyBlock` shape). Deliberately minimal: only `@portabletext/react`, the
 * small official Sanity renderer, plus custom components for exactly the
 * two block kinds the current design uses (a plain paragraph, and a bullet
 * list styled as the existing gold-square list treatment) — matching
 * `ServiceBodySection`'s pre-migration markup exactly rather than falling
 * back to `@portabletext/react`'s default `<p>`/`<ul>`/`<li>` output.
 *
 * Placed here (not under `szolgaltatasok/`) because `Project.body` and
 * `BlogPost.body` are also Portable Text (docs/content-model.md Sections
 * 3–4) and will likely reuse this component — though their content
 * (blockquotes, numbered lists, inline images) isn't handled here yet;
 * extend `components` below on proven need, not preemptively.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <div className="space-y-2.5 pt-2">{children}</div>,
  },
  listItem: {
    bullet: ({ children }) => (
      <div className="flex items-center gap-2 text-sm text-foreground/55">
        <div className="h-1.5 w-1.5 flex-shrink-0 bg-gold" />
        {children}
      </div>
    ),
  },
};

export function PortableTextContent({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
