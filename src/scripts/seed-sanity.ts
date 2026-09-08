/**
 * One-time seed migration: src/lib/mock/* -> Sanity `production` dataset.
 *
 * This is a one-shot script for this project, not a reusable migration
 * framework. It reuses the existing, already-validated mock data as the
 * initial content source for Sanity, so the owner doesn't have to
 * hand-retype everything into Studio.
 *
 * SAFETY
 * ------
 * Defaults to DRY RUN: builds every document and prints what it would send,
 * but performs no Sanity API writes at all — no client is even created with
 * a token in this mode. Pass --write to actually mutate the dataset.
 *
 * Idempotent by design: every document gets a deterministic `_id` derived
 * from its mock slug/title (see the `*Id()` helpers below), and writes use
 * `createOrReplace`, so re-running this script (in --write mode) updates
 * the same documents in place instead of creating duplicates.
 *
 * Run:
 *   node --no-warnings --env-file=.env.local src/scripts/seed-sanity.ts             (dry run)
 *   node --no-warnings --env-file=.env.local src/scripts/seed-sanity.ts --write     (real write)
 *   npm run seed:sanity            (dry run)
 *   npm run seed:sanity -- --write (real write)
 *
 * --write requires SANITY_API_WRITE_TOKEN to be set (in .env.local — never
 * .env.example, never NEXT_PUBLIC_*, never committed). Create one at
 * manage.sanity.io -> your project -> API -> Tokens (Editor permission is
 * enough; this script only creates/replaces documents, never deletes).
 *
 * WHAT THIS DOES NOT DO (see the migration report for full reasoning):
 * - Does not create any `author` documents — no mock source data exists
 *   for this content type.
 * - Does not upload any images — every mock image points at the same
 *   generic placeholder SVG (public/placeholders/photo-placeholder.svg),
 *   not real photography, so no imageWithAlt field is populated anywhere.
 * - Does not populate BlogPost.body/author/seo, Homepage.introText, or
 *   BusinessSettings.logo/brandColorPrimary/brandColorSecondary/openingHours/
 *   socialLinks — none of these have corresponding mock data to migrate from.
 */
import { createClient } from "@sanity/client";

import { ALL_SERVICES, type Service } from "../lib/mock/services.ts";
import { ALL_PROJECTS, type Project } from "../lib/mock/projects.ts";
import { LATEST_POSTS, type BlogPostSummary } from "../lib/mock/blog-posts.ts";
import { FEATURED_REVIEWS, type ReviewSummary } from "../lib/mock/reviews.ts";
import { ALL_PRICE_CATEGORIES, type PriceCategory } from "../lib/mock/price-categories.ts";
import { HOMEPAGE_CONTENT } from "../lib/mock/homepage.ts";
import { BUSINESS_SETTINGS } from "../lib/mock/business-settings.ts";
import { ABOUT_PAGE_CONTENT } from "../lib/mock/about-page.ts";
import type { BodyBlock, ProjectBodyBlock } from "../lib/types.ts";

// ---------------------------------------------------------------------------
// Deterministic ID + key helpers — no randomness anywhere, so re-running
// this script always resolves to the same document/array-item identities.
// ---------------------------------------------------------------------------

const HU_DIACRITICS: Record<string, string> = {
  á: "a", é: "e", í: "i", ó: "o", ö: "o", ő: "o", ú: "u", ü: "u", ű: "u",
  Á: "a", É: "e", Í: "i", Ó: "o", Ö: "o", Ő: "o", Ú: "u", Ü: "u", Ű: "u",
};

function slugify(input: string): string {
  return input
    .split("")
    .map((ch) => HU_DIACRITICS[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const serviceId = (slug: string) => `service-${slug}`;
const projectId = (slug: string) => `project-${slug}`;
const blogPostId = (slug: string) => `blogPost-${slug}`;
const reviewId = (r: ReviewSummary) => `review-${slugify(r.authorName)}-${r.reviewDate}`;
const priceCategoryId = (title: string) => `priceCategory-${slugify(title)}`;

const arrayKey = (prefix: string, index: number) => `${prefix}${index}`;

// ---------------------------------------------------------------------------
// Portable Text construction. The mock `body` fields are a simplified
// stand-in shape (src/lib/types.ts's own comment calls this out explicitly),
// not real Portable Text — this converts them into the actual block/span
// shape Sanity's `body`/`ownerStory` fields require.
// ---------------------------------------------------------------------------

interface PortableSpan {
  _key: string;
  _type: "span";
  text: string;
  marks: string[];
}

interface PortableBlock {
  _key: string;
  _type: "block";
  style: string;
  listItem?: "bullet" | "number";
  level?: number;
  markDefs: unknown[];
  children: PortableSpan[];
}

function span(keyBase: string, text: string, marks: string[] = []): PortableSpan {
  return { _key: `${keyBase}-s`, _type: "span", text, marks };
}

function paragraphBlock(keyBase: string, text: string): PortableBlock {
  return { _key: keyBase, _type: "block", style: "normal", markDefs: [], children: [span(keyBase, text)] };
}

function bulletBlock(keyBase: string, text: string): PortableBlock {
  return {
    _key: keyBase,
    _type: "block",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [span(keyBase, text)],
  };
}

function numberBlock(keyBase: string, title: string, description: string): PortableBlock {
  return {
    _key: keyBase,
    _type: "block",
    style: "normal",
    listItem: "number",
    level: 1,
    markDefs: [],
    children: [span(`${keyBase}-t`, `${title} — `, ["strong"]), span(`${keyBase}-d`, description)],
  };
}

function blockquoteBlock(keyBase: string, text: string): PortableBlock {
  return { _key: keyBase, _type: "block", style: "blockquote", markDefs: [], children: [span(keyBase, text)] };
}

function attributionBlock(keyBase: string, text: string): PortableBlock {
  return {
    _key: keyBase,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [span(keyBase, text, ["em"])],
  };
}

function bodyBlocksToPortableText(blocks: BodyBlock[], idPrefix: string): PortableBlock[] {
  const out: PortableBlock[] = [];
  blocks.forEach((block, i) => {
    const base = `${idPrefix}-${i}`;
    if (block.type === "paragraph") {
      out.push(paragraphBlock(base, block.text));
    } else {
      block.items.forEach((item, j) => out.push(bulletBlock(`${base}-${j}`, item)));
    }
  });
  return out;
}

function projectBodyBlocksToPortableText(blocks: ProjectBodyBlock[], idPrefix: string): PortableBlock[] {
  const out: PortableBlock[] = [];
  blocks.forEach((block, i) => {
    const base = `${idPrefix}-${i}`;
    if (block.type === "paragraph") {
      out.push(paragraphBlock(base, block.text));
    } else if (block.type === "list") {
      block.items.forEach((item, j) => out.push(bulletBlock(`${base}-${j}`, item)));
    } else if (block.type === "numberedSteps") {
      block.items.forEach((step, j) => out.push(numberBlock(`${base}-${j}`, step.title, step.description)));
    } else {
      out.push(blockquoteBlock(`${base}-q`, block.text));
      if (block.attribution) out.push(attributionBlock(`${base}-a`, block.attribution));
    }
  });
  return out;
}

// ---------------------------------------------------------------------------
// Per-content-type document builders.
// ---------------------------------------------------------------------------

// @sanity/client's mutation methods type documents as Record<string, any> —
// the nine content types here have genuinely different shapes, so a single
// precise interface isn't the right fit; this is a deliberate, narrow `any`
// boundary matching the library's own signature, not a general type escape.
type SeedDoc = { _id: string; _type: string } & Record<string, any>;

function buildServiceDoc(service: Service): SeedDoc {
  return {
    _id: serviceId(service.slug),
    _type: "service",
    title: service.title,
    slug: { _type: "slug", current: service.slug },
    tagline: service.tagline,
    summary: service.summary,
    body: bodyBlocksToPortableText(service.body, `${service.slug}-body`),
    highlights: service.highlights,
    process: service.process?.map((step, i) => ({
      _key: arrayKey("process", i),
      _type: "processStep",
      title: step.title,
      description: step.description,
    })),
    faq: service.faq?.map((item, i) => ({
      _key: arrayKey("faq", i),
      _type: "faqItem",
      question: item.question,
      answer: item.answer,
    })),
    isActive: service.isActive,
    displayOrder: service.displayOrder,
    // heroImage/gallery intentionally omitted — placeholder art only, see report.
  };
}

function buildProjectDoc(project: Project): SeedDoc {
  const unresolved = project.relatedServices.filter(
    (slug) => !ALL_SERVICES.some((s) => s.slug === slug),
  );
  if (unresolved.length > 0) {
    throw new Error(
      `Project "${project.slug}" references unknown service slug(s): ${unresolved.join(", ")}`,
    );
  }

  return {
    _id: projectId(project.slug),
    _type: "project",
    title: project.title,
    slug: { _type: "slug", current: project.slug },
    summary: project.summary,
    body: projectBodyBlocksToPortableText(project.body, `${project.slug}-body`),
    specs: project.specs.map((spec, i) => ({
      _key: arrayKey("spec", i),
      _type: "projectSpec",
      label: spec.label,
      value: spec.value,
    })),
    results: project.results?.map((result, i) => ({
      _key: arrayKey("result", i),
      _type: "projectResult",
      value: result.value,
      label: result.label,
      description: result.description,
    })),
    projectDate: project.projectDate,
    relatedServices: project.relatedServices.map((slug, i) => ({
      _key: arrayKey("ref", i),
      _type: "reference",
      _ref: serviceId(slug),
    })),
    displayOrder: project.displayOrder,
    // heroImage/gallery intentionally omitted — placeholder art only, see report.
  };
}

function buildBlogPostDoc(post: BlogPostSummary): SeedDoc {
  return {
    _id: blogPostId(post.slug),
    _type: "blogPost",
    title: post.title,
    slug: { _type: "slug", current: post.slug },
    excerpt: post.excerpt,
    publishedAt: new Date(post.publishedAt).toISOString(),
    // body/author/seo intentionally omitted — no mock source data, see report.
    // heroImage intentionally omitted — placeholder art only, see report.
  };
}

function buildReviewDoc(review: ReviewSummary): SeedDoc {
  return {
    _id: reviewId(review),
    _type: "review",
    authorName: review.authorName,
    rating: review.rating,
    text: review.text,
    reviewDate: review.reviewDate,
    source: review.source,
    sourceDetail: review.sourceDetail,
    isActive: true,
    displayOrder: FEATURED_REVIEWS.indexOf(review) + 1,
  };
}

function buildPriceCategoryDoc(category: PriceCategory): SeedDoc {
  for (const item of category.items) {
    if (item.priceType === "fixed" || item.priceType === "from") {
      if (typeof item.amount !== "number" || !Number.isInteger(item.amount) || item.amount <= 0) {
        throw new Error(
          `Price item "${item.name}" in category "${category.title}" has priceType ` +
            `"${item.priceType}" but an invalid amount (${item.amount}) — expected a positive integer.`,
        );
      }
    } else if (item.amount !== undefined) {
      throw new Error(
        `Price item "${item.name}" in category "${category.title}" is priceType "quote" ` +
          `but has an amount (${item.amount}) set — quote items must not carry a numeric amount.`,
      );
    }
  }

  return {
    _id: priceCategoryId(category.title),
    _type: "priceCategory",
    title: category.title,
    displayOrder: category.displayOrder,
    isActive: category.isActive,
    items: category.items.map((item, i) => ({
      _key: arrayKey("item", i),
      _type: "priceItem",
      name: item.name,
      note: item.note,
      priceType: item.priceType,
      amount: item.amount,
      isActive: item.isActive,
    })),
  };
}

function buildBusinessSettingsDoc(): SeedDoc {
  const b = BUSINESS_SETTINGS;
  return {
    _id: "businessSettings",
    _type: "businessSettings",
    businessName: b.businessName,
    phone: b.phone,
    email: b.email,
    website: b.website,
    address: {
      addressLine1: b.address.addressLine1,
      city: b.address.city,
      postalCode: b.address.postalCode,
    },
    registeredOffice: {
      addressLine1: b.registeredOffice.addressLine1,
      city: b.registeredOffice.city,
      postalCode: b.registeredOffice.postalCode,
    },
    legalCompanyName: b.legalCompanyName,
    legalRegistrationNumber: b.legalRegistrationNumber,
    legalTaxNumber: b.legalTaxNumber,
    managingDirector: b.managingDirector,
    // logo/brandColor*/openingHours/socialLinks intentionally omitted —
    // no mock source data for any of these, see report.
  };
}

function buildHomepageDoc(): SeedDoc {
  const h = HOMEPAGE_CONTENT;
  return {
    _id: "homepage",
    _type: "homepage",
    // heroHeadlineLines exists only for the frontend's per-line/gold-word
    // presentational treatment (already documented as not CMS-driven) —
    // joined into the single plain-string field the schema actually has.
    heroHeadline: h.heroHeadlineLines.join(" "),
    heroSubheadline: h.heroSubheadline,
    // Mirrors current frontend behavior exactly: the homepage sections
    // display *all* active services / all projects / all (featured)
    // reviews from the mock catalogs today, not a smaller curated subset —
    // see the migration report's "References" section for why this is a
    // faithful mapping rather than an invented curation decision.
    featuredServices: ALL_SERVICES.map((s, i) => ({
      _key: arrayKey("svc", i),
      _type: "reference",
      _ref: serviceId(s.slug),
    })),
    featuredProjects: ALL_PROJECTS.map((p, i) => ({
      _key: arrayKey("proj", i),
      _type: "reference",
      _ref: projectId(p.slug),
    })),
    featuredReviews: FEATURED_REVIEWS.map((r, i) => ({
      _key: arrayKey("rev", i),
      _type: "reference",
      _ref: reviewId(r),
    })),
    secondaryCtas: h.secondaryCtas.map((cta, i) => ({
      _key: arrayKey("cta", i),
      _type: "ctaLink",
      label: cta.label,
      url: cta.url,
    })),
    seo: {
      metaTitle: h.seo.metaTitle,
      metaDescription: h.seo.metaDescription,
      noIndex: h.seo.noIndex ?? false,
    },
    // heroImage and introText intentionally omitted — heroImage is
    // placeholder art only; introText has no mock source, see report.
  };
}

function buildAboutPageDoc(): SeedDoc {
  const a = ABOUT_PAGE_CONTENT;
  return {
    _id: "aboutPage",
    _type: "aboutPage",
    heroHeadline: a.heroHeadlineLines.join(" "),
    heroSubheadline: a.heroSubheadline,
    ownerStory: bodyBlocksToPortableText(a.ownerStory, "about-story"),
    philosophyValues: a.philosophyValues.map((v, i) => ({
      _key: arrayKey("phil", i),
      _type: "philosophyValue",
      icon: v.icon,
      title: v.title,
      description: v.description,
    })),
    stats: a.stats.map((s, i) => ({
      _key: arrayKey("stat", i),
      _type: "stat",
      label: s.label,
      value: s.value,
    })),
    cta: { _type: "ctaLink", label: a.cta.label, url: a.cta.url },
    seo: {
      metaTitle: a.seo.metaTitle,
      metaDescription: a.seo.metaDescription,
      noIndex: a.seo.noIndex ?? false,
    },
    // heroImage/photoGallery intentionally omitted — placeholder art only, see report.
  };
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

async function main() {
  const write = process.argv.slice(2).includes("--write");
  const dryRun = !write;

  const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!sanityProjectId) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID — see .env.example / .env.local.");
  }
  if (write && !token) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN. Create a write-capable API token at manage.sanity.io -> " +
        "your project -> API -> Tokens (Editor permission is sufficient), then add it to .env.local " +
        "(gitignored — never .env.example, never a NEXT_PUBLIC_* variable) as SANITY_API_WRITE_TOKEN=... " +
        "before re-running with --write.",
    );
  }

  const client = write
    ? createClient({ projectId: sanityProjectId, dataset, apiVersion: "2025-01-01", token, useCdn: false })
    : null;

  console.log(`Sanity seed migration — ${dryRun ? "DRY RUN (no writes will be made)" : "WRITE MODE"}`);
  console.log(`Project: ${sanityProjectId}  Dataset: ${dataset}`);
  console.log(`Author: skipped entirely — no mock data source exists for this content type.\n`);

  const docs = [
    ...ALL_SERVICES.map(buildServiceDoc),
    ...ALL_PROJECTS.map(buildProjectDoc),
    ...LATEST_POSTS.map(buildBlogPostDoc),
    ...FEATURED_REVIEWS.map(buildReviewDoc),
    ...ALL_PRICE_CATEGORIES.map(buildPriceCategoryDoc),
    buildBusinessSettingsDoc(),
    buildHomepageDoc(),
    buildAboutPageDoc(),
  ];

  let succeeded = 0;
  const failures: { label: string; error: string }[] = [];

  for (const doc of docs) {
    const label = `${doc._type} / ${doc._id}`;
    if (dryRun) {
      console.log(`[dry-run] would createOrReplace ${label}`);
      console.log(JSON.stringify(doc, null, 2));
      console.log("");
      succeeded++;
      continue;
    }
    try {
      // client is non-null whenever write is true (checked above)
      await client!.createOrReplace(doc);
      console.log(`[ok] ${label}`);
      succeeded++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[FAILED] ${label}: ${message}`);
      failures.push({ label, error: message });
    }
  }

  console.log(`\n${succeeded}/${docs.length} document(s) ${dryRun ? "validated" : "written"}.`);
  if (failures.length > 0) {
    console.error(`${failures.length} failure(s):`);
    failures.forEach((f) => console.error(`  - ${f.label}: ${f.error}`));
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Migration aborted:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
