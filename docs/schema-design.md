# Royal-Team Platform — Relational Schema Design (v1)

> **⚠️ STATUS: DEFERRED / FUTURE SCOPE — NOT PART OF ROYAL-TEAM V1**
>
> Royal-Team v1 has been rescoped to a Business Website with no booking system, no PostgreSQL/Prisma, and no custom database (see updated `docs/product.md` and `docs/architecture.md`). This document — including the double-booking prevention design, the relational schema, and all `schema.prisma`-adjacent thinking — is **preserved as future reference** for a possible later appointment-booking platform, not implemented in v1. No `schema.prisma` was created against this design, and none should be created for Royal-Team v1 on this basis. Treat this as validated thinking to revisit, not current architecture.

---

Status: Draft for review (historical — see deferred-status banner above)
Sources: `docs/product.md` (approved), `docs/architecture.md` (approved direction), `docs/database.md` (approved domain model)
Scope: Concrete relational design — tables, columns, keys, constraints, indexes — expressed in database/ORM-agnostic terms. This is the layer between the conceptual domain model and an actual `schema.prisma`. No Prisma syntax, no migrations yet.

**On fidelity to `database.md`:** I reviewed the approved domain model for genuine contradictions with sound relational design and found none that require changing `database.md` itself — that document was explicitly conceptual and didn't commit to a specific physical shape. There is one place (Media relationships) where the *conceptual* description ("a Media record can be associated with zero or more content records") admits more than one physical realization, and the naive realization would weaken referential integrity. I'm treating that as a translation decision to make carefully here, not a contradiction to flag against the approved document — but I'm calling it out explicitly per your instruction, with full reasoning, since it's the one place where "obvious implementation" and "correct implementation" diverge.

---

## 0. Cross-Cutting Conventions

Established once here rather than repeated per entity:

- **Primary keys:** UUID (or an equivalent globally-unique, non-sequential identifier — e.g., Prisma's `cuid`) on every table, rather than auto-incrementing integers. Reasoning: several IDs plausibly end up in URLs or client-visible contexts eventually, and non-sequential IDs avoid trivially enumerable records (e.g., guessing `/booking/2`, `/booking/3`) as a matter of course, at negligible cost. This is a low-stakes, easily-reversible convention, not a load-bearing security decision — the real security boundary for bookings is the separate cancellation token (Section 3), not the primary key.
- **Timestamps:** every table has `createdAt` and `updatedAt` (standard audit pair), in addition to any entity-specific timestamps called out below. All timestamps are stored as timezone-aware (`timestamptz` in Postgres terms) — see Section 6 for why this matters specifically for `AvailabilitySlot`.
- **Soft delete stance:** not used generically. Content entities use an explicit `status` (draft/published) rather than a delete flag, since "unpublished" and "deleted" are different concepts and the product only needs the former. Hard deletes are used elsewhere but are constrained via foreign-key delete behavior (specified per relationship below) so that deleting a record can't silently orphan or corrupt related data.
- **Enums:** represented as database-level enum types where the underlying database supports them well (Postgres does); the specific values are listed per entity below.
- **Slugs:** stored as plain text with a uniqueness constraint scoped per entity type (not globally unique across all content types), and indexed, since they're the primary lookup path for public page rendering.

---

## 1. `User`

**Purpose:** Admin-capable accounts; also the source of public author attribution on `BlogPost` and `Project` (approved in `database.md`).

**Columns:**

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | UUID | No | PK |
| `email` | text | No | Unique. Recommend storing normalized (lowercase) to avoid case-variant duplicates — either enforced at the application layer or via a case-insensitive unique index if the database supports one (Postgres `citext` is a clean option). |
| `displayName` | text | No | **Required, not optional** — since authorship is now public (approved), every `User` must have a presentable name; there's no valid state where a `User` exists but can't be shown as an author. |
| `role` | enum | No | Values: `admin` (only value populated in v1; field exists for future extensibility per the approved domain model — no second value is defined until there's a real behavioral distinction to encode). |
| `isActive` | boolean | No | Default `true`. Disabling an account (rather than deleting it) is how access is revoked — this preserves authorship history (Section on delete behavior below). |
| `lastLoginAt` | timestamptz | Yes | Null until first login. |

**Primary key:** `id`.
**Unique constraints:** `email`.
**Indexes:** on `email` (covered by the unique constraint), no additional indexes needed at this scale.

**Relationships:**
- `User` (1) → `BlogPost` (many), via `BlogPost.authorId`.
- `User` (1) → `Project` (many), via `Project.authorId`.

**Delete/update behavior:** `User` rows are not expected to be deleted in normal operation — the `isActive` flag is the mechanism for revoking access while preserving authorship integrity. If a `User` row is ever deleted regardless, `BlogPost.authorId` and `Project.authorId` should use **`ON DELETE RESTRICT`** (deletion is blocked while authored content exists), not `SET NULL` or `CASCADE` — since silently nulling a public byline or cascading into deleting someone's authored blog posts would both be surprising, destructive behaviors for what should be a rare, deliberate operation.

**Auth infrastructure note (not modeled here):** Auth.js's Prisma adapter (per `architecture.md` Section 7) requires its own standard tables (`Account`, `Session`, `VerificationToken` — the exact set depends on the adapter version) to support magic-link sign-in and session management. These are well-known, adapter-provided schemas, not part of our domain model — I'm flagging their existence here so they're not a surprise when the actual Prisma schema is written, but I'm not hand-designing them, since redesigning a library's required schema would be reinventing something already correctly solved.

---

## 2. `BusinessSettings`

**Purpose:** The single source of business-identity facts (name, contact info, hours, legal details, brand assets) — approved as a singleton.

**Columns:**

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | fixed value (see below) | No | PK — see singleton enforcement discussion. |
| `businessName` | text | No | |
| `phone` | text | No | |
| `email` | text | No | Public contact address — distinct from any `User.email`. |
| `addressLine1`, `addressLine2`, `city`, `postalCode` | text | `addressLine2` nullable, others required | Kept as discrete fields rather than one free-text address block, since structured address data is needed for `LocalBusiness` JSON-LD generation (`architecture.md` Section 13). |
| `openingHours` | structured (JSON) | No | A structured weekly-hours representation (e.g., per-day open/close times), not free text — needed for both display and potential future structured-data use. JSON is appropriate here since it's a fixed-shape, always-read-as-a-whole structure with no need for relational querying into individual days. |
| `logoMediaId` | UUID (FK → `Media.id`) | Yes | See Section 4 — a direct single FK is the right relationship shape here (a business has exactly one current logo, not an ordered gallery), in contrast to the join-table approach used for `Service`/`Project`/`BlogPost` galleries. |
| `brandColorPrimary`, `brandColorSecondary` | text | Yes | Optional; supports config-driven theming per `architecture.md` Section 19's design-system approach. |
| `legalCompanyName`, `legalRegistrationNumber` | text | Yes at the schema level (a v1 launch-readiness item, not a schema-enforced requirement) | Needed for the Impresszum legal page (`product.md` Section 15). |

**Singleton enforcement — addressed explicitly, not hand-waved:**

Application-level enforcement alone ("just never create a second row") is weak — it relies entirely on every code path remembering the rule, and a bug, a bad migration, or direct DB access could silently create a second row, at which point "which `BusinessSettings` row is authoritative" becomes a real, confusing bug with no natural way to detect it.

**Recommended approach:** enforce the singleton at the database level using a **fixed, well-known primary key value** combined with a check constraint restricting the PK to that one value. Concretely: instead of a UUID PK for this table specifically, use a fixed-value PK (e.g., a single-row convention such as `id` typed as a small integer with a `CHECK (id = 1)` constraint, or the equivalent boolean-singleton-table idiom Postgres supports). Any attempt to insert a second row fails at the database level with a constraint violation, not just an application-level convention. The application layer then never "creates" a `BusinessSettings` row in normal operation — it seeds exactly one row during initial setup and thereafter only ever updates it.

This is the one table in the schema that deliberately breaks the "UUID PK everywhere" convention from Section 0, and that's intentional — a singleton table's identity isn't meant to be one-of-many, so treating its PK the same as every other table's would be the actual over-uniformity mistake here, not a beneficial consistency.

**Relationships:** `BusinessSettings` (1) → `Media` (0 or 1), via `logoMediaId`.

**Delete/update behavior:** No delete path is expected in normal operation (there is always exactly one row). `logoMediaId` uses `ON DELETE SET NULL` — if the referenced `Media` row is ever deleted, the business simply has no logo set rather than the whole settings row being blocked or destroyed.

---

## 3. `Service`

**Purpose:** An offered service; the anchor for both the public services section and the booking flow.

**Columns:**

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | UUID | No | PK |
| `slug` | text | No | Unique. |
| `name` | text | No | |
| `summary` | text | Yes | Short listing-page description. |
| `bodyContent` | JSON (structured rich-text document) | Yes | Per `architecture.md` Section 8 — Tiptap-style structured JSON, not raw HTML. |
| `isBookableOnline` | boolean | No | Default `false`. Independent of `status` — a published, non-bookable service still has a live page. |
| `typicalDurationMinutes` | integer | Yes | Used only as a *default* when the owner creates a new `AvailabilitySlot` for this service — not authoritative for any individual slot (see Section 6). |
| `faq` | JSON array | Yes | See Section 8 — structured `{question, answer}` array, embedded per the approved decision to keep FAQ non-relational in v1. |
| `metaTitle`, `metaDescription` | text | Yes | SEO overrides, directly on the entity per the approved decision (no separate `SeoMetadata` entity). |
| `status` | enum | No | Values: `draft`, `published`. |
| `displayOrder` | integer | Yes | For manual ordering on the services index page. |

**Primary key:** `id`.
**Unique constraints:** `slug`.
**Indexes:** `slug` (covered by unique constraint); an index on `status` is reasonable if published-services queries become frequent, though at this scale a full-table scan is not a real performance concern — noting it as a low-priority, easy addition rather than a v1 requirement.

**Relationships:**
- `Service` (1) → `AvailabilitySlot` (many).
- `Service` (1) → `Media` (many, via `ServiceMedia` join — Section 4).
- `Service` (1) → `BlogPost` (many, via `BlogPostRelatedService` join — Section 7) — optional, many-to-many, since `database.md` describes this as "reference(s)," plural, in both directions.
- `Service` (0 or 1) ← `Project` (many) — optional, singular per project (see Section 7) — modeled as a nullable FK on `Project`, not a join table, since `database.md` describes a project referencing at most one loosely-related service, not several.

**Delete/update behavior:** Deleting a `Service` that has any `AvailabilitySlot` rows (booked or not) should be **`ON DELETE RESTRICT`** — a service with booking history (even past/cancelled) shouldn't be removable out from under that history. In practice, the admin UX should guide the owner toward unpublishing (`status = draft`, `isBookableOnline = false`) rather than deleting a service that's ever had real bookings.

---

## 4. Media, and the Media-Relationship Design (dedicated deep-dive, as requested)

### 4.1 `Media` table itself

**Purpose:** A single shared record per uploaded image asset.

**Columns:**

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | UUID | No | PK |
| `storageKey` | text | No | Object-storage reference/key (provider-specific format, kept opaque at this layer). |
| `altText` | text | No | Required at the schema level, per `database.md`'s explicit accessibility/SEO reasoning — even though it may occasionally be left as a short placeholder by the owner in practice, the field itself should not be nullable, or accessibility silently degrades as a side effect of no one noticing an optional field was skipped. |
| `caption` | text | Yes | |
| `originalFilename` | text | Yes | |
| `width`, `height` | integer | Yes | Populated at upload time; supports responsive rendering without re-fetching the file. |
| `uploadedByUserId` | UUID (FK → `User.id`) | Yes | `ON DELETE SET NULL` — losing the uploader attribution on old media if a `User` is ever removed is an acceptable, low-stakes outcome, unlike public content authorship (Section 1). |

**Primary key:** `id`. **Unique constraints:** none required beyond PK. **Indexes:** none beyond PK at this scale.

### 4.2 The relationship problem, addressed directly

The domain model (`database.md` Section 9) describes: *"a `Media` record can be associated with zero or more content records, and a content record can have zero or more ordered `Media` associations."* Read literally, the simplest implementation of "one mechanism that works for any content type" is a **single generic join table** shaped roughly like `MediaAssociation(mediaId, contentType, contentId, role, position)`, where `contentType` is a string/enum ("service"/"project"/"blogpost") and `contentId` is a raw identifier interpreted differently depending on `contentType`.

**This is a polymorphic association, and it's the wrong choice here, for a concrete reason, not a stylistic one:** `contentId` in that design cannot be a real foreign key, because a foreign key must reference exactly one target table, and here the target table varies row-by-row based on `contentType`. Consequently:
- The database **cannot enforce** that a given `MediaAssociation` row actually points at a real, existing `Service`/`Project`/`BlogPost` row — that check would have to live entirely in application code, and any bug, migration mistake, or direct data edit could leave orphaned or dangling associations with no database-level way to detect or prevent it.
- Cascading deletes stop working automatically — deleting a `Service` wouldn't naturally clean up its `MediaAssociation` rows via a real FK cascade; that cleanup would need to be reimplemented in application code per content type anyway, which defeats the "one generic mechanism" appeal in the first place.
- This is a well-known, named anti-pattern in relational design specifically because it trades real, DB-enforced integrity for a small reduction in the number of tables — a bad trade for a booking/content platform where data integrity is an explicit priority (`architecture.md` Section 0 goal #1).

**Recommended approach: one explicit join table per content type**, each with real foreign keys to both sides:

- `ServiceMedia(id, serviceId → Service.id, mediaId → Media.id, role, position)`
- `ProjectMedia(id, projectId → Project.id, mediaId → Media.id, role, position)`
- `BlogPostMedia(id, blogPostId → BlogPost.id, mediaId → Media.id, role, position)`

Where `role` is an enum (`hero`, `gallery`) and `position` is an integer used to order gallery items for display. A partial unique index on `(serviceId) WHERE role = 'hero'` (and equivalently for the other two tables) enforces **at most one hero image per content record** at the database level — the same partial-unique-index technique used for booking/slot integrity (Section 5), applied here for a different but structurally similar reason.

**Tradeoff, stated plainly:** this is three small join tables instead of one generic table — mildly more schema surface, and three near-identical table definitions instead of one. In exchange, every association is a real, database-enforced, cascade-capable foreign-key relationship, exactly matching the platform's stated priority of database integrity over application-only validation. Given `Service`, `Project`, and `BlogPost` are all fixed, known content types (not an open-ended, unbounded set), the "one table per type" cost is small and fixed — it doesn't grow as content volume grows, only if we ever add a genuinely new content type, which is itself a deliberate, infrequent event that already requires other schema work anyway. **This is the recommended, safe approach.**

**Note on `BusinessSettings.logoMediaId`:** as established in Section 2, the logo relationship is a direct single nullable FK, not a join-table entry — correctly reflecting that a business has exactly one current logo, not an ordered gallery. This isn't an inconsistency with the join-table pattern above; it's matching each relationship's actual cardinality rather than forcing every `Media` relationship through one mechanism regardless of shape.

**Delete/update behavior for all three join tables:** `ON DELETE CASCADE` from the content-entity side (deleting a `Service` removes its `ServiceMedia` rows automatically — consistent with the `RESTRICT` on `Service` deletion itself in Section 3, this only matters in the rare admin-initiated deletion path). `ON DELETE CASCADE` or `ON DELETE RESTRICT` from the `Media` side is a real choice: I'd recommend **`RESTRICT`** — deleting a `Media` row that's still attached to published content should be blocked, requiring the owner to first remove it from wherever it's used (via the admin UI) — this prevents accidentally breaking a live page's imagery through an unrelated media-library cleanup action.

---

## 5. `AvailabilitySlot` and `Booking` — Double-Booking Prevention (dedicated deep-dive, as requested)

This is treated with the most rigor in the document, per your instruction not to hand-wave it.

### 5.1 `AvailabilitySlot`

**Columns:**

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | UUID | No | PK |
| `serviceId` | UUID (FK → `Service.id`) | No | |
| `startAt` | timestamptz | No | See timezone note below. |
| `durationMinutes` | integer | No | Defaulted from `Service.typicalDurationMinutes` at creation time in the admin UI, but stored as its own value on the slot and freely overridable per slot — this is an application-layer default-population behavior, not a database-enforced relationship between the two duration fields (deliberately — a slot's duration shouldn't silently change if the service's typical duration is edited later). |

**No `endAt` column, deliberately:** an end time is fully derivable from `startAt + durationMinutes`, and storing it redundantly would create a value that could drift out of sync with the two source values if either is ever edited independently. If a future admin feature wants to warn about overlapping slots, that's a query-time computation (`startAt + durationMinutes` vs. another slot's `startAt`), not a stored column — flagged here as a nice-to-have possibility, not a v1 requirement, and explicitly not a recurring-scheduling feature (each slot remains an individually owner-created row; this would only be a display warning, not an availability *algorithm*).

**Timezone assumption — stated explicitly, as requested:** `startAt` is stored as a timezone-aware timestamp (`timestamptz`), and the value stored is always the equivalent instant in UTC internally, regardless of how it's entered or displayed. The application layer is responsible for interpreting/displaying all slot times in `Europe/Budapest` local time, since Royal-Team operates in a single timezone with no multi-region concern in v1. Storing as UTC internally (rather than a timezone-naive "wall clock" timestamp) is still the correct choice even for a single-timezone business, because it avoids a well-known class of bugs around Hungary's DST transitions (the one weekend per year where local wall-clock time is ambiguous or skips an hour) — a `timestamptz` column handles that correctly without any custom logic; a naive timestamp column would not. This is a case where "always use `timestamptz`" is genuinely the boring, well-established, low-risk default, not something added speculatively for a future multi-timezone requirement we don't have.

**No recurrence fields** — confirmed absent, per the explicit instruction and the already-approved domain model.

**Primary key:** `id`. **Foreign keys:** `serviceId → Service.id`, **`ON DELETE RESTRICT`** (see Section 3 — a service with slot history can't be deleted out from under it). **Indexes:** an index on `(serviceId, startAt)` supports the common query "show me this service's upcoming slots, in order," which is the primary access pattern for the public booking UI.

### 5.2 `Booking`

**Columns:**

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | UUID | No | PK |
| `slotId` | UUID (FK → `AvailabilitySlot.id`) | No | See double-booking mechanics below. |
| `customerName` | text | No | |
| `customerPhone` | text | No | |
| `customerEmail` | text | No | |
| `note` | text | Yes | Optional customer-provided context. |
| `status` | enum | No | Values: `pending`, `confirmed`, `cancelled`, `completed`, `no_show`. **No default value is fixed at the schema level** — see the explicit callout below. |
| `cancellationToken` | text | No | Unique. A securely random, sufficiently long, non-guessable string (e.g., a cryptographically random UUID or higher-entropy token) — this is the actual security boundary for guest self-service cancellation, not the row's primary key. |
| `cancelledAt` | timestamptz | Yes | Set when `status` transitions to `cancelled`; null otherwise. Separated from the generic `updatedAt` so "when was this specifically cancelled" is directly queryable without inferring it from a general-purpose audit column — this timestamp is also the natural anchor for any future GDPR retention/anonymization job (Section 10). |

**Booking status — explicitly not hardcoded, per instruction:** the `status` enum contains both `pending` and `confirmed` as valid values, and this document does not specify which one a newly created `Booking` row receives. That remains an open business decision (`architecture.md` Section 9, `database.md` item 8) to be resolved in application logic — and, if desired later, reinforced with a database `DEFAULT` value at that time. The schema itself is equally correct under either eventual answer; nothing here needs to change once the decision is made, only the value the application (or an added `DEFAULT`) supplies at insert time.

**Primary key:** `id`. **Unique constraints:** `cancellationToken`. **Indexes:** `cancellationToken` (covered by unique constraint, and is the lookup path for the cancellation Route Handler — architecture.md Section 5); an index on `status` is reasonable for the admin bookings list/filter view.

**Foreign key:** `slotId → AvailabilitySlot.id`, **`ON DELETE RESTRICT`** — a booking must never be allowed to become orphaned by a slot's deletion; in practice this means slots with any booking history (Section 3's RESTRICT on `Service` deletion applies analogously here) are effectively permanent once booked, which is the correct, safe default for a system whose GDPR/audit posture depends on booking history remaining intact.

### 5.3 The double-booking constraint, explained precisely

This is the core requirement, and here is exactly how it's enforced — not hand-waved.

A **plain** unique constraint on `Booking.slotId` would be **wrong**, and it's worth being explicit about why: it would mean the same slot could never be referenced by more than one `Booking` row *ever* — including after a legitimate cancellation. Since a cancelled booking's row is kept (not deleted, per the audit/GDPR posture established throughout this document), a plain unique constraint on `slotId` would permanently lock that slot out of ever being booked again, directly contradicting the explicit requirement that a cancelled booking must free the slot back up.

**The correct mechanism is a partial (filtered) unique index**, expressed conceptually as:

> A unique constraint on `Booking.slotId`, applied only to rows where `status <> 'cancelled'`.

This is directly supported by PostgreSQL as a native, first-class feature (a unique index with a `WHERE` clause) — not a workaround or an approximation. Under this constraint:
- At most one **non-cancelled** `Booking` may exist for a given `slotId` at any time — this is what makes double-booking structurally impossible: a second, concurrent insert attempting to claim the same slot with a non-cancelled status fails at the database level, deterministically, even under concurrent/simultaneous requests (this is the actual race-condition-proof guarantee — a check performed in application code first, then an insert, has a real gap between the check and the insert where two simultaneous requests can both pass the check; a database constraint has no such gap, because the database itself is the single point of truth evaluating the constraint atomically at insert time).
- Once a `Booking`'s status becomes `cancelled`, it no longer counts toward the constraint — meaning a *new* `Booking` row can subsequently be created referencing the same `slotId`, correctly modeling "the slot is available again."
- This also correctly means a slot could, over its lifetime, accumulate a history of multiple `Booking` rows (e.g., one cancelled, one that replaced it) — which is exactly the correct audit trail: nothing is overwritten or destroyed, the full history is queryable, and only the currently-active claim (if any) is what the constraint protects.

**Application-level flow that pairs with this constraint** (already described at a conceptual level in `architecture.md` Section 9, restated here at the schema level for completeness): the booking Server Action attempts the insert inside a transaction; if the partial unique index rejects it (because another non-cancelled booking already exists for that slot — the race condition case), the application catches that specific constraint-violation error and returns a "this slot was just taken" response to the customer, rather than a generic error. No advisory locks, no `SELECT ... FOR UPDATE` row-locking dance, and no application-level "check then insert" logic are needed to get correctness — the partial unique index alone provides the guarantee, which is precisely why this is the boring, well-established, low-risk mechanism to rely on here rather than something more elaborate.

**On `no_show` and `completed`:** both count as "not cancelled" for constraint purposes (they're excluded from the partial index's `WHERE status <> 'cancelled'` condition only in the sense that they, too, are non-cancelled and thus still "hold" the slot) — but by the time either status is reached, the slot's `startAt` is necessarily in the past, so this has no practical effect on future bookability. It does, correctly, mean the historical row remains the permanent, singular record of what happened with that slot.

---

## 6. `BlogPost`

**Columns:**

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | UUID | No | PK |
| `slug` | text | No | Unique. |
| `title` | text | No | |
| `excerpt` | text | Yes | Used for listing pages and as a meta-description fallback. |
| `bodyContent` | JSON (structured rich-text) | Yes | |
| `authorId` | UUID (FK → `User.id`) | No | Required — see Section 1; public byline always has an attributed author. |
| `metaTitle`, `metaDescription` | text | Yes | SEO overrides. |
| `status` | enum | No | `draft`, `published`. |
| `publishedAt` | timestamptz | Yes | Distinct from `createdAt` — allows writing in advance and backdating/scheduling sensibly; null while still in `draft`. |

**Primary key:** `id`. **Unique constraints:** `slug`. **Indexes:** `slug`; optionally `(status, publishedAt)` to support "published posts, newest first" listing queries efficiently — reasonable to add, low priority at v1 content volume.

**Relationships:**
- `authorId → User.id`, `ON DELETE RESTRICT` (Section 1).
- Many-to-many with `Service` via `BlogPostRelatedService(blogPostId, serviceId)` — a plain join table, `ON DELETE CASCADE` from the `BlogPost` side (removing a post removes its related-service links) and `ON DELETE CASCADE` from the `Service` side as well (a deleted... though note `Service` deletion is `RESTRICT`ed while slots exist, so in practice this join table's `Service`-side cascade mostly matters for services deleted before ever having slots).
- Media via `BlogPostMedia` (Section 4).

---

## 7. `Project`

**Columns:**

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | UUID | No | PK |
| `slug` | text | No | Unique. |
| `title` | text | No | |
| `summary` | text | Yes | |
| `bodyContent` | JSON (structured rich-text) | Yes | |
| `authorId` | UUID (FK → `User.id`) | No | Same reasoning as `BlogPost`. |
| `relatedServiceId` | UUID (FK → `Service.id`) | Yes | **Nullable, singular** — deliberately different shape from `BlogPost`'s relationship to `Service` (see reasoning below). |
| `metaTitle`, `metaDescription` | text | Yes | |
| `status` | enum | No | `draft`, `published`. |
| `isFeatured` | boolean | No | Default `false` — supports pinning the AMG project prominently, per `database.md`'s "display order/featured flag." |
| `displayOrder` | integer | Yes | |

**Why `relatedServiceId` is a direct nullable FK here, not a join table like `BlogPost`'s:** `database.md` describes a project's service relationship in the singular ("linking the AMG project loosely to 'performance/tuning' services **if such a service exists**"), in contrast to the explicitly plural "reference(s)" used for `BlogPost`. A direct nullable foreign key correctly and simply models "this project is optionally associated with at most one service," without introducing a join table (and its associated cascade-behavior decisions) for a relationship that's never expected to be many-to-many. If a real future need for a project relating to *multiple* services emerges, that's a small, contained schema change (add a join table, migrate the single existing FK's data into it) — not a sign this decision was wrong now, just evidence the requirement genuinely changed.

**Primary key:** `id`. **Unique constraints:** `slug`. **Foreign keys:** `authorId → User.id` (`RESTRICT`); `relatedServiceId → Service.id`, **`ON DELETE SET NULL`** — if the loosely-related service is ever deleted, the project itself shouldn't be blocked or destroyed; it simply loses that optional cross-reference.

**Relationships:** Media via `ProjectMedia` (Section 4).

---

## 8. `Review`

**Columns:**

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | UUID | No | PK |
| `authorName` | text | No | As entered by the business, per the source-of-data distinction noted in `database.md` Section 17. |
| `rating` | integer | No | Recommend a database `CHECK` constraint (e.g., `rating BETWEEN 1 AND 5`) rather than relying solely on application-layer validation — consistent with the platform's stated preference for database-level integrity over application-only checks, and this is exactly the kind of narrow, well-defined range check a `CHECK` constraint handles cleanly. |
| `text` | text | No | |
| `reviewDate` | date | Yes | The date the review reflects/was given (not necessarily the row's `createdAt`, since reviews may be entered into the system after the fact). |
| `source` | enum | No | Recommend a constrained enum (e.g., `google`, `in_person`, `phone`, `email`, `other`) rather than free text, refining `database.md`'s "free-text or constrained list" open framing — an enum keeps attribution consistent and filterable, with `other` as an escape hatch; a genuinely free-text `sourceDetail` field could be added alongside `other` if more nuance is ever needed, but isn't required for v1. |
| `sourceDetail` | text | Yes | **Approved addition.** Free-text supplement to `source`, for cases (especially `other`) where a short additional note on attribution is useful (e.g., "mentioned during phone consultation" or a specific platform name not covered by the enum). Optional in all cases, including when `source` is not `other` — no constraint ties its presence to a specific `source` value, since that's a data-entry nicety, not an integrity rule. |
| `isPublished` | boolean | No | Default `false` — an owner-entered review isn't shown publicly until explicitly published, giving a deliberate review-before-publish moment even though entry itself is already admin-gated. |

**Primary key:** `id`. **Foreign keys:** none — `Review` is intentionally independent of other content entities, per the approved domain model (no per-service review filtering in v1). **Indexes:** an index on `isPublished` is reasonable for the public reviews query, low priority at expected volume.

---

## 9. FAQ Representation (dedicated section, as requested)

**Recommendation: a JSON array column (`Service.faq`) rather than a separate relational table**, matching the approved decision to keep FAQ embedded/structured within `Service` for v1.

**Shape:** an array of `{ question: string, answer: string }` objects, stored as-is; array order is the display order (no separate position column needed, since the array itself is ordered).

**Tradeoff, stated explicitly:**
- **What's given up:** no database-level referential integrity or constraints on individual FAQ entries (e.g., can't enforce "question must be non-empty" at the DB level the way a real column could; can't independently query "all FAQ entries across all services" without JSON-specific query functions), and no independent `id` per FAQ entry for stable referencing (e.g., linking directly to one FAQ item from elsewhere) without adding one inside the JSON structure itself.
- **What's gained:** zero additional tables, zero additional joins for the extremely common case of "render this service page, including its FAQ" (it's just already part of the one row fetched), and a data shape that's trivial for a rich-content editor or a simple repeating form in the admin UI to produce and consume directly as JSON.
- Given FAQ content in this product is genuinely always read and written *together with* its parent service, never independently queried or managed, the case for a fully relational table is weak — this is a reasonable, low-risk simplification, not a corner cut.

**Promotion path, if ever needed:** if FAQ content later needs independent management (e.g., a shared FAQ library reused across multiple services, or site-wide FAQs not tied to any one service), the promotion path is straightforward: introduce a real `FaqItem` table (with its own `id`, `question`, `answer`, and a `serviceId` FK, or a join table if many-to-many reuse is needed), migrate the existing JSON array data into it, and remove the `Service.faq` column. This is a contained, well-understood migration — not a sign the JSON approach was a mistake, just evidence a genuinely new requirement (independent FAQ management) emerged.

---

## 10. i18n — Future Migration Shape (documented, not built)

Confirmed: **no `locale` columns and no translation tables exist anywhere in this v1 schema**, consistent with the approved architecture (`architecture.md` Section 14) and domain model (`database.md` Section 16).

**What a future migration would likely involve**, documented here so the eventual decision isn't made blind, without committing to either answer now:

- **If Hungarian and English content are the same content, translated:** the likely shape is adding a `locale` column to each translatable table (`Service`, `BlogPost`, `Project`, and possibly `Review` if reviews are ever translated) plus a `translationGroupId` (or equivalent) linking rows across locales as a pair/set representing "the same underlying piece of content in different languages." Slugs would need to become unique per `(locale, slug)` rather than per `slug` alone.
- **If Hungarian and English content are independently authored (not strict translations):** the likely shape is simpler — just add a `locale` column (default `hu` for all existing rows) with no forced pairing between locale-variants, and slugs again become unique per `(locale, slug)`.
- Either path is a genuine, non-trivial migration (new column(s), a backfill of the existing single-locale data, and a slug-uniqueness constraint change) — but neither requires restructuring the application's routing or component architecture, since that layer was already built i18n-ready per `architecture.md` Section 14. This confirms that architecture decision is doing its job: the *expensive-to-retrofit* part (routing/UI strings) was handled now; the *comparatively cheaper, deferrable* part (content schema) is correctly left until the real requirement (and its real shape) is known.

---

## 11. GDPR / Data Retention — Field-Level Mapping

Per your instruction, no retention period is invented here — this section identifies where personal data lives and confirms the schema supports future deletion/anonymization operations without needing new fields later, which is the concrete, actionable part of this open item.

**Personal-data-bearing fields, identified explicitly:**

| Table | Field(s) | Nature |
|---|---|---|
| `Booking` | `customerName`, `customerPhone`, `customerEmail`, `note` (potentially) | The primary concentration of customer personal data in the system. |
| `User` | `email`, `displayName` | Admin/staff personal data; low volume, clear legitimate-interest basis (employment/business operation), low retention concern — not the focus of the pending retention-policy decision. |
| `Review` | `authorName` | Business-provided attribution of a third party, not self-submitted — a different GDPR handling posture than a direct-collection form, as already flagged in `database.md`. |
| `Media` | `uploadedByUserId` | Indirect — identifies which admin uploaded an asset; same low-concern category as `User` data generally. |

**No other table stores personal data.** No payment data, no vehicle-identifying data, no sensitive-category data exists anywhere in this schema — consistent with the data-minimization requirement already established.

**Why the schema already supports future deletion/anonymization without new fields:**
- `Booking.cancelledAt` (Section 5) and `Booking.createdAt` provide exactly the timestamps needed to select candidate rows once a retention period is decided (e.g., "cancelled/completed bookings older than N months").
- An eventual anonymization operation (as opposed to hard deletion) would mean nulling or overwriting `customerName`/`customerPhone`/`customerEmail`/`note` on qualifying `Booking` rows while leaving `slotId`, `status`, and timestamps intact — this is directly possible with the current column shapes (all the personal-data columns are independently nullable-in-practice for this purpose, and none of them are referenced by any other table's foreign key, so nulling them has no cascading effect on anything else). This means the eventual retention mechanism is a scheduled application-level job operating on existing columns, not a schema change.
- Nothing about this schema needs to change once the retention period and deletion-vs-anonymization choice are finally made — those remain genuinely open (per `product.md`'s carried-forward open item), and this document deliberately does not resolve them.

---

## Final Summary

### 1. Proposed table list

Domain tables: `User`, `BusinessSettings`, `Service`, `AvailabilitySlot`, `Booking`, `BlogPost`, `Project`, `Review`, `Media`.
Join/relationship tables: `ServiceMedia`, `ProjectMedia`, `BlogPostMedia`, `BlogPostRelatedService`.
Not included, by deliberate design: `Customer`, `SeoMetadata`, `FaqItem`, any `businessId`/tenant table, any recurrence/scheduling-rule table.
Not designed here, but required alongside this schema: Auth.js's adapter-provided tables (`Account`, `Session`, `VerificationToken` or equivalent) — noted in Section 1, not reinvented.

### 2. Relationship summary

- `Service` 1—many `AvailabilitySlot`
- `AvailabilitySlot` 1—many `Booking` (but constrained to at most one *non-cancelled* `Booking` per slot at any time — Section 5.3)
- `User` 1—many `BlogPost` (author), `User` 1—many `Project` (author)
- `Service` many—many `BlogPost` (via `BlogPostRelatedService`)
- `Service` 1—many `Project` (optional, singular per project, via `Project.relatedServiceId`)
- `Media` many—many `Service` (via `ServiceMedia`), many—many `Project` (via `ProjectMedia`), many—many `BlogPost` (via `BlogPostMedia`)
- `Media` 1—0/1 `BusinessSettings` (direct FK, logo)
- `Review` — standalone, no foreign keys.

### 3. Constraint/index summary

- **Partial unique index**, `Booking(slotId) WHERE status <> 'cancelled'` — the core double-booking prevention mechanism (Section 5.3).
- **Partial unique index**, `[ServiceMedia|ProjectMedia|BlogPostMedia](contentId) WHERE role = 'hero'` — at most one hero image per content record (Section 4.2).
- **Fixed-value PK + check constraint** on `BusinessSettings.id` — singleton enforcement (Section 2).
- **Check constraint**, `Review.rating BETWEEN 1 AND 5` (Section 8).
- Unique constraints: `User.email`, `Service.slug`, `BlogPost.slug`, `Project.slug`, `Booking.cancellationToken`.
- Standard indexes: `AvailabilitySlot(serviceId, startAt)`; slug columns (via their unique constraints); `Booking.status` (admin filtering).

### 4. Important tradeoffs

| Decision | Tradeoff accepted |
|---|---|
| Per-content-type Media join tables instead of one polymorphic table | More schema surface (3 tables vs. 1), in exchange for real, DB-enforced referential integrity and working cascades — recommended without reservation. |
| Partial unique index for double-booking prevention | Requires a database that supports filtered/partial unique indexes (PostgreSQL does natively); this is a reason the Postgres choice from `architecture.md` matters concretely here, not just as a generic preference. |
| Fixed-PK singleton pattern for `BusinessSettings` | Breaks the otherwise-uniform UUID-PK convention for exactly one table, deliberately, because this table's identity genuinely isn't "one of many." |
| FAQ as embedded JSON, not a relational table | Loses per-entry DB integrity and independent queryability, in exchange for zero extra tables/joins for content that's always read/written as a unit — low-risk given current requirements, with a clear promotion path if that changes. |
| `RESTRICT` delete behavior on `Service`/`AvailabilitySlot`/`Booking`-adjacent foreign keys | Makes certain deletions (of services or slots with history) blocked by default, pushing the admin UX toward "unpublish" rather than "delete" — a deliberate integrity-over-convenience choice, consistent with the platform's stated priorities. |
| `Booking` status has no fixed default at the schema level | Keeps the schema correct under either eventual answer to the open business decision, at the cost of the schema alone not fully describing booking behavior until that decision lands — intentional, not an oversight. |

### 5. Decisions Status

Following review, decisions 1–10 below are **approved and finalized** for v1:

1. PostgreSQL partial unique index for `Booking.slotId` where `status <> 'cancelled'`.
2. Separate `ServiceMedia`, `ProjectMedia`, `BlogPostMedia` join tables instead of a polymorphic media association.
3. `BusinessSettings` fixed-PK singleton with database-level enforcement.
4. `Review.source` enum: `google`, `in_person`, `phone`, `email`, `other`.
5. `Review.sourceDetail` nullable text field added, for additional attribution detail when needed.
6. `AvailabilitySlot` overlap detection explicitly deferred — not implemented in v1.
7. UUID primary keys across domain tables.
8. FAQ remains JSON on `Service`.
9. No locale/translation fields in v1.
10. No `Customer` entity, `businessId`, multi-tenancy, scheduling engine, or `SeoMetadata` entity.

**Remaining open item, explicitly not resolved by this document:**

- **`Booking` initial status remains OPEN.** No database default is set on `Booking.status` at this time. The schema is correct under either eventual answer and requires no structural change once the decision is made — only an application-level (or later, optionally, a database-level `DEFAULT`) value at insert time.

With all other items approved, this document is ready to inform `prisma/schema.prisma`.
