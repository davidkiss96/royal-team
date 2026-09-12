# Royal-Team Platform — Product Specification (v1)

Status: Draft for review — **v1 scope reduced following business-owner discussion**
Scope: Product definition only. Implementation details are covered in `docs/architecture.md` and `docs/content-model.md`.

> **Scope-change notice:** Royal-Team v1 was originally scoped as a website-plus-appointment-booking platform. Following a scoping discussion with the business owner, **v1 is now reduced to a Business Website**: a premium, SEO-first marketing site with a contact form, with all content managed through Sanity CMS. There is no booking system, no customer accounts, no authentication, and no custom database in v1. The original booking-platform thinking is preserved, not discarded — see `docs/database.md` and `docs/schema-design.md`, both explicitly marked as deferred/future scope for a possible later appointment-booking platform (potentially reusable across other appointment-based verticals). This document reflects the current, reduced v1 scope only.

---

## 1. Product Vision

Royal-Team v1 is a premium, SEO-first business website for Royal-Team Autószerviz Kft., a Hungarian automotive workshop. Its job is to generate qualified customer inquiries through search and word-of-mouth, and to build enough trust and technical credibility that a prospective customer picks up the phone or submits the contact form before ever setting foot in the workshop.

This is a narrower scope than originally envisioned. The original ambition — a reusable local-business platform including appointment booking and a custom admin — remains a real long-term direction, but is explicitly **not** being built in v1. Version 1 focuses entirely on doing the website and content-management side excellently; the booking/platform ambition is deferred, documented, and revisited later with real evidence rather than spanning both ambitions at once now.

For Royal-Team specifically, the website is not a digital business card. It is a customer-acquisition tool built around a specific commercial opportunity: new DPF/particle-filter cleaning equipment, and the owner's credibility as a performance-automotive enthusiast (including his own 800+ hp Mercedes-AMG C63 project).

---

## 2. Business Goals

1. Generate new customer inquiries through Google Search, with an initial commercial focus on DPF cleaning.
2. Build a strong local SEO presence for the workshop.
3. Rank for relevant service-specific and problem-specific searches.
4. Build trust and credibility with prospective customers before first contact.
5. Showcase technical expertise through real project/case-study content, including the AMG build.
6. Give customers a simple, reliable way to reach the business (contact form, phone, address) — **not** an online booking mechanism in v1.
7. Give the (non-technical) business owner a simple way to manage content directly, without developer involvement for routine updates.

**Changed from the original scope:** the previous goal "allow customers to book selected services online without friction or an account" is **removed from v1**. This is a genuine reduction in what the site does at launch, not a rebranding of an unchanged goal — flagging this plainly since it was previously listed as a primary business goal and success criterion. The business owner has decided the operational and development cost of a booking system isn't justified for v1; customers requesting an appointment will call or use the contact form instead.

---

## 3. Target Users

### 3.1 Customers
Primarily Hungarian car owners searching Google for automotive services or problems. Mobile-first usage, with desktop also relevant. Range from routine-maintenance customers to owners of higher-value or performance vehicles, for whom perceived technical competence and trust matter more than price.

### 3.2 Business owner
Non-technical. Manages content — services, blog posts, projects, reviews, business information — directly through Sanity Studio (Sanity's content-editing interface), without needing a custom-built admin application or any separate login system beyond what Sanity itself provides.

### 3.3 Content editor (you)
A second content editor, expected to manage blog and content publishing on an ongoing basis. Sanity supports multiple project members natively (with its own access control), so this requires no custom authentication work — a meaningful simplification versus the original plan, which required a custom `User` table specifically to support this.

---

## 4. Core User Journeys

**Customer — problem-driven:**
Searches Google for a symptom or problem (e.g., "clogged DPF symptoms") → lands on a problem-focused page → reads explanation and credibility signals → views related service and/or reviews → contacts the workshop via the contact form or phone.

**Customer — service-driven:**
Searches for a named service → lands on the service page → reviews details and trust signals → contacts the workshop via the contact form or phone.

**Customer — trust/credibility path:**
Arrives via any entry point → browses About/project content (including the AMG build) and reviews → forms a trust judgment before ever contacting the business.

**Customer — contact:**
Fills out the contact form (name, contact info, message) → submission is validated server-side and forwarded by email to the business owner → customer sees a confirmation that their message was sent. No account, no login, no persisted record in a database the platform maintains.

**Owner — content management:**
Logs into Sanity Studio → manages services, blog posts, projects, reviews, and business info directly. No appointment/booking management exists in v1.

**Removed from v1:** the previous "customer — booking" and "owner reviews incoming bookings" journeys are no longer part of the product. See `docs/database.md` for the preserved future-platform design of that flow.

---

## 5. MVP Features (v1)

- Premium, fully responsive Next.js website: homepage, services (index + individual pages), about, projects/case studies (index + individual), blog (index + post), reviews, contact, legal pages.
- A small number of problem-focused SEO landing pages centered on DPF as the flagship service.
- All content — services, blog posts, projects, reviews, gallery/media, and business/contact information — managed through **Sanity CMS**, editable by the owner and content editor without developer involvement for routine updates.
- A contact form: submissions validated server-side, forwarded by email to the business owner. No customer data is stored in a database maintained by this platform.
- Foundational technical SEO: structured data, clean URLs, sitemap, per-page metadata, static/ISR rendering.
- Hungarian-language site, built on an i18n-ready foundation (routing/UI-string structure only — no English content).
- GDPR-conscious contact-form handling.
- Custom, premium visual design (not a generic template).

**Removed from v1** (previously listed as MVP features, now deferred — see Section 6):
- Scheduling-only appointment booking.
- Any admin capability beyond what Sanity Studio itself provides.
- Any authentication system.

---

## 6. Explicitly Out-of-Scope Features (v1)

These are deliberately excluded, not merely deferred in the sense of "coming soon" — they require a real future decision to reintroduce, not just more development time:

- **Appointment booking of any kind** — no availability slots, no scheduling, no booking-status lifecycle. This is the most significant scope change from the original plan; see the deferred-scope documents (`docs/database.md`, `docs/schema-design.md`) for the preserved design.
- **Any authentication system** — no admin login, no customer accounts, no magic-link auth, no session management built by this project. Sanity Studio's own access control covers the only "who can edit content" need that exists in v1.
- **PostgreSQL, Prisma, or any custom database maintained by this platform.** Sanity's hosted content lake is the only structured-data store in v1.
- **A custom-built admin application.** Sanity Studio is the entire content-management surface.
- **Storage of customer personal data in a database this platform operates.** Contact-form submissions are validated and forwarded by email; they are not persisted in a database under this platform's control (see Section 15 for the important nuance this doesn't erase).
- Online payment or deposit collection.
- SMS notifications.
- Customer accounts or login-based booking/inquiry history.
- Live Google Reviews API integration.
- Runtime brand/theme customization UI.
- Real-time features (websockets, live chat).
- A full translation management system.
- A generic page-builder or flexible content-block system (see `docs/content-model.md` — content types are purpose-specific, not a speculative block system).
- Multi-tenant SaaS infrastructure, a plugin/module system, or any industry-extension mechanism.

---

## 7. V1 vs. Future Roadmap

**V1 (this specification):** as defined in Section 5.

**Near-future / nice-to-have (post-launch, not launch-blocking):**
- Related-content cross-linking between services and blog posts for internal SEO.
- Basic analytics/traffic visibility for the owner.

**Explicit v2 / future:**
- English-language content, once justified by demand.
- Live Google Reviews integration.
- **Appointment booking, as a possible v2 (or later) addition** — not a commitment, a possibility. If and when this is revisited, `docs/database.md` and `docs/schema-design.md` contain preserved, previously-approved architectural thinking to start from (owner-defined availability slots, guest booking, database-enforced double-booking prevention) — but that design should be re-validated against whatever the real requirements are at that time, including whether a custom database is still the right approach or whether a booking-focused third-party service would now be simpler.
- A second, non-automotive customer implementation of the underlying reusable-platform ambition — deferred well beyond v1 now, contingent on whether the appointment-booking capability is ever rebuilt.

---

## 8. Website Structure / Sitemap

- Home
- Services (index)
  - Individual service pages (each independently SEO-addressable)
- Problem-focused landing pages (small set, DPF-focused for v1; distinct in purpose from blog posts — built to convert, not just inform)
- About / Story (owner background, technical philosophy, performance-automotive credibility)
- Projects / Case Studies (index + individual; AMG C63 build is the flagship entry)
- Blog / Knowledge Center (index + post)
- Reviews (can be a dedicated page and/or a surfaced section on relevant pages)
- Contact (contact form, phone, address — the sole conversion mechanism in v1, replacing the previously-planned booking flow)
- Legal: Privacy Policy (`/adatvedelem`), Impresszum (Hungarian legal notice, `/impresszum`)

**Confirmed, closing a previously-open item:** there is **no separate Cookie Policy page/route**. Since v1 sets no analytics, marketing, or visitor-tracking cookies of any kind (see Section 12), a full dedicated Cookie Policy would describe processing that doesn't exist. A short cookie section is folded directly into the Privacy Policy (`/adatvedelem`) instead, covering the one real exception: the Contact page's Google Maps embed, which only contacts Google (and only then may involve Google's own cookies) after the visitor explicitly clicks to load it.

**Removed:** the previously-listed "Booking flow" entry point no longer exists. Every service page's call-to-action now points to the contact form/phone rather than a booking flow.

This structure is a v1 baseline, expected to evolve based on real search behavior once Search Console data is available.

---

## 9. Contact Form Requirements

*(This section replaces the previous "Booking Requirements" section, which is now fully removed from v1 scope — see `docs/database.md` for the preserved future design.)*

- A single contact form, reachable from the Contact page and referenced/linked from service pages, rather than a separate booking flow per service.
- Required fields: name, contact method (phone and/or email — at least one required), message.
- Server-side validation of all fields (not just client-side) before any submission is processed.
- On successful submission, the message is forwarded by email to the business owner's designated contact address. **No submission is stored in a database maintained by this platform** — the email itself is the record, held in whatever mailbox/email-provider system receives it, not in application-controlled storage.
- The customer sees a clear on-screen confirmation that their message was sent (and, optionally, a copy could be CC'd or auto-replied to the customer — a decision left open, not required for v1).
- Basic spam/abuse protection (e.g., rate limiting, a honeypot field, or an equivalent lightweight mechanism) — the form is an unauthenticated, publicly reachable write path and needs baseline protection regardless of overall project simplicity.
- No booking-specific requirements (no slots, no availability, no double-booking concerns, no cancellation flow) apply in v1.

---

## 10. Content Management Requirements

*(This section replaces the previous "Admin Requirements" section.)*

- All structured content is managed through **Sanity Studio** — there is no custom-built admin application in v1.
- Required content types (detailed in `docs/content-model.md`): Services, Blog posts, Projects/case studies, Reviews, Business/contact information, and image/media used across these.
- The owner and content editor access Sanity Studio directly; Sanity's own project-member and access-control system governs who can edit — no custom authentication is built or maintained by this platform.
- The content-editing experience should be usable by a non-technical business owner without extensive training — this remains a real requirement even though the tool (Sanity Studio) is now a third-party product rather than custom-built; content type design (field naming, structure, validation, defaults) is where this usability requirement is actually met, and is treated seriously in `docs/content-model.md`.
- No fine-grained roles/permissions requirement in v1 beyond what Sanity's default project-member model already provides.

---

## 11. Content Requirements

- Rich content editing (WYSIWYG-style, not raw markdown/code) for blog posts, service descriptions, and project/case-study content, provided by Sanity Studio's native rich-text (Portable Text) editing.
- Content types requiring structured, SEO-aware fields: services, blog posts, projects/case studies, reviews.
- FAQ content remains structured and embedded within its parent Service (an array field, not a separate content type) — consistent with the earlier approved decision, now realized through Sanity's native array-of-objects field type rather than a JSON column.
- Project/case-study content remains modeled generically (suitable for any notable technical project a business wants to showcase), not specifically modeled around "car builds" — the AMG C63 project is the first and flagship example, not a special case.
- Image handling must support optimization appropriate to a photography-first site: compression, responsive delivery, and modern formats. Sanity's built-in image pipeline and CDN now provide this natively (see `docs/architecture.md`), removing the need for the previously-planned custom object-storage integration.
- No dedicated video hosting or delivery infrastructure is required for v1.
- No generic page-builder/flexible-block content system — content types remain purpose-specific and structured (see `docs/content-model.md` for the reasoning).

---

## 12. SEO Requirements

Unchanged from the original scope — SEO was never dependent on the booking system, so nothing here is reduced by the scope change:

- Per-page, content-driven metadata (titles/descriptions) — not hardcoded per template.
- Structured data (JSON-LD) for: LocalBusiness/relevant automotive business type, Service, Breadcrumb, and FAQ where applicable.
- Clean, human-readable, stable URLs.
- Sitemap.xml and robots.txt.
- Statically generated or incrementally regenerated content pages, prioritizing strong Core Web Vitals and fast mobile performance.
- Strong internal linking between related services, problem-focused landing pages, and blog content.
- A small, high-quality set of problem-focused landing pages for v1 (DPF-focused), with additional pages added later based on actual Google Search Console performance data.
- **Search-performance tracking via Google Search Console only — confirmed, no analytics tool in v1.** Google Search Console requires no cookies or client-side tracking script (verification is domain/DNS or meta-tag based), so it doesn't conflict with Section 13's confirmed no-cookies decision. A separate analytics tool (GA4, Plausible, Umami, etc.) was previously an open decision (`docs/architecture.md` Section 13) — it's now confirmed **out of v1 scope entirely**, not merely deferred pending tool selection; see Section 15 below.

---

## 13. Internationalization Requirements

Unchanged:

- Hungarian is the only required language for v1 content.
- The application architecture must be i18n-ready: avoid structural decisions (routing, hardcoded in-component strings, content modeling) that would force a rearchitecture to add a second language later.
- No translation management system, no multi-language content authoring UI, and no English content are required or expected in v1.

---

## 14. Non-Functional Requirements

- **Performance:** strong Core Web Vitals and fast mobile load times, given mobile-majority traffic and the direct SEO impact of performance.
- **Accessibility:** reasonable baseline accessibility (semantic structure, contrast, keyboard navigability) as standard practice.
- **Portability:** the application should be built against standard Next.js conventions rather than a specific hosting provider's proprietary features, since the production hosting decision is deliberately deferred. Sanity itself is a hosted third-party dependency by design (see `docs/architecture.md`) — this is an accepted, deliberate exception to "avoid vendor lock-in where possible," justified by the significant simplification it provides; content is exportable from Sanity if ever needed.
- **Cost:** production infrastructure should realistically target roughly 0–5,000 HUF/month (excluding domain). **This target is now easier to meet than under the original scope** — removing the custom database, custom auth, and object-storage requirements removes several previously-open cost line items (see `docs/architecture.md` Section 18 for the updated analysis).
- **Reliability:** contact-form delivery (a submission reliably reaching the owner) is a functional requirement. Booking data integrity is no longer applicable — there is no booking data in v1.
- **Maintainability:** content structures should avoid unnecessary automotive-specific hardcoding where a generic structure is equally simple, without introducing speculative abstraction for hypothetical future industries or content types.

---

## 15. GDPR / Privacy Considerations

- The platform operates in Hungary/EU. **The personal-data surface is now substantially smaller than under the original scope**, since there is no booking system and no database of customer contact records maintained by this platform.
- Required legal pages: Privacy Policy (`/adatvedelem`) and Impresszum (`/impresszum`, Hungarian legal notice requirement) — still required, unchanged. **Confirmed: no separate Cookie Policy page** — see Section 8's sitemap note.
- **Confirmed: v1 sets no visitor cookies, and no analytics/marketing tracking of any kind** — no analytics cookies, no marketing/advertising cookies, no session cookies for tracking purposes, no Google Analytics/GA4, Google Ads, Meta Pixel, or any other tracking script. Because there's no analytics/marketing category to consent to, **no general cookie-consent banner is built in v1** — this isn't a deferred nice-to-have, it's the correct behavior for a site with zero non-essential tracking. The one nuance, stated in the Privacy Policy: the Contact page's Google Maps embed is click-to-load (not automatic), and only after a visitor explicitly grants consent does the browser contact Google directly, which may then involve Google's own cookies under Google's own privacy policy — this is Google's processing, not a cookie this site sets itself, and it never happens without that explicit action. That one consent choice (whether the visitor permitted the Maps embed to load) is remembered via a single, versioned, non-tracking `localStorage` entry on the visitor's own device (`src/lib/consent`), so the choice survives a reload and can be withdrawn at any time from next to the map — this is the only client-side storage v1 uses, and it holds no analytics/marketing data. The consent model (`src/lib/consent/types.ts`) is intentionally structured so a v2 analytics/marketing category can be added later (config + a vendor integration that checks that category) without redesigning this mechanism.
- **Important nuance, stated plainly rather than glossed over:** "no customer data is stored in our own database" does not mean customer personal data disappears entirely. A contact-form submission is still personal data (name, contact details, message content) at the moment it's processed, and it still exists afterward — in the transactional email provider's delivery logs, and in the recipient mailbox the message is forwarded to. GDPR obligations (lawful basis, data minimization, retention awareness, honoring access/deletion requests) still apply to that data wherever it lives; this project simply isn't the system responsible for storing or managing it long-term. The Privacy Policy should describe this accurately (data is forwarded by email to the business, not stored in an application database) rather than implying no processing occurs at all.
- Reviews entered by the admin should retain an honest "source" attribution, unchanged.
- No HIPAA, PCI, or SOC2-level compliance is required or in scope.

---

## 16. Success Criteria

Version 1 will be considered successful if:

- The site ranks for and drives real organic traffic on DPF-related and core service-related searches within a reasonable post-launch period.
- The business owner can independently manage services, blog content, reviews, and business information through Sanity Studio without developer assistance.
- Customers can reliably reach the business via the contact form, with submissions consistently and promptly delivered to the owner.
- Core Web Vitals and mobile performance remain strong as real content (especially images) is added.
- The site achieves a genuinely premium, custom visual identity — not a generic template look.

**Removed from v1 success criteria** (previously listed, no longer applicable): "customers can complete a booking end-to-end" and "no double-booking or lost-booking incidents" — there is no booking system to measure in v1.

Specific numeric targets (traffic volume, inquiry conversion rate, etc.) are intentionally not defined here, since no baseline data exists yet.

---

## Open Items Carried Forward (not resolved by this document)

**Resolved since originally listed here:**
- ~~Production hosting provider~~ — **CONFIRMED: Cloudflare** (`docs/architecture.md` Section 17).
- ~~Whether legal pages should be owner-editable through Sanity or static~~ — **CONFIRMED: static**, developer-controlled pages (Privacy Policy at `/adatvedelem`, Impresszum at `/impresszum`; no separate Cookie Policy page — see Section 8/15 above).

**Still open:**
- Exact initial set of DPF-focused problem landing pages (content-planning scope, not this document).
- Sanity plan/tier confirmation once real usage patterns are known (see `docs/architecture.md` Section 18 for current cost analysis).

## Deferred / Future Scope (see dedicated documents)

- Appointment booking, availability management, and the associated data model — see `docs/database.md` and `docs/schema-design.md`, both explicitly marked as deferred/future scope, preserved for a possible future appointment-booking platform.
