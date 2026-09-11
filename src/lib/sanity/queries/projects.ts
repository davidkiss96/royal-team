import type { PortableTextBlock, PortableTextSpan } from "@portabletext/types";
import type { ImageWithAlt, SeoFields } from "@/lib/types";
import { sanityClient } from "../client";
import { IMAGE_WITH_ALT_PROJECTION, SEO_PROJECTION } from "./fragments";
import { resolveImage, type SanityImageWithAlt } from "../image";

/**
 * Third content-type query module (docs/development-guidelines.md Section
 * 19), following the `Service` pattern (`services.ts`) where it fits and
 * diverging where `Project` genuinely differs: `Project` has no
 * `isActive` field (docs/content-model.md Section 4 — native draft/publish
 * is the only visibility mechanism for this type, unlike `Service`), so
 * there's no active-filtering in GROQ — the read-only `sanityClient`
 * already only ever resolves published content.
 */

/**
 * Same 300s window as `Service` (`services.ts`) — `Project` is the same
 * kind of editorially-curated, low-volatility content type
 * (docs/architecture.md Section 6.2's stated default for future content
 * types migrated after `Service`).
 */
const REVALIDATE_SECONDS = 300;

/**
 * `Project.relatedServices` is an array of references to `Service`
 * documents (docs/content-model.md Section 4). Dereferenced via GROQ's
 * `->` and re-projected to only the fields the Project pages actually
 * render (`ProjectCard`, `ProjectHero`, `ProjectRelatedCta`): the service's
 * title/tagline as a display label plus its slug for linking and icon
 * lookup (`src/lib/service-icons.ts`) — not the full `Service` document
 * (docs/development-guidelines.md Section 8), and no denormalized copy is
 * ever written back to the `Project` document itself.
 */
const RELATED_SERVICE_PROJECTION = `{
  "slug": slug.current,
  title,
  tagline
}`;

export interface ProjectRelatedService {
  slug: string;
  title: string;
  tagline: string;
}

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ProjectResult {
  value: string;
  label: string;
  description: string;
}

export interface ProjectWorkStep {
  title: string;
  description: string;
}

export interface ProjectQuote {
  text: string;
  attribution?: string;
}

interface RawRelatedService {
  slug: string;
  title: string;
  tagline: string | null;
}

interface RawProjectListItem {
  title: string;
  slug: string;
  summary: string | null;
  projectDate: string | null;
  heroImage: SanityImageWithAlt | null;
  relatedServices: RawRelatedService[] | null;
}

interface RawProjectDetail {
  title: string;
  slug: string;
  summary: string | null;
  body: PortableTextBlock[] | null;
  specs: ProjectSpec[] | null;
  results: ProjectResult[] | null;
  projectDate: string | null;
  heroImage: SanityImageWithAlt | null;
  gallery: SanityImageWithAlt[] | null;
  relatedServices: RawRelatedService[] | null;
  seo: SeoFields | null;
}

/** The `/projektek` listing shape — mirrors the fields `ProjectCard`
 * (`src/app/projektek/_components/project-card.tsx`) actually reads. */
export interface ProjectListItem {
  slug: string;
  title: string;
  summary: string;
  projectDate: string | null;
  heroImage: ImageWithAlt;
  relatedServices: ProjectRelatedService[];
}

/**
 * The `/projektek/[slug]` detail shape — mirrors the fields `ProjectHero`,
 * `ProjectOverview`, `ProjectWorkPerformed`, `ProjectGallery`,
 * `ProjectResults`, and `ProjectRelatedCta` actually read.
 *
 * `Project.body` is real Portable Text (unlike the mock's discriminated
 * `ProjectBodyBlock` union), so it carries no `type: "numberedSteps"` /
 * `type: "quote"` tag to filter on directly — `workPerformedSteps` and
 * `resultsQuote` below are derived from `body`'s actual block shape
 * (`listItem: "number"` / `style: "blockquote"`, per the seed migration's
 * `projectBodyBlocksToPortableText`) once, here, so the page components
 * that render those dedicated sections don't need to know Portable Text's
 * block shape at all — they keep consuming the same
 * `{ title, description }[]` / `{ text, attribution? }` shapes the mock
 * previously gave them directly. `overviewBody` keeps the remaining
 * paragraph/bullet-list blocks as real Portable Text, rendered through the
 * shared `PortableTextContent` renderer (`src/components/portable-text.tsx`),
 * which already supports exactly those two block kinds.
 */
export interface ProjectDetail {
  slug: string;
  title: string;
  summary: string;
  overviewBody: PortableTextBlock[];
  workPerformedSteps: ProjectWorkStep[];
  resultsQuote?: ProjectQuote;
  specs: ProjectSpec[];
  results?: ProjectResult[];
  projectDate: string | null;
  heroImage: ImageWithAlt;
  gallery?: ImageWithAlt[];
  relatedServices: ProjectRelatedService[];
  seo?: SeoFields;
}

const PROJECTS_LIST_QUERY = `*[_type == "project"] | order(displayOrder asc) {
  title,
  "slug": slug.current,
  summary,
  projectDate,
  heroImage${IMAGE_WITH_ALT_PROJECTION},
  relatedServices[]->${RELATED_SERVICE_PROJECTION}
}`;

const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  summary,
  body,
  specs,
  results,
  projectDate,
  heroImage${IMAGE_WITH_ALT_PROJECTION},
  gallery[]${IMAGE_WITH_ALT_PROJECTION},
  relatedServices[]->${RELATED_SERVICE_PROJECTION},
  seo${SEO_PROJECTION}
}`;

/**
 * Ordered by `displayOrder`, same as `PROJECTS_LIST_QUERY` — used both for
 * `generateStaticParams` and to compute the detail page's "PROJEKT #NNN"
 * index, which must match the number a project shows on the `/projektek`
 * grid (`ProjectCard`'s `index` prop).
 */
const PROJECT_SLUGS_QUERY = `*[_type == "project"] | order(displayOrder asc){
  "slug": slug.current,
  "noIndex": seo.noIndex
}`;

function toRelatedServices(raw: RawRelatedService[] | null): ProjectRelatedService[] {
  return (raw ?? []).map((service) => ({
    slug: service.slug,
    title: service.title,
    tagline: service.tagline ?? "",
  }));
}

function isSpan(child: PortableTextBlock["children"][number]): child is PortableTextSpan {
  return child._type === "span";
}

/**
 * Splits `Project.body` into the three shapes its dedicated page sections
 * need, mirroring exactly what `projectBodyBlocksToPortableText`
 * (`src/scripts/seed-sanity.ts`) constructed from the original mock data:
 * a numbered-list block's two spans are `{title} — ` (marked `strong`)
 * followed by the plain-text description, and a quote is a `blockquote`-
 * styled block optionally followed by one `em`-marked attribution block.
 */
function splitProjectBody(body: PortableTextBlock[]): {
  overviewBody: PortableTextBlock[];
  workPerformedSteps: ProjectWorkStep[];
  resultsQuote?: ProjectQuote;
} {
  const overviewBody: PortableTextBlock[] = [];
  const workPerformedSteps: ProjectWorkStep[] = [];
  let resultsQuote: ProjectQuote | undefined;
  const consumedAsAttribution = new Set<number>();

  body.forEach((block, index) => {
    if (consumedAsAttribution.has(index)) return;

    if (block.listItem === "number") {
      const spans = block.children.filter(isSpan);
      const titleSpan = spans.find((span) => span.marks?.includes("strong"));
      const title = (titleSpan?.text ?? "").replace(/\s*—\s*$/, "").trim();
      const description = spans
        .filter((span) => span !== titleSpan)
        .map((span) => span.text)
        .join("");
      workPerformedSteps.push({ title, description });
      return;
    }

    if (block.style === "blockquote") {
      const text = block.children.filter(isSpan).map((span) => span.text).join("");
      const next = body[index + 1];
      const nextIsAttribution =
        next !== undefined &&
        next.style !== "blockquote" &&
        next.listItem !== "number" &&
        next.children.filter(isSpan).some((span) => span.marks?.includes("em"));

      let attribution: string | undefined;
      if (nextIsAttribution) {
        attribution = next.children.filter(isSpan).map((span) => span.text).join("");
        consumedAsAttribution.add(index + 1);
      }
      resultsQuote = { text, attribution };
      return;
    }

    overviewBody.push(block);
  });

  return { overviewBody, workPerformedSteps, resultsQuote };
}

function toProjectListItem(raw: RawProjectListItem): ProjectListItem {
  return {
    slug: raw.slug,
    title: raw.title,
    summary: raw.summary ?? "",
    projectDate: raw.projectDate,
    heroImage: resolveImage(raw.heroImage, raw.title),
    relatedServices: toRelatedServices(raw.relatedServices),
  };
}

function toProjectDetail(raw: RawProjectDetail): ProjectDetail {
  const { overviewBody, workPerformedSteps, resultsQuote } = splitProjectBody(raw.body ?? []);

  return {
    slug: raw.slug,
    title: raw.title,
    summary: raw.summary ?? "",
    overviewBody,
    workPerformedSteps,
    resultsQuote,
    specs: raw.specs ?? [],
    results: raw.results ?? undefined,
    projectDate: raw.projectDate,
    heroImage: resolveImage(raw.heroImage, raw.title),
    gallery: raw.gallery?.map((image) => resolveImage(image, raw.title)),
    relatedServices: toRelatedServices(raw.relatedServices),
    seo: raw.seo ?? undefined,
  };
}

/**
 * Fetches all projects for `/projektek`, ordered in GROQ
 * (docs/development-guidelines.md Section 8) — `displayOrder` is the same
 * manual-curation field `/projektek`'s current mock-backed sort already
 * uses, so ordering is unchanged by this migration.
 */
export async function getProjects(): Promise<ProjectListItem[]> {
  const projects = await sanityClient.fetch<RawProjectListItem[]>(
    PROJECTS_LIST_QUERY,
    {},
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  return projects.map(toProjectListItem);
}

/**
 * Fetches one project by slug for `/projektek/[slug]`. Returns `null` for
 * an unknown slug, which the page turns into `notFound()` — there's no
 * `isActive`-style extra filter here (unlike `getServiceBySlug`), since
 * `Project` has no such field (docs/content-model.md Section 4).
 */
export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const project = await sanityClient.fetch<RawProjectDetail | null>(
    PROJECT_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  return project ? toProjectDetail(project) : null;
}

export interface ProjectSlugEntry {
  slug: string;
  noIndex: boolean;
}

/**
 * Fetches all project slugs (plus each one's `seo.noIndex`), ordered by
 * `displayOrder`, for `generateStaticParams`, for computing the detail
 * page's "PROJEKT #NNN" index consistently with `/projektek`'s card grid,
 * and for `sitemap.ts`.
 */
export async function getProjectSlugs(): Promise<ProjectSlugEntry[]> {
  const raw = await sanityClient.fetch<{ slug: string; noIndex: boolean | null }[]>(
    PROJECT_SLUGS_QUERY,
    {},
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  return raw.map(({ slug, noIndex }) => ({ slug, noIndex: noIndex ?? false }));
}
