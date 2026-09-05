/**
 * Mock data shaped to match the approved `Review` document
 * (docs/content-model.md Section 5). The reference design shows a vehicle
 * model under each reviewer's name — there's no dedicated field for that,
 * so it's carried in `sourceDetail` ("free-text supplement, independent of
 * which source is chosen"), a reasonable use of that field's stated
 * purpose rather than an invented one.
 */
export interface ReviewSummary {
  authorName: string;
  rating: number;
  text: string;
  reviewDate: string;
  source: "google" | "in_person" | "phone" | "email" | "other";
  sourceDetail?: string;
}

export const FEATURED_REVIEWS: ReviewSummary[] = [
  {
    authorName: "Kovács Péter",
    rating: 5,
    text: "Elképesztő szakmai tudás. A DPF problémámat más szervizek nem tudták megoldani, itt egyből megtalálták és kijavították. Az autóm újra gyárilag teljesít.",
    reviewDate: "2025-11-01",
    source: "google",
    sourceDetail: "Mercedes-AMG C63",
  },
  {
    authorName: "Tóth Gábor",
    rating: 5,
    text: "Profi csapat, modern felszerelés. A diagnosztika után részletes leírást kaptam minden hibáról. Átlátható árazás, kiváló munka. Csak ajánlani tudom.",
    reviewDate: "2025-10-01",
    source: "google",
    sourceDetail: "BMW M3 F80",
  },
  {
    authorName: "Varga Annamária",
    rating: 5,
    text: "Prémium bánásmód a szervizben is. Pontosan, határidőre és garanciával végezték a munkát. Az árajánlat végig megmaradt — semmi rejtett költség.",
    reviewDate: "2025-12-01",
    source: "google",
    sourceDetail: "Audi RS6 Avant",
  },
];

/**
 * The reference design's "4.9 · Google (128 értékelés)" aggregate figure
 * has no corresponding field anywhere in the content model (not on
 * `BusinessSettings`, not on `Homepage`) and isn't derivable from the three
 * featured reviews above (a real aggregate would cover every review, not
 * just the curated homepage selection). Kept as a clearly-marked
 * placeholder, matching the approved design's numbers, pending a real data
 * source — not computed, not verified.
 */
export const AGGREGATE_RATING_PLACEHOLDER = {
  value: 4.9,
  count: 128,
  source: "Google",
};
