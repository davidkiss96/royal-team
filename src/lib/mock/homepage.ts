import type { ImageWithAlt, SeoFields } from "@/lib/types";

/**
 * Mock data shaped to match the approved `Homepage` singleton
 * (docs/content-model.md Section 8). `featuredServices`/`featuredProjects`/
 * `featuredReviews` are references in the real schema — represented here by
 * importing the mock arrays directly, since there's no Sanity to resolve
 * references through yet.
 *
 * `heroHeadline` is a plain string field (no rich text/inline formatting
 * support), so the reference design's per-word gold highlighting within the
 * headline can't come from this data — see HeroSection, which applies that
 * highlighting as a fixed presentational rule tied to this specific curated
 * copy, not a generic data-driven capability.
 */
export interface HomepageContent {
  heroHeadlineLines: string[];
  heroSubheadline: string;
  heroImage: ImageWithAlt;
  secondaryCtas: { label: string; url: string }[];
  seo: SeoFields;
}

export const HOMEPAGE_CONTENT: HomepageContent = {
  heroHeadlineLines: [
    "Prémium",
    "Autószerviz.",
    "Precíz Munka.",
    "Maximális",
    "Teljesítmény.",
  ],
  heroSubheadline:
    "Ercsi vezető teljesítmény-orientált autószervize. OEM technológia, certified technikusok, kompromisszumok nélkül.",
  heroImage: {
    url: "/placeholders/photo-placeholder.svg",
    alt: "Royal-Team szerviz műhelye",
  },
  secondaryCtas: [
    { label: "Szolgáltatásaink", url: "/szolgaltatasok" },
    { label: "Érdeklődjön", url: "/kapcsolat" },
  ],
  seo: {
    metaTitle: "Royal-Team Autószerviz — Prémium autószerviz Ercsiben",
    metaDescription:
      "Prémium, teljesítmény-orientált autószerviz Ercsiben. DPF tisztítás, diagnosztika, futómű- és fékszerviz, karbantartás — OEM technológiával.",
  },
};

/**
 * Homepage hero trust stats. No content-model field covers these (not on
 * `Homepage`, not on `BusinessSettings`) — kept as static site copy, not
 * modeled Sanity content, matching the approved design's numbers as
 * unverified placeholders pending a real decision on where they'd live.
 */
export const HERO_STATS = [
  { value: "15+", label: "Év tapasztalat" },
  { value: "3000+", label: "Elégedett ügyfél" },
  { value: "4.9★", label: "Google értékelés" },
  { value: "100%", label: "Garancia" },
];
