/**
 * Writes the site's marketing copy (`src/lib/copy/defaults.ts`) into the
 * Sanity page-copy singletons, so the owner edits the real current text in
 * Studio instead of empty fields.
 *
 * Only fills fields that are missing or empty — anything already edited in
 * Studio is left alone, so re-running is safe. An unpublished draft gets
 * the same fill (otherwise publishing it later would drop the seeded
 * fields). One exception: the legacy plain-string `heroHeadline` on
 * `homepage`/`aboutPage` (never rendered; the field is now an
 * `accentHeading`) is replaced — on the published document by the default,
 * in a draft by the editor's own text, one sentence per line with the last
 * line in gold.
 *
 *   npm run seed:page-copy            # dry run: prints what would change
 *   npm run seed:page-copy -- --write # writes (needs SANITY_API_WRITE_TOKEN)
 */
import { createClient } from "@sanity/client";
import { accent } from "../lib/copy/accent.ts";
import { COPY_DEFAULTS, type CopyDocumentId } from "../lib/copy/defaults.ts";

/** Named object types, so written values carry the `_type` Studio expects. */
const OBJECT_TYPES: Record<string, string> = {
  header: "pageHeader",
  meta: "pageMeta",
  cta: "ctaSection",
  ctaSection: "ctaSection",
  priceListCta: "ctaSection",
  servicesSection: "sectionHeading",
  reviewsSection: "sectionHeading",
  projectsSection: "sectionHeading",
  blogSection: "sectionHeading",
};

/** Array item types for arrays of objects (Studio needs `_type` + `_key`). */
const ARRAY_ITEM_TYPES: Record<string, string> = {
  heroStats: "heroStat",
  features: "whyUsFeature",
};

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** Adds `_type`/`_key` where Sanity needs them; leaves Portable Text as built by `accent()`. */
function toSanityValue(key: string, value: unknown): Json {
  if (Array.isArray(value)) {
    const itemType = ARRAY_ITEM_TYPES[key];
    return value.map((item, index) =>
      itemType && isPlainObject(item) ? { _type: itemType, _key: `${key}${index}`, ...(item as object) } : item,
    ) as Json;
  }
  if (isPlainObject(value)) {
    const entries = Object.entries(value).map(([k, v]) => [k, toSanityValue(k, v)]);
    return { ...(OBJECT_TYPES[key] ? { _type: OBJECT_TYPES[key] } : {}), ...Object.fromEntries(entries) };
  }
  return value as Json;
}

/** "Nem csak szerelünk. Szenvedéllyel csináljuk!" → one sentence per line, last line gold. */
function legacyHeadlineToAccent(text: string): Json {
  const sentences = text.match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
  const last = sentences.pop();
  return accent([...sentences, `*${last}*`].join("\n")) as unknown as Json;
}

/** `set` operations (dotted paths) for every default whose Sanity field is empty. */
function missingFields(
  defaults: Record<string, unknown>,
  existing: unknown,
  keepLegacyText: boolean,
  prefix = "",
): Record<string, Json> {
  const current = isPlainObject(existing) ? existing : {};
  const sets: Record<string, Json> = {};
  for (const [key, value] of Object.entries(defaults)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const have = current[key];
    const legacyStringHeadline = key === "heroHeadline" && typeof have === "string";
    if (isPlainObject(value) && isPlainObject(have)) {
      Object.assign(sets, missingFields(value, have, keepLegacyText, path));
    } else if (legacyStringHeadline && keepLegacyText && have.trim()) {
      sets[path] = legacyHeadlineToAccent(have);
    } else if (isEmpty(have) || legacyStringHeadline) {
      sets[path] = toSanityValue(key, value);
    }
  }
  return sets;
}

async function main() {
  const write = process.argv.includes("--write");
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID — see .env.local.");
  if (write && !token) throw new Error("Missing SANITY_API_WRITE_TOKEN in .env.local (needed for --write).");

  const client = createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false });
  console.log(`Page copy seed — ${write ? "WRITE MODE" : "DRY RUN"} — ${projectId}/${dataset}\n`);

  for (const id of Object.keys(COPY_DEFAULTS) as CopyDocumentId[]) {
    const draftId = `drafts.${id}`;
    const [published, draft] = await Promise.all([
      client.fetch(`*[_id == $id][0]`, { id }),
      client.fetch(`*[_id == $id][0]`, { id: draftId }),
    ]);

    const publishedSets = missingFields(COPY_DEFAULTS[id], published, false);
    const draftSets = draft ? missingFields(COPY_DEFAULTS[id], draft, true) : {};
    const describe = (sets: Record<string, Json>) =>
      Object.keys(sets).length ? `fills ${Object.keys(sets).join(", ")}` : "nothing to fill";
    console.log(`${id}: ${published ? "exists" : "will be created"}; ${describe(publishedSets)}`);
    if (draft) console.log(`${draftId} (unpublished draft): ${describe(draftSets)}`);
    if (!write) continue;

    const transaction = client.transaction();
    if (!published || Object.keys(publishedSets).length) {
      transaction.createIfNotExists({ _id: id, _type: id }).patch(id, (patch) => patch.set(publishedSets));
    }
    if (draft && Object.keys(draftSets).length) {
      transaction.patch(draftId, (patch) => patch.set(draftSets));
    }
    if (transaction.toJSON().length) await transaction.commit();
  }

  console.log(write ? "\nDone." : "\nDry run only — re-run with --write to apply.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
