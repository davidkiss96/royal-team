import type { FaqItem } from "@/components/faq-accordion";
import type { BodyBlock, ImageWithAlt } from "@/lib/types";

/**
 * Mock data shaped to match the approved `Service` document
 * (docs/content-model.md Section 2), including the fields added once
 * Next.js implementation of the Services pages surfaced real content-model
 * gaps: `tagline`, `highlights` (Section 0 item 7), and `process`
 * (Section 0 item 8).
 *
 * Named `Service` (not `ServiceSummary`) per
 * docs/development-guidelines.md Section 18 — "a `service` Sanity document
 * type corresponds to a `Service` TypeScript type." This one type now
 * covers both the index page's listing shape and the detail page's full
 * shape, exactly like a real Sanity document would.
 */
export interface Service {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  body: BodyBlock[];
  highlights: string[];
  process?: { title: string; description: string }[];
  faq?: FaqItem[];
  heroImage: ImageWithAlt;
  gallery?: ImageWithAlt[];
  isActive: boolean;
  displayOrder: number;
}

export const ALL_SERVICES: Service[] = [
  {
    slug: "dpf-szuro-tisztitas",
    title: "DPF Szűrő Tisztítás",
    tagline: "Részecskeszűrő regenerálás",
    summary:
      "Professzionális DPF/FAP szűrő tisztítás és regenerálás ultrahangos technológiával — drága csere nélkül.",
    body: [
      {
        type: "paragraph",
        text: "A diesel részecskeszűrő (DPF) összegyűjti a motor koromrészecskéit. Idővel eltömődik, ami csökkenti a teljesítményt, növeli a fogyasztást és hibákat okoz az elektronikában.",
      },
      {
        type: "paragraph",
        text: "Kezeletlen esetben motorleállás, turbó meghibásodás és a szűrő teljes tönkremenetele következhet. Időben kezelve a drága csere elkerülhető.",
      },
      {
        type: "list",
        items: [
          "Csökkent motorteljesítmény",
          "Megnövekedett üzemanyag-fogyasztás",
          "DPF figyelmeztető lámpa a műszerfalon",
          "Füstös kipufogó",
          "Erőltetett regeneráció",
        ],
      },
    ],
    highlights: [
      "Üzemanyag-takarékosság",
      "Csökkentett emisszió",
      "Motortartósság növelése",
    ],
    process: [
      {
        title: "Diagnosztika",
        description: "OBD olvasás, szűrő nyomásmérés, eltömöttség meghatározása",
      },
      {
        title: "Szűrő leszerelése",
        description: "Gondos leszereléssel biztosítjuk, hogy más alkatrész ne sérüljön",
      },
      {
        title: "Ultrahangos tisztítás",
        description: "Professzionális ultrahangos fürdőben a korom és lerakódás eltávolítása",
      },
      {
        title: "Nyomás- és flow-teszt",
        description: "Az eredeti átfolyási kapacitás visszaállításának ellenőrzése",
      },
      {
        title: "Visszaszerelés & tesztelés",
        description: "Visszaszerelés, szoftver reset és tesztvezetés — garanciával",
      },
    ],
    faq: [
      {
        question: "Mikor szükséges a DPF szűrő tisztítása?",
        answer:
          "Általában 150–200.000 km után, vagy ha a műszerfalon megjelenik a DPF figyelmeztető jelzés. Városban sokat közlekedő autóknál hamarabb is szükséges lehet.",
      },
      {
        question: "Megtisztítható-e minden DPF szűrő?",
        answer:
          "A szűrők mintegy 90%-a sikeresen megtisztítható. Erősen sérült vagy repedt szűrőknél csere szükséges — ezt előzetes ellenőrzéssel megállapítjuk.",
      },
      {
        question: "Mennyi ideig tart a tisztítás?",
        answer:
          "A teljes folyamat általában 3–6 óra. Szükség esetén pótautót is biztosítani tudunk.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "DPF részecskeszűrő tisztítása ultrahangos berendezéssel",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Eltömődött DPF szűrő közelről, tisztítás előtt",
      },
    ],
    isActive: true,
    displayOrder: 1,
  },
  {
    slug: "elektronikai-diagnosztika",
    title: "Elektronikai Diagnosztika",
    tagline: "OBD & multirendszer analízis",
    summary:
      "Legmodernebb diagnosztikai eszközökkel feltérképezzük gépjárműve összes elektronikus rendszerét.",
    body: [
      {
        type: "paragraph",
        text: "A modern gépjárművek több tucat elektronikus vezérlőegységet (ECU) tartalmaznak, amelyek hibái gyakran nem járnak azonnal látható tünettel. Egy apró érzékelőhiba is jelentős teljesítményveszteséghez vagy motorkárosodáshoz vezethet, ha időben nem derül fény rá.",
      },
      {
        type: "paragraph",
        text: "Rendszeres diagnosztikával a rejtett hibák még azelőtt felszínre kerülnek, hogy komolyabb, drágább meghibásodást okoznának.",
      },
      {
        type: "list",
        items: [
          "Motor-figyelmeztető lámpa világít",
          "Rendszertelen járásmű vagy teljesítményingadozás",
          "Megnövekedett üzemanyag-fogyasztás",
          "Nehézkes hidegindítás",
        ],
      },
    ],
    highlights: [
      "Pontos hibakód olvasás",
      "Összes rendszer ellenőrzése",
      "Részletes hibajegyzőkönyv",
    ],
    process: [
      {
        title: "Rendszerszkennelés",
        description: "LAUNCH X431 PRO műszerrel valamennyi elektronikus rendszer lekérdezése",
      },
      {
        title: "Hibakód-elemzés",
        description: "A talált hibakódok kiértékelése és a valós ok azonosítása",
      },
      {
        title: "Célzott mérés",
        description: "Az érintett alkatrészek/érzékelők élő adatainak ellenőrzése",
      },
      {
        title: "Jegyzőkönyv és javaslat",
        description: "Részletes írásos összefoglaló a talált hibákról és a javasolt javításról",
      },
    ],
    faq: [
      {
        question: "Mennyi ideig tart egy teljes diagnosztika?",
        answer:
          "Az alapdiagnosztika 30–45 perc, a teljes körű multirendszer vizsgálat 1–1,5 óra, a jármű típusától és a hibák számától függően.",
      },
      {
        question: "A diagnosztika után kötelező náluk javíttatni?",
        answer:
          "Nem. A diagnosztika önálló szolgáltatás — a jegyzőkönyvvel szabadon eldöntheti, hol javíttatja meg az autót.",
      },
      {
        question: "Minden márkával foglalkoznak?",
        answer:
          "Igen, valamennyi európai, japán és amerikai márkájú személyautóval és kisteherrel foglalkozunk.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "OBD diagnosztikai eszköz csatlakoztatva egy gépjárműhöz",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Elektronikai diagnosztikai eszköz kijelzője hibakódokkal",
      },
    ],
    isActive: true,
    displayOrder: 2,
  },
  {
    slug: "futomu-beallitas",
    title: "Futómű Beállítás",
    tagline: "3D kerékbeállítás és geometria",
    summary:
      "Legmodernebb 3D-s mérőrendszerrel precíziós futómű-geometria és tengelybeállítás.",
    body: [
      {
        type: "paragraph",
        text: "A futómű geometriájának akár néhány tized fokos eltérése is érezhető kormányzási problémákat és egyenetlen gumikopást okoz. Az eltérés leggyakrabban egy kátyúba hajtás, egy komolyabb fékezés vagy a természetes elhasználódás következménye.",
      },
      {
        type: "paragraph",
        text: "A pontos beállítás nemcsak a menetstabilitást javítja, hanem hosszabb távon jelentős megtakarítást is jelent az abroncsok élettartamában.",
      },
      {
        type: "list",
        items: [
          "Az autó húz egyik oldalra",
          "Egyenetlen, ferde gumikopás",
          "Vibráció a kormányban",
          "Instabil érzés kanyarban vagy autópályán",
        ],
      },
    ],
    highlights: ["Egyenes kormányzás", "Gumiabroncs-kímélés", "Stabilitás javítás"],
    process: [
      {
        title: "3D mérés",
        description: "Hunter Hawkeye Elite rendszerrel a jelenlegi geometria pontos felmérése",
      },
      {
        title: "Eltérések azonosítása",
        description: "Az eredeti gyári értékektől való eltérés meghatározása",
      },
      {
        title: "Precíziós beállítás",
        description: "Az összes tengely finombeállítása a gyári specifikáció szerint",
      },
      {
        title: "Ellenőrző mérés és tesztvezetés",
        description: "A beállítás pontosságának igazolása",
      },
    ],
    faq: [
      {
        question: "Honnan tudom, hogy szükségem van futómű-beállításra?",
        answer:
          "Ha az autó húz valamelyik oldalra, a gumik egyenetlenül kopnak, vagy vibrálást érez a kormányban, érdemes ellenőriztetni a futóművet.",
      },
      {
        question: "Milyen gyakran érdemes ellenőriztetni?",
        answer:
          "Javasoljuk évente egyszer, vagy minden nagyobb gumicsere, illetve kátyúba hajtás/erős fékezés után.",
      },
      {
        question: "Mennyi ideig tart a beállítás?",
        answer: "Egy átlagos 3D kerékbeállítás 45–60 percet vesz igénybe.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "3D kerékbeállító rendszer működés közben",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "3D kerékbeállító rendszer méréssel",
      },
    ],
    isActive: true,
    displayOrder: 3,
  },
  {
    slug: "altalanos-karbantartas",
    title: "Általános Karbantartás",
    tagline: "Teljes körű szerviz",
    summary:
      "Átfogó gépjármű karbantartás a gyári előírások szerint, OEM minőségű alkatrészekkel.",
    body: [
      {
        type: "paragraph",
        text: "A rendszeres karbantartás a leghatékonyabb módja annak, hogy elkerülje a váratlan, költséges meghibásodásokat. A gyári előírások szerinti szervizintervallumok betartása közvetlenül befolyásolja a jármű élettartamát és megbízhatóságát.",
      },
      {
        type: "paragraph",
        text: "Karbantartás során nemcsak a kötelező cseréket végezzük el, hanem átfogó állapotfelmérést is készítünk, hogy időben jelezzük a közelgő teendőket.",
      },
      {
        type: "list",
        items: [
          "Motorolaj és szűrők cseréje",
          "Fékrendszer és futómű átvizsgálás",
          "Folyadékszintek és -minőség ellenőrzése",
          "Elektromos rendszerek alapszintű ellenőrzése",
        ],
      },
    ],
    highlights: ["Gyári előírások szerinti", "OEM alkatrészek", "Garanciális munka"],
    process: [
      {
        title: "Bejelentkezés és átvétel",
        description: "Igény és korábbi szervizelőzmények egyeztetése",
      },
      {
        title: "Átfogó átvizsgálás",
        description: "A jármű állapotának teljes körű felmérése",
      },
      {
        title: "Karbantartási munkák",
        description: "A gyári előírás szerinti cserék és beállítások elvégzése",
      },
      {
        title: "Záróellenőrzés",
        description: "Minőségellenőrzés és tesztvezetés átadás előtt",
      },
    ],
    faq: [
      {
        question: "Milyen gyakran esedékes az általános karbantartás?",
        answer:
          "Jellemzően évente vagy 15 000–20 000 km-enként, a gyártói előírásoktól és a használat jellegétől függően.",
      },
      {
        question: "OEM alkatrészeket használnak?",
        answer: "Igen, minden karbantartás során gyári minőségű, OEM alkatrészekkel dolgozunk.",
      },
      {
        question: "Mennyi idő alatt végeznek el egy karbantartást?",
        answer:
          "Egy átlagos karbantartás 2–4 órát vesz igénybe, a szükséges munkák terjedelmétől függően.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Gépjármű általános karbantartás közben az emelőn",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Gépjármű karbantartás közben az emelőn",
      },
    ],
    isActive: true,
    displayOrder: 4,
  },
  {
    slug: "fekrendszer-szerviz",
    title: "Fékrendszer Szerviz",
    tagline: "Teljesítményfékek és szériafékek",
    summary:
      "Prémium fékbetét, tárcsa és folyadék csere — sportfék opciókkal teljesítményautókhoz.",
    body: [
      {
        type: "paragraph",
        text: "A fékrendszer a jármű legkritikusabb biztonsági eleme — állapota közvetlenül befolyásolja a fékút hosszát és a menetbiztonságot. A kopott fékbetét vagy elhasználódott fékfolyadék érezhetően rontja a fékhatást, különösen vészfékezéskor.",
      },
      {
        type: "paragraph",
        text: "Teljesítményautóknál a szériafékek gyakran nem bírják a megnövekedett igénybevételt — ezért kínálunk sportfék-opciókat is.",
      },
      {
        type: "list",
        items: [
          "Csikorgó vagy nyikorgó hang fékezéskor",
          'Megnyúlt fékút vagy "puha" fékpedál',
          "Vibráció fékezéskor",
          "Fékfolyadék-szint figyelmeztetés",
        ],
      },
    ],
    highlights: ["Maximális fékerő", "Sportfékek elérhetők", "Biztonsági ellenőrzés"],
    process: [
      {
        title: "Átvizsgálás",
        description: "Fékbetétek, tárcsák és a fékfolyadék állapotának felmérése",
      },
      {
        title: "Alkatrészcsere",
        description: "Kopott fékbetét, tárcsa és tömítések cseréje szükség szerint",
      },
      {
        title: "Fékfolyadék-csere",
        description: "A teljes rendszer légtelenítéssel egybekötött folyadékcseréje",
      },
      {
        title: "Próbafékezés",
        description: "Fékhatás és biztonsági ellenőrzés tesztvezetés közben",
      },
    ],
    faq: [
      {
        question: "Milyen gyakran kell cserélni a fékbetétet?",
        answer:
          "Jellemzően 30 000–60 000 km-enként, de ez erősen függ a vezetési stílustól és a jármű típusától — átvizsgáláskor pontosan megmondjuk.",
      },
      {
        question: "Érdemes sportféket választani egy teljesítményautóhoz?",
        answer:
          "Igen, ha rendszeresen intenzív igénybevételnek teszi ki a féket (pl. sportvezetés), a sportfék jelentősen jobb, konzisztensebb fékhatást ad.",
      },
      {
        question: "Mennyi ideig tart egy fékbetétcsere?",
        answer: "Tengelyenként átlagosan 1–1,5 óra, alkatrész rendelkezésre állása esetén.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Teljesítmény fékrendszer szerelés közben",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Teljesítmény fékrendszer alkatrészei szerelés közben",
      },
    ],
    isActive: true,
    displayOrder: 5,
  },
  {
    slug: "olajcsere-szerviz",
    title: "Olajcsere Szerviz",
    tagline: "Prémium szintetikus olajok",
    summary:
      "Prémium szintetikus motorolaj csere, szűrő csere és összes folyadék ellenőrzése.",
    body: [
      {
        type: "paragraph",
        text: "A motorolaj a motor legfontosabb kenőanyaga — minősége és állapota közvetlenül meghatározza a motor élettartamát. Az elhasználódott olaj elveszti kenőképességét, ami fokozott kopáshoz és hosszú távon komoly motorkárosodáshoz vezethet.",
      },
      {
        type: "paragraph",
        text: "Prémium szintetikus olajjal és szűrővel dolgozunk, hogy motorja a lehető leghosszabb ideig megbízhatóan szolgáljon.",
      },
      {
        type: "list",
        items: [
          "Az olaj sötét, szennyezett vagy alacsony szintű",
          "Az olajcsere-jelzés világít a műszerfalon",
          "Szokatlan motorhang vagy nehézkes indítás",
          "Utolsó csere óta eltelt 10 000+ km vagy 1 év",
        ],
      },
    ],
    highlights: ["Szintetikus olaj", "Szűrő csere", "Összes folyadék ellenőrzés"],
    process: [
      {
        title: "Állapotfelmérés",
        description: "A jelenlegi olajszint és -minőség ellenőrzése",
      },
      {
        title: "Olaj- és szűrőcsere",
        description: "Fáradt olaj leengedése, új szintetikus olaj és szűrő beépítése",
      },
      {
        title: "Folyadékok ellenőrzése",
        description: "Hűtőfolyadék, fékfolyadék és ablakmosó szint ellenőrzése",
      },
      {
        title: "Záróellenőrzés",
        description: "Szivárgásmentesség és helyes olajszint igazolása",
      },
    ],
    faq: [
      {
        question: "Milyen gyakran esedékes az olajcsere?",
        answer:
          "Szintetikus olajjal jellemzően 10 000–15 000 km-enként vagy évente, a gyártói előírástól függően.",
      },
      {
        question: "Milyen olajat használnak?",
        answer:
          "Prémium, gyártói specifikációnak megfelelő szintetikus motorolajjal dolgozunk minden jármű esetén.",
      },
      {
        question: "Az olajcserével egyben más folyadékokat is ellenőriznek?",
        answer: "Igen, minden olajcsere részeként a fontosabb folyadékszinteket is átvizsgáljuk.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Szintetikus motorolaj csere közben",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Szintetikus motorolaj betöltése olajcsere közben",
      },
    ],
    isActive: true,
    displayOrder: 6,
  },
];

/**
 * Resolves `Project.relatedServices` (an array of `Service` slugs) to real
 * `Service` documents — the mock equivalent of dereferencing a Sanity
 * reference array. Used by the Projects pages; unknown slugs are silently
 * dropped rather than erroring, matching how a real reference to a deleted
 * document would just disappear from a resolved query result.
 */
export function getServicesBySlugs(slugs: string[]): Service[] {
  return slugs
    .map((slug) => ALL_SERVICES.find((service) => service.slug === slug))
    .filter((service): service is Service => Boolean(service));
}
