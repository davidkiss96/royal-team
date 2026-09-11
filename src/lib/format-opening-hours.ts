import type { BusinessSettingsOpeningHoursRow } from "@/lib/sanity/queries/business-settings";

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const DAY_ABBREVIATIONS: Record<string, string> = {
  mon: "H",
  tue: "K",
  wed: "Sze",
  thu: "Cs",
  fri: "P",
  sat: "Szo",
  sun: "V",
};

interface OpenDay {
  day: string;
  opens: string;
  closes: string;
}

/**
 * Formats `BusinessSettings.openingHours` into the same "H–P: 8:00–18:00"
 * style the contact page previously hardcoded — consecutive days sharing
 * identical hours collapse into one range, matching how a small business
 * naturally states a Mon–Fri schedule. Rows for an unrecognized `day` value
 * are skipped rather than guessed at. Returns `undefined` when there's
 * nothing to show (no rows, every day closed, or rows missing opens/closes)
 * — callers omit the line entirely rather than inventing a fallback
 * schedule.
 */
export function formatOpeningHours(
  rows: BusinessSettingsOpeningHoursRow[] | null | undefined,
): string | undefined {
  const byDay = new Map((rows ?? []).map((row) => [row.day, row]));

  const openDays: OpenDay[] = [];
  for (const day of DAY_ORDER) {
    const row = byDay.get(day);
    if (row && !row.closed && row.opens && row.closes) {
      openDays.push({ day, opens: row.opens, closes: row.closes });
    }
  }

  if (openDays.length === 0) return undefined;

  const ranges: OpenDay[][] = [];
  for (const entry of openDays) {
    const currentRange = ranges.at(-1);
    const previous = currentRange?.at(-1);
    const isConsecutiveDay =
      previous !== undefined &&
      DAY_ORDER.indexOf(entry.day) === DAY_ORDER.indexOf(previous.day) + 1;
    const sameHours =
      previous !== undefined && previous.opens === entry.opens && previous.closes === entry.closes;

    if (currentRange && isConsecutiveDay && sameHours) {
      currentRange.push(entry);
    } else {
      ranges.push([entry]);
    }
  }

  return ranges
    .map((range) => formatRange(range))
    .join(", ");
}

/** `range` is always non-empty — a range is only ever created by pushing an
 * entry into it (see the loop above) — so `first`/`last` are safe here. */
function formatRange(range: OpenDay[]): string {
  const first = range[0] as OpenDay;
  const last = range[range.length - 1] as OpenDay;
  const dayLabel =
    range.length > 1
      ? `${DAY_ABBREVIATIONS[first.day]}–${DAY_ABBREVIATIONS[last.day]}`
      : DAY_ABBREVIATIONS[first.day];
  return `${dayLabel}: ${first.opens}–${first.closes}`;
}
