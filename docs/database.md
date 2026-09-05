# Royal-Team Platform — Domain Model (v1)

> **⚠️ STATUS: DEFERRED / FUTURE SCOPE — NOT PART OF ROYAL-TEAM V1**
>
> Following a business-owner discussion, Royal-Team v1 has been rescoped to a **Business Website** (Sanity CMS-managed content, contact form, no booking, no database, no auth — see the updated `docs/product.md` and `docs/architecture.md`). Royal-Team v1 does **not** implement any of the booking/availability/user-account model described in this document.
>
> This document is **preserved, not deleted**, because it represents real, validated architectural thinking for a possible **future reusable appointment-booking platform** — one that could eventually serve Royal-Team (as a v2 addition) or other appointment-based verticals (beauty salons, dental practices, other automotive businesses, etc.). Nothing here should be treated as current v1 architecture. If and when appointment booking becomes a real, funded requirement again, this document is the starting point for that work — re-validate it against whatever the actual requirements are at that time rather than assuming it's still exactly correct.

---

Status: Draft for review (historical — see deferred-status banner above)
Sources: `docs/product.md` (approved), `docs/architecture.md` (approved direction, two open decisions carried forward: booking auto-confirm leaning, analytics tool)
Scope: Conceptual domain model only. No Prisma schema, no migrations, no field types beyond what's needed to reason about the model. This document's job is to get the *concepts and relationships* right before anything is committed to a schema.

---

## 0. Approach

Before listing entities, a challenge to the suggested list itself, per your instruction not to assume it's correct.

**Entities I'm keeping, and why each earns its place:**
- `User` — needed for admin auth (Section 7 of architecture.md requires a real table, not an env-var check).
- `Service` — core content type, explicitly required (product.md Section 5, 9).
- `AvailabilitySlot` — required by the booking model (product.md Section 9, architecture.md Section 10).
- `Booking` — the core transactional entity.
- `BlogPost` — explicitly required content type.
- `Project` (I'll rename "CaseStudy" to `Project` — see below) — explicitly required.
- `Review` — explicitly required, with the specific fields already listed in product.md Section 10.
- `Media` — required, but as a *shared asset table*, not a field bolted onto each content type — reasoning below.
- `BusinessSettings` — required, but I'll challenge its shape below.

**Entities I'm explicitly NOT including, and why:**
- **`Customer`** — not in your suggested list, but worth naming as a rejected entity explicitly: guest booking (product.md Section 9) means there is no persistent customer identity to model. Booking contact info (name/phone/email) lives directly on `Booking`, not on a separate `Customer` record. Introducing a `Customer` entity now would imply account/history features that are explicitly out of scope (product.md Section 6) and would raise premature questions (deduplication? merging? login?) with no current requirement to answer them. **No `Customer` entity in v1.** Future customer history/accounts remain a possible future capability if a real business requirement emerges (e.g., returning-customer recognition or booking history) — this document does not foreclose that, it simply doesn't build toward it speculatively now.
- **"CaseStudy" as separate from `Project`** — the suggested list offers these as alternatives ("Project / CaseStudy"), and I'm resolving that ambiguity: one entity, called `Project`, used for the AMG build and any future showcased work. Two entities here would just be the same concept twice.
- **A separate `SiteSettings` distinct from `BusinessSettings`** — the suggested list offers these as alternatives too. I'm resolving this as one entity (see Section on `BusinessSettings` below) rather than two, because in a single-business v1 there's no real distinction between "site configuration" and "business configuration" — that distinction only becomes meaningful in a multi-business future, which we're explicitly not designing for now.
- **A generic `ContentBlock` / page-builder entity** — nothing in the product spec asks for a flexible page-builder; each content type (service, post, project) has its own structured fields plus one rich-text body. Building a generic block system would be speculative flexibility with no current requirement driving it.
- **`FAQ` as its own entity** — product.md mentions FAQ structured data as a requirement (SEO section), but doesn't establish FAQ as a standalone content type customers browse. **Approved for v1:** FAQ modeled as an optional structured field *on* `Service` (and possibly `BlogPost`) rather than a separate top-level entity. This can be promoted to its own entity later if FAQ content grows large enough to need independent management.

So the final v1 entity list is: **`User`, `BusinessSettings`, `Service`, `AvailabilitySlot`, `Booking`, `BlogPost`, `Project`, `Review`, `Media`** — nine entities, one fewer conceptual type than the suggested list implied (since two of the suggested pairs each collapse into one).

---

## 1. `User`

**Purpose:** Represents an admin-capable person who can log into `/admin`. Nothing else — there is no customer-facing use of this entity (guest booking, see Section 0).

**Important fields (conceptual):** email (unique, used for magic-link auth, never shown publicly), display name (used as the public byline for authored content — should be a real, presentable name rather than an internal username), role, active/disabled flag, created timestamp, last-login timestamp.

**Relationships:** A `User` may be recorded as the author of content records (`BlogPost`, `Project`). This authorship is **public-facing** (approved direction): the author's display name is shown to site visitors on authored content, since real-name attribution from the owner/technical staff is a legitimate trust and credibility signal (and supports E-E-A-T-style SEO positioning) consistent with the product's "build trust before contact" goal. No separate author entity is created — the public byline is derived directly from the related `User` record's display name at render time, not duplicated into a second table.

**Lifecycle/statuses:** Active vs. disabled (a simple boolean is enough — no complex account lifecycle; if the owner ever needs to be locked out, an admin disables the record, no deletion needed to preserve authorship history).

**Ownership:** Platform-level — this table's *shape* (magic-link auth, single flat `role` field) is exactly the kind of thing that should carry over unchanged to a second business implementation. The *data* (which humans have accounts) is obviously Royal-Team-specific.

**Reusable platform-level vs. Royal-Team-specific:** Structure is platform-level. Data is business-specific.

**Note on the `role` field:** per architecture.md Section 7, v1 populates only one meaningful value (`admin`). The field exists so a second admin user is a data insert, not a schema change — it is *not* the beginning of a permissions system, and no second role value needs to be defined until there's an actual behavioral distinction to encode.

---

## 2. `BusinessSettings`

**Purpose:** Holds the single set of business-identity facts referenced throughout the site: business name, contact phone/email, address, opening hours, logo/brand asset references, social links, and any legal-page-required details (e.g., company registration info for the Impresszum).

**Important fields (conceptual):** business name, phone, email, address, opening hours (structured, not free text — needed if opening hours are ever shown programmatically or used in `LocalBusiness` structured data), logo media reference, brand color values (if theming is config-driven per architecture.md's design-system approach), legal/registration details for the Impresszum.

**Relationships:** Referenced (read-only, conceptually a singleton) by nearly every public page for header/footer/contact info and by the SEO structured-data generation (`LocalBusiness` schema, architecture.md Section 13).

**Lifecycle/statuses:** No meaningful lifecycle — this is configuration, not content with a publish/draft workflow. Just "current values."

**Ownership:** Owner-editable via admin (product.md Section 10 requirement: "manage core business information").

**Reusable platform-level vs. Royal-Team-specific:** This is the clearest example of "structure is platform-level, data is business-specific" in the whole model — the *concept* of "a business has a name/address/hours/contact info" is universal to the platform's purpose; Royal-Team's actual values are not.

**Modeling note — why a single row, not a key-value settings table:** A generic key-value settings table (`SettingsKey`, `SettingsValue`) is tempting for "flexibility," but it loses type safety and makes the SEO/structured-data generation code fragile (string-keyed lookups instead of a real field). Since v1 is single-business, a single structured record with real fields is simpler, safer, and not meaningfully less "reusable" — a second business implementation would just have its own single record with its own values, not a shared multi-row settings table. This is a case where the "simple, well-established" option and the "not overengineered for reuse" instinct agree.

---

## 3. `Service`

**Purpose:** Represents one offered service (e.g., DPF cleaning, diagnostics, suspension alignment) — the anchor entity for both the services section of the site and the booking flow.

**Important fields (conceptual):** name, slug, short summary, rich-text body content, SEO metadata (title/description overrides), online-bookable flag, typical duration (used to size `AvailabilitySlot`s — see below), optional FAQ entries (structured, embedded — see Section 0 rationale), publish status, display order.

**Relationships:**
- One `Service` → many `AvailabilitySlot`s (a slot is always for exactly one service).
- One `Service` → many `Media` (gallery/hero images) via the shared media-relationship pattern (Section 9 below).
- One `Service` → many `Booking`s, indirectly through `AvailabilitySlot` (see the booking model discussion, Section 10).

**Lifecycle/statuses:** `draft` / `published` — an owner should be able to prepare a new service page before it's live. Additionally, the `online-bookable` flag is independent of publish status — a published, non-bookable service still shows its page (contact-only), consistent with product.md Section 9 ("not every service should support online booking").

**Ownership:** Owner/editor-managed via admin.

**Reusable platform-level vs. Royal-Team-specific:** The *entity shape* is generic and reusable (any local business has "things it offers, some bookable, some not"). The actual services (DPF cleaning, etc.) are Royal-Team-specific content — no automotive-specific fields are baked into the entity itself (no "engine type" field, etc.), consistent with architecture.md Section 8's genericity principle.

---

## 4. `AvailabilitySlot`

**Purpose:** A single, concrete, owner-created bookable time — the deliberately simple v1 model per architecture.md Section 10 (no recurrence engine, no generalized calendar).

**Important fields (conceptual):** associated service, date/time, duration (defaulted from the service's typical duration but overridable per slot, since real-world scheduling sometimes needs a one-off adjustment), and — critically — its "available" state is *derived*, not stored (see below).

**Relationships:** Belongs to exactly one `Service`. Has at most one associated non-cancelled `Booking` at any time — this "at most one" constraint is the crux of double-booking prevention and is discussed in depth in Section 10 below.

**Lifecycle/statuses:** No independent status field. A slot's bookability is computed from two facts: (a) is its date/time in the future, and (b) does it have an associated `Booking` that is not `cancelled`. This is a deliberate modeling choice — see the callout below.

**Why derived state, not a stored `status` field on the slot itself:** A separately stored "is this slot available" flag on `AvailabilitySlot` is a classic source of data drift — if a booking is cancelled, something has to remember to flip the slot's flag back, and if that update is ever missed (a bug, a manual DB edit, a failed transaction step), the slot silently shows as unavailable forever, or worse, shows as available when it isn't. Deriving availability from "does an active booking exist for this slot" makes the two facts impossible to disagree with each other, because there's only one fact, not two copies of it.

**Ownership:** Fully owner-controlled — created and removable via admin, per product.md Section 9 ("availability is entirely owner-defined").

**Reusable platform-level vs. Royal-Team-specific:** The entity shape (a bookable instance tied to a service, at a specific time, with derived availability) is platform-level and would transfer directly to a dental practice or salon implementation. The actual slot data (Royal-Team's Monday 9am DPF slot) is business-specific.

---

## 5. `Booking`

**Purpose:** Represents a customer's claim on a specific `AvailabilitySlot`. This is the most business-critical entity in the model — see Section 10 below for a full comparison of modeling approaches.

**Important fields (conceptual):** reference to the claimed slot, customer name, customer phone, customer email, status (`pending` / `confirmed` / `cancelled` / `completed` / `no_show` — per product.md Section 9's defined lifecycle, with the auto-confirm-vs-pending entry point still an open decision per architecture.md), a unique non-guessable cancellation token, optional customer-provided note (e.g., additional context about the issue), created timestamp, status-changed timestamp(s) sufficient to know when a cancellation happened.

**Relationships:** Belongs to exactly one `AvailabilitySlot` (and transitively, one `Service`). No relationship to any `User`/customer-identity entity, by design (Section 0).

**Lifecycle/statuses:** `pending → confirmed → cancelled → completed`, plus `no_show`, exactly as specified in product.md Section 9. **The initial/entry status remains an OPEN DECISION** (auto-confirmed on submission vs. starting as `pending` pending owner review), per architecture.md Section 9 — not resolved by this document. Confirmed here at the data-model level: the fixed status enum already contains both `pending` and `confirmed` as valid values, so this decision is purely a matter of *which value a new `Booking` row is created with* — it requires no schema change either way, and can be changed later (including reversed) without a migration, only an application-logic change.

**Ownership:** Created by an anonymous customer (via the booking flow), subsequently manageable (status updates, manual cancellation) only by admin users. No customer-facing edit capability beyond the cancellation-link flow.

**Reusable platform-level vs. Royal-Team-specific:** Entity shape is platform-level (any appointment-based business needs "someone claimed this slot, here's their contact info, here's the status"). Data is obviously per-booking and business-specific.

**GDPR-relevant field, flagged for Section 8 below:** this entity is where the platform's actual personal data (name, phone, email) concentrates. Retention policy directly applies here.

---

## 6. `BlogPost`

**Purpose:** SEO/trust-building content — the knowledge-center articles described in product.md.

**Important fields (conceptual):** title, slug, excerpt (used for listing pages and meta description fallback), rich-text body (structured JSON, per architecture.md Section 8), SEO metadata overrides, publish status, published date, author reference (`User`, **publicly displayed** — see Section 1), optional related-service reference(s) (supports the internal-linking SEO requirement — product.md Section 12 — without hardcoding link structure into content).

**Relationships:** Optionally references one or more `Service` records (for "related service" linking). Has `Media` relationships for hero/inline images (Section 9 below). Authored-by a `User` — this relationship drives the public byline shown on the post (display name only; no other `User` fields are exposed publicly).

**Lifecycle/statuses:** `draft` / `published`, with a published date distinct from created date (so a post can be written in advance and scheduled/backdated sensibly).

**Ownership:** Editor-managed (you and/or the owner).

**Reusable platform-level vs. Royal-Team-specific:** Entity shape is fully generic — a blog is a blog regardless of industry. Content is Royal-Team-specific.

---

## 7. `Project`

**Purpose:** Showcased project/case-study content — the AMG C63 build is the flagship instance, but the entity is modeled generically per architecture.md Section 8 and product.md Section 11 (explicitly not "a car build" entity).

**Important fields (conceptual):** title, slug, summary, rich-text body (structured JSON), SEO metadata, publish status, display order/featured flag (so the AMG project can be pinned prominently), author reference (`User`, publicly displayed — see Section 1), gallery of `Media`.

**Relationships:** Has `Media` relationships (likely the entity with the *most* associated media, given the photography-first, project-documentation nature described in product.md Section 14). Authored-by a `User`, with the same public-byline treatment as `BlogPost` (Section 6) — reasonable here too, since the AMG project's credibility benefits directly from being attributed to a named technical author. No required relationship to `Service`, though an optional reference is reasonable (e.g., linking the AMG project loosely to "performance/tuning" services if such a service exists) — optional, not required, since not every project necessarily maps to a bookable service.

**Lifecycle/statuses:** `draft` / `published`.

**Ownership:** Editor-managed.

**Reusable platform-level vs. Royal-Team-specific:** Entity shape generic (any business can have "notable work we've done"). Content — including all AMG-specific narrative and photography — is entirely Royal-Team-specific and lives in this entity's data, not its schema. This is the concrete enforcement mechanism for the product spec's explicit requirement that the AMG project not become a special-cased content type.

---

## 8. `Review`

**Purpose:** Manually curated testimonial content, per product.md Section 10's explicit field list.

**Important fields (conceptual):** author name, rating, review text, date, source (free-text or constrained list — e.g., "Google," "in person," "phone" — per product.md Section 15's honesty-in-attribution requirement), published/visible flag.

**Relationships:** None required to other content entities — reviews are independent, though a future (not v1) enhancement could optionally tie a review to a specific `Service`. Not modeled now, since nothing in the product spec asks for per-service review filtering.

**Lifecycle/statuses:** `published` / `unpublished` (effectively pre-moderated by construction, since only an admin can create one — see the assumption logged in the earlier product-spec conversation).

**Ownership:** Owner/editor-managed via admin.

**Reusable platform-level vs. Royal-Team-specific:** Entity shape generic. Content Royal-Team-specific.

---

## 9. `Media`

**Purpose:** A shared, reusable asset table representing an uploaded image (object-storage reference plus metadata), decoupled from any single content type.

**Important fields (conceptual):** storage reference/URL (or key, depending on the final storage integration), alt text (required for accessibility and SEO — should not be optional at the data-model level, even if occasionally left blank by the owner in practice), caption (optional), original filename, uploaded-by (`User` reference), uploaded timestamp, dimensions (useful for layout/responsive rendering without re-fetching the file).

**Relationships — approved direction, this is the one place I'd actively steer away from the "obvious" design:** The naive approach is an image field/foreign key directly on each content type (`Service.imageUrl`, `Project.heroImageUrl`, etc.). Instead, **approved for v1**: a `Media` record can be associated with zero or more content records, and a content record can have zero or more ordered `Media` associations (with a role/position, e.g., "hero" vs. "gallery item N").

**Why a join model instead of direct fields, explained concretely:** `Project` (the AMG build) is explicitly expected to have many photos (product.md Section 14 lists starting condition, modifications, build process, testing, results — clearly a multi-image narrative, not one hero image). A single foreign-key-per-image-slot approach would mean either a growing number of nullable image fields on `Project` (`image1`, `image2`... — a well-known anti-pattern) or under-modeling the requirement. A proper `Media` table plus an ordered join association handles "many images, in order, per content item" cleanly, and the same mechanism serves `Service` (which needs fewer images) without needing two different patterns.

**Lifecycle/statuses:** No publish status of its own (visibility is governed by whether the *content record* referencing it is published) — but should support soft-deletion or at least "orphan cleanup" awareness (an image removed from a project shouldn't necessarily be hard-deleted from storage immediately, in case it's referenced elsewhere or removal was accidental) — this is a v1 implementation nicety to keep in mind, not a hard architectural requirement.

**Ownership:** Uploaded and managed via admin.

**Reusable platform-level vs. Royal-Team-specific:** Entity shape fully platform-level — this is arguably the cleanest, most directly reusable entity in the whole model. Data (actual photos) is Royal-Team-specific.

---

## 10. Booking and Availability Modeling — Detailed Comparison

You asked me to explicitly compare approaches here, since this is the highest-stakes modeling decision in the system.

### Option A: `Booking` directly references a pre-existing `AvailabilitySlot`

The owner creates `AvailabilitySlot` records ahead of time (service + date/time + duration). A `Booking` is created by referencing one existing, currently-unclaimed slot. A database-level uniqueness constraint ensures at most one non-cancelled `Booking` can reference a given slot.

**Pros:**
- Double-booking prevention is structural and simple: a unique constraint (e.g., on `slotId` for non-cancelled bookings) makes a conflicting insert fail deterministically at the database level — exactly the guarantee architecture.md Section 9 requires, with no custom locking logic needed.
- The public booking UI is naturally driven by "what slots currently have no active booking" — a straightforward query, no derived-availability computation logic beyond a simple existence check.
- Matches the actual real-world workflow described in the product spec precisely: the owner pre-defines exactly what's offered; nothing is invented at booking time.
- Keeps `AvailabilitySlot` as a clean, independently manageable admin concept — the owner can see and manage "my open slots" as a first-class list, separate from bookings.

**Cons:**
- Two related tables instead of one — marginally more joins when displaying a booking with its service/time info (though this is a trivial, well-indexed join, not a real performance concern at this scale).
- Requires the owner to proactively create slots before any booking can happen — but this is a *feature*, not a bug, per the product's explicit "no automatic availability generation" requirement; it's not something Option A causes, it's something the product mandates.

### Option B: `Booking` creates/reserves a slot at booking time (slot and booking are the same act)

There's no independent, owner-pre-created slot; instead, the owner defines *rules or a calendar of open windows*, and a customer's `Booking` itself effectively carves out and claims a time from that availability at submission time.

**Pros:**
- Fewer tables in the simplest imaginable version.

**Cons:**
- This is really a description of a *scheduling engine* (something has to compute "what times are open" from rules, then handle the claim atomically) — precisely what both product.md and architecture.md explicitly instruct us not to build. It reintroduces the complexity we deliberately excluded, just moved into the booking-creation code path instead of an admin-defined slot table.
- Loses the clean owner-facing "these are my open slots" management view — the owner would instead be managing abstract rules or a raw calendar, which is a worse admin experience for a non-technical user than a simple list of concrete slots.
- Double-booking prevention becomes harder to guarantee at the database level, since there's no stable pre-existing row to put a uniqueness constraint on — you'd be constraining against a computed window instead of a row, which is a meaningfully harder integrity problem.

**Verdict:** rejected — this is scheduling-engine territory by another name, explicitly out of scope.

### Option C: Service + date/time stored directly on `Booking`, no separate slot entity at all

The owner doesn't pre-create anything; `Booking` itself just stores whatever service/date/time the customer picks (perhaps from a UI showing generic open hours), with no independent record of "what's offered" separate from what's been booked.

**Pros:**
- Simplest possible schema — one table.

**Cons:**
- Directly contradicts the explicit product requirement that "customers should only be able to select explicitly available slots" defined entirely by the owner (product.md Section 9) — under this model there's nothing for the customer to select *from*; the concept of "available slot" wouldn't exist as data at all, only as booked outcomes.
- Double-booking prevention becomes awkward: you'd need a uniqueness constraint on a (service, date, time) tuple *stored redundantly on every booking row*, which is fragile (relies on exact value matching across separately-submitted rows rather than referencing one canonical row) and gives the owner no way to pre-define or preview what's offered before anyone books it.
- No natural way to represent "an open slot that hasn't been booked yet" for the public booking UI to display — there'd be nothing to query.

**Verdict:** rejected — doesn't actually satisfy the stated requirements, not just a matter of taste.

### Recommendation: Option A — **Approved**

`Booking` references a pre-existing, owner-created `AvailabilitySlot`, with double-booking prevented by a database-level uniqueness constraint on the active booking-to-slot relationship. This is the only option of the three that satisfies every explicit product requirement (owner-defined availability, structural double-booking prevention, no scheduling engine) simultaneously, and it does so with a genuinely simple two-table relationship — not a complex model dressed up as simple. This decision is now finalized for v1.

---

## 11. Guest Bookings

Already reflected in the `Booking` entity design (Section 5): contact fields (name, phone, email) live directly on `Booking`, with no `User`/`Customer` account relationship. The cancellation token (Section 5) is the sole mechanism by which a non-authenticated customer can act on their own booking after creation — it functions as a scoped, single-purpose credential (access to *this one booking's* cancellation action only), not a general authentication mechanism, which keeps guest booking genuinely account-free while still giving customers a safe way to self-service a cancellation.

---

## 12. Admin Users

Covered in Section 1 (`User`). Worth restating the key modeling decision here since it was explicitly asked about: a real `User` table with a `role` field exists from v1, even though only one row and one role value are populated at launch. This is what makes "the owner also gets access later" a data change, not a migration — directly satisfying product.md Section 10's forward-compatibility requirement.

---

## 13. Content Ownership

"Ownership" here has two different meanings worth separating clearly:

1. **Editorial/public authorship** (who wrote a piece of content) — modeled via the `User` reference on `BlogPost` and `Project` (Sections 6–7). **Approved as public-facing**: the author's display name is shown to site visitors on authored content, as a deliberate trust/credibility signal, not just an internal accountability record. Only the `User`'s display name is exposed publicly — email, role, and other account fields remain internal.
2. **Business ownership** (which business this content belongs to) — **approved as excluded from v1.** There is no `businessId` foreign key threaded through content tables, because v1 is single-business by explicit design (architecture.md Section 20) and multi-tenancy is intentionally not being built. If a second business implementation happens, it is expected to initially use a separate database (per architecture.md's extraction-later philosophy) — not a shared schema with a tenant column bolted on.

---

## 14. Media Relationships

Covered in depth in Section 9. Summary of the key decision: a shared `Media` table plus an ordered join association to content entities (rather than direct image-URL fields per content type), because multiple v1 content types (especially `Project`) genuinely require ordered multi-image galleries, and a join model handles that cleanly without a growing set of nullable per-slot image fields.

---

## 15. SEO Metadata

Rather than a separate `SeoMetadata` entity joined to every content type, **approved for v1:** SEO fields live directly on each content entity (`Service`, `BlogPost`, `Project`) as an optional override group: meta title override, meta description override, and (implicitly) the canonical slug already present on the entity.

**Why not a separate entity:** SEO metadata isn't independently meaningful data — it's always 1:1 with exactly one content record and has no independent lifecycle, no independent management screen, and no case where it's queried without its parent content. A separate entity here would be a join for no benefit; it's the kind of "looks more normalized" decision that adds a table without adding real flexibility, since there's no scenario where two different content records would ever share one SEO metadata record.

**Default-vs-override behavior:** if a meta title/description override is left blank, rendering logic falls back to the content's title/excerpt — this is a rendering-layer concern (architecture.md Section 13), not something that needs its own stored "is this using the default" flag.

**Structured data (JSON-LD):** not stored at all — generated at render time from the actual content fields (title, description, `BusinessSettings` data, etc.), per architecture.md Section 13's explicit requirement that structured data never be separately-maintained "SEO data" that could drift from the real content.

---

## 16. Future i18n Considerations

Per architecture.md Section 14's deliberate asymmetry (routing/UI-strings ready now, content-schema localization deferred), **no content entity in this document carries a `locale` field or translation-join-table in v1.** This is intentional, not an oversight — restated here so it's clear the domain model is consistent with the architecture decision, not silently working around it.

What *is* worth flagging now, without acting on it: when English content becomes a real requirement, the actual schema shape needed depends on a business question we can't answer yet — are Hungarian and English versions of, say, a blog post the *same content translated* (which would favor a `locale` field on the existing tables, with rows linked as translation-pairs), or *independently written* per-language content (which might favor no special linking at all, just separate rows with a `locale` field and no forced pairing)? Recording this open question here means it doesn't get silently pre-decided when v2 planning starts.

---

## 17. Data Retention and GDPR Considerations

The personal data surface in this model is narrow and concentrated, which is itself a useful design property:

- **`Booking`** is the primary holder of personal data (name, phone, email) — as flagged in Section 5.
- **`User`** holds admin personal data (email, name) — small in volume, clearly legitimate (employment/business-operation basis), low retention concern.
- **`Review`** holds a reviewer's name as provided by the business (not self-submitted by the reviewer) — worth noting the *data source* here is the business itself entering a name, which has different GDPR handling implications (legitimate interest, business-provided attribution) than a form directly collecting a third party's personal data — flagging this distinction for whoever finalizes the privacy policy, not resolving it here.
- **No entity in this model stores payment data, vehicle-identifying data (e.g., license plates), or any sensitive-category personal data** — consistent with product.md's data-minimization requirement (Section 15). If a future requirement introduces vehicle details (e.g., for service history), that would be a deliberate new field/entity decision, not something implicitly already present.

**Retention mechanics (open, per product.md's own carried-forward open item):** the product spec already flags "data retention period for booking/contact records" as an unresolved business/legal decision. At the domain-model level, the only thing worth committing to now is that `Booking` records carry the timestamps (created, status-changed) needed to *implement* whatever retention period is eventually decided (e.g., "delete or anonymize completed/cancelled bookings after N months") — the model supports that operation without needing new fields later; the specific N and the deletion-vs-anonymization choice remain open.

---

## Domain Model Status

Following your review, the following are now **approved and finalized** for v1:

1. **No `Customer` entity in v1.** Guest-only contact fields on `Booking`. Future customer history/accounts remain a possible future capability if a real business requirement emerges — not foreclosed, just not built now.
2. **Booking/Availability: Option A, approved.** `Booking` references a pre-existing, owner-created `AvailabilitySlot`; availability is derived (not stored) from whether the slot has an active booking; the database enforces double-booking prevention via a uniqueness constraint.
3. **`Media` as a shared table with ordered join relationships to content entities**, approved.
4. **No `businessId` / multi-tenancy in v1**, approved. A future second business implementation is expected to use a separate database initially.
5. **FAQ as a structured field on `Service`**, approved, with promotion to its own entity available later if real requirements emerge.
6. **SEO metadata directly on content entities**, approved, no separate `SeoMetadata` entity.
7. **Public authorship for `BlogPost` and `Project`**, approved. Author is derived from the related `User` record (display name only, shown publicly); no separate author entity created.

**Remaining open decision, explicitly not resolved by this document:**

8. **Booking initial/entry status** (`confirmed` vs. `pending` on creation) remains an **OPEN DECISION**, per architecture.md Section 9, pending the owner-workflow discussion. Confirmed at the data-model level: the `Booking` status enum already accommodates either choice without a schema change — this is an application-logic decision to be made later, not a modeling gap.

With items 1-7 approved and item 8 explicitly and correctly left open, I consider this domain model ready to move toward a Prisma schema once you confirm - with the understanding that the schema will need to accommodate whichever value item 8 resolves to as the default, without that being a blocker to writing the schema itself now.

No other domain decisions remain outstanding from this review cycle.
