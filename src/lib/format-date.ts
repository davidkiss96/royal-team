// timeZone: "UTC" pins these to the date-only ISO string's own calendar date
// (e.g. "2026-01-15" parses as UTC midnight) regardless of the server's
// local timezone — without it, a negative-UTC-offset server could render
// the day before.
const hungarianDateFormatter = new Intl.DateTimeFormat("hu-HU", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const hungarianMonthYearFormatter = new Intl.DateTimeFormat("hu-HU", {
  year: "numeric",
  month: "long",
  timeZone: "UTC",
});

/** Formats an ISO date string the way Hungarian editorial dates read (e.g. "2026. február 20."). */
export function formatHungarianDate(isoDate: string): string {
  return hungarianDateFormatter.format(new Date(isoDate));
}

/** Month/year only (e.g. "2025. november") — used where the day isn't meaningfully precise, like review dates. */
export function formatHungarianMonthYear(isoDate: string): string {
  return hungarianMonthYearFormatter.format(new Date(isoDate));
}

/** Calendar year of a date-only ISO string, read as UTC — see the timeZone note above. */
export function getIsoYear(isoDate: string): number {
  return new Date(isoDate).getUTCFullYear();
}
