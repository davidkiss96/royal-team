# Royal-Team Platform — Development Guidelines (v1)

Status: Draft for review
Sources of truth this document sits alongside: `docs/product.md`, `docs/architecture.md`, `docs/content-model.md`, `docs/design-system.md` (the Figma design revision is still pending; nothing here should be read as approving or assuming any specific visual detail ahead of that).
Explicitly not governed by this document: `docs/database.md`, `docs/schema-design.md` — both describe the deferred appointment-booking architecture and must not influence v1 implementation decisions in any way.

Scope: engineering rules and conventions for building the approved v1 product — a premium, SEO-first Next.js + Sanity CMS business website for Royal-Team, with no booking, no payments, no customer accounts, no custom database, and no custom admin. No application code, Next.js project, or Sanity schema is created by this document.

---

## 1. General Engineering Principles

- **The approved documents are the source of truth for product and architectural decisions**, not this document, not code comments, not chat history. When this document and one of the four source documents appear to disagree, the source documents win, and the disagreement should be raised and resolved, not silently worked around.
- **Correctness of the things that actually matter commercially comes first** — SEO fundamentals, content accuracy, contact-form reliability, GDPR-conscious data handling — ahead of polish elsewhere, mirroring `architecture.md`'s own stated priority order.
- **Sanity provides content; Next.js provides presentation.** This boundary, established in `architecture.md` and `content-model.md`, is an engineering rule as much as an architectural one: content types define data, not layout; components define layout, not editable data. A component asking Sanity for something to render *differently* rather than something to render is a sign this boundary is being crossed.
- **Build only what v1 needs.** This project has direct precedent for scope discipline — the appointment-booking system was fully designed and then deliberately deferred rather than half-built. That standard applies to every future feature decision, not just the one it was first applied to.

---

## 2. Keep-It-Simple / Avoid-Overengineering Rules

- No abstraction is introduced before it's justified by **actual, observed repetition** — not anticipated future repetition. `design-system.md`'s recommended component set (`Container`, `Button`, `SectionLabel`, `GoldDivider`, etc.) earns its place specifically because each pattern already repeats many times in the approved reference design — that's the bar every future shared component should clear, not "this might be reused someday."
- No generic page-builder or content-block system, on `Homepage` or anywhere else — confirmed repeatedly across `content-model.md` and `design-system.md`, restated here as a standing engineering rule, not a one-time decision.
- No client-side state-management library (Redux, Zustand, or similar) without a concrete, demonstrated need. A content-driven marketing site has very little client state; plain React state and URL state should cover what exists.
- No speculative multi-tenancy, plugin systems, or "what if we need this for another business later" scaffolding — that ambition is explicitly deferred alongside the booking platform (`docs/database.md`'s banner), not something to smuggle back in through the website codebase.
- No feature from the deferred scope (booking, payments, accounts, custom admin) gets implemented "since we're already in there," even in a minimal form, without an explicit decision to revisit `docs/product.md`'s scope. This is the single most important instance of this rule, given how much design and architecture work already exists for that deferred feature — its presence in the project's history is not permission to reintroduce it piecemeal.
- Don't add infrastructure (testing frameworks, CI complexity, additional hosting services) ahead of a concrete need, consistent with `architecture.md`'s cost and simplicity goals.

---

## 3. Next.js Architecture Conventions

- **App Router only**, per `architecture.md`'s stated direction — no Pages Router code or conventions.
- **Real, file-based routes with real URLs per page**, once the final route list is confirmed against the finished design (`design-system.md` Section 8's page inventory, pending the Figma revision). This is a hard requirement, not a preference — the reference prototype's client-side `useState`-based "routing" was explicitly flagged as fundamentally incompatible with the SEO-first goal and must never inform the production implementation.
- **Static generation / ISR as the default rendering strategy** for content pages, per `architecture.md` Section 13, with revalidation windows chosen deliberately per content type rather than one blanket value applied without thought (a homepage hero likely tolerates a different staleness window than an urgent, rarely-changing legal page).
- **Route Handlers reserved for the narrow cases identified in `architecture.md` Section 5** — chiefly a possible Sanity webhook-triggered revalidation endpoint. The contact form and any other in-app mutation uses Server Actions, not a hand-rolled API route, unless a specific reason emerges to do otherwise.
- No route groups, parallel routes, or intercepting routes without a concrete need — these are real App Router capabilities, but nothing in the current scope calls for them, and reaching for them speculatively would be exactly the overengineering Section 2 warns against.

---

## 4. TypeScript Conventions

- Strict mode, no exceptions. `any` requires an explicit comment explaining why a more precise type genuinely isn't available — prefer `unknown` plus narrowing where the type is truly not known ahead of time.
- **Types describing Sanity content should be derived from the actual Sanity schema once it exists** (e.g., via Sanity's typegen tooling), not hand-written and left to drift from the real schema shape. A hand-maintained parallel type definition is a maintenance liability the moment the schema changes and the type doesn't.
- Shared types live in one clear, predictable location per content type (Section 19) — not redefined ad hoc per component that happens to need them.
- Explicit return types on exported functions/components where they aid a reader; don't over-annotate where inference is already obvious and correct.

---

## 5. React Component Conventions

- Functional components with hooks throughout — no class components.
- Page and layout files use Next.js's required default-export convention; all other shared components use named exports, for clearer refactoring and discoverability.
- Props are explicitly typed via an interface or type alias — no implicit `any` props, no untyped spread props without a clear reason.
- **Presentational components (the `Button`, `Container`, `Card`, etc. family identified in `design-system.md` Section 7) receive data via props and do not fetch their own content or import the Sanity client directly.** This is the concrete, component-level enforcement of the Sanity/Next.js boundary from Section 1 — a presentational component that reaches into Sanity itself is no longer reusable or independently testable, and quietly reintroduces content-and-presentation coupling the whole architecture is designed to avoid.
- Avoid prop-drilling workarounds (context providers, global state) for problems this project's actual scale doesn't have. A marketing site with a handful of page types doesn't need the state-management patterns of a complex application.

---

## 6. Server vs. Client Component Guidance

- **Default to Server Components.** Given the site is almost entirely content-driven, the large majority of components — arguably nearly all of them — should never need `"use client"` at all.
- **Client Components are reserved for genuine interactivity or browser APIs**, and per `design-system.md` Section 10, the known candidates are: the contact form's client-side validation/submission state, the mobile navigation toggle, the FAQ accordion's expand/collapse state, the scroll-linked navigation background change, and any Framer Motion-driven animation.
- **Push `"use client"` as far down the component tree as possible.** Don't mark an entire page Client just because one small interactive widget lives on it — isolate the interactive piece into its own small Client Component, and keep everything around it server-rendered. This directly protects the performance goals in Section 12.
- Client Components needing Sanity-sourced content receive it as props from a Server Component parent; they never fetch content themselves, and never hold or use a write-capable Sanity token.

---

## 7. Sanity Integration Conventions

- Content is fetched via Sanity's official client library and GROQ queries — no hand-rolled REST calls against Sanity's HTTP API.
- Only the read path is used by the public-facing application; no write-capable Sanity token is ever present in code the public app executes, consistent with `architecture.md` Section 15.
- Sanity project ID and dataset name are read from environment variables in one central place (Section 15), not hardcoded per call site.
- **Content-fetching code should not assume a specific Sanity Studio deployment topology.** `architecture.md` Section 6 leaves embedded-vs-separate Studio as an open decision — implementation should not bake in an assumption that only holds under one of those two outcomes.
- GROQ queries are defined once per genuine content need, in a clearly organized location (Section 19), not inlined and duplicated across every page that happens to need a similar shape of data.

---

## 8. Content Querying Conventions

- **Query only the fields a page or component actually uses.** Avoid blanket `*`-style projections that pull entire documents — this both wastes payload and creates an invisible dependency on fields that might change without the query author noticing.
- **Centralize repeated query fragments** — the `imageWithAlt` projection and the `seo` object projection (both defined once in `content-model.md` Section 1) should be defined once as reusable GROQ fragments, mirroring the same "shared building block" discipline already established at the content-model level. Don't let the query layer silently re-fragment what the content model deliberately kept unified.
- **Draft content must never leak into the public site.** Public queries resolve published content only. If preview/draft-mode is ever implemented (an explicitly deferred capability per `content-model.md` Section 10), it is a separate, deliberately gated concern — not something casually available by omission.
- Ordering and filtering (`Service.displayOrder`, `BlogPost.publishedAt` descending, `Service.isActive` filtering) belong in the GROQ query itself, not fetched unsorted/unfiltered and handled client-side afterward.

---

## 9. Image Handling and Optimization

- All Sanity-sourced images render through `next/image`, using Sanity's image URL builder for the source and explicit width/quality parameters, per `architecture.md` Section 12.
- **Every image requires real alt text sourced from the content's `alt` field** (`content-model.md`'s `imageWithAlt`, a required field for exactly this reason) — never a hardcoded generic string, and an empty/decorative-image exception is a rare, deliberate choice, not a default way to skip writing one.
- `sizes` attributes are set deliberately per usage context (hero banner vs. card thumbnail vs. gallery image) — these are visually very different use cases and shouldn't share one default blindly.
- No unoptimized `<img>` tags for CMS-driven images without a specifically documented reason.

---

## 10. SEO Implementation Rules

- Every page defines metadata through Next.js's Metadata API, sourced from the content's `seo` object, with defined, sensible fallbacks (title → content title, description → excerpt/summary) matching `content-model.md`'s design.
- Structured data (JSON-LD) is generated server-side from the same content driving the visible page — never separately maintained data that could drift from what's actually shown, per `architecture.md` Section 13.
- `noIndex` (`content-model.md` Section 1) is respected wherever set and used sparingly, matching its own field description's guidance.
- Sitemap and `robots.txt` are generated programmatically from live Sanity content, not hand-maintained lists that will inevitably fall out of date.
- Canonical URLs are set explicitly per page.
- Nothing that needs to be indexed is ever client-side-only rendered.

---

## 11. Accessibility Requirements

- Semantic HTML first — proper heading hierarchy, landmark elements, native `<button>`/`<a>` usage rather than non-semantic clickable `<div>`s, continuing the reasonable baseline `design-system.md` Section 11 observed in the reference app.
- **Explicit, on-brand focus states for every interactive element** — `design-system.md` flagged this as absent from the reference design entirely; it must be designed and implemented in production, not carried forward as a gap.
- Color contrast verified against WCAG AA for real body/label text, with the specific low-opacity text treatments flagged in `design-system.md` Section 11 checked explicitly against final colors, not assumed acceptable because they read fine in the reference screenshots.
- All interactive elements are keyboard-operable — verify tab order and enter/space activation specifically for the FAQ accordion, mobile navigation, and the contact form.
- Form fields have real associated labels, not placeholder-text-only labeling, and validation errors are exposed in a way assistive technology can announce (e.g., `aria-describedby`, an `aria-live` region for submission feedback).

---

## 12. Performance Requirements

- Core Web Vitals are a hard requirement, not an aspiration, per `product.md` Section 14 and `architecture.md`'s stated priorities.
- Static generation/ISR is the default; dynamic per-request rendering is reserved for what genuinely needs it (the contact form's submission path).
- **Image weight is the single highest-risk performance area for this photography-first site** — actively managed per Section 9, not left to default behavior.
- Client-side JavaScript surface area stays minimal — a direct consequence of the Server/Client Component discipline in Section 6, not a separate effort.
- Font loading is optimized (e.g., `next/font` for the three typefaces identified in `design-system.md` Section 3), avoiding layout shift and unnecessary render-blocking requests.

---

## 13. Error Handling

- The contact form shows clear, field-specific validation messages, distinct from a generic fallback message reserved for genuine server/network failures.
- Sanity content-fetch failures degrade gracefully where reasonable (a missing optional image shouldn't crash a page), but a failure to load genuinely essential content shows a proper error state via Next.js's `error.tsx` convention — not a blank or broken page, and not scattered ad hoc `try/catch` handling without a consistent pattern.
- `not-found.tsx` is used appropriately per route segment for genuinely missing content (e.g., a slug with no matching document).
- Internal error details (stack traces, raw upstream error bodies) are never shown to the visitor — logged server-side, with a safe, generic message shown publicly.

---

## 14. Security Considerations

- All contact-form input is validated server-side (schema-based, e.g., Zod) as the actual integrity boundary, independent of and in addition to client-side validation, per `architecture.md` Section 15.
- Basic rate limiting protects the contact form's unauthenticated, publicly-reachable submission path.
- No write-capable Sanity token, or any other secret, is ever present in client-executed code.
- Dependencies are kept current and deliberately minimal (Section 21), reducing supply-chain exposure as a direct consequence, not a separate security initiative.
- Any user-supplied content is treated as untrusted before being used anywhere else in the system (e.g., before being included in a forwarded email).

---

## 15. Environment Variables and Secrets

- No secret or credential is ever committed to the repository. `.env.local` (or the framework's equivalent) is gitignored; a `.env.example` listing variable names (no real values) is maintained so setup is reproducible for another developer.
- **Public vs. private environment variables are understood correctly, not assumed.** Next.js only exposes variables explicitly prefixed `NEXT_PUBLIC_` to client-side code — genuinely non-secret values like the Sanity project ID/dataset name may use that prefix; anything genuinely secret (the transactional email provider's API key, any Sanity write token if one is ever introduced) must not be, and this distinction should be double-checked deliberately, since accidentally prefixing a secret is a real, easy-to-make mistake with serious consequences.
- Secrets are managed through whichever hosting provider's standard mechanism applies once the hosting decision (`architecture.md` Section 17, still open) is made — not hardcoded, and not accessed through a provider-proprietary secrets SDK, consistent with the project's portability stance.

---

## 16. Form Handling

- The contact form is the only form in v1, per the confirmed reduced scope. It is validated client-side for immediate user feedback and server-side (via a Server Action) as the actual, non-bypassable integrity boundary, per `architecture.md` Section 9.
- Progressive enhancement is preferred where it's cheap to achieve — a Server Action-backed form degrading reasonably without JavaScript is a nice property of the platform, not something to engineer around exhaustively if it costs real effort.
- The spam-mitigation mechanism (a honeypot field or equivalent, per `architecture.md` Section 9) must be implemented in a genuinely accessible-safe way — a honeypot that confuses screen readers or keyboard navigation solves one problem by creating another.
- Success and failure states are always shown clearly to the user; there is no silent failure mode.

---

## 17. GDPR/Privacy Considerations

- The contact form collects only what `product.md` Section 9 specifies — name, a contact method, and a message — with no additional fields added without a deliberate reason.
- **No database or persistent log of contact-form submissions is introduced without an explicit decision to revisit the approved architecture.** The current design deliberately has no application database at all; a well-intentioned "let's also save a copy of submissions somewhere for reference" addition would silently reintroduce exactly the persistence layer this project's architecture avoided on purpose. If that need ever becomes real, it's a documented architecture decision, not an incidental implementation choice.
- Cookie consent is obtained before any non-essential (e.g., analytics) cookie is set, per `product.md` Section 15.
- The Privacy Policy and Impresszum are developer-controlled static content (per the approved `content-model.md` decision), referencing `BusinessSettings` fields at render time rather than duplicating facts like the company registration number by hand in a second place.

---

## 18. Naming Conventions

- Files and folders: kebab-case, following standard Next.js convention. Component exports: PascalCase.
- **Sanity schema type names, TypeScript types, and query function names should mirror each other exactly** — a `service` Sanity document type corresponds to a `Service` TypeScript type and a `getServices()`/`getServiceBySlug()` query function, not a parallel naming scheme that drifts from the schema's actual names.
- **Code (variables, functions, types, file names) stays in English throughout**, even though all user-facing content and copy is Hungarian. This avoids a confusing mixed-language codebase and is near-universal practice; localized strings and content remain properly Hungarian wherever a visitor actually sees them, consistent with the i18n-ready architecture already established.

---

## 19. File/Folder Organization

- Standard Next.js App Router layout: `app/` for routes, with route-specific components colocated only when they're genuinely specific to that route; a shared `components/` directory for the cross-route reusable set identified in `design-system.md` Section 7.
- **Finalized:** `src/lib/sanity/` holds the Sanity integration foundation — `client.ts` (the read-only `sanityClient`) and `image.ts` (`urlForImage()`, `@sanity/client`/`@sanity/image-url` were chosen over `next-sanity` for this foundation, `architecture.md` Section 6.1) — not scattered per-component or duplicated per page.
- **Query/type organization mirrors `content-model.md`'s content types** (`Homepage`, `BusinessSettings`, `Service`, `BlogPost`, `Project`, `Review`, `Author`, `AboutPage`, `PriceCategory`) — one predictable module per content type under `src/lib/sanity/queries/` is the default once a page actually needs it, so "where do I find how we fetch a Service" always has an obvious answer. Not created until the first real query exists (`architecture.md` Section 6.1) — an empty per-type scaffold would be exactly the unused-code pattern Section 2 warns against.
- Start flat; introduce deeper nesting only once a directory's flat file count genuinely becomes hard to navigate — the same "don't abstract before it's proven necessary" principle from Section 2, applied to file structure specifically.

---

## 20. Reusable Component Strategy

- **Build `design-system.md` Section 7's identified component inventory first** — `Container`, `Button` (primary/outline), `SectionLabel`, `GoldDivider`, the corner-framed-image pattern, the card family, `FaqAccordion`, `StarRating`, and the numbered-steps pattern. These are already validated as repeating, load-bearing patterns in the approved design — not a guess about what might be reusable.
- The same "proven repetition" bar from Section 2 governs any *new* shared component proposed beyond that list — extract on the second or third occurrence of a pattern, not preemptively.
- Reusable components stay strictly presentational (Section 5) — a component that's reusable in principle but secretly assumes a specific data-fetching context isn't actually reusable.

---

## 21. Dependency Management

- **Every new dependency needs a stated reason** — what specific problem it solves that isn't already reasonably solvable with what's in place. This is also an explicit AI-assisted-development rule in Section 25, restated here as a general engineering norm that applies regardless of who's writing the code.
- Prefer the framework's native capability over a third-party package where one reasonably exists — e.g., Next.js's built-in Metadata API over a third-party SEO package, already the direction set in `architecture.md` Section 13.
- **Audit for and remove unused dependencies** as a matter of course. `design-system.md` documented a concrete cautionary example: the reference app ships an entire ~50-file shadcn/ui scaffold that the actual application barely uses. Production must not repeat that pattern — only the specific primitives genuinely needed are added.
- Avoid pulling in a substantial library to solve a problem that's simple to hand-roll correctly, and avoid unconstrained version ranges that could silently pull in breaking changes.

---

## 22. Testing Expectations

- This is a content-driven marketing site with limited custom business logic — exhaustive test coverage is not the goal, and scaffolding a full testing setup before there's real logic to test would itself be a form of the overengineering Section 2 warns against.
- **Testing effort concentrates where actual logic and risk live:** the contact form's validation and submission logic, any non-trivial GROQ query/data-transformation logic, and SEO-metadata-generation logic (a bug here is easy to ship unnoticed and has outsized, hard-to-detect impact on the site's primary business goal).
- Purely presentational components generally don't need dedicated unit tests beyond what TypeScript's type-checking and a manual/visual QA pass already catch.
- The specific testing framework (likely Vitest or whatever Next.js's own current tooling recommends) is an open implementation decision to make once the project is actually initialized and there's real logic to justify it — not something to pre-select or scaffold speculatively now.

---

## 23. Git and Commit Conventions

- Small, focused commits — one logical change per commit, directly mirroring the "implement the smallest appropriate change" step in the AI-assisted workflow (Section 25).
- Commit messages explain *why* a change was made where that reason isn't obvious from the diff alone, not just a restatement of *what* changed.
- No secrets or environment files ever committed (Section 15).
- Feature branches for non-trivial work; direct-to-main is acceptable for small, low-risk documentation or configuration changes given the current one-to-two-person team size — a heavyweight review process would be disproportionate to the team, not a sign of rigor.

---

## 24. Documentation Expectations

- The five documents governing this project (`product.md`, `architecture.md`, `content-model.md`, `design-system.md`, and this one) are updated when a real decision changes — a decision that changes actual product or architectural direction should never live only in chat history or a code comment.
- Genuinely consequential new architectural decisions get reflected back into the relevant source document; routine implementation choices (e.g., which specific utility function handles a small formatting task) don't need document-level tracking.
- Code comments explain *why*, especially for non-obvious decisions — mirroring the reasoning-forward style already established throughout this project's documentation — not restating what the code already obviously shows.

---

## 25. AI-Assisted Development Rules

This project has been built through an explicitly AI-assisted workflow from the discovery phase onward, and has already demonstrated concrete cases where holding to these rules produced a better outcome than the first draft — worth naming, since these aren't abstract cautions:

- **The `isFeatured` field on `Project` and `Review` was proposed, then removed** after a closer review revealed a cleaner, centralized alternative (`Homepage`'s reference-array curation, `content-model.md` Sections 4–5). The right behavior wasn't defending the first draft — it was recognizing a better answer and revising.
- **A dominant assumption in the approved reference design (the booking-focused call-to-action, present on nearly every page) was flagged as a scope conflict rather than silently implemented or silently ignored**, once the design was inspected against the already-approved reduced scope (`docs/design-system.md`'s opening findings).

The standing rules, in force for any AI-assisted work on this project going forward:

- **Do not blindly implement a request if a better or safer solution exists.** Say so, explain why, and propose the alternative — don't implement the less-good version just because it's what was literally asked for.
- **Challenge architectural decisions when appropriate**, including decisions made earlier in this same project. Prior approval isn't permanent immunity from reconsideration if new information (like the design inspection above) reveals a problem.
- **Do not introduce dependencies without a reason** (Section 21).
- **Do not create abstractions before they are justified** (Section 2/20) — proven repetition, not anticipated repetition.
- **Prefer simple, boring, maintainable solutions** over clever ones, consistent with this project's stance in every document produced so far.
- **Before making a large change, inspect the existing implementation and the relevant approved documentation first.** Don't propose or build against an assumed state of the codebase or product scope — verify it.
- **Do not rewrite working code unnecessarily.** A change should be scoped to what the task actually requires, not an opportunity for unrelated cleanup, however tempting.
- **Do not modify unrelated files.**
- **Do not silently change product requirements.** If a requirement seems wrong, outdated, or in conflict with something else, raise it explicitly — don't quietly implement a different behavior than what was specified.
- **Do not invent missing business requirements.** Where the documentation is genuinely silent on something (e.g., the price-list content shape, or the exact map/location integration approach — both currently open, see the summary below), the correct response is to flag the gap and ask, not to assume a plausible-sounding answer and proceed.
- **If an important requirement is ambiguous, ask before implementing.** An ambiguity resolved by guessing is a decision made without the person responsible for the business actually deciding it.
- **When multiple reasonable technical approaches exist, briefly explain the tradeoff and recommend one** — don't silently pick one without surfacing that a choice was made, and don't present an exhaustive options menu for every trivial decision either; match the depth of the tradeoff discussion to how consequential the decision actually is.
- **Preserve the approved Figma design rather than inventing new UI patterns during implementation.** Once the pending Figma revision is finalized, `docs/design-system.md` (updated accordingly) governs visual decisions — implementation is not a second opportunity to redesign.
- **Treat the project documentation as the source of truth** for product and architectural decisions, per Section 1.

### AI-Assisted Implementation Workflow

For any non-trivial change:

1. **Understand the task** — what's actually being asked, and what problem it's solving.
2. **Inspect relevant files** — the current state of the code, not an assumed state.
3. **Identify affected architecture/components** — which parts of the approved documentation and which parts of the codebase this change actually touches.
4. **Explain the proposed approach when the change is non-trivial** — before writing code, not after, so a bad direction is caught early rather than after significant work.
5. **Implement the smallest appropriate change** — scoped to the actual task, per Section 23's commit-granularity principle.
6. **Run relevant checks/tests** — type-checking, linting, and whatever test coverage exists for the affected area.
7. **Review the resulting diff** — confirm the change is what was intended and touches only what it should (Section 25's "do not modify unrelated files," verified concretely).
8. **Report what changed and any remaining concerns** — including anything discovered along the way that seems worth flagging, even if it wasn't the direct subject of the task.

---

## Summary

### What this document adds
A complete set of engineering conventions across 25 areas, grounded specifically in this project's already-approved documents rather than generic best practice — every section ties back to a specific decision already made in `product.md`, `architecture.md`, `content-model.md`, or `design-system.md`, and several sections directly generalize a lesson already demonstrated earlier in this project's own history (the `isFeatured` reversal, the booking-CTA scope conflict).

### Contradictions found
None outright, between this scope restatement and the four current approved documents. Two **gaps** were originally flagged here — both are now resolved:

1. ~~**Price list**~~ — **RESOLVED.** `PriceCategory` (`docs/content-model.md` Section 10), a document type fully independent of `Service`.
2. ~~**Precise business location/map**~~ — **RESOLVED.** A real, interactive Google Maps embed is implemented on the Contact page (`/kapcsolat`), using a **click-to-load** pattern: a styled placeholder renders by default (no iframe, no request to Google) until the visitor clicks "Térkép betöltése," at which point the map mounts. This needs no Google Maps API key (`docs/architecture.md` Section 9.1) and is now listed in `docs/architecture.md` Section 16's external-services table.

### Engineering decisions that remain open
As of the legal-pages/Contact-page implementation step, hosting, transactional email, receiving mailbox, analytics, and map/location are all **confirmed** (`docs/architecture.md` Sections 9.1, 11, 13, 16, 17) — no longer open. What's still genuinely open:
- Sanity Studio deployment topology (`architecture.md` Section 6).
- Testing framework selection (Section 22) — deliberately deferred until real logic exists to justify it.
- ISR revalidation windows per content type (Section 3) — a real decision, but one better made against real content-update cadence once Sanity is wired in, not speculatively now.
- The Contact form's real Server Action + Resend integration itself (the form's client-side UI/validation is implemented; the actual send is intentionally not yet wired up, per this step's explicit scope limits).

### Recommended next steps
1. Wire up the Contact form's Server Action (validate server-side, send via Resend to the Google Workspace mailbox) — the one piece of this step intentionally left as a UI-only boundary.
2. Resolve the Sanity Studio deployment topology (embedded vs. separate) once Sanity itself is introduced.
3. Initialize the Sanity project/schema and replace the hand-written mock data (`src/lib/mock/`) with real Sanity-sourced content and generated types.
