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
 *
 * Content reflects the first approved round of 10 real services (2026-09).
 * `Fékrendszer Szerviz` and `Olajcsere Szerviz` from the previous mock are
 * folded into `Általános szerviz és karbantartás` and no longer exist as
 * separate documents — see the seed script's stale-document reconciliation
 * for how already-seeded Sanity documents for those two are retired.
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
    slug: "altalanos-karbantartas",
    title: "Általános szerviz és karbantartás",
    tagline: "Teljes körű időszakos karbantartás",
    summary:
      "Motorolaj- és szűrőcsere, fékrendszer-karbantartás és vezérlés csere egy helyen — időszakos karbantartás, felkészítve gépjárművét a mindennapi használatra és a műszaki vizsgára.",
    body: [
      {
        type: "paragraph",
        text: "Az időszakos karbantartás a gépjármű megbízható működésének alapja. A motorolaj, a szűrők és a fékrendszer állapota folyamatosan változik a használat során, ezért ezeket rendszeresen ellenőrizni, szükség esetén cserélni kell, mielőtt komolyabb problémát okoznának.",
      },
      {
        type: "paragraph",
        text: "Az általános karbantartás a leggyakrabban esedékes munkákat fogja össze egy alkalommal: az olaj- és szűrőcserétől a fékrendszer ellenőrzésén és javításán át a vezérlés cseréjéig. A munka végén átfogó képet kap gépjárműve állapotáról.",
      },
      {
        type: "list",
        items: [
          "Esedékes motorolaj- és szűrőcsere",
          "Kopott fékbetét vagy féktárcsa",
          "Közelgő vagy esedékes vezérléscsere",
          "Közelgő műszaki vizsga",
          "Bizonytalanság a jármű általános állapotával kapcsolatban",
        ],
      },
    ],
    highlights: ["Több karbantartási munka egy alkalommal", "Átfogó állapotfelmérés", "Felkészítés a műszaki vizsgára"],
    process: [
      {
        title: "Bevétel és állapotfelmérés",
        description: "A jármű átvétele, a szervizelőzmények és az aktuális állapot áttekintése",
      },
      {
        title: "Olaj-, szűrő- és folyadékcsere",
        description: "Motorolaj, olajszűrő és a szükséges egyéb szűrők cseréje, folyadékszintek ellenőrzése",
      },
      {
        title: "Fékrendszer és vezérlés ellenőrzése",
        description:
          "A fékalkatrészek állapotának vizsgálata, szükség esetén csere, valamint a vezérlés ellenőrzése vagy cseréje",
      },
      {
        title: "Záró ellenőrzés",
        description: "Az elvégzett munkák átvizsgálása és a jármű általános állapotának összegzése",
      },
    ],
    faq: [
      {
        question: "Milyen munkák tartoznak az általános karbantartásba?",
        answer:
          "Jellemzően a motorolaj- és szűrőcsere, a fékrendszer ellenőrzése és szükség esetén alkatrészcseréje, valamint a vezérlés ellenőrzése vagy cseréje tartozik bele. A pontos munkafolyamat mindig a jármű állapotától és típusától függ.",
      },
      {
        question: "Honnan tudom, hogy esedékes a karbantartás?",
        answer:
          "A gyártó által javasolt szervizintervallum mellett érdemes figyelni a műszerfali jelzésekre, a fékek működésére és a motor viselkedésére. Bizonytalanság esetén egy állapotfelmérés egyértelmű választ ad.",
      },
      {
        question: "A karbantartás részeként felkészítik az autót a műszaki vizsgára is?",
        answer:
          "Igen, a karbantartás során a műszaki vizsgán ellenőrzött főbb pontokat is átvizsgáljuk, így pontosabb képet kap arról, mire számíthat a vizsgán.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Gépjármű általános karbantartás közben az emelőn",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Motorolaj- és szűrőcsere karbantartás közben",
      },
    ],
    isActive: true,
    displayOrder: 1,
  },
  {
    slug: "elektronikai-diagnosztika",
    title: "Komplex műszeres diagnosztika és hibakeresés",
    tagline: "Célzott hibakeresés méréssel alátámasztva",
    summary:
      "Komplex műszeres diagnosztika és célzott hibakeresés — a hibakódok kiolvasásától és értelmezésétől az élőadatok vizsgálatáig, amíg világossá nem válik a hiba valódi oka és a szükséges javítás.",
    body: [
      {
        type: "paragraph",
        text: "Egy figyelmeztető lámpa vagy szokatlan tünet hátterében ritkán áll egyetlen, nyilvánvaló ok. A modern gépjárművek elektronikus rendszerei szorosan összefüggnek egymással, ezért a pontos javításhoz nem elég a hibakód kiolvasása — alapos, műszeres hibakeresésre van szükség.",
      },
      {
        type: "paragraph",
        text: "A komplex diagnosztika a hibakódok kiolvasásával és szakszerű értelmezésével kezdődik, majd ahol ez önmagában nem ad egyértelmű választ, élőadatok és mérési eredmények vizsgálatával folytatódik. A cél, hogy ne csak egy kódot lássunk, hanem valóban megértsük, mi áll a tünet hátterében — ha pedig egy adott hibához különleges, gyártóspecifikus diagnosztikai háttér szükséges, ezt előre jelezzük.",
      },
      {
        type: "list",
        items: [
          "Motor-figyelmeztető lámpa világít",
          "Egyéb műszerfali hibajelzés",
          "Rendszertelen járásmű vagy teljesítménykiesés",
          "Nehézkes indítás",
          "Bizonytalan eredetű tünet, amit érdemes körüljárni",
        ],
      },
    ],
    highlights: [
      "Komplex, méréssel alátámasztott hibakeresés",
      "Hibakódok kiolvasása és szakszerű értelmezése",
      "Konkrét javítási javaslat a feltárt ok alapján",
    ],
    process: [
      {
        title: "Hibakód-kiolvasás",
        description: "A jármű elektronikus rendszereinek lekérdezése és a tárolt hibakódok kigyűjtése",
      },
      {
        title: "Hibakeresés és elemzés",
        description: "A talált kódok és a tapasztalt tünet összevetése, az érintett rendszerek pontos beazonosítása",
      },
      {
        title: "Célzott mérés",
        description: "Szükség esetén élőadatok és mérési eredmények vizsgálata az ok pontos behatárolásához",
      },
      {
        title: "Javítási javaslat",
        description: "A feltárt hiba alapján egyértelmű javaslat a szükséges javításra",
      },
    ],
    faq: [
      {
        question: "Mikor érdemes műszeres diagnosztikát kérni?",
        answer:
          "Érdemes elvégeztetni, ha műszerfali figyelmeztető lámpa világít, vagy bármilyen szokatlan tünetet — teljesítménykiesést, rendszertelen járást, nehézkes indítást — tapasztal. Minél korábban derül ki a hiba oka, annál egyszerűbb lehet a javítás.",
      },
      {
        question: "Elég a hibakód kiolvasása a hiba megállapításához?",
        answer:
          "Sok esetben a hibakód önmagában is pontos irányt ad, de összetettebb tüneteknél ez csak a kiindulópont. Ilyenkor élőadatok és további mérések vizsgálatával jutunk el a valódi okig.",
      },
      {
        question: "Mi történik, ha a diagnosztika után sem egyértelmű a hiba oka?",
        answer:
          "Vannak esetek, amikor egy hiba több lehetséges okra is visszavezethető, vagy csak bizonyos körülmények között jelentkezik. Ilyenkor további célzott vizsgálatra vagy próbaútra lehet szükség a pontos behatárolásához.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Komplex műszeres diagnosztika egy gépjárművön",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Hibakód-kiolvasás és élőadat-vizsgálat diagnosztikai műszerrel",
      },
    ],
    isActive: true,
    displayOrder: 2,
  },
  {
    slug: "dpf-szuro-tisztitas",
    title: "DPF szűrő tisztítás",
    tagline: "Bekis DPF 4100+ automatizált tisztítás",
    summary:
      "A DPF szűrő állapotfelmérése és automatizált, vízbázisú tisztítása Bekis DPF 4100+ berendezéssel — sok esetben költséghatékony alternatíva a szűrő cseréjéhez képest.",
    body: [
      {
        type: "paragraph",
        text: "A dízel részecskeszűrő (DPF) a motor kipufogógázában lévő koromrészecskéket gyűjti össze. Idővel korom, hamu és egyéb lerakódás halmozódik fel benne, ami rontja az átáramlást, és teljesítménycsökkenéshez, megnövekedett fogyasztáshoz vagy figyelmeztető jelzésekhez vezethet.",
      },
      {
        type: "paragraph",
        text: "A tisztítást Bekis DPF 4100+ berendezéssel, automatizált, vízbázisú eljárással végezzük. A folyamat állapotfelméréssel kezdődik, ezt követi a tisztítás és a szárítás, majd utóméréssel ellenőrizzük az eredményt. A csere helyett sok esetben ez költséghatékony alternatíva.",
      },
      {
        type: "list",
        items: [
          "DPF figyelmeztető lámpa a műszerfalon",
          "Csökkent motorteljesítmény",
          "Megnövekedett üzemanyag-fogyasztás",
          "Gyakori, magától induló regenerációs kísérlet",
        ],
      },
    ],
    highlights: [
      "Automatizált, vízbázisú tisztítási folyamat",
      "Mérésen alapuló állapotfelmérés és utómérés",
      "Költséghatékony alternatíva a szűrőcseréhez képest",
    ],
    process: [
      {
        title: "Állapotfelmérés",
        description: "A szűrő kiszerelése és kezdeti állapotának felmérése, áteresztőképesség- és ellennyomás-méréssel",
      },
      {
        title: "Automatizált tisztítás",
        description:
          "A szűrő tisztítása Bekis DPF 4100+ berendezéssel, vízbázisú eljárással, a korom, hamu és egyéb lerakódások eltávolítására",
      },
      {
        title: "Szárítás",
        description: "A szűrő alapos szárítása a visszaszerelés előtt",
      },
      {
        title: "Utómérés és dokumentáció",
        description:
          "A tisztítás eredményének ellenőrzése méréssel, visszaszerelés, majd a mérési eredmények dokumentálása",
      },
    ],
    faq: [
      {
        question: "Minden DPF szűrő tisztítható?",
        answer:
          "A legtöbb eltömődött szűrő tisztítható, de a tényleges állapot csak kiszerelés és állapotfelmérés után állapítható meg pontosan. Ha a szűrő szerkezetileg sérült, ezt a felmérés során jelezzük.",
      },
      {
        question: "Miben különbözik a tisztítás a cserétől?",
        answer:
          "A tisztítás a meglévő szűrőt állítja vissza működőképes állapotba korom- és hamueltávolítással, míg a csere egy új alkatrész beépítését jelenti. A tisztítás sok esetben költséghatékonyabb megoldás lehet.",
      },
      {
        question: "Honnan tudom, hogy a DPF szűrőm eltömődött?",
        answer:
          "A leggyakoribb jelek a műszerfalon megjelenő DPF figyelmeztető lámpa, a csökkenő teljesítmény és a megnövekedett fogyasztás. Ilyen tünetek esetén érdemes elvégeztetni az állapotfelmérést.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "DPF szűrő tisztítása Bekis DPF 4100+ berendezéssel",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Eltömődött DPF szűrő állapotfelmérés közben",
      },
    ],
    isActive: true,
    displayOrder: 3,
  },
  {
    slug: "futomu-beallitas",
    title: "Futómű javítás és beállítás",
    tagline: "Állapotfelmérés, javítás és geometria-beállítás",
    summary:
      "Futóműalkatrészek ellenőrzése és javítása, valamint a futóműgeometria pontos beállítása az egyenletes gumikopásért és a stabil menettulajdonságokért.",
    body: [
      {
        type: "paragraph",
        text: "A futómű geometriája egy kátyúba hajtás, egy erősebb fékezés vagy a hosszú távú elhasználódás hatására is elállítódhat, a kopó alkatrészek pedig idővel játékossá válnak. Ez egyenetlen gumikopásban, kormányvibrációban vagy bizonytalan menetstabilitásban mutatkozhat meg.",
      },
      {
        type: "paragraph",
        text: "Először felmérjük a futómű alkatrészeinek állapotát, és a kopott vagy sérült elemeket kicseréljük. Ezt követően ellenőrizzük, és szükség esetén pontosan beállítjuk a futóműgeometriát, hogy a jármű egyenesen fusson és a gumik egyenletesen kopjanak.",
      },
      {
        type: "list",
        items: [
          "Az autó húz valamelyik oldalra",
          "Egyenetlen vagy ferde gumikopás",
          "Vibráció a kormányban",
          "Kopogó vagy zörgő hang a futómű felől",
          "Bizonytalan érzés kanyarban vagy autópályán",
        ],
      },
    ],
    highlights: [
      "Futóműalkatrészek ellenőrzése és javítása",
      "Pontos geometria-beállítás",
      "Rendellenes gumikopás okának feltárása",
    ],
    process: [
      {
        title: "Állapotfelmérés",
        description: "A futómű alkatrészeinek átvizsgálása emelőn, a kopás és a játék mértékének felmérése",
      },
      {
        title: "Javítás",
        description: "A kopott vagy sérült futóműalkatrészek cseréje",
      },
      {
        title: "Geometria ellenőrzése és beállítása",
        description: "A kerékállás-geometria mérése, eltérés esetén pontos beállítása",
      },
      {
        title: "Próbavezetés",
        description: "A javítás és a beállítás eredményének ellenőrzése próbaút közben",
      },
    ],
    faq: [
      {
        question: "Honnan tudom, hogy szükségem van futómű-beállításra?",
        answer:
          "Ha az autó húz valamelyik oldalra, a gumik egyenetlenül kopnak, vagy vibrálást érez a kormányban, érdemes elvégeztetni egy állapotfelmérést és geometria-ellenőrzést.",
      },
      {
        question: "Elég csak beállítani a futóművet, vagy javítás is szükséges lehet?",
        answer:
          "Ez a futómű tényleges állapotától függ. Ha a beállítás előtt kopott vagy elhasználódott alkatrészt találunk, azt érdemes kicserélni, mert enélkül a beállítás nem lesz tartós.",
      },
      {
        question: "Milyen gyakran érdemes ellenőriztetni a futóművet?",
        answer:
          "Érdemes rendszeresen, illetve egy komolyabb kátyúba hajtás vagy erős fékezés után is átvizsgáltatni, még akkor is, ha egyelőre nem tapasztal feltűnő tünetet.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Futómű geometria ellenőrzése és beállítása",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Futóműalkatrészek ellenőrzése az emelőn",
      },
    ],
    isActive: true,
    displayOrder: 4,
  },
  {
    slug: "kuplung-es-kettostomegu-lendkerek-csere",
    title: "Kuplung és kettőstömegű lendkerék csere",
    tagline: "Kuplungrendszer hibafeltárás és csere",
    summary:
      "A kuplungrendszer és a kettőstömegű lendkerék állapotának vizsgálata, valamint a szükséges alkatrészek cseréje a hajtáslánc megbízható működéséért.",
    body: [
      {
        type: "paragraph",
        text: "A kuplung és a kettőstömegű lendkerék elhasználódása fokozatosan jelentkezik: a kuplung csúszni kezdhet, a sebességváltás nehezebbé válhat, a kettőstömegű lendkerék hibája pedig jellemzően rezgés vagy szokatlan hang formájában mutatkozik meg alapjáraton vagy terhelés alatt.",
      },
      {
        type: "paragraph",
        text: "A hibafeltárás során megvizsgáljuk a kuplungrendszert és a hozzá kapcsolódó alkatrészeket, hogy pontosan meghatározzuk, mi okozza a tapasztalt tünetet. Ha csere szükséges, azt a kapcsolódó alkatrészekkel együtt végezzük el, mivel ezek elhasználódása jellemzően összefügg.",
      },
      {
        type: "list",
        items: [
          "Csúszó vagy nehezen fogó kuplung",
          "Nehezen kapcsolható sebességváltó",
          "Rezgés vagy zörgő hang alapjáraton",
          "Szokatlan hang vagy rángás a kuplung működtetésekor",
        ],
      },
    ],
    highlights: [
      "Kuplungrendszer célzott hibafeltárása",
      "Kapcsolódó alkatrészek együttes ellenőrzése",
      "Kettőstömegű lendkerék csere szükség esetén",
    ],
    process: [
      {
        title: "Hibafeltárás",
        description: "A kuplungrendszer és a kettőstömegű lendkerék állapotának, valamint a tünet okának vizsgálata",
      },
      {
        title: "Alkatrészek ellenőrzése",
        description: "A kuplunghoz kapcsolódó elemek és a hajtáslánc érintett részeinek átvizsgálása",
      },
      {
        title: "Csere",
        description: "A kuplung, szükség esetén a kettőstömegű lendkerék és a kapcsolódó alkatrészek cseréje",
      },
      {
        title: "Próbavezetés",
        description: "A csere utáni működés ellenőrzése próbaút közben",
      },
    ],
    faq: [
      {
        question: "Miért kell gyakran együtt cserélni a kuplungot és a kettőstömegű lendkereket?",
        answer:
          "A két alkatrész összekapcsolva működik, elhasználódásuk gyakran együtt jár. Emiatt a hibafeltárás mindkettő állapotát vizsgálja, és ez alapján döntünk arról, mit szükséges cserélni.",
      },
      {
        question: "Honnan tudom, hogy a kuplung vagy a lendkerék hibás?",
        answer:
          "A csúszó kuplung, a nehezen kapcsolható váltó, illetve az alapjáraton jelentkező rezgés vagy zörgés mind arra utalhat, hogy érdemes elvégeztetni egy hibafeltárást.",
      },
      {
        question: "Meg lehet előre mondani, hogy pontosan mit kell cserélni?",
        answer:
          "A hibafeltárás eredménye adja meg, mely alkatrészek érintettek — ez járművenként és a tünetek alapján eltérő lehet.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Kuplung és kettőstömegű lendkerék cseréje szerelés közben",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Hajtáslánc alkatrészeinek ellenőrzése kuplungcsere közben",
      },
    ],
    isActive: true,
    displayOrder: 5,
  },
  {
    slug: "motor-mechanikus-javitasa",
    title: "Motor mechanikus javítása",
    tagline: "Mechanikus motorhibák feltárása és javítása",
    summary:
      "A motor mechanikus hibáinak feltárása és javítása — a tapasztalt tünet pontos beazonosításától a szükséges alkatrészcseréig.",
    body: [
      {
        type: "paragraph",
        text: "A motor mechanikus hibái sokféle formában jelentkezhetnek: szokatlan kopogó vagy csörgő hang, olajszivárgás, egyenetlen járás vagy teljesítménykiesés egyaránt utalhat rá. Ezek hátterében gyakran a motor mozgó alkatrészeinek elhasználódása vagy egy adott elem meghibásodása áll.",
      },
      {
        type: "paragraph",
        text: "A javítás első lépése mindig a hiba pontos beazonosítása: megvizsgáljuk a tünetet, és feltárjuk, mely alkatrész vagy rendszer érintett. Ez alapján határozzuk meg a szükséges javítást és a cserélendő alkatrészeket.",
      },
      {
        type: "list",
        items: [
          "Kopogó vagy csörgő hang a motortérből",
          "Olajszivárgás",
          "Egyenetlen járásmű",
          "Szokatlan füst a kipufogóból",
          "Teljesítménykiesés terhelés alatt",
        ],
      },
    ],
    highlights: [
      "Mechanikus motorhibák célzott feltárása",
      "A tünet és az ok pontos beazonosítása",
      "Szükséges alkatrészcsere elvégzése",
    ],
    process: [
      {
        title: "Hibafeltárás",
        description: "A tapasztalt tünet és a motor állapotának vizsgálata a lehetséges okok beazonosítására",
      },
      {
        title: "Célzott vizsgálat",
        description: "Az érintett motoralkatrészek vagy -rendszerek részletesebb ellenőrzése",
      },
      {
        title: "Javítás",
        description: "A hibás vagy elhasználódott alkatrészek cseréje, javítása",
      },
      {
        title: "Próbavezetés",
        description: "A javítás eredményének ellenőrzése próbaút közben",
      },
    ],
    faq: [
      {
        question: "Milyen jellegű motorhibákkal foglalkoznak?",
        answer:
          "A motor mechanikus, azaz mozgó alkatrészeit érintő hibáival foglalkozunk — a hibafeltárás során derül ki pontosan, milyen munka szükséges egy adott esetben.",
      },
      {
        question: "Mindig egyértelmű, hogy mi okozza a hibát?",
        answer:
          "Nem minden esetben — bizonyos tünetek több okra is visszavezethetők, ezért néha célzott vizsgálatra vagy próbaútra is szükség van a pontos beazonosításhoz.",
      },
      {
        question: "Kockázatos tovább használni az autót ilyen tünetekkel?",
        answer:
          "Ez a hiba jellegétől és súlyosságától függ. Szokatlan hang, olajszivárgás vagy teljesítménykiesés esetén érdemes mielőbb elvégeztetni egy hibafeltárást, hogy elkerülje a probléma súlyosbodását.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Motor mechanikus hibafeltárása szerelés közben",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Motoralkatrészek ellenőrzése javítás közben",
      },
    ],
    isActive: true,
    displayOrder: 6,
  },
  {
    slug: "dizel-uzemanyagrendszer",
    title: "Dízel üzemanyagrendszer diagnosztika/javítás",
    tagline: "Diagnosztika, hibakeresés és javítás",
    summary:
      "A dízel üzemanyagrendszer diagnosztikája és javítása egy helyen — az üzemanyag-ellátási és befecskendezési problémák feltárásától a szükséges alkatrészcseréig.",
    body: [
      {
        type: "paragraph",
        text: "A dízel üzemanyagrendszer pontos működése alapvető a motor teljesítménye és megbízhatósága szempontjából. Az üzemanyag-ellátás vagy a befecskendezés hibája nehézkes indításban, egyenetlen járásban, teljesítménykiesésben vagy megnövekedett fogyasztásban mutatkozhat meg.",
      },
      {
        type: "paragraph",
        text: "A hibakeresés során feltárjuk, hogy az üzemanyag-ellátás vagy a befecskendezéssel kapcsolatos alkatrészek okozzák-e a tapasztalt tünetet, majd a diagnosztika eredménye alapján a szükséges javítást és alkatrészcserét is elvégezzük — nem állunk meg a hiba megállapításánál.",
      },
      {
        type: "list",
        items: [
          "Nehézkes hidegindítás",
          "Egyenetlen járásmű",
          "Teljesítménykiesés terhelés alatt",
          "Megnövekedett üzemanyag-fogyasztás",
          "Füstös kipufogó",
        ],
      },
    ],
    highlights: [
      "Üzemanyag-ellátási problémák feltárása",
      "Diagnosztika és javítás egy helyen",
      "Szükséges alkatrészek cseréje a hiba feltárása után",
    ],
    process: [
      {
        title: "Diagnosztika",
        description: "A dízel üzemanyagrendszer elektronikus és mechanikus vizsgálata a tünet okának feltárására",
      },
      {
        title: "Célzott vizsgálat",
        description: "Az üzemanyag-ellátás és a befecskendezéssel kapcsolatos alkatrészek részletesebb ellenőrzése",
      },
      {
        title: "Javítás és alkatrészcsere",
        description: "A feltárt hiba alapján a szükséges javítások és alkatrészcserék elvégzése",
      },
      {
        title: "Próbavezetés",
        description: "A javítás eredményének ellenőrzése próbaút közben",
      },
    ],
    faq: [
      {
        question: "Milyen tünetek utalnak üzemanyagrendszer-hibára?",
        answer:
          "A nehézkes indítás, az egyenetlen járás, a teljesítménykiesés és a megnövekedett fogyasztás mind utalhat az üzemanyag-ellátás vagy a befecskendezés problémájára.",
      },
      {
        question: "A diagnosztika után Önök el is végzik a javítást?",
        answer:
          "Igen, a diagnosztika eredménye alapján a szükséges javítást és alkatrészcserét is elvégezzük, nem csak a hiba megállapításáig jutunk el.",
      },
      {
        question: "Mennyire sürgős egy ilyen jellegű hiba javítása?",
        answer:
          "Az üzemanyagrendszer hibáit érdemes mielőbb kivizsgáltatni, mivel elhanyagolásuk hosszabb távon további alkatrészek meghibásodásához vezethet.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Dízel üzemanyagrendszer diagnosztikája és javítása",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Üzemanyagrendszer alkatrészeinek vizsgálata és javítása",
      },
    ],
    isActive: true,
    displayOrder: 7,
  },
  {
    slug: "diohejas-tisztitas",
    title: "Dióhéjas tisztítás",
    tagline: "Szívórendszer lerakódásainak eltávolítása",
    summary:
      "A szívórendszer és a szívószelepek lerakódásainak eltávolítása dióhéjas tisztítással, állapotfelmérést követően.",
    body: [
      {
        type: "paragraph",
        text: "A szívórendszerben és a szívószelepeken idővel lerakódás képződhet, ami a motor típusától és üzemmódjától függően befolyásolhatja a levegő áramlását a hengerekbe. A dióhéjas tisztítás egy célzott eljárás ezen lerakódások eltávolítására.",
      },
      {
        type: "paragraph",
        text: "A módszer lényege, hogy apróra őrölt dióhéj-granulátumot juttatunk a szívórendszerbe, amely mechanikusan, a felületek károsítása nélkül távolítja el a lerakódásokat. A tisztítást mindig állapotfelmérés előzi meg, hogy lássuk, valóban ez a megoldás illik-e az adott járműhöz és tünethez.",
      },
      {
        type: "list",
        items: [
          "Egyenetlen alapjárat",
          "Csökkent válaszkészség gázadásra",
          "Ismerten lerakódásra hajlamos motortípus",
          "Rendszeres, döntően rövidtávú városi használat",
        ],
      },
    ],
    highlights: [
      "Célzott lerakódás-eltávolítás a szívórendszerben",
      "Felületkímélő tisztítási eljárás",
      "Állapotfelmérés a tisztítás előtt",
    ],
    process: [
      {
        title: "Állapotfelmérés",
        description:
          "A szívórendszer és a szívószelepek állapotának vizsgálata, annak eldöntése, hogy a dióhéjas tisztítás indokolt-e",
      },
      {
        title: "Előkészítés",
        description: "A szívórendszer hozzáférhetővé tétele a tisztításhoz",
      },
      {
        title: "Dióhéjas tisztítás",
        description: "A lerakódások eltávolítása apróra őrölt dióhéj-granulátum segítségével",
      },
      {
        title: "Visszaszerelés és ellenőrzés",
        description: "Az alkatrészek visszaszerelése, majd a motor működésének ellenőrzése",
      },
    ],
    faq: [
      {
        question: "Mi az a dióhéjas tisztítás?",
        answer:
          "Egy mechanikus tisztítási eljárás, amely során apróra őrölt dióhéj-granulátumot juttatunk a szívórendszerbe, hogy eltávolítsa az ott lerakódott szennyeződéseket, a felületek károsítása nélkül.",
      },
      {
        question: "Minden autónál szükséges ez a tisztítás?",
        answer:
          "Nem feltétlenül — vannak motortípusok és használati módok, amelyeknél gyakrabban képződik lerakódás a szívórendszerben. Az állapotfelmérés dönti el, hogy indokolt-e a tisztítás.",
      },
      {
        question: "Érezhető változás várható a tisztítás után?",
        answer:
          "A lerakódás mennyiségétől és a motor állapotától függően a tisztítás javíthatja az alapjárat egyenletességét és a motor válaszkészségét, de a pontos hatás járművenként eltérő lehet.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Szívórendszer dióhéjas tisztítása közben",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Szívórendszer állapotfelmérése tisztítás előtt",
      },
    ],
    isActive: true,
    displayOrder: 8,
  },
  {
    slug: "klimarendszer-javitas",
    title: "Klímarendszer javítás",
    tagline: "Hibafeltárás és javítás",
    summary:
      "A klímarendszer működésének ellenőrzése, szivárgásvizsgálat és a szükséges javítások elvégzése, hogy a hűtés ismét megfelelően működjön.",
    body: [
      {
        type: "paragraph",
        text: "A klímarendszer teljesítménye idővel csökkenhet, ennek leggyakoribb oka egy apró szivárgás, a kompresszor vagy egy kapcsolódó alkatrész meghibásodása. A gyenge hűtés, a szokatlan hang vagy a klíma bekapcsolásakor tapasztalt probléma mind jelezheti, hogy a rendszert érdemes átvizsgáltatni.",
      },
      {
        type: "paragraph",
        text: "A hibafeltárás során ellenőrizzük a rendszer működését, megvizsgáljuk, van-e szivárgás, és átnézzük a kompresszort és a kapcsolódó alkatrészeket. Az eredmény alapján elvégezzük a szükséges javítást.",
      },
      {
        type: "list",
        items: [
          "Gyenge vagy egyáltalán nem hűtő klíma",
          "Szokatlan hang a klíma működése közben",
          "Kellemetlen szag a szellőzésből",
          "A klímakompresszor nem kapcsol be",
        ],
      },
    ],
    highlights: [
      "Klímarendszer célzott hibafeltárása",
      "Szivárgásvizsgálat",
      "Kompresszor és kapcsolódó alkatrészek ellenőrzése",
    ],
    process: [
      {
        title: "Működés ellenőrzése",
        description: "A klímarendszer alapvető működésének és teljesítményének vizsgálata",
      },
      {
        title: "Szivárgásvizsgálat",
        description: "A rendszer átvizsgálása esetleges szivárgás után kutatva",
      },
      {
        title: "Kompresszor és alkatrészek ellenőrzése",
        description: "A klímakompresszor és a kapcsolódó elemek állapotának felmérése",
      },
      {
        title: "Javítás",
        description: "A feltárt hiba alapján a szükséges javítás elvégzése",
      },
    ],
    faq: [
      {
        question: "Miért gyengül a klíma hűtése idővel?",
        answer:
          "Leggyakrabban egy apró szivárgás vagy egy alkatrész, például a kompresszor fokozatos elhasználódása áll a háttérben. A hibafeltárás pontosítja, mi okozza a problémát a konkrét esetben.",
      },
      {
        question: "Honnan tudom, hogy szivárog a klímarendszerem?",
        answer:
          "A leggyakoribb jelek a fokozatosan gyengülő hűtés, illetve ha a klíma egy idő után egyáltalán nem hűt. Ilyen esetben érdemes szivárgásvizsgálatot kérni.",
      },
      {
        question: "Ha csak feltöltésre van szükség, azt is el lehet végeztetni?",
        answer:
          "Igen, de érdemes előtte szivárgásvizsgálatot is kérni, mert a feltöltés önmagában nem old meg egy esetleges szivárgásból eredő problémát.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Klímarendszer hibafeltárása és ellenőrzése",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Klímakompresszor vizsgálata szerelés közben",
      },
    ],
    isActive: true,
    displayOrder: 9,
  },
  {
    slug: "gepi-atmosasos-automata-valtoolajcsere",
    title: "Gépi, átmosásos automata váltóolajcsere",
    tagline: "Prémium márkájú automata sebességváltókhoz",
    summary:
      "Teljes, gépi és átmosásos automata váltóolajcsere elsősorban prémium márkájú (például Mercedes-Benz, BMW, Audi, Volkswagen, Porsche) gépjárművekhez — a fáradt olaj és a szennyeződések eltávolítása a teljes rendszerből, gyártói előírás szerinti hőmérsékleten, szükség esetén váltóadaptációval és záróellenőrzéssel.",
    body: [
      {
        type: "paragraph",
        text: "Az automata sebességváltó a kapcsolásokat hidraulikus nyomáson és a váltóolaj kenőképességén keresztül vezérli. Az idővel elhasználódó, szennyeződésekkel terhelt olaj rontja a hidraulikus vezérlés pontosságát, ami a kapcsolási minőség romlásában és a váltó fokozott terhelésében mutatkozhat meg.",
      },
      {
        type: "paragraph",
        text: "A gépi, átmosásos váltóolajcsere lényege, hogy a hagyományos leeresztéses cserével szemben — ahol az olaj egy része szinte mindig a nyomatékváltóban és a csatornákban marad — egy erre alkalmas berendezés az egész rendszeren átáramoltatja az új olajat. Így a fáradt olaj és a benne lévő szennyeződések nagyobb arányban távoznak a rendszerből.",
      },
      {
        type: "paragraph",
        text: "A folyamatot a gyártó előírásának megfelelő üzemi hőmérsékleten végezzük, mivel a váltóolaj viselkedése — és ezáltal a csere pontossága — hőmérsékletfüggő. Az olajtípusra, mennyiségre és eljárásra vonatkozó gyártói előírások jármű- és váltótípusonként eltérnek, ezért ezeket minden esetben az adott típushoz igazítjuk. A csere után, ahol ez indokolt vagy elvégezhető, váltóadaptációt és hibakód-ellenőrzést is végzünk, hogy a rendszer a csere után is megfelelően működjön.",
      },
      {
        type: "paragraph",
        text: "A referenciaanyagunk szerint az automata váltóolaj cseréje jellemzően 60 000–80 000 km körül javasolt, fokozott igénybevétel — például sportos használat, vontatás vagy jelentős városi közlekedés — esetén pedig 40 000–60 000 km körülire csökkenhet ez az intervallum. Ezek általános tájékoztató értékek: a tényleges csereintervallumot mindig a jármű típusa, a sebességváltó fajtája, a gyártói előírás és a használati mód határozza meg.",
      },
      {
        type: "list",
        items: [
          "Esedékes vagy közelgő váltóolajcsere a gyártói előírás szerint",
          "Rendszertelen vagy döccenős kapcsolás",
          "Fokozott igénybevétel — sportos vezetés, vontatás, sok városi használat",
          "Bizonytalanság a váltó állapotával kapcsolatban",
        ],
      },
    ],
    highlights: [
      "Teljes rendszeren átáramoltatott, gépi olajcsere",
      "A fáradt olaj és a szennyeződések nagyobb arányú eltávolítása",
      "Gyártói előírás szerinti hőmérsékleten végzett csere",
      "Szükség esetén váltóadaptáció és hibakód-ellenőrzés",
    ],
    process: [
      {
        title: "Állapotfelmérés",
        description:
          "A sebességváltó és a jelenlegi váltóolaj állapotának, valamint az adott jármű- és váltótípusnál alkalmazandó gyártói előírásnak a felmérése",
      },
      {
        title: "Csatlakoztatás és előmelegítés",
        description:
          "A jármű csatlakoztatása az olajcserélő berendezéshez, majd a rendszer a gyártó által előírt üzemi hőmérsékletre hozása",
      },
      {
        title: "Gépi, átmosásos olajcsere",
        description:
          "A fáradt olaj és a benne lévő szennyeződések kontrollált lecserélése az új olajra a teljes rendszeren keresztül",
      },
      {
        title: "Ellenőrzés és adaptáció",
        description: "A csere utáni működés és a hibakódok ellenőrzése, szükség esetén a váltóadaptáció elvégzése",
      },
    ],
    faq: [
      {
        question: "Mikor érdemes automata váltóolajat cserélni?",
        answer:
          "Az általános tájékoztatás szerint ez jellemzően 60 000–80 000 km körül esedékes, fokozott igénybevétel — például sportos használat, vontatás vagy sok városi közlekedés — esetén pedig már 40 000–60 000 km körül indokolt lehet. A pontos intervallum mindig a jármű és a váltó típusától, valamint a gyártói előírástól függ.",
      },
      {
        question: "Mi a különbség a hagyományos és a gépi, átmosásos csere között?",
        answer:
          "Hagyományos leeresztéses cserénél az olaj egy része a nyomatékváltóban és a csatornákban marad, míg a gépi, átmosásos eljárás az egész rendszeren átáramoltatja az új olajat, így a régi olajat és a szennyeződéseket nagyobb arányban távolítja el.",
      },
      {
        question: "Minden automata váltónál ugyanaz az olajcsere-periódus?",
        answer:
          "Nem — a csereintervallum jármű- és váltótípusonként, valamint a használati módtól függően is eltérő lehet. A gyártói előírás mindig irányadó, ezért ezt minden esetben figyelembe vesszük.",
      },
      {
        question: "Szükség van-e váltóadaptációra az olajcsere után?",
        answer:
          "Ez a jármű és a váltó típusától függ — ahol ez indokolt vagy elvégezhető, a csere részeként váltóadaptációt és a rendszer működésének ellenőrzését is elvégezzük.",
      },
    ],
    heroImage: {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Automata sebességváltó gépi, átmosásos olajcseréje prémium márkájú gépjárművön",
    },
    gallery: [
      {
        url: "/placeholders/photo-placeholder.svg",
        alt: "Váltóolajcserélő berendezés csatlakoztatva egy automata sebességváltóhoz",
      },
    ],
    isActive: true,
    displayOrder: 10,
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
