import type { ImageWithAlt } from "@/lib/types";

/**
 * Mock data shaped to match the approved `Project` document
 * (docs/content-model.md Section 4). Each entry gets its own real `slug` —
 * the reference prototype gave all three example projects the identical id
 * "project-amg", a confirmed bug (docs/design-system.md closing summary,
 * item 6), not something to reproduce.
 */
export interface ProjectSummary {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  heroImage: ImageWithAlt;
  projectDate: string;
  displayOrder: number;
}

export const FEATURED_PROJECTS: ProjectSummary[] = [
  {
    slug: "mercedes-amg-c63",
    title: "Mercedes-AMG C63",
    summary: "Komplex szervizprogram",
    tags: ["DPF Tisztítás", "Diagnosztika", "Futómű"],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Mercedes-AMG C63 a szervizben, komplex szervizprogram közben",
    },
    projectDate: "2025-06-01",
    displayOrder: 1,
  },
  {
    slug: "bmw-m3-competition",
    title: "BMW M3 Competition",
    summary: "Futómű & fékszerviz",
    tags: ["Futómű", "Fékrendszer"],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "BMW M3 Competition futómű és fékszerviz közben",
    },
    projectDate: "2025-03-01",
    displayOrder: 2,
  },
  {
    slug: "audi-rs6-avant",
    title: "Audi RS6 Avant",
    summary: "DPF regenerálás & karbantartás",
    tags: ["DPF Tisztítás", "Karbantartás"],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Audi RS6 Avant DPF regenerálás és karbantartás közben",
    },
    projectDate: "2024-09-01",
    displayOrder: 3,
  },
];
