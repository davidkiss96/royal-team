# Royal-Team Autószerviz — Website

Status: discovery complete, implementation in progress. This is a partial Next.js scaffold, not a finished application.

## Start here

**Before writing or changing any code, read `docs/development-guidelines.md` in full.** It defines the engineering rules for this project, including an explicit "AI-assisted development" section with rules such as: challenge decisions when appropriate, don't introduce dependencies without a reason, ask before implementing when a requirement is ambiguous, and treat the documents in `docs/` as the source of truth for product and architecture — not assumptions, not this README.

Recommended reading order if you're picking this up fresh:
1. `docs/product.md` — what this is and why (business goals, scope, what's explicitly out of scope).
2. `docs/architecture.md` — the technical architecture (Next.js + Sanity CMS, no custom database, no auth, no booking system).
3. `docs/content-model.md` — the full Sanity content model (nine content types, all field-level decisions and their reasoning).
4. `docs/design-system.md` — the approved visual design system, reverse-engineered from the approved Figma prototype in `design-reference/figma-app/`. Read this before building any UI.
5. `docs/development-guidelines.md` — engineering conventions, and the AI-assisted workflow this project has followed throughout.

**`docs/database.md` and `docs/schema-design.md` are explicitly marked as deferred/future scope** (a possible future appointment-booking platform). They do not apply to this v1 build — do not let them influence current implementation decisions.

## What's already decided (don't re-litigate without reason)

- **Scope:** premium SEO-first business website. No booking, no payments, no customer accounts, no custom database, no custom admin.
- **Stack:** Next.js (App Router) + Sanity CMS. Content types: `Homepage`, `BusinessSettings`, `Service`, `BlogPost`, `Project`, `Review`, `Author`, `AboutPage`, `PriceCategory`.
- **Design:** dark-only, no light mode, no theme toggle. Gold (`#C9A84C`) as the fixed brand accent. See `docs/design-system.md` for the full token set.
- **Routes are Hungarian:** `/`, `/szolgaltatasok`, `/szolgaltatasok/[slug]`, `/arlista`, `/projektek`, `/projektek/[slug]`, `/rolunk`, `/blog`, `/blog/[slug]`, `/kapcsolat`, `/impresszum`, `/adatvedelem`.
- **The real logo** is at `public/logo.svg` (also in `design-reference/figma-app/`) — use this, not a placeholder.

## What's NOT decided yet (ask before assuming)

- Production hosting provider (`docs/architecture.md` Section 17).
- Sanity Studio deployment topology — embedded `/studio` route vs. separate deployment (`docs/architecture.md` Section 6).
- Transactional email provider for the contact form (`docs/architecture.md` Section 11).
- Analytics tool (`docs/architecture.md` Section 13).
- A few small Sanity schema-code safeguards flagged in `docs/content-model.md`'s closing summary (read-only-after-publish slugs, singleton delete-action removal) — recommended, not yet confirmed.

## Project structure

```
docs/                       — all product/architecture/content-model/design docs (source of truth)
design-reference/figma-app/ — the approved Figma-exported prototype (READ-ONLY reference, do not edit or copy its architecture — see docs/design-system.md for what to preserve vs. not)
src/app/                    — Next.js App Router routes
src/components/             — shared, cross-route React components (not yet built)
src/lib/sanity/             — Sanity client, queries, types (not yet built)
public/                     — static assets, including the real logo
```

## Current implementation state

- Next.js 16 + Tailwind CSS v4 + TypeScript scaffold in place (`package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`).
- `src/app/globals.css` — the approved dark-only design tokens (`docs/design-system.md` Section 2), translated into Tailwind v4's CSS-first `@theme` syntax.
- `src/app/layout.tsx` — the three-typeface system (Rajdhani, DM Sans, JetBrains Mono) loaded via `next/font`.
- **Not yet built:** any actual page content, the shared component library (`Container`, `Button`, `SectionLabel`, etc. — see `docs/design-system.md` Section 7 for the full inventory), Sanity schema files, the contact form, or a real Sanity project connection.

## Getting started locally

```bash
npm install
npm run dev
```

You'll also need a `.env.local` file — see `.env.example` for the required variable names (none of them are secret except the email provider key, which isn't chosen yet).
