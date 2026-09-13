import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

/**
 * Shared Portable Text renderer (docs/development-guidelines.md Section 8 —
 * `Service.body` is real Sanity Portable Text, not the mock's simplified
 * `BodyBlock` shape). Deliberately minimal: only `@portabletext/react`, the
 * small official Sanity renderer, with custom components only where the
 * design system needs its own typography classes or markup (headings, the
 * gold-square bullet list, inline links) — everything else (`strong`, `em`,
 * numbered lists) is intentionally left unset so it falls through to
 * `@portabletext/react`'s own `defaultComponents`, which already render the
 * semantically correct `<strong>`/`<em>`/`<ol>`/`<li>`.
 *
 * The bullet list below renders real `<ul>`/`<li>` (not `<div>`s) — Tailwind
 * v4's preflight already zeroes `<ul>` margin/padding and list-style, so this
 * doesn't need any extra reset classes to keep its current look.
 *
 * Placed here (not under `szolgaltatasok/`) because `Project.body` and
 * `BlogPost.body` are also Portable Text (docs/content-model.md Sections
 * 3–4) and reuse this component.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => (
      <h2 className="font-heading text-2xl font-black text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading text-xl font-black text-foreground">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-heading text-lg font-bold text-foreground">{children}</h4>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href as string | undefined;
      const isExternal = href?.startsWith("http");
      return (
        <a
          href={href}
          className="text-gold hover:underline"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul className="space-y-2.5 pt-2">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-center gap-2 text-sm text-foreground/55">
        <div className="h-1.5 w-1.5 shrink-0 bg-gold" />
        {children}
      </li>
    ),
    // `@portabletext/react`'s default `listItem` is a single function shared
    // by every list-item style, not a `{bullet, number}` map like `list` —
    // overriding just `bullet` above replaces that whole default, so
    // `number` must be spelled out too or numbered items fall through to
    // the library's "unknown list item style" warning path.
    number: ({ children }) => <li>{children}</li>,
  },
};

export function PortableTextContent({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
