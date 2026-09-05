# Royal-Team Platform — Design System (v1)

Status: Draft for review — **revised following a second Figma design pass** (booking removed, Pricing/Árlista and Projects/Projektek added, Impresszum/Privacy pages added)
Source: Approved Figma-exported reference application (React + Tailwind + Vite). Two revisions inspected so far, both **read-only, not modified, not copied architecturally**:
- Revision 1 (`project template` commit) — the original design, which included a booking flow and had no Projects/Pricing pages.
- Revision 2 (`adjust design` commit) — the current approved baseline, built from an explicit design brief (preserved in the source repo as `src/imports/pasted_text/project-scope.md`) that removed booking and added Pricing, Projects, and the two legal pages.

This document now describes **Revision 2** throughout. Findings specific to Revision 1 that are no longer applicable are marked resolved rather than deleted, so the document's own history stays traceable.

> **Status of the two findings originally flagged here as most important:**
>
> 1. **Booking as the dominant CTA — RESOLVED.** Revision 2 removes all booking UI, copy, and destinations. CTAs are now contextually varied (e.g., "Ajánlatkérés," "Érdeklődjön," "Kapcsolatfelvétel") per page, all pointing to the Contact page or a phone link, consistent with `docs/product.md`. One harmless artifact remains: a stale code comment (`{/* Benefits + Booking CTA */}` on the DPF page) referencing the removed concept — the rendered content itself is correct; only a comment wasn't cleaned up.
> 2. **Missing Projects/Case-Studies page — RESOLVED.** Revision 2 adds a full Projects index page and a project detail page (see Section 8), built specifically for the AMG C63 case study per the design brief. One real implementation gap was found in how this is wired up in the prototype (not a visual/design problem) — see Section 7's routing note and the closing summary.

**New, confirmed decisions incorporated into this revision** (finalized outside the design files themselves, recorded here for implementation reference):
- `Project.relatedServices` is a **plural** reference (array), not singular — the design's project detail page shows multiple related services per project, and the content model (`docs/content-model.md` Section 4) has been corrected to match.
- `Project` gains a `specs` field (structured label/value pairs) for the vehicle/technical spec table shown on the project detail page — `docs/content-model.md` Section 4.
- The real logo asset (`base_logo_transparent_background 1.svg`, present in the source repo) is confirmed as the production logo, replacing the procedurally-generated placeholder SVG still used in the prototype's code (see Section 9).
- The workshop's confirmed final address is **Móricz Zsigmond utca 60., 2451 Ercsi, Hungary** — replacing the placeholder "Ercsi, Autó utca 12." seen throughout the prototype (Contact page map, Impresszum). See `docs/content-model.md` Section 7 for the field-level mapping.
- The "ELÉRHETŐ" availability badge is confirmed to be driven by `Service.isActive` in production (`docs/content-model.md` Section 2), not a permanently-on decorative label.
- FAQ display is confirmed to be strictly per-`Service` (`Service.faq`) — the prototype's general homepage FAQ set and separate DPF-specific FAQ set (two independent hardcoded arrays) should not both exist in production; both should resolve to specific services' `faq` arrays.
- The Contact page's map (currently a static placeholder image with an external Google Maps link) and the `/projektek/[slug]` per-project routing (currently a single hardcoded detail page, not parametrized) are both **confirmed to remain in their current prototype form** — a real map embed and real slug-based routing are explicitly Next.js implementation-phase work, not something to resolve in design or content-model documents now.
- **The site is dark-only.** No light mode, no theme toggle, no requirement to support switching between themes. The reference app's light-mode token set and toggle mechanism are prototype-only artifacts, not carried into production. See Section 2 for the full color-token treatment under this decision.

---

## 1. Visual Design Principles

Reverse-engineered from consistent patterns across the reference app, not stated anywhere explicitly in the code — these are my characterization of what the design is actually doing, offered so we have shared language for preserving it:

- **Sharp, angular, "technical precision" aesthetic** — the theme's border-radius token is effectively zero (`0.0625rem`, ~1px) and no custom component in the app (buttons, cards, sections) uses a rounded corner. This is a deliberate, consistent choice, not an oversight — it directly supports the "precision, engineering, technical expertise" brand language from the product brief, and should be treated as a firm constraint, not a default to "soften" in production.
- **Flat depth, not skeuomorphic depth** — no drop shadows appear anywhere in the reference app. Depth and hierarchy come entirely from borders (`border-{color}/8` to `/40` opacity steps), background contrast, and image treatment (brightness reduction + gradient overlays), not `box-shadow`. Production should preserve this — introducing card shadows would visibly soften the design's intended sharpness.
- **Gold as a fixed, constant brand signal** — the gold brand color (`#C9A84C`) is the platform's single accent color, present at consistent strength throughout (see Section 2 for the token-level detail and an implementation inconsistency worth fixing, not copying). With the confirmed dark-only decision (Section 2), there's no cross-theme consistency question to reason about at all — gold is simply *the* accent color, full stop.
- **Dense, tracked-out, uppercase micro-typography for labels** — small UI text (section labels, button text, status tags, subtitles) consistently uses uppercase text with wide letter-spacing (`tracking-[0.2em]` to `tracking-[0.3em]`) in either Rajdhani (bold, condensed-feeling) or JetBrains Mono (monospace, technical-feeling), while body copy uses a calmer sans-serif (DM Sans). This three-typeface split by *role* (display/label vs. mono/technical-label vs. body) is a real, consistent system worth preserving precisely (Section 3).
- **Photography treated as atmosphere, not decoration** — nearly every large image is deliberately darkened (`brightness-[0.65]` to `brightness-80`) and combined with a gradient overlay fading into the page background, so text remains legible over the image and the image reads as mood/context rather than a competing focal element. This is a specific, repeated technique (Section 9), not incidental.
- **Corner-bracket framing as a recurring decorative motif** — small L-shaped border accents at two opposite corners of framed images (e.g., top-right + bottom-left) recur across at least four sections (workshop tech, DPF problem section, About owner story, About workshop photos). This is a real, intentional recurring visual signature worth extracting as a named, reusable pattern (Section 7), not something to reproduce ad hoc per page as the reference app currently does.

---

## 2. Color Tokens

> **RESOLVED: the site is dark-only.** There is no light mode, no theme toggle, and no requirement to support switching between themes anywhere in production. The dark token set below is the single, permanent source of truth for color. This closes what was previously an open question about the footer's theme-independent styling (see below) — there's no longer a "the rest of the site could theoretically be light" baseline for the footer to be inconsistent with.

The reference app's `src/styles/theme.css` (imported via `index.css` — **not** `default_shadcn_theme.css`, which is shadcn's unused generic scaffold default) defines two token sets, a light one and a dark one, and includes a toggle to switch between them. **Only the dark set is relevant to production.** The light-mode tokens and the toggle mechanism itself are prototype-only artifacts that should not be carried forward — they're noted here only so it's clear why the source file contains them, not because production needs to reason about them.

### Color tokens (dark — the only theme)
| Token | Value | Role |
|---|---|---|
| `--background` | `#080808` | Near-black |
| `--foreground` | `#F0EDE5` | Warm off-white text |
| `--card` | `#111111` | |
| `--primary` | `#C9A84C` | Gold |
| `--secondary` | `#1A1A1A` | |
| `--muted` | `#1E1E1E` / `--muted-foreground` `#888880` | |
| `--accent` | `#C9A84C` | Same gold as `--primary` |
| `--border` | `rgba(201,168,76,0.12)` | Gold-tinted, not neutral — a deliberate warm-dark detail, not an accident |
| `--radius` | `0.0625rem` | Effectively square |

**A genuine inconsistency worth understanding before production, not copying:** the theme defines `--accent` (and, in dark mode, `--primary`) as `#C9A84C` — meaning referencing either token would correctly and consistently produce the brand gold. **The actual component code in `App.tsx` never does this.** Instead, gold is hardcoded as a JavaScript constant (`const GOLD = "#C9A84C"`) and referenced via Tailwind arbitrary-value classes (`text-[#C9A84C]`, `border-[#C9A84C]/20`, etc.) in roughly 40+ places throughout the file, completely bypassing the CSS variable system. This is pure redundant technical debt with no functional benefit, now that there's no cross-theme scenario it could even be (accidentally or otherwise) compensating for.

**Recommendation for production:** define a single semantic token (e.g., `--color-brand-gold`, or simply consume the existing `--accent` consistently) and reference it everywhere the reference app hardcodes the hex value. This turns "update the brand gold" from a 40+-occurrence find-and-replace into a one-line change.

**Footer color — resolved by the dark-only decision, no longer an open question.** The footer hardcodes `bg-[#040404]` (distinct from, but very close to, `--background`) and uses `text-white/*` opacity utilities rather than theme tokens. This was previously flagged as an open question ("is a fixed-dark footer intentional, or untested in light mode?") — that question is now moot, since there's no light mode for it to be inconsistent with. The remaining, much smaller point worth carrying into production: the footer should ideally reference the same token system as the rest of the site (`--background`/`--foreground`, or a deliberate, named darker-footer token if a slightly different near-black is genuinely wanted) rather than a second, independently hardcoded near-black value — a minor consistency cleanup, not a design decision requiring input.

**Chart colors** (`--chart-1` through `--chart-5`) and **sidebar tokens** are defined in the theme but appear entirely unused anywhere in the actual application — no charts, no sidebar component is used. Safe to drop from the production token set unless a future need arises.

**The `--destructive` mixed-color-space inconsistency (hex in the prototype's light-mode definition, `oklch()` in dark) is no longer a production concern** — since only the dark value is ever used, there's no cross-mode mismatch to normalize. Noted here only for completeness, removed as an action item.

---

## 3. Typography

Three typefaces, each with a distinct, consistent role — imported via `src/styles/fonts.css` from Google Fonts:

| Typeface | Weights loaded | Role observed in the reference app |
|---|---|---|
| **Rajdhani** | 400, 500, 600, 700 | Display/heading font and all interactive-label text: page headings (`font-black`), button text (bold, uppercase, tracked), section subheadings, nav links, stat numbers. This is the design's "voice." |
| **JetBrains Mono** | 400, 500 | Small technical/meta labels: section eyebrow labels (e.g., "— PRÉMIUM AUTÓSZERVIZ"), status tags ("ELÉRHETŐ"), timestamps/dates, phone number in nav, review car-model text. Always uppercase or otherwise treated as a "technical annotation," never body prose. |
| **DM Sans** | 300, 400, 500, 600 (+ 400 italic) | Body font — set once on the root app container (`style={{ fontFamily: "'DM Sans', sans-serif" }}`), used for all paragraph copy. |

**Implementation issue worth flagging, not copying:** font families are applied via inline `style={{ fontFamily: ... }}` props scattered throughout individual JSX elements, rather than through a Tailwind font-family utility class backed by a `fontFamily` theme extension (e.g., `font-heading`, `font-mono-label`, `font-body`). This works, but means the same string literal (`"'Rajdhani', sans-serif"`) is repeated dozens of times rather than defined once. **Recommendation:** define named font-family tokens in the production Tailwind config and use utility classes, not inline styles.

**No consistent type scale.** Font sizes are frequently set via arbitrary Tailwind values (`text-[10px]`, `text-[7.5px]` in the logo SVG, one-off `fontSize` values) rather than a small, defined set of steps. This produces a visually cohesive result in the reference app (a human eye tuned it), but it's not a *system* — there's no small set of named sizes (e.g., "label-xs," "eyebrow," "heading-1" through "heading-4") that a future page could reliably reuse without re-eyeballing pixel values. **Recommendation:** production should define a small, explicit type scale (a handful of named sizes covering the roles actually observed — hero heading, section heading, card heading, body, label/eyebrow, micro-label) rather than continuing the arbitrary-value pattern.

**Consistent, worth preserving exactly:** the uppercase + wide-tracking treatment for labels (`tracking-[0.15em]` through `tracking-[0.3em]`, varying slightly by context) is a real, repeated system, not arbitrary per-instance choice — this specific range of tracking values should be captured as 2–3 named tracking tokens (e.g., "label-tracking-wide," "label-tracking-wider") rather than continuing as scattered arbitrary values.

---

## 4. Spacing

No custom spacing scale is defined — the reference app uses Tailwind's default spacing scale throughout, applied consistently enough to identify real patterns:

- **Section vertical rhythm:** nearly every full-width page section uses `py-20` or `py-24` — a real, consistent convention worth codifying explicitly (e.g., as a "Section" layout primitive with a fixed vertical padding prop/default) rather than re-typing `py-20`/`py-24` on every section as the reference app does.
- **Content width container:** every section wraps its content in `max-w-7xl mx-auto px-6 lg:px-8` — this exact string is repeated verbatim across effectively every section in the file. This is the clearest "reusable Tailwind pattern to extract" finding in the entire reference app — production should have a single `Container` component wrapping this pattern once, not repeat the utility string dozens of times.
- **Card/content internal padding:** generally `p-6` to `p-10` depending on card size/prominence, scaling up for larger feature cards (e.g., the DPF CTA card uses `p-10`).
- **Grid gaps:** `gap-4` to `gap-16` depending on context, with larger gaps (`gap-12`–`gap-16`) used for major two-column layout splits (image/content) and smaller gaps (`gap-3`–`gap-5`) for tighter repeating grids (service cards, review cards).

---

## 5. Container/Grid System

- **Max content width:** `max-w-7xl` (1280px) for nearly all sections; a few narrower exceptions (`max-w-4xl` for the FAQ section, `max-w-3xl` for the DPF-specific FAQ, `max-w-2xl` for the booking flow — narrower reading-width containers used deliberately for text-dense or form-based content).
- **Grid patterns observed:**
  - `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` — the standard responsive card-grid pattern (services overview, review cards).
  - `grid lg:grid-cols-2` with an alternating `[direction:rtl]`/`[direction:ltl]` trick — used on the Services index page to alternate image-left/image-right per row without separate markup per row. **Clever, but flagged as an implementation detail not worth preserving as-is** — the `direction: rtl` CSS trick for layout alternation is a fragile, hard-to-read pattern (it affects text direction semantics, not just visual order, as a side effect) achieving something more clearly expressed via explicit per-row conditional ordering or a dedicated alternating-layout component in production.
  - `grid-cols-2 md:grid-cols-4` — used for the stats rows (About page, homepage hero stats).
  - `grid-cols-2 md:grid-cols-3` — used for the About page photo grid.

---

## 6. Responsive Breakpoints

Standard Tailwind default breakpoints throughout (no custom breakpoint configuration found): `sm` (640px), `md` (768px), `lg` (1024px), `xl` (not notably used).

**One specific, real decision worth explicitly preserving, not "improving":** the navigation's mobile/desktop split happens at **`lg` (1024px), not the more common `md` (768px)**. Desktop nav links and the phone-number display are gated behind `hidden lg:flex`/`hidden md:flex`, and the hamburger menu is `lg:hidden`. This means tablets in portrait and small-laptop widths see the mobile hamburger nav, not the desktop nav — a deliberate-looking choice (likely because the full nav-link row plus phone number plus CTA button genuinely needs more than 768px of width to avoid crowding), and one that should be carried forward intentionally rather than "corrected" to the more common `md` breakpoint without a reason to do so.

---

## 7. Component Patterns

Distinguishing **what to preserve visually** from **what not to copy structurally**.

### Preserve (visual pattern → recommended production component)

| Reference pattern | Recommended production component |
|---|---|
| Repeated `max-w-7xl mx-auto px-6 lg:px-8` wrapper | `<Container>` |
| `PrimaryBtn` / `OutlineBtn` (gold-filled and gold-outlined buttons, Rajdhani, uppercase, tracked, square corners) | `<Button variant="primary" \| "outline">` — same two visual variants, properly tokenized (no inline `fontFamily`, no hardcoded hex) |
| Section eyebrow label (`— LABEL TEXT`, gold, JetBrains Mono, tracked) | `<SectionLabel>` |
| Thin gold gradient divider under section labels | `<GoldDivider>` |
| Corner-bracket image framing (recurs 4+ times) | `<CornerFramedImage>` or a `cornerFrame` wrapper — currently copy-pasted raw absolutely-positioned divs per instance in the reference app; should be one component. |
| Image + gradient-overlay hero treatment (darkened image, fading gradient into background) | A reusable hero/banner background pattern — currently hand-rolled per page (Home, Services, DPF, About, Blog, Contact all repeat a near-identical structure with slightly different gradient stops). |
| Service/Project/Blog "card" shape (bordered, image top, icon/label, hover state with brightness/scale/border-color transition) | A small family of card components sharing the same visual language, per content type (Section 8 details which fields are content vs. presentation). |
| FAQ accordion (bordered rows, rotating chevron, animated height) | `<FaqAccordion>` — used identically on the homepage and the DPF page; should be one component, not two near-duplicate implementations (the reference app currently has two separate, slightly-diverging copies of this exact pattern). |
| Numbered process-step list (DPF "how we work" section) | A generic `<NumberedSteps>` pattern — currently DPF-specific in the reference app, but the shape (numbered box + content box, repeated) is generic enough to reuse for any future service that wants to explain its process. |
| Star rating display (filled gold stars) | `<StarRating>` — used for both the aggregate rating display and individual review cards. |
| "Status available" badge (pulsing dot + label) | **Flagged as a design ambiguity, not a straightforward carry-forward** — see closing summary; its original meaning ("bookable now") no longer applies. |

### Do NOT copy structurally

- **The entire booking flow/wizard** (multi-step service → date/time → contact info → summary) — not a component to adapt, a whole page/feature that doesn't belong in production at all. If any part of it is visually useful, it's at most the *step-indicator* visual treatment and *form field* styling, which the (much simpler) contact form could optionally borrow — a design decision, not an assumption I'm making here.
- **State-based "routing"** (`useState<Page>` + conditional rendering of page components, no real URLs) — the reference app is a client-side single-page app with no per-page URLs at all. This is fundamentally incompatible with the SEO-first requirement that's core to this entire project (`docs/product.md` Section 12) and must not inform the production routing approach in any way. Production uses real Next.js file-based routes with real, indexable URLs per page.
- **The single-file, ~1000+-line `App.tsx` structure** — everything (all pages, all shared components, all data) lives in one file. This is a known characteristic of Figma/Make-exported code, not a structure to preserve. Production needs proper decomposition: one file per route, one file per component, content fetched from Sanity rather than defined as in-file constants.
- **The full shadcn/ui component scaffold** (~50 component files present in `components/ui/`) — almost none of them are actually used by the real application (which hand-builds its own buttons, cards, and sections with raw Tailwind rather than the scaffolded `Button`/`Card` components sitting right next to them). Production should pull in only the specific shadcn primitives actually needed (if any — the visual language may be simple enough to need very few), not carry the entire generated kit forward as unused dependency weight.
- **`ImageWithFallback`** (`components/figma/ImageWithFallback.tsx`) — a Figma Make platform convention for handling broken image URLs in their preview environment specifically. Not meaningful in production, which will use `next/image` against Sanity-resolved asset URLs with a different, framework-native error-handling model.
- **The `[direction: rtl]` alternating-layout trick** (Section 5) — achieves a legitimate visual goal through a fragile mechanism; reimplement more directly in production.

---

## 8. Page Patterns

Mapping every route in the current (Revision 2) reference prototype to its production equivalent, and to the Sanity content that should drive it (per `docs/content-model.md`'s approved nine content types: `Homepage`, `BusinessSettings`, `Service`, `BlogPost`, `Project`, `Review`, `Author`, `AboutPage`, `PriceCategory`).

| Reference page (`Page` type value) | Structure observed | Production route (proposed) | Sanity content driving it |
|---|---|---|---|
| `home` | Hero, services overview grid, "why us" 4-feature grid, workshop-tech 2-col, projects-preview section, reviews grid + aggregate rating, FAQ accordion, CTA banner, contact-info strip | `/` | `Homepage` (hero, intro, featured services/projects/reviews, CTAs) + `BusinessSettings` (contact strip) — **not** the hardcoded `SERVICES`/`REVIEWS`/`FAQS`/`PROJECTS` arrays currently in `App.tsx` |
| `services` (index) | Hero banner, alternating image/content rows per service | `/szolgaltatasok` (confirmed — Hungarian route segments approved) | All published `Service` documents, ordered by `displayOrder` |
| `dpf` (one hardcoded detail page) | Hero, problem section, numbered process, benefits + CTA card, dedicated FAQ | `/szolgaltatasok/[slug]` — **generalize this into the standard `Service` detail template**, not a one-off DPF-specific page. | Individual `Service` document |
| `pricing` (**new in Revision 2**) | Hero, category sections (each a list of name/note/price rows), disclaimer note, CTA banner | `/arlista` | **Resolved.** `PriceCategory` documents (`docs/content-model.md` Section 9) — fully independent of `Service`, with embedded price items (name, note, `priceType`/`amount` pair, per-item `isActive`). |
| `projects` (index, **new in Revision 2**) | Hero, asymmetric grid (first project large, others smaller), tag pills, hover-reveal "view project" label, CTA banner | `/projektek` | Published `Project` documents. **Implementation note, not a design problem:** the prototype's click handler on every card navigates to the same single hardcoded detail page regardless of which project was clicked, and all three example `PROJECTS` entries share the identical `id: "project-amg"`. This is expected/acceptable in a prototype demonstrating one template once — per the confirmed decision, real per-project `/projektek/[slug]` routing driven by actual `Project` documents is Next.js implementation-phase work, not something to fix in the design files. |
| `project-amg` (detail, **new in Revision 2**) | Hero, overview + structured spec table (2-col), work-performed section, gallery, results section, related-services + CTA | `/projektek/[slug]` (see routing note above) | Individual `Project` document — `body` (overview/narrative), `specs` (the structured spec table — new field, `docs/content-model.md` Section 4), `gallery`, `relatedServices` (**plural**, corrected in this revision — the design shows three related services per project, not one) |
| `about` | Hero, owner-story 2-col, philosophy 3-col value cards, stats grid, photo grid, CTA banner | `/rolunk` | **Resolved.** `AboutPage` singleton (`docs/content-model.md` Section 9) — mirrors `Homepage`'s pattern: hero, `ownerStory` (Portable Text), `philosophyValues`, `stats`, `photoGallery`, `cta`, `seo`. |
| `blog` (index) + `blog-article` (detail, **new in Revision 2**) | Index: horizontal card list. Detail: hero, author bar (name + date), body, tags, sidebar (service CTA + related articles) | `/blog` (index) + `/blog/[slug]` (detail) | `BlogPost` documents, with `author` now visually confirmed as a real design element (the author bar), matching the approved `Author` reference type |
| `contact` | 2-col: contact info + social links + map + CTA / contact form with GDPR checkbox | `/kapcsolat` | `BusinessSettings` (info, address — see the confirmed final address in the summary above) + the contact form itself (no Sanity content, per `docs/architecture.md` Section 9). GDPR acknowledgment is correctly wired into form validity in the prototype — preserve this behavior in production. |
| `impressum` (**new in Revision 2**) | Hero, four labeled fact-sections (Üzemeltető/Elérhetőség/Tárhely-szolgáltató/Szerzői jogok) as label/value pairs, legal citation footnote | `/impresszum` | None — static Next.js content per the confirmed decision, optionally reading facts like company name/registration number/address from `BusinessSettings` at render time rather than duplicating them by hand (`docs/content-model.md` Section 0, decision 3). |
| `privacy` (**new in Revision 2**) | Not fully inspected line-by-line in this pass; present as a distinct route/component, consistent with the Impresszum's static-page treatment | `/adatvedelem` | Same as Impresszum — static Next.js content. |
| `booking` | *(removed in Revision 2 — no longer exists in the prototype)* | **Dropped entirely.** Not implemented in production. | — |

**Content-model gap found during this inspection — now resolved:** the About page contains real editorial content (an owner-story narrative, a philosophy/values section, stats) that a non-technical owner might reasonably want to update occasionally — similar in spirit to why `Homepage` was approved as an editable singleton rather than static text. **Resolved:** a new `AboutPage` singleton (`docs/content-model.md` Section 9), mirroring `Homepage`'s pattern rather than static Next.js content.

**Content-model gap — resolved.** The Pricing/Árlista page's content is now modeled as `PriceCategory` (`docs/content-model.md` Section 9), a dedicated document type fully independent of `Service`, per your explicit decision.

---

## 9. Image/Asset Guidelines


- **All images in the reference app are Unsplash stock photography**, referenced by hardcoded photo IDs with URL-based sizing/crop parameters (`?w=...&h=...&fit=crop&auto=format`). This is placeholder content only — every image reference must be replaced with real Royal-Team photography uploaded through Sanity, per `docs/content-model.md`'s `imageWithAlt` object type.
- **Consistent darkening + gradient-overlay treatment** on large hero/banner images (`brightness-[0.65]` to `brightness-80` on the image itself, plus a CSS gradient overlay on a wrapping element, typically fading from the page background color into transparency) — this is a real, repeated technique worth documenting precisely as a production pattern (Section 7), not left as an ad hoc per-page implementation.
- **Card thumbnail images** use a fixed aspect treatment (fixed height, `object-cover`, moderate brightness reduction, hover state brightening + slight scale-up) — consistent across service cards, blog cards, and About's photo grid.
- **No responsive `srcset`/`sizes` handling is visible** in the reference app (single URL per image, sized via Unsplash's own query-string API rather than Next.js/Sanity-native responsive image handling). This is expected and fine for a prototype, but production must use Sanity's image pipeline + `next/image` (per `docs/architecture.md` Section 12) rather than anything resembling the reference app's approach.
- **Alt text:** the reference app's `<img>` tags do include `alt` attributes, generally reasonable descriptive text (not filenames) — a good sign for the source design intent, consistent with the `imageWithAlt` requirement already established in the content model.
- **The real logo asset exists but is unused in the code — confirmed decision, not left ambiguous.** `base_logo_transparent_background 1.svg` is present in the source repository (added alongside the Revision 2 design changes), but `RoyalTeamLogo` — the component actually rendered in the nav and footer — remains the original procedurally-generated inline SVG (a JS function drawing a seven-blade turbo-fan shape), unchanged from Revision 1. **Confirmed for production:** the real SVG file is the logo to use; the procedural placeholder component should not be carried forward. This is a genuine asset-integration task for the Next.js build, not a design decision still pending — the correct file already exists, it simply isn't wired into the prototype's own code yet.

---

## 10. Animation/Interaction Guidelines

Built on `motion/react` (Framer Motion) throughout. Observed patterns, all worth preserving as interaction *language* (not literal code):

- **Scroll-triggered fade/rise-in** (`initial={{opacity:0, y:16}}`, `whileInView={{opacity:1, y:0}}`, `viewport={{once:true}}`) on grid items (service cards, review cards, process steps), frequently staggered by index (`transition={{delay: i * 0.07}}` or similar) — a consistent, subtle entrance pattern, not per-instance improvisation.
- **Page-transition fade** (`AnimatePresence` + `mode="wait"` wrapping the active page component, simple opacity crossfade) — this specific mechanism is tied to the state-based SPA routing being discarded (Section 7), but the *visual effect* (a brief crossfade between pages rather than an instant cut) is worth preserving in production via Next.js's own page-transition/view-transition capabilities, evaluated at implementation time.
- **Accordion expand/collapse** (FAQ): chevron icon rotates 180° on open (`animate={{rotate: openFaq === i ? 180 : 0}}`), content height animates from `0` to `auto`. Standard, worth preserving exactly.
- **Mobile menu slide-down**: height/opacity animate on open, consistent with the accordion mechanism.
- **Hover micro-interactions**: consistent, small (arrow icons translate slightly on card hover, images scale slightly + brighten, border colors intensify) — all via Tailwind `transition-all duration-300`/`duration-500` rather than Framer Motion, i.e., hover states are CSS transitions, scroll/mount animations are Framer Motion. This is a sensible, worth-preserving division (don't reach for a JS animation library for simple hover states).
- **Scroll-linked nav background** (nav becomes blurred/bordered after `window.scrollY > 60`, via a scroll event listener) — a real, specific interaction worth preserving exactly, including the threshold value.

**Nothing here is exotic or risky to reproduce** — these are all standard, well-supported patterns in a Next.js/React context; no animation technique observed requires the SPA architecture to work.

---

## 11. Accessibility Requirements

Observations from the reference app, both positive and gap-flagging:

- Reasonable `alt` text present on images (Section 9) — good starting point, must remain a hard requirement in production per the content model's `imageWithAlt.alt` (required field).
- **Color contrast risk area, flagged for verification, not asserted as broken:** several text treatments use fairly low-opacity foreground colors against the background (e.g., `text-foreground/25`, `text-foreground/30`, `text-white/20` in the footer) for de-emphasized text (timestamps, secondary labels). These specific low-opacity values should be checked against WCAG contrast requirements once real colors are finalized in production — some (particularly the `/20`–`/25` range on the near-black footer) look likely to fail AA contrast for body-sized text, though decorative/non-essential micro-text has more leeway. Not something to silently "fix" by guessing new values — flagged for an actual contrast check during implementation.
- **No visible focus-state styling** was evident in the reviewed code for custom interactive elements (the hand-built `PrimaryBtn`/`OutlineBtn`, nav links, accordion triggers) — these rely on browser defaults rather than designed focus states. Production should design explicit, on-brand focus states (e.g., a visible gold outline/ring) for all interactive elements, both for accessibility compliance and because unstyled default browser focus rings would look visually inconsistent with this design's deliberate aesthetic.
- **Heading hierarchy** appears reasonable at a glance (single `h1` per page, `h2`/`h3` for section/card headings) but wasn't exhaustively verified line-by-line — worth a dedicated pass during implementation rather than assumed correct by extrapolation.
- The mobile hamburger menu and FAQ accordion both appear to be plain `<button>`-driven (good baseline for keyboard operability) rather than non-semantic `<div onClick>` patterns — a good sign to preserve in production.

---

## 12. Sanity-Driven Content Areas

Direct application of the architectural boundary stated in your instructions — **Sanity provides content, Next.js provides presentation** — mapped against what's currently hardcoded in the reference app:

| Hardcoded in reference app | Becomes Sanity content | Notes |
|---|---|---|
| `SERVICES` array (6 services, each with icon, title, subtitle, description, image, benefits list) | `Service` documents | The `Icon` field (a Lucide icon component reference) is presentation, not content — see note below. |
| `REVIEWS` array | `Review` documents | |
| `FAQS` array (general, homepage) + DPF-specific FAQ array | `Service.faq` (per-service embedded array) | **Confirmed resolved:** FAQ display is per-`Service` only. The reference app's two independent hardcoded FAQ arrays should not both survive into production — both should resolve to specific services' `faq` data. |
| `ARTICLES` array | `BlogPost` documents | |
| `PROJECTS` array (**new in Revision 2**) | `Project` documents | Includes the new `specs` field (structured vehicle/technical facts) and `relatedServices` (confirmed plural — Section 8). |
| `PRICING_CATEGORIES` array (**new in Revision 2** — category → items with name/note/price) | **Open — no Sanity content type defined yet.** | See the closing summary. This is a real, unresolved gap, not an oversight to quietly work around during implementation. |
| Business phone/address/hours, hardcoded independently across Navigation, Home contact strip, Footer, Contact page, DPF CTA card, **and now also the Impresszum page (Revision 2)** | `BusinessSettings` singleton | Confirmed final address: **Móricz Zsigmond utca 60., 2451 Ercsi, Hungary** (`docs/content-model.md` Section 7), replacing the placeholder "Ercsi, Autó utca 12." seen throughout the reference app. The redundant hardcoding across now six-plus locations remains a concrete, live illustration of why `BusinessSettings` was worth approving. |
| Owner story text, philosophy/values copy, stats (About page) | **Resolved:** `AboutPage` singleton (`docs/content-model.md` Section 9). | |
| Hero headline/subheadline/copy (Home) | `Homepage` singleton | |
| The Lucide icon assigned to each service (e.g., `Filter` for DPF, `Cpu` for diagnostics) | **Presentation, not content** — recommend a small, fixed enum/mapping maintained in code (e.g., a `serviceIcon` field on the `Service` schema constrained to a defined list of icon names, resolved to an actual icon component in the Next.js layer), rather than trying to let Sanity reference arbitrary icon components directly. | |
| The procedurally-generated `RoyalTeamLogo` component | **Confirmed replaced.** The real logo asset (`base_logo_transparent_background 1.svg`, present in the source repo but not yet wired into the app's code) is the confirmed production logo — see Section 9. | |

---

## 13. Design Elements That Must Remain Visually Consistent

Non-negotiable-unless-explicitly-changed, based on how consistently and deliberately each pattern recurs:

1. The three-typeface system and its role split (Rajdhani for display/interactive, JetBrains Mono for technical labels, DM Sans for body) — Section 3.
2. Effectively-zero border radius across all custom components — Section 1.
3. No drop shadows; depth via borders and image treatment only — Section 1.
4. Gold as the fixed brand accent color — Section 2 (implementation should change to consume the theme token properly; the visual result should not change).
5. The `Container` max-width/padding pattern and section vertical rhythm — Sections 4–5.
6. The image darkening + gradient-overlay technique for hero/banner sections — Section 9.
7. The corner-bracket image-framing motif — Section 1/7.
8. The `lg`-breakpoint (not `md`) mobile-nav cutover — Section 6.
9. Scroll-triggered fade/rise entrance animation on grid content, and the scroll-linked nav background change at 60px — Section 10.

**Previously open items, now resolved:** the meaning/wording of booking-oriented CTAs, whether a Projects page exists visually, whether the footer's fixed-dark treatment is intentional, the About page's content-management status, and URL language strategy — see the closing summary for the current status of each.

---

## 14. Technical Implementation Recommendations for Production

1. **Tokenize colors and fonts properly** — replace hardcoded hex values and inline `fontFamily` strings with a real Tailwind theme extension (CSS variables for color, named `fontFamily` keys), fixing the `--accent`-vs-hardcoded-hex redundancy identified in Section 2.
2. **Define an explicit type scale** rather than continuing the arbitrary-pixel-value pattern (Section 3).
3. **Build a small shared component library** covering the patterns in Section 7's "preserve" table (`Container`, `Button`, `SectionLabel`, `GoldDivider`, `CornerFramedImage`, `FaqAccordion`, `StarRating`, a card family) rather than re-implementing each pattern per page as the reference app does.
4. **Use real Next.js file-based routing** with one route per page/dynamic segment (`/`, `/szolgaltatasok`, `/szolgaltatasok/[slug]`, `/blog`, `/blog/[slug]`, `/rolunk`, `/kapcsolat`, and the new `/projektek` + `/projektek/[slug]`) — never the reference app's `useState`-based page switching.
5. **Pull in only the shadcn/ui primitives actually needed**, if any, rather than the full scaffolded set present in the reference tree.
6. **Do not port `ImageWithFallback`** — use `next/image` with Sanity-resolved URLs and Next.js-native image error handling.
7. **Replace the `[direction:rtl]` alternating-layout trick** with an explicit, readable mechanism (e.g., a `reverse` boolean prop on a shared row component).
8. **Verify contrast on all low-opacity text treatments** during implementation, not by inspection alone (Section 11).
9. **Design explicit focus states** for all interactive elements — not present in the reference app, needed for production regardless.
10. **Resolve the FAQ-data-shape question** (Section 12) — homepage-level FAQ vs. strictly-per-service FAQ — as a small content-modeling follow-up, not a blocker to starting implementation.

---

## Closing Summary

### 1. Complete page inventory
`home` (→ `/`), `services` index (→ `/szolgaltatasok`), `dpf` detail (→ generalized `/szolgaltatasok/[slug]` template), `pricing` (→ `/arlista`, **new in Revision 2**, content model resolved via `PriceCategory`), `projects` index (→ `/projektek`, **new in Revision 2**), `project-amg` detail (→ `/projektek/[slug]`, **new in Revision 2**, real routing deferred to implementation per confirmed decision), `about` (→ `/rolunk`, content model resolved via a new `AboutPage` singleton), `blog` index (→ `/blog`), `blog-article` detail (→ `/blog/[slug]`, **new in Revision 2**), `contact` (→ `/kapcsolat`), `impressum` (→ `/impresszum`, **new in Revision 2**, static content), `privacy` (→ `/adatvedelem`, **new in Revision 2**, static content). `booking` — **removed**, confirmed dropped, not implemented in production. **All route segments confirmed as Hungarian**, per the approved URL language decision.

### 2. Reusable component inventory
`Container`, `Button` (primary/outline variants), `SectionLabel`, `GoldDivider`, `CornerFramedImage`, image-hero-with-gradient-overlay pattern, card family (service/blog/project, shared visual language with type-specific fields), `FaqAccordion` (unify the two current near-duplicate implementations), `NumberedSteps`, `StarRating`, a pricing-table row/category component (**new**, from the `pricing` page), a project-card component distinguishing the "large first item" layout from standard grid items (**new**, from the `projects` page), an author-bar component (**new**, from `blog-article`), a labeled fact-list component (**new**, shared shape between the Impresszum's sections and the project detail page's spec table). The "available/status" badge is confirmed as a component, now with confirmed data behind it (`Service.isActive`) rather than a pending ambiguity.

### 3. Design token proposal
Unchanged in substance, but scoped to the resolved dark-only decision: the entire token layer (`theme.css`, `fonts.css`, `tailwind.css`) is byte-for-byte identical between Revision 1 and Revision 2, so the underlying values haven't changed — only the dark set is now in scope at all. Colors: consolidate around `theme.css`'s dark token values only, fix the `--accent`-vs-hardcoded-gold redundancy, drop unused chart/sidebar tokens (and the now-irrelevant light-mode token set and toggle mechanism entirely). Typography, spacing, and radius recommendations are unaffected by the theme decision: define a real type scale, codify the `py-20`/`py-24` and `max-w-7xl` container conventions, keep radius near-zero and shadows absent.

### 4. Sanity content dependencies
`Service` (replacing `SERVICES`, including embedded `faq`), `BlogPost` (replacing `ARTICLES`), `Project` (replacing `PROJECTS`, now including the confirmed `specs` and plural `relatedServices` fields), `Review` (replacing `REVIEWS`), `Author` (byline data — now visually confirmed in the design via the blog article's author bar, not merely inferred), `Homepage` (hero/intro/featured-content curation, now including a projects-preview section), `BusinessSettings` (consolidating contact-detail hardcoding now spread across six-plus locations including the new Impresszum page; confirmed final address recorded in `docs/content-model.md` Section 7), `PriceCategory` (replacing `PRICING_CATEGORIES`, resolved as a type fully independent of `Service` — `docs/content-model.md` Section 9). Icon selection per service: presentation-layer mapping, not raw Sanity content.

### 5. Production implementation recommendations
Unchanged in substance from the original review (Section 14) — tokenize properly, build the shared component set once, use real routing, trim the unused shadcn scaffold, drop the Figma-Make-specific image-fallback component, replace the RTL layout trick, verify accessibility gaps rather than assuming the design is compliant as-is. **Added from this revision:** implement real per-project `/projektek/[slug]` routing and a real map embed as confirmed, deliberate Next.js-phase work (not gaps to close now); wire in the real logo SVG in place of the procedural placeholder.

### 6. Problems found in the Figma-generated code
Carried forward from Revision 1 (all still present in Revision 2's code, since the token layer and most shared components are unchanged):
- Gold brand color hardcoded ~40+ times instead of consuming the theme's own already-correct `--accent` token.
- ~~Mixed color-space definition (hex vs. oklch) for `--destructive` across light/dark modes~~ — **no longer a production concern**, since the dark-only decision means only the single dark-mode value is ever used; there's no cross-mode mismatch left to normalize.
- Several unused Lucide icon imports.
- Entire ~50-file shadcn/ui scaffold present but almost entirely unused by the actual hand-built UI.
- Footer grid declared as 4 columns but only 3 column groups populated.
- FAQ accordion pattern implemented twice, independently (homepage and DPF page) — **now confirmed to be resolved by design decision, not just a code cleanup**: production uses `Service.faq` exclusively.
- Fragile `[direction:rtl]` trick used for alternating row layout.
- No responsive image handling, no designed focus states.

**New in Revision 2:**
- **A real routing/data bug in the Projects feature.** All three entries in the `PROJECTS` array share the identical `id: "project-amg"`, and the Projects index page's click handler navigates every card to the same hardcoded detail page regardless of which project was clicked — clicking the BMW M3 or Audi RS6 cards currently shows AMG C63 content. Per the confirmed decision, this is acceptable in the prototype (which is demonstrating one detail template, not real multi-project routing) and is deferred to the Next.js implementation phase — but it's a genuine bug, not a stylistic quirk, and shouldn't be mistaken for intentional behavior if the prototype is ever referenced again during implementation.
- **A stale code comment** (`{/* Benefits + Booking CTA */}` on the DPF page) referencing the removed booking concept — the rendered content is correct; only the comment wasn't cleaned up.
- **The real logo asset is present in the repository but unused in the actual component code** (Section 9) — confirmed as a production integration task, not an open question.

### 7. Design ambiguities requiring human review
Status of each item originally raised, after this revision and the decisions recorded at the top of this document:

1. ~~Every booking-oriented CTA~~ — **RESOLVED.** Booking fully removed; CTAs contextually reworded per page.
2. ~~The complete absence of a Projects/Case-Studies page~~ — **RESOLVED.** Projects index and detail pages added; see the routing bug noted in item 6 above as a separate, deferred implementation matter.
3. ~~Whether the "ELÉRHETŐ" status badge still makes sense~~ — **RESOLVED.** Confirmed driven by `Service.isActive` in production.
4. ~~Whether the footer's fixed-dark, theme-independent treatment is intentional~~ — **RESOLVED by the dark-only decision.** The site has no light mode at all, so the footer's dark styling is simply consistent with the rest of the site, not an anomaly. The only remaining, minor point (not a decision requiring input) is a code-cleanliness one: the footer should reference the shared `--background`/`--foreground` tokens rather than an independently hardcoded near-black value — see Section 2.
5. ~~The About page's content-management status~~ — **RESOLVED.** A new `AboutPage` Sanity singleton (`docs/content-model.md` Section 9), mirroring `Homepage`'s pattern.
6. ~~The homepage/DPF-page FAQ data-shape mismatch~~ — **RESOLVED.** Confirmed strictly per-`Service` via `Service.faq`.
7. ~~URL language strategy~~ — **RESOLVED.** Hungarian route segments confirmed throughout (`/szolgaltatasok`, `/rolunk`, `/arlista`, `/projektek`, `/kapcsolat`, `/impresszum`, `/adatvedelem`).

**New ambiguity surfaced by this revision — now resolved:**

8. ~~The Pricing/Árlista page has no confirmed Sanity content shape~~ — **RESOLVED.** `PriceCategory` (`docs/content-model.md` Section 9), a document type fully independent of `Service`, with embedded price items supporting both fixed and "starting from" pricing and hide-without-delete at both the category and item level.

No production code, Next.js project, or Sanity project has been initialized. The reference application was inspected only, across both commits, and was not modified.

