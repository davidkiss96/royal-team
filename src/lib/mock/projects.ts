import type { ImageWithAlt, ProjectBodyBlock } from "@/lib/types";

/**
 * Mock data shaped to match the approved `Project` document
 * (docs/content-model.md Section 4), including `results` — an approved
 * addition once Next.js implementation of the Projects pages surfaced a
 * real gap (Section 0 item 9).
 *
 * `relatedServices` stores `Service` slugs, not embedded Service data —
 * resolved to real `Service` documents at render time via
 * `getServicesBySlugs` (src/lib/mock/services.ts), the same way a Sanity
 * reference array would be dereferenced. No separate `tags` field exists:
 * the reference design's category pills are the resolved related services'
 * titles, per this task's explicit "use the real project data structure
 * rather than a second UI-specific model" instruction.
 *
 * Each entry gets its own real `slug` — the reference prototype gave all
 * three example projects the identical id "project-amg", a confirmed bug
 * (docs/design-system.md closing summary, item 6), not reproduced here.
 *
 * No `isActive` field — confirmed in content-model.md Section 4 ("a project
 * doesn't have Service's 'temporarily pause' operational need"; native
 * Sanity draft/publish is the only visibility mechanism). For this mock
 * catalog, a project's presence in `ALL_PROJECTS` below **is** its
 * published state — there's no separate flag to check.
 */
export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ProjectResult {
  value: string;
  label: string;
  description: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  body: ProjectBodyBlock[];
  specs: ProjectSpec[];
  results?: ProjectResult[];
  projectDate: string;
  heroImage: ImageWithAlt;
  gallery?: ImageWithAlt[];
  relatedServices: string[];
  displayOrder: number;
}

export const ALL_PROJECTS: Project[] = [
  {
    slug: "mercedes-amg-c63",
    title: "Mercedes-AMG C63",
    summary: "Komplex szervizprogram — az AMG teljesítmény visszaállítása gyári szintre",
    body: [
      {
        type: "paragraph",
        text: "Egy gondosan karbantartott, 2018-as Mercedes-AMG C63 érkezett szervizünkbe. A tulajdonos csökkent teljesítményt, megnövekedett fogyasztást és DPF figyelmeztetőt tapasztalt. Az autó kiváló állapotban volt, ám az AMG jellegű, főként városi közlekedés miatt a részecskeszűrő kritikusan eltömödött.",
      },
      {
        type: "paragraph",
        text: "A cél: teljes diagnosztika, DPF szerviz, futómű ellenőrzés — és az eredeti 476 LE-s AMG teljesítmény visszaállítása. Kompromisszumok nélkül.",
      },
      {
        type: "numberedSteps",
        items: [
          {
            title: "Teljes körű diagnosztika",
            description:
              "Minden elektronikus rendszer átvizsgálása LAUNCH X431 PRO eszközzel. 23 pontból álló komplex ellenőrzés.",
          },
          {
            title: "DPF szűrő ultrahangos tisztítás",
            description:
              "A szűrő eltömödöttsége 94%-os volt. Ultrahangos eljárással teljes mértékben visszaállítottuk az átfolyást.",
          },
          {
            title: "Futómű geometria ellenőrzés",
            description:
              "3D kerékbeállítás Hunter rendszerrel. Kis eltérés a hátsó tengelyen — korrigálva.",
          },
          {
            title: "Fékrendszer átvizsgálás",
            description:
              "Fékbetét vastagság, féktárcsa állapot és fékfolyadék minőség ellenőrzése — minden rendben.",
          },
          {
            title: "Motorolaj és folyadékok",
            description:
              "Teljesen szintetikus motorolaj csere, hűtőfolyadék szintje és minősége ellenőrizve.",
          },
          {
            title: "Szoftver reset & tesztelés",
            description: "DPF hibaüzenet törlése, kalibrálás, majd 40 km-es tesztvezetés — hibamentes.",
          },
        ],
      },
      {
        type: "quote",
        text: "Az autó teljesen megváltozott. Már az első kilométernél érezhető volt a különbség — az AMG ereje visszajött. Kiváló munka, pontosan a tervezett időn belül.",
        attribution: "— A tulajdonos visszajelzése",
      },
    ],
    specs: [
      { label: "Jármű", value: "Mercedes-AMG C63" },
      { label: "Motor", value: "4.0L V8 Biturbo" },
      { label: "Teljesítmény", value: "476 LE / 650 Nm" },
      { label: "Évjárat", value: "2018" },
      { label: "Futott km", value: "~185 000 km" },
      { label: "Átvétel", value: "2025. március" },
    ],
    results: [
      { value: "0", label: "Hibaüzenet maradt", description: "Teljes hibamentesítés" },
      { value: "100%", label: "DPF átfolyás", description: "Gyári szint visszaállítva" },
      { value: "23+", label: "Ellenőrzési pont", description: "Komplex rendszerátvizsgálás" },
    ],
    projectDate: "2025-03-01",
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Mercedes-AMG C63 a szervizben, komplex szervizprogram közben",
    },
    gallery: [
      { url: "/placeholders/photo-placeholder.svg", alt: "Elektronikai diagnosztika az AMG C63-on" },
      { url: "/placeholders/photo-placeholder.svg", alt: "DPF szűrő ultrahangos tisztítás közben" },
      { url: "/placeholders/photo-placeholder.svg", alt: "Fékrendszer átvizsgálása az emelőn" },
      { url: "/placeholders/photo-placeholder.svg", alt: "Szintetikus motorolaj csere" },
      { url: "/placeholders/photo-placeholder.svg", alt: "Az elkészült Mercedes-AMG C63 tesztvezetés előtt" },
    ],
    relatedServices: ["dpf-szuro-tisztitas", "elektronikai-diagnosztika", "futomu-beallitas"],
    displayOrder: 1,
  },
  {
    slug: "bmw-m3-competition",
    title: "BMW M3 Competition",
    summary: "Futómű & fékszerviz — pontos geometria és megbízható fékrendszer versenyre kész teljesítményhez",
    body: [
      {
        type: "paragraph",
        text: "A tulajdonos rendszeres pályanapokra jár ezzel az M3 Competition modellel, és egyenetlen gumikopást, valamint bizonytalan kanyarstabilitást tapasztalt. A futómű geometriája jelentősen eltért a gyári specifikációtól, feltehetően egy korábbi kátyúba hajtás következtében.",
      },
      {
        type: "paragraph",
        text: "A cél a pontos futómű-beállítás helyreállítása és a fékrendszer teljes átvizsgálása volt, hogy az autó pályán és közúton egyaránt kiszámíthatóan viselkedjen.",
      },
      {
        type: "numberedSteps",
        items: [
          {
            title: "Teljes körű diagnosztika",
            description: "Futómű és fékrendszer átfogó állapotfelmérése emelőn és 3D mérőrendszerrel.",
          },
          {
            title: "3D futómű-beállítás",
            description: "Hunter Hawkeye Elite rendszerrel a teljes geometria precíziós korrekciója.",
          },
          {
            title: "Fékbetét és tárcsacsere",
            description: "Kopott első fékbetétek és tárcsák cseréje sportfék alkatrészekre.",
          },
          {
            title: "Fékfolyadék-csere",
            description: "A teljes rendszer légtelenítéssel egybekötött frissítése.",
          },
          {
            title: "Próbafékezés és tesztvezetés",
            description: "Fékhatás és menetstabilitás ellenőrzése valós körülmények között.",
          },
        ],
      },
      {
        type: "quote",
        text: "Az autó most pontosan úgy viselkedik, ahogy egy M3-tól elvárható. A kanyarstabilitás és a fékérzet is teljesen más szinten van.",
        attribution: "— A tulajdonos visszajelzése",
      },
    ],
    specs: [
      { label: "Jármű", value: "BMW M3 Competition (F80)" },
      { label: "Motor", value: "3.0L Biturbo Line 6" },
      { label: "Teljesítmény", value: "510 LE / 650 Nm" },
      { label: "Évjárat", value: "2019" },
      { label: "Futott km", value: "~92 000 km" },
      { label: "Átvétel", value: "2025. február" },
    ],
    results: [
      { value: "±0.05°", label: "Geometria pontosság", description: "Gyári specifikáció szerint beállítva" },
      { value: "100%", label: "Fékhatás", description: "Új fékbetét és tárcsa, teljes kapacitáson" },
      { value: "4", label: "Kerék korrigálva", description: "Mind a négy tengelyponton" },
    ],
    projectDate: "2025-02-01",
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "BMW M3 Competition futómű és fékszerviz közben",
    },
    gallery: [
      { url: "/placeholders/photo-placeholder.svg", alt: "3D futómű-beállítás az M3 Competitionön" },
      { url: "/placeholders/photo-placeholder.svg", alt: "Fékbetét és tárcsacsere közben" },
      { url: "/placeholders/photo-placeholder.svg", alt: "Az M3 Competition az emelőn" },
      { url: "/placeholders/photo-placeholder.svg", alt: "Próbafékezés tesztvezetés közben" },
    ],
    relatedServices: ["futomu-beallitas", "altalanos-karbantartas"],
    displayOrder: 2,
  },
  {
    slug: "audi-rs6-avant",
    title: "Audi RS6 Avant",
    summary: "DPF regenerálás & karbantartás — a családi kombi teljesítményének és megbízhatóságának helyreállítása",
    body: [
      {
        type: "paragraph",
        text: "Az RS6 Avant tulajdonosa csökkent teljesítményt és füstös kipufogást tapasztalt hosszabb autópályás út után. Vizsgálatkor kiderült, hogy a DPF szűrő jelentősen eltömődött, a karbantartási előírások pedig már régóta esedékesek voltak.",
      },
      {
        type: "paragraph",
        text: "A cél a DPF szűrő teljes regenerálása és egy átfogó karbantartási csomag elvégzése volt, hogy az autó ismét megbízhatóan és a gyári teljesítményszinten szolgáljon.",
      },
      {
        type: "numberedSteps",
        items: [
          { title: "Diagnosztika", description: "Teljes körű rendszervizsgálat és DPF nyomásmérés." },
          {
            title: "DPF ultrahangos tisztítás",
            description: "A 89%-ban eltömődött szűrő teljes regenerálása.",
          },
          {
            title: "Olaj- és szűrőcsere",
            description: "Szintetikus motorolaj és valamennyi szűrő cseréje.",
          },
          {
            title: "Fékrendszer átvizsgálás",
            description: "Fékbetét, tárcsa és fékfolyadék ellenőrzése.",
          },
          {
            title: "Szoftver reset & tesztvezetés",
            description: "DPF hibakód törlése és 35 km-es próbaút.",
          },
        ],
      },
      {
        type: "quote",
        text: "Az autó ismét úgy megy, mint amikor új volt. A fogyasztás is érezhetően csökkent az út óta.",
        attribution: "— A tulajdonos visszajelzése",
      },
    ],
    specs: [
      { label: "Jármű", value: "Audi RS6 Avant (C8)" },
      { label: "Motor", value: "4.0L V8 Biturbo" },
      { label: "Teljesítmény", value: "600 LE / 800 Nm" },
      { label: "Évjárat", value: "2021" },
      { label: "Futott km", value: "~61 000 km" },
      { label: "Átvétel", value: "2024. szeptember" },
    ],
    results: [
      { value: "0", label: "Hibaüzenet maradt", description: "Teljes hibamentesítés" },
      { value: "100%", label: "DPF átfolyás", description: "Gyári szint visszaállítva" },
      { value: "12+", label: "Ellenőrzési pont", description: "Karbantartási csomag részeként" },
    ],
    projectDate: "2024-09-01",
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Audi RS6 Avant DPF regenerálás és karbantartás közben",
    },
    gallery: [
      { url: "/placeholders/photo-placeholder.svg", alt: "DPF szűrő nyomásmérés az RS6 Avanton" },
      { url: "/placeholders/photo-placeholder.svg", alt: "Olaj- és szűrőcsere közben" },
      { url: "/placeholders/photo-placeholder.svg", alt: "Fékrendszer átvizsgálása" },
      { url: "/placeholders/photo-placeholder.svg", alt: "Az elkészült Audi RS6 Avant próbaút előtt" },
    ],
    relatedServices: ["dpf-szuro-tisztitas", "altalanos-karbantartas"],
    displayOrder: 3,
  },
];
