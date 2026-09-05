import type { ImageWithAlt } from "@/lib/types";

/**
 * Mock data shaped to match the approved `Service` document
 * (docs/content-model.md Section 2). No `subtitle`/tagline field exists on
 * the real schema (only `title`/`summary`/`body`), and no `benefits`/
 * highlights list field either — the reference design's short mono-font
 * tagline and per-service bulleted benefits list have no content-model
 * home and are dropped rather than invented as extra fields.
 *
 * This represents the full `Service` catalog (what `/szolgaltatasok` would
 * query — "all published Service documents, ordered by displayOrder", per
 * docs/design-system.md Section 8), not `Homepage.featuredServices`'
 * curated subset. The homepage currently renders all of them too, but
 * that's a coincidence of this mock catalog being small, not a query
 * relationship — a real `Homepage.featuredServices` reference array would
 * be its own (possibly smaller) curated list.
 */
export interface ServiceSummary {
  slug: string;
  title: string;
  summary: string;
  heroImage: ImageWithAlt;
  isActive: boolean;
  displayOrder: number;
}

export const ALL_SERVICES: ServiceSummary[] = [
  {
    slug: "dpf-szuro-tisztitas",
    title: "DPF Szűrő Tisztítás",
    summary:
      "Professzionális DPF/FAP szűrő tisztítás és regenerálás ultrahangos technológiával — drága csere nélkül.",
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "DPF részecskeszűrő tisztítása ultrahangos berendezéssel",
    },
    isActive: true,
    displayOrder: 1,
  },
  {
    slug: "elektronikai-diagnosztika",
    title: "Elektronikai Diagnosztika",
    summary:
      "Legmodernebb diagnosztikai eszközökkel feltérképezzük gépjárműve összes elektronikus rendszerét.",
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "OBD diagnosztikai eszköz csatlakoztatva egy gépjárműhöz",
    },
    isActive: true,
    displayOrder: 2,
  },
  {
    slug: "futomu-beallitas",
    title: "Futómű Beállítás",
    summary:
      "Legmodernebb 3D-s mérőrendszerrel precíziós futómű-geometria és tengelybeállítás.",
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "3D kerékbeállító rendszer működés közben",
    },
    isActive: true,
    displayOrder: 3,
  },
  {
    slug: "altalanos-karbantartas",
    title: "Általános Karbantartás",
    summary:
      "Átfogó gépjármű karbantartás a gyári előírások szerint, OEM minőségű alkatrészekkel.",
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Gépjármű általános karbantartás közben az emelőn",
    },
    isActive: true,
    displayOrder: 4,
  },
  {
    slug: "fekrendszer-szerviz",
    title: "Fékrendszer Szerviz",
    summary:
      "Prémium fékbetét, tárcsa és folyadék csere — sportfék opciókkal teljesítményautókhoz.",
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Teljesítmény fékrendszer szerelés közben",
    },
    isActive: true,
    displayOrder: 5,
  },
  {
    slug: "olajcsere-szerviz",
    title: "Olajcsere Szerviz",
    summary:
      "Prémium szintetikus motorolaj csere, szűrő csere és összes folyadék ellenőrzése.",
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Szintetikus motorolaj csere közben",
    },
    isActive: true,
    displayOrder: 6,
  },
];
