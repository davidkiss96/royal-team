import { COPY_DEFAULTS, type CopyDocumentId } from "@/lib/copy/defaults";
import { sanityClient } from "../client";

/**
 * Marketing copy for every page, from one Sanity singleton per page
 * (`homepage`, `aboutPage`, `servicesPage`, … `siteCopy`; the document `_id`
 * equals its type). Only the copy keys listed in `COPY_DEFAULTS` are
 * projected — the rest of `homepage`/`aboutPage` keeps going through their
 * own query modules.
 *
 * Same 60s window as `BusinessSettings`: a copy fix from the owner should
 * show up about as fast as a phone-number change.
 */
const REVALIDATE_SECONDS = 60;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Portable Text whose spans are all blank counts as empty, like "". */
function isBlankPortableText(value: unknown[]): boolean {
  return value.every(
    (block) =>
      isPlainObject(block) &&
      block._type === "block" &&
      Array.isArray(block.children) &&
      block.children.every((child) => !isPlainObject(child) || !String(child.text ?? "").trim()),
  );
}

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0 || isBlankPortableText(value);
  return false;
}

/**
 * Field-by-field merge over the defaults' shape: a Sanity value wins when
 * it's non-empty; nested objects (e.g. `header`) merge recursively, so
 * clearing one field falls back for that field only. Keys Sanity has but
 * the defaults don't (`_type`, `_key`, …) are dropped.
 */
function mergeCopy<T>(defaults: T, raw: unknown): T {
  if (isPlainObject(defaults)) {
    const source = isPlainObject(raw) ? raw : {};
    return Object.fromEntries(
      Object.entries(defaults).map(([key, value]) => [key, mergeCopy(value, source[key])]),
    ) as T;
  }
  return isEmpty(raw) ? defaults : (raw as T);
}

/**
 * Fetches one page's copy, every field already resolved (Sanity value or
 * default) — callers never handle a missing heading.
 */
export async function getPageCopy<K extends CopyDocumentId>(
  id: K,
): Promise<(typeof COPY_DEFAULTS)[K]> {
  const defaults = COPY_DEFAULTS[id];
  const raw = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_id == $id][0]{${Object.keys(defaults).join(", ")}}`,
    { id },
    { next: { revalidate: REVALIDATE_SECONDS } },
  );
  return mergeCopy(defaults, raw);
}
