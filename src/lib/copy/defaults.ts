import { accent } from "./accent.ts";

/**
 * Every marketing text on the site that lives in Sanity, with the copy it
 * had before it moved there. Two jobs:
 *
 * 1. Fallback — `src/lib/sanity/queries/page-copy.ts` uses a value from
 *    here whenever the Sanity field is missing or empty, so the site never
 *    renders a blank heading.
 * 2. Seed — `src/scripts/seed-page-copy.ts` writes these into Sanity
 *    (only into empty fields), so the owner edits real text in Studio.
 *
 * Keys mirror the Sanity field names one-to-one (the query projects
 * exactly these keys). Relative `.ts` import because the seed script runs
 * on plain Node, without the `@/` alias.
 */
export const COPY_DEFAULTS = {
  homepage: {
    heroLabel: "Prémium Autószerviz · Ercsi",
    heroHeadline: accent("Prémium\n*Autószerviz.*\nPrecíz Munka.\nMaximális\n*Teljesítmény.*"),
    heroStats: [
      { value: "15+", label: "Év tapasztalat" },
      { value: "3000+", label: "Elégedett ügyfél" },
      { value: "100%", label: "Garancia" },
    ],
    servicesSection: {
      label: "Szolgáltatásaink",
      title: accent("Minden, amit\nautójának szüksége van."),
    },
    whyUsSection: {
      label: "Miért válasszon minket",
      title: accent("Precizitás.\n*Teljesítmény.*\nMegbízhatóság."),
      text: "Nem egy átlagos autószerviz vagyunk. Prémium felszerelésünkkel és tapasztalt technikusainkkal a legtöbb problémát egyetlen látogatással megoldjuk.",
      features: [
        { title: "OEM Diagnosztika", description: "Gyári szintű diagnosztikai rendszerek minden márkához" },
        { title: "Minőség Garancia", description: "Munkánkra és az alkatrészekre teljes körű garancia" },
        { title: "Certified Technikusok", description: "Képzett és folyamatosan fejlődő szakember csapat" },
        { title: "Gyors Átfutás", description: "Értékeli az idejét — minimális várakozással dolgozunk" },
      ],
    },
    workshopSection: {
      label: "Felszerelésünk",
      title: accent("Prémium eszközök.\n*Precíz eredmények.*"),
      text: "Legmodernebb diagnosztikai és szervizberendezésekkel dolgozunk — autóját ugyanolyan vagy annál fejlettebb eszközökkel kezeljük, mint a márkaszervizek.",
      equipment: [
        "LAUNCH X431 PRO multirendszer diagnosztika",
        "3D kerékbeállító (Hunter Hawkeye Elite)",
        "DPF ultrahangos tisztítórendszer",
        "Kétoszlopos hidraulikus emelők",
        "Nitrogén abroncs-töltő rendszer",
        "Klímarendszer töltőállomás",
      ],
      badgeValue: "OEM+",
      badgeLabel: "Technológiai szint",
    },
    reviewsSection: { label: "Ügyfeleink mondták", title: accent("Vásárlói *vélemények.*") },
    projectsSection: { label: "Automotive portfolio", title: accent("Kiemelt *projektek.*") },
    blogSection: { label: "Tudástár", title: accent("Legújabb *cikkeink.*") },
    ctaSection: {
      title: "Kérdése van? Lépjen kapcsolatba.",
      text: "Szívesen adunk árajánlatot vagy válaszolunk kérdéseire — keressen minket telefonon vagy írjon üzenetet.",
    },
  },

  aboutPage: {
    heroLabel: "Rólunk",
    heroHeadline: accent("Prémium szerviz.\n*Szenvedéllyel.*"),
    servicesLabel: "Szolgáltatások",
    closingLabel: "A filozófiánk",
    philosophyLabel: "Értékeink",
    ctaSection: {
      title: "Ismerje meg szervizünket személyesen",
      text: "Kérdése van, vagy ajánlatot szeretne? Vegyük fel a kapcsolatot.",
    },
  },

  servicesPage: {
    header: {
      label: "Prémium autószerviz",
      title: accent("Szolgáltatásaink"),
      intro:
        "Folyamatosan fejlesztjük és bővítjük szolgáltatásaink körét, hogy ügyfeleink egyre szélesebb igényeit tudjuk kielégíteni. Célunk, hogy a legmodernebb technológiákkal és magas színvonalú szakmai háttérrel minden autós problémára megbízható megoldást nyújtsunk.",
    },
    priceListCta: {
      title: "Áttekinthető tájékoztató árak",
      text: "Tekintse meg árlistánkat — tájékoztató jellegű, alkatrész nélküli munkadíjakkal.",
    },
    meta: {
      title: "Szolgáltatásaink — Royal-Team Autószerviz",
      description:
        "DPF tisztítás, elektronikai diagnosztika, futómű- és fékrendszer-szerviz, karbantartás — prémium autószerviz Ercsiben, OEM technológiával.",
    },
  },

  blogPage: {
    header: {
      label: "Tudástár",
      title: accent("Blog & *Cikkek*"),
      intro: "Szakmai tartalmak, tippek és útmutatók autótulajdonosoknak — a Royal-Team szakembereinek tollából.",
    },
    meta: {
      title: "Blog — Royal-Team Autószerviz",
      description: "Szakmai tartalmak, tippek és útmutatók autótulajdonosoknak — a Royal-Team szakembereinek tollából.",
    },
  },

  contactPage: {
    header: {
      label: "Lépjen kapcsolatba velünk",
      title: accent("Kapcsolat"),
      intro:
        "Kérdése van, vagy árajánlatot kérne? Keressen minket telefonon, e-mailben, vagy töltse ki az alábbi űrlapot — hamarosan jelentkezünk.",
    },
    meta: {
      title: "Kapcsolat — Royal-Team Autószerviz",
      description:
        "Lépjen kapcsolatba a Royal-Team Autószerviz csapatával — telefon, e-mail, cím és kapcsolatfelvételi űrlap.",
    },
  },

  priceListPage: {
    header: {
      label: "Átlátható árazás",
      title: accent("Árlista"),
      intro:
        "Az alábbi árak tájékoztató jellegűek és a megjelölt összegtől kezdődő díjakat jelölnek. A pontos ár az elvégzett munkától, az alkatrész igénytől és a jármű típusától függ.",
    },
    footnote:
      "* Az árak tájékoztató jellegűek és az ÁFÁ-t nem tartalmazzák. A végső ár az elvégzett munkától, a felhasznált alkatrészektől és a jármű típusától függően eltérhet. Alkatrészek ára külön számítódik.",
    cta: {
      title: "Pontos árajánlatért keressen minket",
      text: "Ingyenes előzetes helyszíni felmérés — rejtett költségek nélkül.",
    },
    meta: {
      title: "Árlista — Royal-Team Autószerviz",
      description:
        "Áttekinthető, tájékoztató jellegű árlista — DPF tisztítás, diagnosztika, futómű- és fékszerviz, karbantartás.",
    },
  },

  projectsPage: {
    header: {
      label: "Automotive portfolio",
      title: accent("Projektek"),
      intro: "Válogatott szervizprojektek — részletes dokumentációval, technikai leírással és valódi eredményekkel.",
    },
    cta: {
      title: "Hasonló munkát szeretne elvégeztetni?",
      text: "Keressen minket — szívesen megbeszéljük az Ön autójához szükséges munkát.",
    },
    meta: {
      title: "Projektek — Royal-Team Autószerviz",
      description: "Válogatott szervizprojektek — részletes dokumentációval, technikai leírással és valódi eredményekkel.",
    },
  },

  siteCopy: {
    footerTagline:
      "Munkánkat alázattal, tisztességgel és szakmai elhivatottsággal végezzük. Célunk, hogy minden ránk bízott járművet legjobb tudásunk szerint, lelkiismeretesen javítsunk, ügyfeleink bizalmát pedig nap mint nap kiérdemeljük.",
    notFound: {
      label: "Hiba",
      title: "Az oldal nem található",
      text: "A keresett oldal nem létezik, vagy időközben megváltozott a címe. Ellenőrizze, hogy jól írta-e be, vagy térjen vissza a főoldalra.",
    },
  },
};

export type CopyDocumentId = keyof typeof COPY_DEFAULTS;
export type HomepageCopy = typeof COPY_DEFAULTS.homepage;
export type AboutPageCopy = typeof COPY_DEFAULTS.aboutPage;
export type ServicesPageCopy = typeof COPY_DEFAULTS.servicesPage;
export type BlogPageCopy = typeof COPY_DEFAULTS.blogPage;
export type ContactPageCopy = typeof COPY_DEFAULTS.contactPage;
export type PriceListPageCopy = typeof COPY_DEFAULTS.priceListPage;
export type ProjectsPageCopy = typeof COPY_DEFAULTS.projectsPage;
export type SiteCopy = typeof COPY_DEFAULTS.siteCopy;
