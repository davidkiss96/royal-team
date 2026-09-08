# Royal-Team Platform — Architecture Specification (v1)

Status: Draft for review — **substantially revised following v1 scope reduction**
Source of truth: `docs/product.md` (updated for the Business Website scope)
Scope: Conceptual system architecture for the reduced v1 scope. No Sanity schema definitions yet (see `docs/content-model.md`), no application code, no project initialization.

> **Scope-change notice:** This document supersedes the previous booking-platform architecture for v1 purposes. The previous PostgreSQL/Prisma/custom-admin/Auth.js/booking architecture is **not deleted** — it's preserved in `docs/database.md` and `docs/schema-design.md`, explicitly marked as deferred/future scope for a possible later appointment-booking platform. Everything below describes the current, reduced v1 architecture only.

---

## 1. Architecture Goals

Revised for the new scope, in priority order:

1. **Correctness of the things that still matter commercially** — SEO fundamentals, content editability, contact-form reliability — over theoretical elegance elsewhere.
2. **Low, predictable operating cost** (target ~0–5,000 HUF/month excluding domain) — **now more comfortably achievable** than under the original scope, since several previously open cost/complexity line items (database hosting, object storage, authentication infrastructure) are removed entirely.
3. **Developer-learning value** — this remains a goal, but the *shape* of the learning changes: less backend/database/auth depth in this reduced v1 (since none of those subsystems exist now), more depth in headless-CMS integration, content modeling, and SEO-focused Next.js architecture. Worth naming plainly: some of the backend-skill-building ambition behind the original scope is deferred along with the booking system.
4. **Portability** — standard framework conventions over provider-specific features, with one deliberate, acknowledged exception: Sanity itself (Section 3).
5. **Clean, reusable content structure** — so a future second business implementation (if the platform ambition is ever revisited) benefits from clean content modeling, without over-investing in reusability now for a much smaller v1.
6. **Simplicity over speculative flexibility** — even more directly achievable now: an entire architectural layer (custom backend, database, auth) has been removed, not just simplified.

---

## 2. High-Level System Architecture

A single Next.js application (App Router, TypeScript) renders the public website and handles contact-form submissions. **There is no application database.** Content is fetched from Sanity's hosted content API at build/request time; the contact form validates input server-side and forwards it by email — nothing is persisted by this application.

```
                        ┌─────────────────────────────┐
                        │      Next.js Application     │
                        │                              │
   Browser (customer) ──┼──► Public pages (SSG/ISR,     │
                        │    content fetched from Sanity)
                        │                              │
                        │    Contact form (Server       │
                        │    Action: validate → email)  │
                        └───────────┬──────────────────┘
                                    │
                    ┌───────────────┼────────────────────┐
                    ▼                                     ▼
              Sanity (hosted content API +          Transactional email
              image CDN + Sanity Studio)             provider (contact
                                                       form forwarding)
```

**What's gone compared to the original architecture, stated plainly:**
- No PostgreSQL, no Prisma, no application-managed database of any kind.
- No Auth.js, no session management, no login of any kind within this application — content-editor authentication is entirely Sanity's responsibility, via Sanity Studio's own account system.
- No admin route/surface within the Next.js app — Sanity Studio is the entire content-management interface (whether embedded at a route within this same Next.js app, or run as its own small separate deployment — see Section 6).
- No object storage integration (R2 or otherwise) — Sanity's asset pipeline and CDN serve this role now.
- No booking domain logic, no double-booking prevention, no availability model.

**Why this is a materially simpler architecture, not just a smaller one:** the previous design's most rigorous, highest-stakes sections (database-level double-booking prevention, auth session security, media join-table integrity) addressed problems that **no longer exist** in this scope, rather than being solved more simply. This is worth being explicit about, since it's a meaningfully different kind of simplification than "same problems, easier solutions."

**Status: v1 requirement.**

---

## 3. Application Boundaries

Two logical surfaces now, down from three:

- **`public` surface** — everything an anonymous visitor sees. Content-driven, fetched from Sanity, optimized for caching/SSG/ISR and SEO.
- **`contact` surface** — the contact form and its server-side handling (validation + email forwarding). Small in scope, but still treated with real rigor (input validation, rate limiting) since it remains an unauthenticated, publicly-reachable write path — the one place in this architecture where "external input reaches server logic" still applies.

**Sanity Studio is not a third application surface in the same sense as before** — it's a separate product (Sanity's own), either embedded at a route (e.g., `/studio`) within this Next.js app for convenience, or deployed as its own small standalone app. Either way, its authentication, access control, and editing UI are Sanity's responsibility, not ours to build or maintain. See Section 6 for the embedding-vs-separate tradeoff.

**Status: v1 requirement.**

---

## 4. Frontend Responsibilities

Largely unchanged from the original plan, since these responsibilities were never dependent on the booking system:

- Render public content pages via Static Site Generation with Incremental Static Regeneration (ISR), sourced from Sanity's content API — content changes made in Sanity Studio should propagate without a full redeploy.
- Render the contact form server-side, with minimal client-side JavaScript (form state, validation feedback) — consistent with the original SEO-first, server-rendering-first philosophy.
- Own presentation-layer concerns only: layout, responsive design, accessibility markup, client-side form UX.

**Removed:** anything related to rendering an admin UI or a booking flow — neither exists in this application anymore.

**Status: v1 requirement.**

---

## 5. Backend / Server Responsibilities

Substantially reduced:

- **Server Actions** for the contact form submission — the only meaningful server-side mutation in this application now. Validates input (schema library, e.g., Zod), applies basic rate limiting/spam protection, and triggers the forwarding email.
- **No Route Handlers are anticipated as a v1 requirement** — the previous design's cancellation-link endpoint no longer exists (no bookings to cancel), and there's no other identified need for a Route Handler at this scope. If Sanity's webhook system is ever used to trigger an ISR revalidation on content publish (a reasonable, optional enhancement — see Section 12), that would be the one plausible Route Handler need; flagged as a nice-to-have, not a hard v1 requirement, since time-based ISR revalidation alone may be sufficient for a low-frequency-publishing content site.
- All contact-form business rules (validation rules, spam-protection logic) live in one clearly-owned module — the "domain layer" concept from the original architecture is far less necessary now (there's really only one piece of business logic left: "process a contact submission"), but the principle of not duplicating that logic across entry points still applies if it's ever invoked from more than one place.

**Status: v1 requirement.**

---

## 6. Content Management Architecture (Sanity)

This section replaces the original "Admin Architecture" section.

- **Sanity CMS** is the system of record for all structured content: services, blog posts, projects/case studies, reviews, business/contact information, and media. See `docs/content-model.md` for the detailed content-type design.
- **Sanity Studio** (Sanity's React-based content-editing application) is the entire content-management interface. No custom admin UI is built.
- **Access control:** governed entirely by Sanity's own project-member system — the owner and content editor(s) are added as Sanity project members with appropriate roles, using Sanity's built-in authentication (which supports email/password, Google, and other providers depending on plan). This directly satisfies the original product requirement ("support multiple admin users without structural rework") — arguably better than the original plan, since there's no custom `User` table or auth flow to build or maintain at all.

**OPEN DECISION — embedded Studio vs. separate deployment:** Sanity Studio can be embedded as a route within this same Next.js application (e.g., `/studio`, using the `next-sanity` package), or deployed as its own small, separate application (e.g., a bare Sanity Studio project deployed to Sanity's own free hosting or elsewhere). Tradeoffs:
- **Embedded (`/studio` route in the same app):** one deployment to manage, one codebase, simpler mental model. Tradeoff: the Studio's JavaScript bundle becomes part of this application's build, and the `/studio` route needs to be excluded from SEO indexing and from any caching/ISR behavior meant for public pages (a small but real configuration detail to get right).
- **Separate Studio deployment:** cleaner separation (the public site's build/deploy is untouched by Studio changes and vice versa), and Sanity offers free hosting for the Studio itself (`sanity deploy`, resulting in a `*.sanity.studio` URL) — meaning this option may add zero extra hosting cost or complexity, not more.
- **Recommendation, low-confidence:** the separate-deployment option (using Sanity's own free Studio hosting) is likely the simpler choice overall, specifically because it sidesteps the SEO/caching exclusion concerns of embedding, at no additional cost. This is a low-stakes, reversible decision — flagging it as open rather than deciding unilaterally, since it's cheap to change either way.

**Why Sanity over a custom-built admin, restated as the core architectural consequence of the scope change:** the original project's most-debated architecture decision was "custom admin vs. headless CMS," resolved in favor of a custom admin specifically *because* booking/transactional data (which a CMS handles poorly) needed to live alongside content in one consistent system. With booking removed from scope, that reason no longer applies — there is no transactional data left that a CMS would handle badly. A headless CMS is now a better fit than a custom admin would be, not a compromise: less code to build and maintain, natively better non-technical editing UX (Sanity Studio is a mature, polished product; a custom admin would need real design investment to match it), and multi-user access without any custom auth work.

**Status: v1 requirement**, Studio deployment topology open (low-stakes).

---

## 7. Authentication and Authorization Approach

**There is no authentication system in this application.** This entire section — previously one of the more substantial parts of the architecture (Auth.js, magic-link sign-in, a `User` table with a `role` field) — is removed from v1 scope.

- Content-editor authentication is entirely Sanity's responsibility (Section 6).
- There is no customer-facing authentication (unchanged from the original plan — guest-only was already the design; it's simply now the *only* mode of interaction, since there's no booking flow that guest-mode was originally built to support).
- No sessions, no cookies-for-auth-purposes, no password/magic-link infrastructure exists anywhere in this codebase.

**This is a genuine simplification worth naming, not just a smaller version of the old section:** an entire class of security responsibility (session management, credential handling, auth-related attack surface) is now outside this application's scope entirely, delegated to a mature third-party product built specifically for that purpose.

**Status: not applicable to v1 — removed, not deferred**, since nothing about the reduced scope creates a future need to revisit this unless booking (and its guest/admin distinction) is reintroduced.

---

## 8. Content Modeling Architecture

Detailed content-type design lives in `docs/content-model.md`. At the architecture level, the key decisions:

- Content is modeled as **purpose-specific Sanity document types** (Service, BlogPost, Project, Review, BusinessSettings — see `docs/content-model.md` for the full list and reasoning), not a generic page-builder or flexible content-block system. This matches the platform's consistent preference for structured, purpose-specific modeling over speculative flexibility, now applied to a headless-CMS context instead of a relational one.
- Rich text is authored via Sanity's native **Portable Text** format — a structured, JSON-based rich-text representation (conceptually similar in spirit to the Tiptap JSON approach from the original architecture, though it's Sanity's own format, not a separate editor library we integrate ourselves).
- Images are handled via Sanity's native image type and asset pipeline — see Section 12.

**Status: v1 requirement**, detailed in `docs/content-model.md`.

---

## 9. Contact Form Architecture

Replaces the original "Booking Architecture" section (Section 9) in full — booking no longer exists.

**Flow:**
1. Customer fills out the contact form (name, contact method, message) on the Contact page or from a service page's call-to-action.
2. Client-side validation provides immediate feedback; **server-side validation is the actual integrity boundary** (a Server Action re-validates everything regardless of client-side checks).
3. On successful validation, the Server Action sends the message via **Resend** (confirmed transactional email provider, Section 11) to the business owner's designated address (`szerviz@royalteam.hu`, received in the business's **Google Workspace** mailbox — confirmed, Section 11).
4. The customer sees an on-screen success confirmation. No database write occurs — there is no `Booking`-equivalent record created anywhere in this application.
5. On validation failure, the customer sees field-level error feedback and can correct and resubmit.

**Spam/abuse protection:** basic rate limiting (e.g., IP-based, or a lightweight service like Vercel's/Cloudflare's built-in options depending on the eventual hosting choice) and/or a honeypot field — proportionate protection for an unauthenticated public write path, without over-engineering a problem that, for a small local business site, is unlikely to see serious abuse volume.

**No delivery guarantee beyond the transactional email provider's own reliability** — since there's no database fallback/retry-queue in this architecture (that would be disproportionate complexity for this scope), a transient email-provider outage could mean a lost inquiry. This is an accepted risk at this scale, but worth naming rather than silently assuming email delivery is infallible — if this ever becomes a real problem in practice, a lightweight fallback (e.g., logging failed sends somewhere reviewable) would be a proportionate, small addition, not a reason to reintroduce a database now.

**Status: v1 requirement.**

### 9.1 Map/Location Integration (confirmed, closes a previously-open gap)

The Contact page includes an interactive Google Maps embed of the workshop
location (Móricz Zsigmond utca 60., 2451 Ercsi), implemented as
**click-to-load**: the page renders a styled placeholder (no iframe, no
request to Google) until the visitor explicitly clicks a "Térkép betöltése"
button, at which point the Google Maps iframe mounts and an external
"Megnyitás Google Térképen" link is shown alongside it. This requires no
Google Maps API key (a plain `google.com/maps?...&output=embed` iframe
source), so it adds no new billing/credential surface. `docs/development-guidelines.md`'s
previously-flagged "map/location integration approach" gap is resolved by
this decision.

**Status: v1 requirement — implemented.**

---

## 10. Availability-Slot Model Concept

**Not applicable to v1.** No availability or scheduling concept exists in this scope. See `docs/database.md` Section 4 for the preserved future design.

---

## 11. Email Architecture

Narrower than the original scope, but still required:

- **Resend (confirmed)** is the transactional email provider, needed for exactly one purpose in v1: **forwarding contact-form submissions** to the business owner. The original plan's other email needs (booking confirmation, cancellation, admin magic-link) no longer exist. This was previously an open decision (candidates included Resend "or equivalent") — Resend is now the confirmed choice, not merely a placeholder example.
- **Google Workspace (confirmed)** is the receiving mailbox: Resend forwards each submission to `szerviz@royalteam.hu`, a business mailbox hosted on Google Workspace. Google Workspace is the system that actually stores the resulting email — this application never persists the submission itself (Section 9), consistent with `docs/product.md` Section 15's nuance that the data still exists somewhere (here: in Resend's delivery logs and in this Workspace mailbox), just not in an application-controlled database.
- Given the much lower email volume (contact-form submissions only, likely a handful per week at most for a small local business), Resend's free tier should comfortably cover this — cost risk here is very low.
- Templates: a single simple email template (the forwarded contact-form content) is sufficient.

**Status: v1 requirement — provider and receiving mailbox both confirmed, no longer open decisions.**

---

## 12. Media/Image Architecture

Substantially simplified — this entire section is now handled by Sanity rather than custom infrastructure:

- **Sanity's native asset pipeline** stores, optimizes, and serves all images uploaded through Sanity Studio. Sanity provides its own image CDN with on-the-fly transformation (resizing, format negotiation, cropping via "hotspot" selection) via URL parameters — this replaces the previously-planned Cloudflare R2 + `next/image` combination entirely for content images.
- **`next/image` may still be used on the frontend** to wrap Sanity-served image URLs for additional Next.js-side optimizations (e.g., responsive `sizes`, lazy loading, layout stability) — the two aren't mutually exclusive; Sanity handles the *storage and transformation* of the source image, `next/image` can still handle *how it's embedded in this specific frontend's layouts*. This is a reasonable combination, not a redundancy.
- No object storage provider (R2 or otherwise) needs to be provisioned or paid for separately — this removes an entire previously-open infrastructure decision.
- No dedicated video infrastructure, unchanged from the original decision (photography-first).

**Status: v1 requirement — and a genuine simplification, removing a previously-open cost/infrastructure decision entirely.**

---

## 13. SEO Architecture

Unchanged in substance from the original plan — SEO requirements never depended on the booking system:

- Metadata (title, description, canonical URL) generated per-page from Sanity content fields using Next.js's built-in Metadata API.
- Structured data (JSON-LD) rendered server-side per page type: `LocalBusiness`/`AutoRepair`, `Service`, `BreadcrumbList`, `FAQPage` where applicable — generated from the same Sanity content driving the visible page.
- Rendering strategy: SSG/ISR, sourced from Sanity, with revalidation triggered either on a time interval or (optionally) via a Sanity webhook calling a revalidation Route Handler when content is published (see Section 5's note on this being a plausible, optional Route Handler use case).
- `sitemap.xml` and `robots.txt` generated programmatically from Sanity content.
- **Analytics: confirmed — none in v1.** Previously an open decision between Plausible, Umami, and GA4-with-consent; now resolved as no analytics tool at all for v1 (`docs/product.md` Section 12/15). Search-performance visibility comes from Google Search Console alone, which needs no client-side script or cookie. This also means no cookie-consent banner is needed (`docs/product.md` Section 15) — there's nothing non-essential to consent to.

**Status: v1 requirement** — analytics tool selection is resolved (none), not merely deferred.

---

## 14. Internationalization Approach

Unchanged from the original architecture — this was never coupled to the booking system:

- Next.js's built-in i18n routing conventions (locale-prefixed routing) used from the start, even though only `hu` is populated.
- User-facing static UI strings live in a translation resource file per locale from day one.
- Sanity content itself does **not** need multi-locale schema support in v1 — no `locale` field on content types, no translation-pairing mechanism. Sanity does have native, well-supported internationalization features (locale-specific field values) that could be adopted later without a platform migration, if English content becomes a real requirement — arguably an easier future path than the original Postgres-based i18n migration would have been, since Sanity's tooling for this is mature and designed in from the platform level.

**Status: v1 requirement** (routing + UI strings), **explicitly deferred** (Sanity content localization) — same posture as before, now via a different (and likely easier) future mechanism.

---

## 15. Security Considerations

Narrower in scope, but not lower in rigor for what remains:

- **Input validation:** the contact form's Server Action validates all input server-side (schema library), independent of client-side validation.
- **No authentication/authorization surface exists in this application** to secure (Section 7) — Sanity's own security posture governs Studio access, which is outside this application's direct responsibility (though worth basic diligence: ensuring project members use strong credentials/2FA where Sanity supports it, and that API tokens are handled correctly — see below).
- **Sanity API token hygiene:** if any write-capable Sanity API token is ever used by this application (unlikely in v1, since all content authoring happens through Studio, not through this application), it must be kept server-side only, never exposed to the browser. Read-only tokens (or Sanity's public, unauthenticated read API for published content, depending on dataset visibility settings) are the expected default for the public website's content-fetching needs.
- **Rate limiting:** basic protection on the contact form endpoint, as noted in Section 9.
- **Secrets management:** Sanity project ID/dataset name (not secret), any API tokens (secret), and the email provider's API key live in environment variables, never committed to the repository.
- **Data minimization:** the contact form collects only what's needed (name, contact method, message) — unchanged principle from the original plan, now the *only* personal-data collection point in the entire application.

**Status: v1 requirement** — a smaller surface than before, treated with the same rigor.

---

## 16. External Services and Integrations

| Purpose | Recommendation | Status |
|---|---|---|
| Content management | **Sanity** (hosted content API, image CDN, Sanity Studio) | v1 requirement — new in this revision |
| Hosting | **Cloudflare** (Section 17) | CONFIRMED |
| Transactional email | **Resend** (contact-form forwarding only) | CONFIRMED (Section 11) |
| Receiving mailbox | **Google Workspace** (`szerviz@royalteam.hu`) | CONFIRMED (Section 11) |
| Maps/location | **Google Maps**, click-to-load embed on the Contact page, no API key required | CONFIRMED (Section 9.1) |
| Analytics | None in v1 | CONFIRMED — no analytics tool (Section 13) |
| Search performance | Google Search Console | v1 requirement, no cost |

**Removed entirely:** managed PostgreSQL, object storage (R2 or equivalent), and any auth-related service — none are needed in this scope.

**Status: simplified and largely settled — the database is removed entirely, Sanity is a new fixed requirement, and hosting/email/receiving-mailbox/maps/analytics are now all confirmed rather than open decisions.**

---

## 17. Production / Deployment Considerations

**CONFIRMED: Cloudflare** is the hosting provider for the Next.js frontend — previously the most consequential open decision in this document, now resolved.

- The Next.js frontend deploys to Cloudflare (Pages/Workers, per Cloudflare's Next.js runtime), avoiding the Vercel Hobby-tier commercial-use restriction that ruled Vercel's free tier out for this project.
- The hosting decision doesn't need to account for database connection pooling concerns (no Prisma, no Postgres) or object storage integration ergonomics (Sanity handles media independently of wherever the frontend is hosted).
- Cloudflare's own Next.js runtime edge cases (noted as a tradeoff when this was still an open decision) should be verified during initial project setup, but don't change the decision itself.

**Status: v1 requirement — confirmed, no longer an open decision.**

---

## 18. Cost Considerations

Updated analysis — the target (~0–5,000 HUF/month excluding domain) is **now more comfortably achievable**:

- Hosting: **Cloudflare, confirmed** (Section 17) — Cloudflare's free tier is expected to cover this site's scale, though exact usage should be verified once real traffic exists.
- **Database: removed entirely — $0, not a line item at all.** This was previously a "likely $0 on a free tier" item with some uncertainty; now there's no database to provision in the first place.
- **Object storage: removed entirely — $0, not a line item.** Sanity's asset storage/CDN is included in its own pricing (see below), not a separate cost.
- **Sanity CMS: new line item.** Based on current published pricing (verified via web search, July 2026 sources), Sanity's free tier is genuinely production-viable for a project at this scale — no cost for hosting the content lake itself, a meaningful free allotment of API requests and bandwidth, and (per most sources checked) enough free non-admin project members to cover the owner + one content editor. Some sources disagree on the exact free-tier seat count (reports ranged from 2 to 20 depending on the source and how recently it was verified against Sanity's actual pricing page) — this should be **confirmed directly against Sanity's current pricing page** before final commitment, but even the most conservative figures found are sufficient for this project's two-editor need. If usage ever exceeds free-tier limits, Sanity's paid "Growth" tier starts at $15/seat/month — a real cost, but well above what a small local-business site is likely to need.
- Email: likely $0 on a transactional provider's free tier, now even more comfortably so given the much lower volume (contact-form-only, not booking-confirmation volume).
- Analytics: $0 if a free/self-hosted option is chosen; a few dollars/month if a paid tool is preferred instead (unchanged open decision).
- Domain: excluded from this target per the product spec, unchanged.

**This target is now realistically achievable with more margin than before**, provided the hosting decision (Section 17) lands on a free-tier-compatible option. The removal of the database and object-storage line items is the single biggest driver of this improved margin.

**Status: target more comfortably achievable than under the original scope; Sanity's exact free-tier limits should be verified directly before final commitment.**

---

## 19. Portability Considerations

- The frontend remains built on standard Next.js conventions, unchanged in principle from the original plan.
- **New, deliberate exception to the "avoid vendor lock-in" principle:** Sanity is a hosted, proprietary content platform — content lives in Sanity's content lake, not in a portable, self-hostable format by default. This is a real tradeoff, not a hidden one: switching content-management systems later would require exporting and migrating content, not a drop-in swap. This is accepted because the alternative (a self-hosted or more portable CMS, or building custom content management) would cost meaningfully more development time for a benefit (avoiding lock-in to a specific vendor) that's low-priority given this project's actual constraints (one developer, tight budget, non-technical content owners who benefit from Sanity's polished editing experience). Sanity does support exporting content (via its CLI/API) if migration is ever needed, which meaningfully reduces the practical risk of this lock-in, even though it doesn't eliminate it.
- Everything else (hosting portability, standard Next.js APIs) remains as previously designed.

**Status: v1 requirement, with one named, deliberate, and justified exception (Sanity) — not an oversight.**

---

## 20. Reusability Boundaries

Revised significantly given the smaller v1 scope:

- The original "extract reusability later, from real evidence" philosophy still applies, but there is now much less v1 system to extract from — no booking/domain logic, no admin, no auth. What remains reusable in principle is mostly the **content-type design** (Section 8, detailed in `docs/content-model.md`) and general Next.js/SEO architecture patterns.
- The previously-designed booking/appointment domain model remains the most substantial piece of "reusability-relevant" thinking from this project, and it's exactly the piece now deferred to `docs/database.md`/`docs/schema-design.md` rather than built. If the platform ambition is ever seriously revisited, that preserved thinking — not this reduced v1 — is the more relevant starting point for the "reusable appointment-based business platform" vision.
- No multi-tenant data model, no plugin system, no abstract industry-configuration layer — all previously excluded, still excluded, and now even less relevant given the smaller v1 surface.

**Status: v1 architectural principle — reusability ambition is now mostly deferred alongside the booking system, not abandoned.**

---

## 21. Important Architectural Tradeoffs

Summarized, focusing on what changed in this revision:

| Decision | Chosen | Tradeoff accepted |
|---|---|---|
| Sanity CMS vs. custom admin + PostgreSQL | Sanity | Vendor lock-in to a hosted, proprietary platform, in exchange for eliminating an entire custom-built subsystem (admin app, auth, database) — a clearly favorable trade now that there's no transactional/booking data that would have justified the custom approach. |
| No authentication system at all | Removed | None — this was previously justified specifically by the need to support guest booking alongside admin auth; with booking gone, there's no remaining requirement this trade costs us anything against. |
| Sanity's native asset pipeline vs. custom object storage | Sanity | Less control over the exact storage/CDN implementation, in exchange for zero integration work and zero separate cost. |
| Contact form with no database fallback/retry | Accepted risk | A transient email-provider outage could mean a lost inquiry; accepted as proportionate for this scale rather than adding a database specifically to mitigate a low-probability, low-severity risk. |
| Deferring the booking/platform ambition entirely, rather than building a reduced version of it | Deferred | The original developer-learning goal around backend/database/auth depth is genuinely reduced in this v1 — named explicitly rather than quietly dropped. |

---

## 22. What We Deliberately Do NOT Build in V1

Restated for the current scope:

- No appointment booking, availability, or scheduling of any kind.
- No authentication or session management of any kind.
- No PostgreSQL, Prisma, or any custom database.
- No custom-built admin application.
- No object storage integration (Sanity handles media).
- No payment processing integration.
- No SMS integration.
- No customer authentication/accounts.
- No live third-party review API integration.
- No video storage/transcoding pipeline.
- No translation-management system or multi-locale content schema.
- No generic page-builder/flexible content-block system.
- No multi-tenant database schema, plugin/module system, or industry-extension mechanism.
- No fallback/retry queue for contact-form email delivery (accepted risk, Section 21).

---

## Open Decisions Requiring Explicit Resolution

**Resolved in this revision, no longer open:**
1. ~~Production hosting provider~~ — **CONFIRMED: Cloudflare** (Section 17).
2. ~~Transactional email provider~~ — **CONFIRMED: Resend**, forwarding to a **Google Workspace** mailbox (Section 11).
3. ~~Analytics tool selection~~ — **CONFIRMED: none in v1** (Section 13).
4. ~~Map/location integration approach~~ — **CONFIRMED: Google Maps, click-to-load embed, no API key** (Section 9.1).
5. ~~Whether legal pages should be Sanity-managed or static~~ — **CONFIRMED: static** Next.js pages, per `docs/content-model.md` Section 0 decision 3.

**Still open:**
1. **Sanity Studio deployment topology**: embedded `/studio` route vs. separate deployment (Section 6) — low-stakes, my lean is toward separate deployment using Sanity's free Studio hosting, but not decided here.
2. **Sanity plan/tier confirmation** — free tier appears sufficient based on current published pricing, but should be verified directly against Sanity's actual pricing page before final commitment (Section 18).
