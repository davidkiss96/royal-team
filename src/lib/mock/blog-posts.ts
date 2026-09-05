import type { ImageWithAlt } from "@/lib/types";

/**
 * Mock data shaped to match the approved `BlogPost` document
 * (docs/content-model.md Section 3). The reference design shows a category
 * tag per article ("DPF & Kipufogó", "Karbantartás"...) — `BlogPost` has no
 * category/tag field, so it's dropped here rather than invented; a real
 * field would need a content-model decision first.
 */
export interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string;
  heroImage: ImageWithAlt;
  publishedAt: string;
}

export const LATEST_POSTS: BlogPostSummary[] = [
  {
    slug: "dpf-szuro-eltomodesenek-jelei",
    title:
      "A DPF szűrő eltömődésének jelei — mikor van szüksége tisztításra?",
    excerpt:
      "A részecskeszűrő (DPF) az egyik legkritikusabb, mégis legtöbbször elhanyagolt alkatrész a modern diesel motorban. Összefoglaljuk a figyelmeztető jeleket.",
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Eltömődött DPF szűrő közelről",
    },
    publishedAt: "2026-01-15",
  },
  {
    slug: "mikor-erdemes-megtisztitani-a-dpf-szurot",
    title:
      "Mikor érdemes megtisztítani — és mikor kell cserélni a DPF szűrőt?",
    excerpt:
      "Sok autótulajdonos nem tudja, hogy a DPF szűrő esetek 90%-ában sikeresen megtisztítható drága csere nélkül. Összefoglaljuk a döntési szempontokat.",
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "DPF szűrő tisztítás és csere összehasonlítása",
    },
    publishedAt: "2026-02-03",
  },
  {
    slug: "rendszeres-elektronikus-diagnosztika-fontossaga",
    title:
      "Miért fontos a rendszeres elektronikus diagnosztika — a rejtett hibák veszélye",
    excerpt:
      "Autója tele van elektronikus rendszerekkel, amelyek hibái nem mindig láthatóak. A rendszeres diagnosztika megelőzhet súlyos és drága meghibásodásokat.",
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Elektronikai diagnosztikai eszköz kijelzője",
    },
    publishedAt: "2026-02-20",
  },
];
