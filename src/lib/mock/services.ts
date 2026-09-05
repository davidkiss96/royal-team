import type { ImageWithAlt } from "@/lib/types";

/**
 * Mock data shaped to match the approved `Service` document
 * (docs/content-model.md Section 2), including `tagline` and `highlights` —
 * approved additions once Next.js implementation of the Services pages
 * surfaced them as real, repeated design elements with no existing field
 * to source them from (docs/content-model.md Section 0, item 7).
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
  tagline: string;
  summary: string;
  highlights: string[];
  heroImage: ImageWithAlt;
  isActive: boolean;
  displayOrder: number;
}

export const ALL_SERVICES: ServiceSummary[] = [
  {
    slug: "dpf-szuro-tisztitas",
    title: "DPF Szűrő Tisztítás",
    tagline: "Részecskeszűrő regenerálás",
    summary:
      "Professzionális DPF/FAP szűrő tisztítás és regenerálás ultrahangos technológiával — drága csere nélkül.",
    highlights: [
      "Üzemanyag-takarékosság",
      "Csökkentett emisszió",
      "Motortartósság növelése",
    ],
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
    tagline: "OBD & multirendszer analízis",
    summary:
      "Legmodernebb diagnosztikai eszközökkel feltérképezzük gépjárműve összes elektronikus rendszerét.",
    highlights: [
      "Pontos hibakód olvasás",
      "Összes rendszer ellenőrzése",
      "Részletes hibajegyzőkönyv",
    ],
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
    tagline: "3D kerékbeállítás és geometria",
    summary:
      "Legmodernebb 3D-s mérőrendszerrel precíziós futómű-geometria és tengelybeállítás.",
    highlights: [
      "Egyenes kormányzás",
      "Gumiabroncs-kímélés",
      "Stabilitás javítás",
    ],
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
    tagline: "Teljes körű szerviz",
    summary:
      "Átfogó gépjármű karbantartás a gyári előírások szerint, OEM minőségű alkatrészekkel.",
    highlights: [
      "Gyári előírások szerinti",
      "OEM alkatrészek",
      "Garanciális munka",
    ],
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
    tagline: "Teljesítményfékek és szériafékek",
    summary:
      "Prémium fékbetét, tárcsa és folyadék csere — sportfék opciókkal teljesítményautókhoz.",
    highlights: [
      "Maximális fékerő",
      "Sportfékek elérhetők",
      "Biztonsági ellenőrzés",
    ],
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
    tagline: "Prémium szintetikus olajok",
    summary:
      "Prémium szintetikus motorolaj csere, szűrő csere és összes folyadék ellenőrzése.",
    highlights: ["Szintetikus olaj", "Szűrő csere", "Összes folyadék ellenőrzés"],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Szintetikus motorolaj csere közben",
    },
    isActive: true,
    displayOrder: 6,
  },
];
