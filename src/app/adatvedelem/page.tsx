import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import { BUSINESS_SETTINGS, formatAddress } from "@/lib/mock/business-settings";

export const metadata: Metadata = {
  title: "Adatvédelmi tájékoztató — Royal-Team Autószerviz",
  description:
    "A Royal-Team Autószerviz Kft. adatvédelmi tájékoztatója a weboldal és a kapcsolatfelvételi űrlap adatkezeléséről.",
};

const EFFECTIVE_DATE = "2026. szeptember 8.";

interface PolicySection {
  id: string;
  title: string;
  body: ReactNode;
}

const SECTIONS: PolicySection[] = [
  {
    id: "adatkezelo",
    title: "1. Adatkezelő",
    body: (
      <p>
        A jelen tájékoztatóban leírt adatkezelést a{" "}
        <strong className="text-foreground/80">{BUSINESS_SETTINGS.legalCompanyName}</strong>{" "}
        (a továbbiakban: „Adatkezelő&rdquo; vagy „Royal-Team&rdquo;) végzi, mint a
        royalteamszerviz.hu weboldal (a továbbiakban: „Weboldal&rdquo;) üzemeltetője.
      </p>
    ),
  },
  {
    id: "hivatalos-adatok",
    title: "2. Az adatkezelő hivatalos adatai",
    body: (
      <ul className="space-y-1.5">
        <li>Cégnév: {BUSINESS_SETTINGS.legalCompanyName}</li>
        <li>Székhely: {formatAddress(BUSINESS_SETTINGS.registeredOffice)}, Magyarország</li>
        <li>Telephely / szolgáltatás helye: {formatAddress(BUSINESS_SETTINGS.address)}, Magyarország</li>
        <li>Cégjegyzékszám: {BUSINESS_SETTINGS.legalRegistrationNumber}</li>
        <li>Adószám: {BUSINESS_SETTINGS.legalTaxNumber}</li>
        <li>Ügyvezető: {BUSINESS_SETTINGS.managingDirector}</li>
        <li>E-mail: {BUSINESS_SETTINGS.email}</li>
        <li>Telefon: {BUSINESS_SETTINGS.phone}</li>
        <li>Weboldal: {BUSINESS_SETTINGS.website}</li>
      </ul>
    ),
  },
  {
    id: "urlap",
    title: "3. Kapcsolatfelvételi űrlap",
    body: (
      <p>
        A Weboldal Kapcsolat oldalán elérhető kapcsolatfelvételi űrlap teszi
        lehetővé, hogy látogatóink üzenetet küldjenek az Adatkezelőnek. Az
        űrlap kitöltése és elküldése önkéntes. Az űrlapon keresztül beküldött
        üzenet e-mailben kerül továbbításra az Adatkezelő e-mail címére — az
        üzenetet a Weboldalt üzemeltető alkalmazás nem tárolja saját
        adatbázisban.
      </p>
    ),
  },
  {
    id: "kezelt-adatok",
    title: "4. Kezelt személyes adatok",
    body: (
      <>
        <p className="mb-3">A kapcsolatfelvételi űrlapon keresztül az alábbi adatokat kezeljük:</p>
        <ul className="space-y-1.5">
          <li>Név (kötelező)</li>
          <li>E-mail cím (kötelező)</li>
          <li>Telefonszám (opcionális)</li>
          <li>Az üzenet szövege (kötelező)</li>
        </ul>
        <p className="mt-3">
          Ezeken túl más személyes adatot a kapcsolatfelvételi űrlap nem
          kér és nem gyűjt (nincs hírlevél-feliratkozás, nincs
          marketing-hozzájárulás, nincs „honnan hallott rólunk&rdquo; mező).
        </p>
      </>
    ),
  },
  {
    id: "cel",
    title: "5. Az adatkezelés célja",
    body: (
      <>
        <p className="mb-3">A megadott adatokat kizárólag az alábbi célokra használjuk fel:</p>
        <ul className="space-y-1.5">
          <li>az érdeklődő megkeresésének megválaszolása,</li>
          <li>szervizzel kapcsolatos kérdések megválaszolása,</li>
          <li>árajánlat elkészítése és megküldése,</li>
          <li>egy esetleges szervizmegbízás előkészítése.</li>
        </ul>
      </>
    ),
  },
  {
    id: "jogalap",
    title: "6. Az adatkezelés jogalapja",
    body: (
      <p>
        Az adatkezelés jogalapja az Európai Parlament és a Tanács (EU)
        2016/679 rendelete (a továbbiakban: „GDPR&rdquo;) 6. cikk (1)
        bekezdés b) pontja: az adatkezelés az érintett kérésére történő
        szerződéskötést megelőző lépések megtételéhez szükséges (pl. az
        érdeklődés vagy árajánlatkérés megválaszolása, egy esetleges
        szervizmegbízás előkészítése). Az adatkezelés jogalapja{" "}
        <strong className="text-foreground/80">nem az Ön hozzájárulása</strong> — a
        Kapcsolat oldal jelölőnégyzete nem hozzájárulási nyilatkozat, hanem
        annak megerősítése, hogy Ön elolvasta és tudomásul vette a jelen
        tájékoztatót.
      </p>
    ),
  },
  {
    id: "adattovabbitas",
    title: "7. Adattovábbítás / adatfeldolgozók",
    body: (
      <>
        <p className="mb-3">
          Az Ön adatait harmadik félnek nem adjuk el és nem adjuk át
          marketingcélra. Az üzenet kézbesítéséhez és a Weboldal
          üzemeltetéséhez az alábbi, az Adatkezelő nevében eljáró
          adatfeldolgozókat vesszük igénybe:
        </p>
        <ul className="space-y-1.5">
          <li>
            <strong className="text-foreground/80">Cloudflare, Inc.</strong> —
            hosting- és infrastruktúra-szolgáltató (8. pont),
          </li>
          <li>
            <strong className="text-foreground/80">Resend</strong> — tranzakciós
            e-mail-küldő szolgáltató (9. pont),
          </li>
          <li>
            <strong className="text-foreground/80">Google Workspace</strong> — az
            Adatkezelő üzleti postafiókjának szolgáltatója (10. pont).
          </li>
        </ul>
        <p className="mt-3">
          A Sanity nevű tartalomkezelő rendszert az Adatkezelő kizárólag a
          Weboldal tartalmának (pl. szolgáltatásleírások, blogbejegyzések)
          kezelésére használja — a kapcsolatfelvételi űrlap adatait a Sanity
          nem kapja meg és nem tárolja (11. pont).
        </p>
        <p className="mt-3">
          Az igénybe vett szolgáltatók egy része az Európai Gazdasági
          Térségen (EGT) kívül is kezelhet adatokat. Ilyen esetben az
          adattovábbítás a GDPR előírásainak megfelelő, megfelelő garanciák
          biztosítása mellett történik.
        </p>
      </>
    ),
  },
  {
    id: "cloudflare",
    title: "8. Cloudflare — hosting- és infrastruktúra-szolgáltató",
    body: (
      <p>
        A Weboldal üzemeltetéséhez és kiszolgálásához a Cloudflare, Inc.
        hosting- és infrastruktúra-szolgáltatásait vesszük igénybe. Ennek
        keretében a Weboldal meglátogatásakor technikai jellegű
        kérésadatok (pl. IP-cím, a kérés időpontja, user-agent /
        böngészőazonosító) kezelésre kerülhetnek, amennyiben az a Weboldal
        biztonságos és megbízható működtetéséhez szükséges. A Cloudflare
        ebben a folyamatban az Adatkezelő adatfeldolgozójaként jár el.
      </p>
    ),
  },
  {
    id: "resend",
    title: "9. Resend e-mail-kézbesítés",
    body: (
      <p>
        A kapcsolatfelvételi űrlapon beküldött üzenetet a Weboldal a Resend
        nevű tranzakciós e-mail-küldő szolgáltatáson keresztül továbbítja az
        Adatkezelő e-mail címére. A Resend ennek során az üzenet
        továbbításához szükséges adatokat (az űrlapon megadott
        név/e-mail/telefon/üzenet) dolgozza fel, kizárólag a kézbesítés
        céljából, az Adatkezelő adatfeldolgozójaként.
      </p>
    ),
  },
  {
    id: "google-workspace",
    title: "10. Google Workspace postafiók",
    body: (
      <p>
        A kapcsolatfelvételi űrlapról érkező e-maileket az Adatkezelő a
        Google Workspace szolgáltatás keretében üzemeltetett üzleti
        postafiókjában ({BUSINESS_SETTINGS.email}) fogadja és tárolja. Az
        e-mail — mint az adatkezelés tárgyát képező üzenet — ebben a
        postafiókban marad meg mindaddig, amíg a 13. pontban leírt
        megőrzési idő szerint indokolt.
      </p>
    ),
  },
  {
    id: "sanity",
    title: "11. Sanity CMS szerepe",
    body: (
      <p>
        A Weboldal tartalmát (pl. szolgáltatások, blogbejegyzések, projektek,
        vélemények, üzleti adatok) a Sanity nevű tartalomkezelő rendszeren
        (CMS) keresztül szerkesztjük. A Sanity kizárólag a Weboldal
        megjelenő tartalmának kezelésére szolgál —{" "}
        <strong className="text-foreground/80">
          a kapcsolatfelvételi űrlap adatait a Sanity nem kapja meg és nem
          tárolja
        </strong>
        , az elkülönül a kapcsolatfelvételi adatkezeléstől.
      </p>
    ),
  },
  {
    id: "google-maps",
    title: "12. Google Maps (kattintásra betöltődő térkép)",
    body: (
      <p>
        A Kapcsolat oldalon található térkép alapértelmezetten{" "}
        <strong className="text-foreground/80">nem töltődik be automatikusan</strong>{" "}
        — helyette egy statikus, tájékoztató jellegű előnézet jelenik meg. A
        Google Maps beágyazás (iframe) kizárólag akkor töltődik be, ha Ön
        erre kifejezetten rákattint a „Térkép betöltése&rdquo; gombra. A
        térkép betöltése után az Ön böngészője közvetlenül kapcsolatba lép a
        Google szervereivel, amely ennek keretében technikai jellegű adatokat
        (pl. az Ön IP-címét) kezelhet a saját adatkezelési gyakorlata
        szerint — erről bővebben a Google saját adatvédelmi tájékoztatója
        nyújt információt. A beágyazott térkép mellett egy „Megnyitás Google
        Térképen&rdquo; feliratú külső hivatkozás is elérhető, amellyel a
        címet a Weboldaltól függetlenül, közvetlenül a Google Maps oldalán
        is megtekintheti.
      </p>
    ),
  },
  {
    id: "megorzes",
    title: "13. Adatmegőrzési idő",
    body: (
      <p>
        A kapcsolatfelvételi űrlapon keresztül megadott adatokat a
        megkeresés megválaszolásához, illetve a kért szolgáltatás vagy
        árajánlat előkészítéséhez szükséges ideig kezeljük. Az ezzel
        kapcsolatos e-maileket az utolsó kapcsolatfelvételtől számított{" "}
        <strong className="text-foreground/80">legfeljebb 1 évig</strong> őrizzük
        meg, kivéve, ha jogszabályi kötelezettség vagy jogos jogi igény
        érvényesítése ennél hosszabb megőrzést tesz szükségessé. A
        megőrzési idő lejártával az adatokat töröljük, illetve a további
        adatkezelést megszüntetjük.
      </p>
    ),
  },
  {
    id: "erintetti-jogok",
    title: "14. Érintetti jogok",
    body: (
      <>
        <p className="mb-3">A GDPR alapján Önt az alábbi jogok illetik meg a kezelt adatai tekintetében:</p>
        <ul className="space-y-1.5">
          <li>hozzáférés (tájékoztatás kérése a kezelt adatokról),</li>
          <li>helyesbítés (pontatlan adat kijavítása),</li>
          <li>törlés,</li>
          <li>az adatkezelés korlátozása,</li>
          <li>adathordozhatóság,</li>
          <li>tiltakozás az adatkezelés ellen.</li>
        </ul>
        <p className="mt-3">
          Kérelmét a {BUSINESS_SETTINGS.email} e-mail címre küldheti. Az
          Adatkezelő az érintetti kérelmeket indokolatlan késedelem nélkül,
          de főszabály szerint a kérelem beérkezésétől számított egy hónapon
          belül kezeli és tájékoztatja az érintettet a megtett
          intézkedésekről. Szükség esetén — a kérelem összetettségét és a
          kérelmek számát figyelembe véve — a határidő további két hónappal
          meghosszabbítható; erről az Adatkezelő az első hónapon belül
          tájékoztatja az érintettet.
        </p>
      </>
    ),
  },
  {
    id: "panasz",
    title: "15. Panasz benyújtása / NAIH",
    body: (
      <p>
        Amennyiben úgy ítéli meg, hogy adatai kezelése sérti a GDPR-t vagy a
        vonatkozó magyar jogszabályokat, panasszal fordulhat a Nemzeti
        Adatvédelmi és Információszabadság Hatósághoz (NAIH): 1055 Budapest,
        Falk Miksa utca 9–11.; postacím: 1363 Budapest, Pf. 9.; e-mail:
        ugyfelszolgalat@naih.hu; telefon: +36 1 391 1400;
        weboldal: naih.hu. Panaszt a lakóhelye vagy tartózkodási helye
        szerint illetékes törvényszéknél is előterjeszthet.
      </p>
    ),
  },
  {
    id: "cookiek",
    title: "16. Cookie-k és hasonló technológiák",
    body: (
      <>
        <p className="mb-3">
          A Weboldal jelenleg <strong className="text-foreground/80">nem használ</strong>{" "}
          látogatói cookie-kat, és nem alkalmaz analitikai vagy marketing
          célú nyomkövetést. Nem használunk Google Analytics-et, Google Tag
          Manager-t, Meta Pixelt, sem más statisztikai vagy hirdetési célú
          eszközt, és a látogatók böngészőjében nem tárolunk adatot
          (localStorage/sessionStorage) nyomkövetési célból.
        </p>
        <p>
          Egyetlen kivétel a 12. pontban leírt, kattintásra betöltődő Google
          Maps beágyazás: ha Ön kifejezetten rákattint a térkép betöltésére,
          a Google — saját szolgáltatásának részeként — cookie-kat vagy
          hasonló technológiákat helyezhet el az Ön böngészőjében. Ez a
          Weboldal saját cookie-kezelése helyett a Google saját
          adatkezelési gyakorlatának a része, és csak az Ön kifejezett
          kattintása után történik meg.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-background pt-40 pb-16">
        <Container>
          <SectionLabel>GDPR megfelelőség</SectionLabel>
          <h1 className="font-heading text-5xl font-black text-foreground md:text-6xl">
            Adatvédelmi <span className="text-gold">tájékoztató</span>
          </h1>
          <GoldDivider className="mt-4" />
          <p className="mt-5 text-sm text-foreground/35">Hatályos: {EFFECTIVE_DATE}-től</p>
        </Container>
      </section>

      <section className="bg-background pb-24">
        <Container className="max-w-3xl space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.id} className="border-l-2 border-gold/20 py-2 pl-6">
              <h2 className="mb-3 font-heading text-base font-black text-foreground">
                {section.title}
              </h2>
              <div className="text-sm leading-relaxed text-foreground/55">{section.body}</div>
            </div>
          ))}

          <div className="mt-10 flex flex-col gap-4 border-t border-gold/10 pt-6 sm:flex-row">
            <a
              href="/kapcsolat"
              className="inline-flex items-center justify-center border border-gold/50 px-8 py-3.5 font-heading text-xs font-bold tracking-[0.2em] text-gold uppercase transition-all duration-300 hover:border-gold hover:bg-gold/8"
            >
              Kapcsolatfelvétel →
            </a>
            <a
              href="/impresszum"
              className="text-xs text-foreground/30 transition-colors hover:text-foreground/60"
            >
              Impresszum megtekintése
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
