# Royal-Team Platform — Sanity Content Model (v1)

Status: Draft for review — revised following approved decisions and a dedicated editor-UX/safety pass
Sources: `docs/product.md`, `docs/architecture.md` (Business Website / Sanity scope)
Scope: Conceptual Sanity content model — document types, fields, relationships, editor experience, and safety behavior. No Sanity schema code, no Studio configuration, no project initialization.

---

## 0. Decisions Applied From Prior Review

1. **`Author`** — approved, kept independent of authentication. Fields: `name`, `slug`, `photo`, `bio`, `role`/title. Detailed in Section 6.
2. **`Homepage`** — approved as a separate singleton, holding marketing/presentation content only. `BusinessSettings` holds operational/business facts only. Detailed in Sections 7–8.
3. **Legal pages** (Privacy Policy, Impresszum, Cookie Policy) — **not** Sanity content types. They remain developer-controlled static pages in the Next.js codebase, optionally referencing business facts (name, registration number, address) from `BusinessSettings` at render time so those facts aren't duplicated by hand in two places. No `LegalPage` content type exists in this model.
4. **Media** — confirmed: no `Media` document type. The `imageWithAlt` reusable object type (Section 1) remains the sole mechanism, using Sanity's native asset system directly.
5. **Content type list** — confirmed final for v1, challenged and found sound (Section 1 explains the one place I'd have added something and why I'm not): `Homepage`, `BusinessSettings`, `Service`, `BlogPost`, `Project`, `Review`, `Author`.
6. **Following the Figma design revision review (booking removed, pricing and case studies added), the following corrections and confirmations are now final:**
   - `Project.relatedService` (single reference) is **changed to `Project.relatedServices`** (array of references) — Section 4.
   - `Project` gains a `specs` field (array of `label`/`value` pairs) for structured vehicle/technical facts — Section 4.
   - The "ELÉRHETŐ" availability badge seen on service cards in the design is confirmed to be **driven by `Service.isActive`** in production, not a separate always-on visual — Section 2.
   - FAQ display is confirmed to be **strictly per-`Service`, via `Service.faq`** — any general/homepage-level FAQ section must draw from a specific `Service`'s `faq` array rather than existing as an independent, separately-maintained FAQ set. This resolves an inconsistency observed in the design reference (which currently has both a general FAQ set and a separate DPF-specific one, predating this content model).
   - The workshop's confirmed final address — **Móricz Zsigmond utca 60., 2451 Ercsi, Hungary** — replaces the placeholder address seen in the design reference ("Ercsi, Autó utca 12.") everywhere it appears: `BusinessSettings`, the Contact page, the Impresszum, and any future `LocalBusiness`/SEO structured data. Recorded here for reference during Sanity content population — Section 7.
   - The real logo asset (`base_logo_transparent_background 1.svg`, provided alongside the design revision) is confirmed as the logo to use in production, replacing the procedurally-generated placeholder logo still present in the design reference code. This doesn't change any content-model field (`BusinessSettings.logo` already exists as an `imageWithAlt`) — it's a content/asset decision, not a schema change.
   - The contact page's map and the `/projektek/[slug]` detail routing are both confirmed to remain in their current placeholder/single-instance form within the design prototype — a real map embed and real per-project routing are implementation-phase work for the Next.js build, not something to resolve in the design or content-model documents now.
6. **Booking** — not implemented. `docs/database.md` and `docs/schema-design.md` remain under their deferred-scope banners, untouched by this document.
7. **Following the Next.js implementation of the Services pages, two small, approved additions to `Service` (Section 2):**
   - `tagline` (string, optional) — the short mono-font subtitle shown under the service title in both the homepage service-card grid and the services index page's alternating rows (e.g., "Részecskeszűrő regenerálás"). Implementation surfaced this as a real, repeated design element with no existing field to source it from.
   - `highlights` (array of strings, optional) — the "Főbb előnyök" bulleted benefits list on the services index page (e.g., "Üzemanyag-takarékosság," "Csökkentett emisszió"). Plain strings, not label/value pairs like `Project.specs` — each item is a short, self-contained phrase with no second value to pair it with.
   - Both were deliberately left out of the original model and only added once their absence was concretely felt against the approved design, per this project's own "extract on proven need, not anticipated need" principle — not an oversight corrected in hindsight, but the intended process working as designed.
8. **Following Next.js implementation of the Service detail page (`/szolgaltatasok/[slug]`), one further approved addition to `Service` (Section 2):**
   - `process` (array of `{ title (string), description (string) }`, optional) — the numbered "how we work" steps shown on the approved DPF detail page (design-system.md's `dpf` page-pattern row, generalized into the standard `Service` detail template — Section 8 of that document). Step numbers are derived from array position, not stored. Same shape rationale as `Project.specs`: a small, fixed, repeating structure an editor can freely add/remove/reorder rows in, not worth naming as separate fixed fields.
   - The reference DPF page's "Problem" section (descriptive prose + a bullet list of warning signs) needed **no new field** — it's exactly what `body` (Portable Text) is for once generalized past DPF-specific content: an editor writing any service's `body` can include paragraphs and a bullet list as needed, using Portable Text's standard block types.
   - The reference's title/description benefit pairs in that same page's "Benefits" section are **not** reproduced as a richer shape — the detail page reuses the same flat `highlights` (Section 0 item 7) already used on the services index, consistent with that field's "short, self-contained phrase" design, not a second, competing benefits shape.
9. **Following Next.js implementation of the Projects pages (`/projektek`, `/projektek/[slug]`), one approved addition to `Project` (Section 4):**
   - `results` (array of `{ value (string), label (string), description (string) }`, optional) — the "Eredmény" stat tiles on the project detail page (e.g., "0 / Hibaüzenet maradt / Teljes hibamentesítés"). Not folded into `specs`: `specs` describes the *vehicle* as label/value pairs, while these are 3-field project *outcomes* with a distinct big-number visual treatment — different shape, different concern.
   - The reference page's "Work performed" numbered list (6 title/description steps) needed **no new field** — `body`'s own description already explicitly covers this: "fits a build-documentation arc (starting condition → goals → modifications → process → testing → results)." Rendered as a Portable-Text-style numbered list within `body`, not a separate structured field.
   - The reference page's customer-quote pull quote is likewise rendered as part of `body` (a blockquote-style block) — Portable Text's standard block types already cover this; no `Review` reference or dedicated quote field was added.
10. **Following Next.js implementation of the Price List page (`/arlista`), one approved change to the price-item object (Section 10):**
    - `priceType` gains a third value: `quote` (alongside `fixed` and `from`). *Why:* the approved Figma reference has line items priced "Ingyenes" (e.g., "Egyedi árajánlatkérés") that aren't really free services at 0 Ft — they're "the quote itself is free" items, a genuinely different pricing mode from a flat or "starting from" number, not a numeric edge case of either.
    - `amount` becomes **required only when `priceType` is `fixed` or `from`** — a `quote` item has no number to validate. This is a conditional-required rule (Studio validation, `Rule.custom` keyed off the sibling `priceType` field), not a general loosening of the "positive integer" rule for `fixed`/`from` items, which stays exactly as strict as originally approved.

**On challenging the list per your instruction:** I don't have a concrete reason to add or remove a type beyond what's already been decided. The one place I reconsidered was whether `Review` needs any structural change given the Homepage-curation rework below — it doesn't; it stays as previously designed, just no longer self-managing its own "featured" state (Section 5 explains why that responsibility moved to `Homepage`).

---

## 1. Shared Building Blocks (object types, not documents)

Unchanged in concept from the prior version, with one addition (`noIndex`).

### `imageWithAlt` (object)
- `asset` — Sanity's native image reference (hotspot/crop supported).
- `alt` (string, **required**) — *why required:* accessibility and image SEO both depend on this; making it optional would mean it gets skipped under time pressure, silently degrading both. A field description should read: "Describe what's in the image for screen readers and search engines — not the filename, a real description (e.g., 'DPF filter before cleaning, heavily clogged with soot')."
- `caption` (string, optional).

### `seo` (object)
- `metaTitle` (string, optional).
- `metaDescription` (text, optional).
- `noIndex` (boolean, optional, default `false`) — **new in this revision.** *Why:* an escape hatch for the rare case of a page that must exist but shouldn't appear in search results (e.g., a legacy or duplicate page kept for a specific link, or content published for internal review purposes). Given how rarely this is genuinely needed, the field description should actively discourage casual use: "Only turn this on if you specifically want to hide this page from Google. This is unusual — leave it off unless you know why you need it." Used wherever `seo` is used: `Service`, `BlogPost`, `Project`, `Homepage`. Not exposed on `BusinessSettings` (not a rendered page) or `Author`/`Review` (not independently indexed pages).

### `faqItem` (object), used only as `faq: array of faqItem` on `Service`
- `question` (string, required), `answer` (text, required). Unchanged.

### `ctaLink` (object), new — used only within `Homepage`
- `label` (string, required).
- `url` (string, required — internal path or full URL; a full "smart link" reference-resolver type is deliberately not introduced here, since a plain URL/path string covers the homepage's actual need without adding a more complex link-resolution field type on spec alone).

### Cross-cutting: no custom `status`/`isPublished` field anywhere by default

Restated from the prior version because it remains the single most important platform-capability point in this document: Sanity's native draft/publish document lifecycle already answers "is this ready to show publicly," so no content type below duplicates that with its own status field. Where a type needs something draft/publish *doesn't* answer — see `Service.isActive` below — that's added deliberately and explained, not as a default pattern repeated everywhere.

---

## 2. `Service`

**Purpose:** unchanged — an offered service, the anchor for the services section.

**Fields, with field grouping for the Studio UI:**

**Group: Content**
| Field | Type | Required | Why |
|---|---|---|---|
| `title` | string | Yes | |
| `slug` | slug | Yes | Generated from `title` once, at creation. See "Slug stability" below for the safety behavior around editing it afterward. |
| `tagline` | string | No, **approved addition** | Short subtitle shown under the title in the homepage service-card grid and the services index page (e.g., "Részecskeszűrő regenerálás") — a brief, more specific descriptor than `title`, distinct from `summary`'s longer descriptive sentence. Added once implementation surfaced it as a real, repeated design element (Section 0, item 7). |
| `summary` | text | No | Listing-card text and meta-description fallback. |
| `body` | Portable Text | Warning-level validation | Warning, not hard error, because content is built incrementally — an editor should be able to save an in-progress draft without a scolding error blocking them. |
| `highlights` | array of strings | No, **approved addition** | The "Főbb előnyök" bulleted benefits list on the services index page (e.g., "Üzemanyag-takarékosság," "Csökkentett emisszió," "Motortartósság növelése"). Plain strings, not label/value pairs like `Project.specs` (Section 4) — each item is a short, self-contained phrase with nothing to pair it with. A field description should nudge editors toward 3–4 items, the same soft-guidance approach used on `Homepage.secondaryCtas` (Section 8) — editorial guidance, not a hard validation limit. |
| `process` | array of `{ title (string), description (string) }` | No, **approved addition** | The numbered "how we work" steps shown on the `Service` detail page (e.g., "01 Diagnosztika — OBD olvasás, szűrő nyomásmérés..."). Step number is derived from array position, not stored. Same rationale as `Project.specs` (Section 4): a small, fixed, repeating shape, simple enough not to need named per-step fields. Genuinely optional — a service with a simple, one-visit process may reasonably have none. |
| `faq` | array of `faqItem` | No | Kept here (not a separate type) per the long-standing approved decision — FAQ content is always read/edited together with its service, never independently. Confirmed rendered on the `Service` detail page (`/szolgaltatasok/[slug]`) — the FAQ's actual, correct home once the design's per-page FAQ display was generalized past the DPF-specific prototype page. |

**Group: Media**
| Field | Type | Required | Why |
|---|---|---|---|
| `heroImage` | `imageWithAlt` | Recommended (warning-level) | |
| `gallery` | array of `imageWithAlt` | No | |

**Group: Display Settings**
| Field | Type | Required | Why |
|---|---|---|---|
| `isActive` | boolean | No, **default `true`** | **This is the one deliberate deviation from "rely on native draft/publish" in this entire document, and it earns its place for a specific reason:** a service can be a finished, correct, *published* piece of content that the business nonetheless wants to temporarily hide — e.g., paused seasonally, waiting on equipment, or temporarily not offered. Unpublishing in Sanity is a general-purpose document action that isn't obviously "the hide button" to a non-technical editor (it can feel like an ambiguous or slightly alarming action — "did I just delete this?"). A plain, clearly-labeled toggle avoids that ambiguity entirely. Field description: "Turn this off to temporarily remove this service from the website without deleting anything. Turn it back on any time." Default `true` because creating a service implies wanting it shown, not hidden. **Confirmed production behavior:** the "ELÉRHETŐ" (Available) status indicator seen on service cards in the approved design is driven by this field — shown when `isActive` is `true`, hidden (or replaced with different copy) when `false` — rather than being a permanently-on decorative label. This is the concrete reason the field needs to exist as real, queryable data rather than a purely cosmetic toggle. |
| `displayOrder` | number | No | Controls manual ordering on the services index page — a small, fixed list of services benefits from manual curation (e.g., DPF cleaning first, as the flagship) more than an alphabetical or creation-date default would. |

**Group: SEO**
| Field | Type | Required | Why |
|---|---|---|---|
| `seo` | `seo` object | No | |

**Why no `ctaLabel` field (reconsidered from the prior version):** on reflection, a single, consistent site-wide contact call-to-action ("Contact us" / "Get in touch") is simpler and more consistent for visitors than a per-service custom CTA label would be, and it removes one more field an editor has to think about for every service. If a genuine need for per-service CTA wording emerges in practice, it's a small, easy addition later — not adding it now is the "minimize unnecessary fields shown to editors" principle applied concretely.

**Preview configuration (Studio list/reference view):** title as the primary line; subtitle showing `summary` truncated, with a visual "Hidden" badge/indicator when `isActive` is `false` — so an editor scanning the services list can immediately see which services are currently hidden without opening each one. Thumbnail from `heroImage`.

**Answering the specific review points requested:**
- **Active/visible:** yes, via `isActive` — justified above, the one type in this model that needs it.
- **Homepage featured:** **not** a field on `Service` — curation lives on `Homepage.featuredServices` instead (Section 8). Keeping it off `Service` means there's exactly one place to look to see "what's currently on the homepage," rather than having to remember to check a flag scattered across every service document.
- **Ordering:** `displayOrder`, for the services index page specifically (separate concern from homepage curation).
- **SEO:** standard `seo` object, including the rarely-used `noIndex` escape hatch.
- **FAQ:** embedded array field, unchanged.
- **Hero/gallery:** both present, using the shared `imageWithAlt` object.
- **Tagline/highlights:** `tagline` (short subtitle string) and `highlights` (array of short benefit strings) — approved additions, Section 0 item 7.
- **Process steps:** `process` (array of title/description pairs) — approved addition, Section 0 item 8.

---

## 3. `BlogPost`

**Purpose:** unchanged — SEO/trust-building articles.

**Group: Content**
| Field | Type | Required | Why |
|---|---|---|---|
| `title` | string | Yes | |
| `slug` | slug | Yes | Same stability treatment as `Service.slug`. |
| `excerpt` | text | No | Listing summary, meta-description fallback. |
| `body` | Portable Text (inline images supported) | Warning-level | Inline images (not a separate gallery) because blog narrative is linear — a photo illustrates a specific point in the text as it's written, unlike `Project`'s more documentation-style structure (Section 4). |

**Group: Media**
| Field | Type | Required | Why |
|---|---|---|---|
| `heroImage` | `imageWithAlt` | Recommended | Listing card and article banner. |

**Group: Publishing**
| Field | Type | Required | Why |
|---|---|---|---|
| `author` | reference → `Author` | Recommended | Public byline — the reason `Author` exists as a type at all (Section 6). |
| `publishedAt` | datetime | Recommended | Editorial "Published on [date]" shown to readers — distinct from Sanity's own internal publish-action timestamp, so an author can backdate or hold a finished post without the displayed date depending on exactly when the Studio "Publish" button happened to be clicked. Field description: "The date shown to readers. Doesn't have to match today — set it to whenever this should read as published." |

**Group: SEO**
| Field | Type | Required | Why |
|---|---|---|---|
| `seo` | `seo` object | No | |

**Preview configuration:** title as primary line; subtitle showing author name + `publishedAt` (or "Draft" if unpublished); thumbnail from `heroImage`.

**Answering the specific review points requested:**
- **Draft/published:** native Sanity state, no custom field — this is the clean, canonical case for relying on the platform default rather than adding anything.
- **Visible/hidden:** **no separate field.** Unlike `Service`, a blog post doesn't have an operational "temporarily pause this" need — it's either not yet ready (draft) or live (published). If a specific old post ever needs to come down, unpublishing it via Sanity's native action is adequate and appropriately rare — adding a dedicated toggle here would be solving a problem that doesn't actually recur for this content type.
- **Author:** reference to `Author`, publicly displayed.
- **`publishedAt`:** present and justified above.
- **Cover image:** `heroImage`.
- **SEO:** standard `seo` object.
- **Slug stability:** same treatment as all slugged types — see the dedicated section below.

---

## 4. `Project`

**Purpose:** unchanged — showcased project/case-study content, generically modeled; AMG C63 is the flagship instance, not a special case.

**Group: Content**
| Field | Type | Required | Why |
|---|---|---|---|
| `title` | string | Yes | |
| `slug` | slug | Yes | |
| `summary` | text | No | |
| `body` | Portable Text (inline images supported) | Warning-level | Primary narrative mechanism — fits a build-documentation arc (starting condition → goals → modifications → process → testing → results) where each stage's photo has direct narrative context. |
| `specs` | array of `{ label (string), value (string) }` | No, **approved addition** | *Why:* structured vehicle/technical facts (e.g., "Jármű: Mercedes-AMG C63," "Motor: 4.0L V8 Biturbo," "Teljesítmény: 476 LE / 650 Nm") read better as a scannable spec table than embedded in prose, and a fixed label/value shape lets an editor add or remove rows freely without touching layout. Kept as a simple array of pairs rather than named fixed fields (e.g., separate `engine`/`power`/`mileage` fields) specifically because different projects plausibly want different spec rows — a diagnostic-focused project might list different facts than a suspension build — and a fixed field set would either force irrelevant blank fields or need per-project-type schema variants, both worse than one flexible, editor-controlled list. |
| `projectDate` | date | No, new addition | *Why:* portfolio-style credibility benefits from visible recency ("Completed: March 2026") without needing to infer it from `publishedAt`/Sanity's internal metadata, which track editorial workflow, not when the actual work happened. Optional, low-risk addition — easy to omit if you'd rather not have it. |
| `results` | array of `{ value (string), label (string), description (string) }` | No, **approved addition** | The "Eredmény" stat tiles on the project detail page (e.g., "0 / Hibaüzenet maradt / Teljes hibamentesítés"). Not folded into `specs` — `specs` is a 2-field label/value shape describing the *vehicle*, while these are 3-field project *outcomes* with their own distinct big-number stat-tile visual treatment; conflating the two would lose the description line and mix two different concerns in one list. Not representable as `body` prose either, unlike the "work performed" narrative (see `body`'s row above) — these are isolated data points, not flowing text. |

**Group: Media**
| Field | Type | Required | Why |
|---|---|---|---|
| `heroImage` | `imageWithAlt` | Recommended | |
| `gallery` | array of `imageWithAlt` | No | **Supplementary** to the inline body images, not a replacement — a "more photos" section for a broader shot set that doesn't map to one specific narrative beat, coexisting deliberately with inline images rather than duplicating the same purpose. |

**Group: Details**
| Field | Type | Required | Why |
|---|---|---|---|
| `author` | reference → `Author` | Recommended | Same rationale as `BlogPost` — the AMG build's credibility benefits from named technical attribution. |
| `relatedServices` | array of references → `Service` | No, **changed from a single reference in this revision** | A project can plausibly relate to more than one service (e.g., the AMG build involved DPF cleaning, diagnostics, and suspension work together) — the earlier singular design underestimated this. Changed from `relatedService` (single) to `relatedServices` (array) specifically because the approved Figma design's project detail page shows multiple related services per project; the content model is being corrected to match a real, confirmed requirement, not speculatively widened. |
| `displayOrder` | number | No | Controls ordering on the projects index page — e.g., ensuring the AMG build appears first regardless of when it was published. |

**Group: SEO**
| Field | Type | Required | Why |
|---|---|---|---|
| `seo` | `seo` object | No | |

**Why `isFeatured` is dropped from this revision (reversing the prior draft):** on the closer editor-UX review requested here, a per-project boolean flag for "featured" is redundant in two directions at once — `displayOrder` already controls prominence within the Projects listing page itself, and homepage curation now lives entirely on `Homepage.featuredProjects` (Section 8). Keeping `isFeatured` here as well would mean the same underlying question ("should this be prominent?") could be answered inconsistently in three different places across two documents, which is a real risk of confusion for a non-technical editor, not just redundant data. Removing it is a direct application of "minimize unnecessary fields shown to editors."

**Preview configuration:** title as primary line; subtitle showing `projectDate` (if set) and related service name(s) (if set); thumbnail from `heroImage`.

**Answering the specific review points requested:**
- **Visible/hidden:** no separate field, same reasoning as `BlogPost` — native draft/publish is adequate; a project doesn't have `Service`'s "temporarily pause" operational need.
- **Featured:** removed as a field on `Project` itself — see above; curation lives on `Homepage`.
- **Ordering:** `displayOrder`, for the Projects index page.
- **Gallery:** present, supplementary to inline body images.
- **Author:** reference to `Author`, publicly displayed.
- **Specs:** structured `label`/`value` array for vehicle/technical facts, approved addition (above).
- **Related services:** array of references, plural — corrected from the original singular design (above).
- **SEO:** standard `seo` object.
- **Results:** `results` (array of value/label/description triples) — approved addition, Section 0 item 9.

---

## 5. `Review`

**Purpose:** unchanged — manually curated testimonials.

**Fields (kept flat, no groups — small enough that tabs/sections would add friction rather than remove it):**

| Field | Type | Required | Why |
|---|---|---|---|
| `authorName` | string | Yes | Not a reference to `Author` — a review's author is an external customer, a different concept entirely from a content contributor, and doesn't warrant the same reference type. |
| `rating` | number | Yes | Validation: integer, min 1, max 5, enforced by a schema rule — this is the Sanity-native equivalent of the previously-approved database `CHECK` constraint, now expressed as Studio validation. No default value — forcing an explicit choice is correct here; a pre-filled rating risks being left unchanged by mistake. |
| `text` | text | Yes | |
| `reviewDate` | date | No | The date the review reflects, independent of when it was entered into Sanity. |
| `source` | string, fixed list | Yes | Values: `google`, `in_person`, `phone`, `email`, `other` — approved enum, implemented as a Studio dropdown (`options.list`). |
| `sourceDetail` | string | No | Free-text supplement, independent of which `source` is chosen. |

**Why `isFeatured` is dropped from this revision (reversing the prior draft, same reasoning as `Project`):** homepage curation now lives on `Homepage.featuredReviews` (Section 8) as a reference array. A separate `isFeatured` boolean here would be a second, competing way to answer the same question, with no clear rule for which one wins if they ever disagreed — removing it resolves that ambiguity at the model level rather than leaving it as a future support question.

**Preview configuration:** `authorName` as primary line; subtitle showing rating as stars (e.g., "★★★★★") and `source`; no thumbnail (reviews have no image field).

**Answering the specific review points requested:**
- **Visible/hidden:** no separate field — native draft/publish is sufficient; a review is either ready to show or still being entered/reviewed internally, which maps cleanly onto draft/publish with no additional state needed.
- **Featured:** removed as a field here — see above.
- **Source attribution:** `source` (constrained list) + `sourceDetail` (free text), unchanged from the prior approved design.

---

## 6. `Author`

**Purpose:** unchanged — public editorial attribution for `BlogPost`/`Project`, entirely decoupled from Sanity project membership or any authentication concept.

**Fields (flat, deliberately minimal, per your explicit "keep this lightweight" instruction):**

| Field | Type | Required | Why |
|---|---|---|---|
| `name` | string | Yes | Public display name. |
| `slug` | slug | No | **Added per your suggested field list.** Not used for a dedicated public author page in v1 (no author archive/landing page exists in the current sitemap) — included now specifically so that a future "all posts by this author" page can be added later without a schema change, at effectively zero cost today. If that page never gets built, the field simply goes unused; it's cheap insurance, not speculative overreach, since it's a single string field with no dependent behavior attached to it in v1. |
| `photo` | `imageWithAlt` | No | Optional headshot for the byline. |
| `bio` | text | No | Short editorial bio, optionally shown alongside authored content. |
| `role` | string | No | **Added per your suggested field list** (e.g., "Owner & Master Technician," "Founder"). Gives the public byline more credibility context than a bare name alone — directly supports the trust-building business goal, at the cost of one simple field. |

**Explicitly not included, to keep this lightweight as instructed:** no email field, no social links, no multiple-photo gallery, no "areas of expertise" tagging, no relationship back to which posts/projects reference this author (that relationship already exists in the other direction, via `BlogPost.author`/`Project.author` — duplicating it here would be redundant data with no query benefit for how Sanity references work). `Author` is a name, an optional face, an optional short bio, and an optional title — nothing more.

**Public presentation:** rendered inline as a small byline wherever referenced (e.g., "Written by [name], [role]" with `photo` if present) — not as a standalone profile page in v1, consistent with keeping this type genuinely lightweight rather than building out unneeded profile-management surface area.

**Preview configuration:** `name` as primary line, `role` as subtitle, `photo` as thumbnail.

---

## 7. `BusinessSettings` (singleton — operational information only)

**Purpose:** unchanged in spirit, now explicitly scoped to **operational/business facts only**, per your instruction to keep marketing content out of it entirely.

**Group: Contact & Location**
| Field | Type | Required | Why |
|---|---|---|---|
| `businessName` | string | Yes | |
| `phone` | string | Yes | |
| `email` | string | Yes | Also the intended recipient for contact-form forwarding (`docs/architecture.md` Section 9) — read from here rather than hardcoded, so the owner can update the recipient address by editing content, not by requesting a code change. |
| `address` | object: `addressLine1`, `addressLine2` (optional), `city`, `postalCode` | Yes except `addressLine2` | Structured, not free text — needed for `LocalBusiness` JSON-LD generation. **Confirmed final value, mapped to these fields:** `addressLine1` = "Móricz Zsigmond utca 60.", `city` = "Ercsi", `postalCode` = "2451" — replacing the placeholder "Ercsi, Autó utca 12." seen in the design reference. **No separate `country` field is added**, even though the confirmed address is naturally written with ", Hungary" at the end — v1 is a single-market (Hungary-only) business per `docs/product.md`, so country is fixed, implicit context for every use of this address (display copy, `LocalBusiness` structured data, etc.), not a value that varies and needs to be stored as data. Adding a field to hold a constant is exactly the kind of unneeded schema addition this project consistently avoids; if a second, non-Hungarian business implementation is ever built, that's a new `BusinessSettings` document in a new context, not a reason to add a country field to this one now. |

**Group: Hours**
| Field | Type | Required | Why |
|---|---|---|---|
| `openingHours` | array of `{ day (fixed list Mon–Sun), opens (string "HH:mm"), closes (string "HH:mm"), closed (boolean) }` | No | Structured rather than free text, since it feeds both display and potential future structured-data use. Validation: `opens`/`closes` matched against an `HH:mm` regex, to avoid inconsistent free-form time entry (e.g., "9am" vs "09:00" vs "9:00 AM" all meaning the same thing but breaking any programmatic use). |

**Group: Branding**
| Field | Type | Required | Why |
|---|---|---|---|
| `logo` | `imageWithAlt` | Recommended | Used site-wide (header/footer), not homepage-specific — correctly belongs here, not on `Homepage`. |
| `brandColorPrimary`, `brandColorSecondary` | string (hex) | No | Plain hex strings for v1 rather than adding the `@sanity/color-input` plugin — a reasonable, low-dependency default; easy upgrade later if plain hex editing proves annoying. |

**Group: Legal**
| Field | Type | Required | Why |
|---|---|---|---|
| `legalCompanyName` | string | Recommended before launch | Referenced by the static Next.js legal pages (Section 0, decision 3) — kept here specifically so the Impresszum/Privacy Policy pages can pull this fact dynamically rather than it being hardcoded twice (once in this field, once in the static page copy) with a risk of the two drifting apart if the company details ever change. |
| `legalRegistrationNumber` | string | Recommended before launch | Same rationale. |

**Group: Social**
| Field | Type | Required | Why |
|---|---|---|---|
| `socialLinks` | array of `{ platform (fixed list), url }` | No | |

**Explicitly removed from this type in this revision:** the previously-included `seo` object. Homepage-level SEO metadata now belongs on `Homepage` (Section 8), since it's describing an actual rendered page (the homepage), whereas `BusinessSettings` itself isn't a page — it's a data source other pages and structured-data generation draw from. Keeping `seo` here would have been exactly the "marketing content bleeding into operational settings" pattern you asked me to avoid.

**Singleton mechanism:** fixed `_id: "businessSettings"`, Studio structure configuration presenting it as a single direct-edit screen (no "create new," no list view). **Recommended additional safety measure:** remove the "Delete" document action for this type in Studio configuration entirely — there's no legitimate reason a non-technical editor should ever delete the one business-settings document, and doing so accidentally would break structured data and legal-page rendering across the whole site. This is a Studio-configuration detail to implement at the schema-code stage, but the *policy* (this document should not be deletable through normal editing) is worth deciding now.

**Preview:** singleton, no list view — Studio navigation shows it as a single named entry (e.g., "Business Settings").

---

## 8. `Homepage` (singleton — marketing/presentation content only)

**Purpose:** curated homepage editorial content, kept structurally separate from `BusinessSettings` so "hard business facts" and "homepage marketing copy" never mix in one editing screen, per your explicit instruction.

**Group: Hero**
| Field | Type | Required | Why |
|---|---|---|---|
| `heroHeadline` | string | Recommended | |
| `heroSubheadline` | string | No | |
| `heroImage` | `imageWithAlt` | Recommended | |

**Group: Introduction**
| Field | Type | Required | Why |
|---|---|---|---|
| `introText` | text | No | Brief homepage positioning statement, below the hero. |

**Group: Featured Content — this is where curation actually lives, replacing the per-document `isFeatured` flags removed from `Service`/`Project`/`Review`**
| Field | Type | Required | Why |
|---|---|---|---|
| `featuredServices` | array of references → `Service` | No | Manually curated, ordered selection — editors see and reorder exactly what's on the homepage from one screen, rather than needing to remember which of many `Service` documents have a flag set. Sanity's reference arrays support drag-to-reorder natively in the Studio, which is a materially better editing experience than hunting through a list of services for scattered checkboxes. |
| `featuredProjects` | array of references → `Project` | No | Same rationale — this is specifically how the AMG build gets pinned to the homepage, deliberately and visibly, rather than via a flag buried on the `Project` document itself. |
| `featuredReviews` | array of references → `Review` | No | Same rationale. |

**Group: Calls to Action**
| Field | Type | Required | Why |
|---|---| ---|---|
| `secondaryCtas` | array of `ctaLink` | No | A small, fixed-shape list (label + url), **not** a generic block system — this is exactly the kind of purpose-specific, bounded field the instruction to avoid a page-builder calls for. Field description should nudge quality: "Keep this to 2–3 key actions — more than that dilutes the message and makes the page feel cluttered." (A soft content-quality nudge via description text, not a hard validation-enforced limit, since there's no real integrity risk in having four items instead of three — this is editorial guidance, not a safety rule.) |

**Group: SEO**
| Field | Type | Required | Why |
|---|---|---|---|
| `seo` | `seo` object | No | The homepage's own meta title/description — this is the correct home for what was previously (incorrectly, per this revision) proposed as a `BusinessSettings` field. |

**Explicitly not a generic page builder:** every field above is a specific, named section with a specific, bounded shape (a hero, an intro paragraph, three fixed featured-content arrays, a small bounded CTA list, SEO). There is no "add a block, choose its type, arrange freely" mechanism anywhere in this document — consistent with the instruction throughout this project's history, and directly avoiding the failure mode where a "flexible" homepage schema turns into an unmaintainable pile of loosely-typed content blocks with no real structure.

**Which content should be referenced rather than duplicated (direct answer to your review question):** all three featured-content fields are references, never duplicated copies of the underlying `Service`/`Project`/`Review` content. This matters concretely: if a featured service's description is edited later, the homepage automatically reflects the update, with no risk of the homepage silently showing stale, duplicated text that someone forgot to update in two places.

**Singleton mechanism:** same fixed-`_id` + Studio structure pattern as `BusinessSettings`, including the same recommendation to remove the "Delete" action for this document type.

**Preview:** singleton, no list view.

---

## 9. `AboutPage` (singleton — approved, mirrors `Homepage`'s pattern)

**Purpose:** closes the previously-open content-model gap for the About/Rólunk page. Per your decision, this is a new Sanity singleton, owner-editable like `Homepage`, rather than static Next.js content — the owner story, philosophy, and stats are exactly the kind of content that changes over time (updated years of experience, a revised philosophy statement) and shouldn't require a developer to touch code for a routine edit.

**Group: Hero**
| Field | Type | Required | Why |
|---|---|---|---|
| `heroHeadline` | string | Recommended | |
| `heroSubheadline` | string | No | |
| `heroImage` | `imageWithAlt` | Recommended | |

**Group: Story**
| Field | Type | Required | Why |
|---|---|---|---|
| `ownerStory` | Portable Text | Warning-level | The owner/company narrative — kept as rich text (not plain text) since the approved design shows this as a multi-paragraph editorial piece, the same reasoning already applied to `Service.body`/`BlogPost.body`. |

**Group: Philosophy**
| Field | Type | Required | Why |
|---|---|---|---|
| `philosophyValues` | array of `{ icon (string, fixed list — same presentation-layer icon-mapping approach already used for `Service`, `docs/design-system.md` Section 12), title (string), description (text) }` | No | The three value cards seen in the approved design (e.g., precision, technical expertise, craftsmanship). A bounded, purpose-specific array — not a generic block field — matching the same discipline already applied to `Homepage`. |

**Group: Stats**
| Field | Type | Required | Why |
|---|---|---|---|
| `stats` | array of `{ label (string), value (string) }` | No | The same simple label/value pair shape already used for `Project.specs` (Section 4), reused here for consistency rather than inventing a differently-shaped structure for what is functionally the same kind of content (e.g., "15+ év tapasztalat," "500+ elégedett ügyfél"). Kept as its own field definition rather than formally elevated to a new shared object type in Section 1, since only these two places currently use this shape — a case where noting the parallel is enough, and promoting it to a shared type would be premature abstraction for a two-occurrence pattern. |

**Group: Gallery**
| Field | Type | Required | Why |
|---|---|---|---|
| `photoGallery` | array of `imageWithAlt` | No | The workshop/photo grid section seen in the approved design. |

**Group: Calls to Action**
| Field | Type | Required | Why |
|---|---|---|---|
| `cta` | `ctaLink` (single, not an array) | No | The closing CTA banner — a single call-to-action here, unlike `Homepage.secondaryCtas` (which is deliberately a small array for multiple homepage actions); the About page's design shows exactly one closing CTA, so the field shape matches the actual content need rather than defaulting to an array "just in case." |

**Group: SEO**
| Field | Type | Required | Why |
|---|---|---|---|
| `seo` | `seo` object | No | |

**Explicitly not a generic page builder** — same discipline as `Homepage`: every field is a specific, named, bounded section (hero, one rich-text story field, one bounded values array, one bounded stats array, one gallery array, one CTA, SEO). No "add a block, choose its type" mechanism.

**Singleton mechanism:** same fixed-`_id` + Studio structure pattern as `BusinessSettings` and `Homepage`, including the same recommendation to remove the "Delete" action.

**Preview:** singleton, no list view.

---

## 10. `PriceCategory` (approved — closes the previously-open pricing content-model gap)

**Purpose:** the Árlista/Pricing page's content, kept deliberately independent of `Service` — a category groups a set of individually priced line items, but neither the category nor its items are required to correspond to any `Service` document. This is a firm decision, not a default: the pricing page can describe one-off workflows or line items that don't warrant their own service page.

**Fields (flat, no field groups — the field count doesn't justify tabs, consistent with `Review`/`Author`):**

| Field | Type | Required | Why |
|---|---|---|---|
| `title` | string | Yes | E.g., "DPF & Részecskeszűrő." |
| `displayOrder` | number | No | Controls category ordering on the pricing page — the same manual-ordering pattern already used by `Service.displayOrder`, reused here for consistency rather than introducing a different convention. |
| `isActive` | boolean, default `true` | No | **Category-level hide-without-delete**, for the same reason `Service.isActive` exists: Sanity's native unpublish isn't an obviously-safe "hide" action to a non-technical editor, while a plainly labeled toggle is unambiguous. Field description: "Turn this off to temporarily remove this category from the price list without deleting it." |
| `items` | array of the price-item object (below) | **Yes, minimum 1 item** | A category with zero items would render as an empty, confusing section on a live page — requiring at least one item at the schema level (`Rule.required().min(1)`) prevents that state from ever being publishable, rather than relying on an editor to notice and avoid it. **This minimum-length requirement is the one refinement made to this model in this round, per your instruction.** |

### Price item (object, embedded within `items` — not a separate document type)

| Field | Type | Required | Why |
|---|---|---|---|
| `name` | string | Yes | |
| `note` | string | No | A short, single-line explanatory note (e.g., "Személyautó, szűrőmérettől függően") — plain string, not Portable Text, since this is never more than a brief clarifying phrase. |
| `priceType` | enum: `fixed` \| `from` \| `quote`, **`quote` approved addition** | Yes | Structured distinction between a flat price, a "starting from" price, and a quote-only item with no number at all (e.g., "Egyedi árajánlatkérés," shown as "Ingyenes" — the quote itself is free, not the work) — rather than encoding any of this into free text. See the rationale below. |
| `amount` | number | **Yes when `priceType` is `fixed` or `from`; not applicable for `quote`** | Validated as a positive integer (`Rule.integer().positive()`) — whole forint amounts, no decimal places, matching standard Hungarian pricing convention. The required-ness is conditional on `priceType` (Studio validation keyed off the sibling field), not a blanket requirement. |
| `isActive` | boolean, default `true` | No | **Item-level hide-without-delete.** Since this is an embedded object (not its own document), it has no independent draft/publish state of its own — this field is the only mechanism available for hiding a single line item without removing it or unpublishing the entire parent category. |

**Deliberately excluded, matching decisions already approved elsewhere in this model:**
- **No `currency` field** — v1 operates in a single currency (HUF) for a single market, exactly the same reasoning already applied to omitting a `country` field on `BusinessSettings.address`: this would be a field holding a constant, not genuinely variable data.
- **No formatted price string field** (e.g., editors typing "35 000 Ft-tól" directly) — the display string is composed entirely in the Next.js presentation layer from `priceType` + `amount` (or, for `quote`, from `priceType` alone — a fixed "Ingyenes" label, not editor-authored text). This is a direct, concrete application of the project's core boundary ("Sanity provides content, Next.js provides presentation"): letting editors hand-type formatted price strings would risk inconsistent thousands-separators, spacing, or "Ft"/"-tól" phrasing across dozens of line items, whereas deriving the display format once in code guarantees every price renders identically.
- **No `Service` reference of any kind** — confirmed, per your explicit instruction.
- **No separate `PriceListItem` document type** — items are embedded in `items`, the same "always edited together with its parent, never independently referenced" reasoning already applied to `Service.faq`.
- **No `PriceList` wrapper/singleton document** — the pricing page's content is simply "all published `PriceCategory` documents, ordered by `displayOrder`," exactly mirroring how the Services page works off "all published `Service` documents." A wrapper document would add a fictitious third conceptual layer with nothing real to hold.
- **No field groups/tabs** — four fields on the category, five on the item; below the threshold where grouping reduces friction rather than adding it, consistent with how `Review` and `Author` were treated.

**Preview configuration:** `title` as the primary line for `PriceCategory` in Studio's document list; subtitle showing item count and a visual "Hidden" indicator when `isActive` is `false`, mirroring the pattern already established for `Service`.

**Status: approved, final.** This closes the previously-open pricing content-model gap (`docs/content-model.md`'s earlier closing summary, item 5; `docs/design-system.md`'s ambiguity item 8) — both are updated below to reflect this resolution.

---

## 11. Slug Stability (cross-cutting, applies to `Service`, `BlogPost`, `Project`, `Author`)

Addressed once here rather than repeated per type, since the policy is identical everywhere a slug exists. **Not applicable to `PriceCategory`** — pricing categories have no individual public URL/slug; they're rendered as sections of the single Árlista page.

- The slug is generated from the title **once**, at document creation, via Sanity's standard slug-generation action — not silently regenerated every time the title is edited afterward (which would otherwise risk quietly breaking a URL the editor never intended to change).
- **Recommended technical safeguard for the schema-code stage** (a policy decision now, an implementation detail later): make the slug field conditionally read-only once a document has been published at least once, requiring an explicit, deliberate action (e.g., a brief unlock/confirm step) to change it afterward. This directly protects against the single most damaging accidental edit a non-technical editor could make to a live page — an accidental slug change silently breaks external links and destroys any accumulated SEO ranking for that URL, and the mistake is easy to make (it looks like just another text field) and hard to notice immediately (the page still loads fine internally in Studio; only external links and search rankings suffer, invisibly).
- Field description on every slug field: "This becomes part of the page's web address. Changing it after the page is live will break existing links and can hurt search rankings — only change it if you're sure."

---

## 12. Preview Experience — Summary

Sanity supports two levels of "preview," worth distinguishing:

1. **List/reference-picker preview** (title, subtitle, thumbnail shown wherever a document appears in a list or a reference field) — specified per type above. This is a v1 requirement; it costs little to configure and meaningfully helps an editor scan and recognize content at a glance (e.g., seeing which services are hidden, which blog posts are drafts, star ratings on reviews).
2. **Live visual preview** (Sanity's "Presentation" tool, showing the actual rendered page inline in Studio as you edit) — a genuinely valuable enhancement, **explicitly deferred as a future capability, not built in v1.** It requires wiring up preview URLs and Next.js draft-mode integration, which is real, non-trivial implementation work disproportionate to include in the content-modeling phase — flagged here so it isn't forgotten, not because it isn't worthwhile.

---

## 13. Sanity Plan Consideration: Scheduled Publishing (deferred capability)

Raised explicitly because you asked for it to be considered: Sanity offers **scheduled publishing** (queue a document to publish automatically at a future date/time) as a platform feature — but based on current published pricing (checked in the prior architecture revision), this capability is associated with Sanity's paid "Growth" tier, not the free tier this project is currently targeting for cost reasons. **Not relied upon or assumed in v1** — editors publish manually, and `BlogPost.publishedAt`/`Project.projectDate` (the editorial-display-date fields) already provide a reasonable substitute for "make this look like it was published on a specific date" even without true scheduled automation. If Sanity's plan is ever upgraded for other reasons, scheduled publishing becomes available with no schema change required — it's a Studio/platform capability, not something modeled in the content types themselves.

---

## 14. Final Summary

### 1. Final proposed content types
`Homepage` (singleton), `BusinessSettings` (singleton), `Service`, `BlogPost`, `Project`, `Review`, `Author`, `AboutPage` (singleton), `PriceCategory` — **nine types**, confirmed final. `Project` includes two fields added during the Figma design review (`specs`, `relatedServices` — see item 2); `AboutPage` (Section 9) closes the previously-open About-page content-model gap; `PriceCategory` (Section 10) closes the previously-open pricing gap.

### 2. Fields for each type
Detailed in Sections 2–10 above, with per-field justification. Two corrections from the Figma design review are final: `Project.relatedService` (single reference) is **`Project.relatedServices`** (array of references), and `Project` gained a `specs` field (array of label/value pairs) — both in Section 4. `Service` gained `tagline` (string), `highlights` (array of strings), and `process` (array of title/description pairs) once Next.js implementation of the Services pages surfaced them as real, repeated design elements with no existing field to source (Section 0 items 7–8, Section 2). `Project` gained `results` (array of value/label/description triples) once implementation of the Projects pages surfaced the same kind of gap (Section 0 item 9, Section 4). **`AboutPage`** (Section 9) mirrors `Homepage`'s singleton pattern: hero, `ownerStory` (Portable Text), `philosophyValues`, `stats` (reusing `Project.specs`'s label/value shape), `photoGallery`, a single `cta`, and `seo`. **`PriceCategory`** (Section 10) is the approved type: `title`, `displayOrder`, `isActive`, and a required, minimum-one-item `items` array of embedded price-item objects (`name`, `note`, `priceType`, `amount`, `isActive`) — fully independent of `Service`, per your explicit instruction. `priceType` gained a third value, `quote`, once Next.js implementation of the Price List page surfaced "Ingyenes" (quote-only) line items with no real numeric amount (Section 0 item 10).

### 3. Editor UX decisions
- Field grouping (tabs/sections) for `Service`, `BlogPost`, `Project`, `BusinessSettings`, `Homepage` — flat/ungrouped for the smaller `Review` and `Author` types, deliberately, since grouping adds friction below a certain field count rather than reducing it.
- List/reference preview configuration specified per type (Section 12), including a visible "Hidden" indicator on `Service`.
- Field descriptions specified for every non-obvious field, especially slug fields, `isActive`, and `noIndex`.
- Homepage curation via reference arrays (drag-to-reorder), replacing scattered `isFeatured` flags across three other content types.
- **`Service.isActive` is confirmed to be the production data source for the "ELÉRHETŐ" badge** seen in the approved design (Section 2) — not a cosmetic, always-on label.

### 4. Validation and safety rules
- Slug uniqueness (Studio validation query) and conditional read-only-after-publish (recommended for schema-code stage).
- `Review.rating`: required, integer, 1–5.
- `openingHours` time fields: `HH:mm` regex validation.
- Required `alt` text on every image.
- `Service.isActive` as a deliberate, low-anxiety alternative to unpublishing for a real recurring operational need — now also confirmed as the source of truth for the design's availability badge.
- Recommended removal of the "Delete" Studio action on both singleton types (`BusinessSettings`, `Homepage`).
- **`PriceCategory.items` requires a minimum of one entry** (Section 10) — prevents ever publishing an empty, confusing price category, enforced at the schema level rather than left to editor diligence.

### 5. What is intentionally NOT included
- No `Media` document type (Section 1/0).
- No `LegalPage` content type — legal pages are static Next.js pages (Section 0).
- No `isFeatured` flags on `Service`, `Project`, or `Review` — superseded by `Homepage`'s reference-array curation (Sections 4, 5, 8).
- No `ctaLabel` field on `Service` (Section 2) — a single site-wide contact CTA is simpler and sufficient.
- No generic page-builder/block system anywhere, including on `Homepage`.
- No profile-management complexity on `Author` beyond five fields (Section 6).
- No visible/hidden field on `BlogPost`, `Project`, or `Review` — native draft/publish is sufficient for all three; only `Service` has a demonstrated recurring need distinct from draft/publish.
- **No `country` field on `BusinessSettings.address`** (Section 7) — Hungary is fixed, implicit single-market context for v1, not stored data.
- **No `currency` field, no formatted price-string field, no `Service` reference, no separate `PriceListItem` document, and no `PriceList` wrapper document on `PriceCategory`** (Section 10) — all deliberately excluded for reasons detailed there; the pricing content-model gap is now closed, not left open.
- **No `AboutPage` field beyond a single `cta`** — unlike `Homepage.secondaryCtas` (a small array), the About page's design shows exactly one closing call-to-action, so the field matches that shape rather than defaulting to an array (Section 9).

### 6. Future capabilities deliberately deferred
- Sanity's live visual "Presentation" preview (Section 12) — real value, real implementation cost, deferred past v1.
- Scheduled publishing (Section 13) — tied to a paid Sanity tier not currently justified by this project's scale.
- A dedicated public `Author` archive/landing page — the `slug` field is reserved for this, but no such page exists in v1.
- Appointment booking and everything under it — unchanged, remains under `docs/database.md`/`docs/schema-design.md`'s deferred-scope banners.
- **A real Google Maps (or equivalent) embed on the Contact page** — the design prototype keeps its current static placeholder-plus-external-link treatment deliberately; a real embed is confirmed as Next.js implementation-phase work, not a content-model or design concern to resolve now.
- **Real `/projektek/[slug]` per-project routing** — the design prototype's current single-instance project-detail page is confirmed acceptable as a prototype; real slug-based routing driven by actual `Project` documents is confirmed as Next.js implementation-phase work.

### 7. Remaining decisions genuinely requiring your review
1. **Conditional read-only-after-publish for slugs** (Section 11) — I've recommended this as a safeguard; confirm you want this implemented at the schema-code stage, since it adds a small amount of custom schema logic beyond a plain slug field.
2. **Removing the "Delete" action for the two singleton types** (Sections 7–8) — a Studio-configuration safety measure I'd recommend; confirm you're comfortable with editors being unable to delete these documents through the normal Studio UI at all (a project admin could still do so via more direct means if truly necessary).
3. **`Project.projectDate`** (Section 4) — a new, optional field not previously discussed; confirm it's wanted or should be dropped.
4. **`Author.slug`** being included now for a page that doesn't exist yet (Section 6) — low-cost, but confirm you're comfortable carrying an unused field on the reasoning given, rather than adding it only if/when an author page is actually built.

**Resolved in this round, no longer open:** the Pricing/Árlista content shape — see `PriceCategory` (Section 10), approved as a fully independent content type from `Service`, with a required minimum-one-item constraint on `items` as the one refinement made during approval. **Also resolved:** the About/Rólunk page's content-management status — a new `AboutPage` singleton (Section 9), mirroring `Homepage`'s pattern, rather than static Next.js content.

No Sanity schema code, Studio configuration, or project initialization has been created — this remains conceptual content modeling only.
