import type { BodyBlock, ImageWithAlt, SeoFields } from "@/lib/types";

/**
 * Mock data shaped to match the approved `AboutPage` singleton
 * (docs/content-model.md Section 9).
 *
 * `photoGallery[0]` doubles as the owner-story section's companion image,
 * with the remaining entries rendered in the workshop photo grid below —
 * the same "reuse gallery's first entry for a secondary section image"
 * pattern already established for `Service`/`Project` (their `gallery[0]`
 * fallback), not a new field. This also avoids the reference prototype's
 * own repeated-stock-photo artifact (its owner-story and grid images are
 * literally the same two Unsplash photos reused across three slots) — each
 * mock photo here appears exactly once.
 *
 * The hero's `heroSubheadline` field exists on the schema but isn't
 * populated — the approved Figma hero for this page shows no subheadline
 * text, so leaving it unset (rather than inventing copy) matches the
 * design exactly while keeping the optional field genuinely optional.
 *
 * The owner-story section heading ("Szenvedély a motorok iránt.") and the
 * philosophy/stats/gallery section headings are static template copy, not
 * modeled fields — consistent with every other page's closing/section
 * headings in this project (Services, Projects, Price List), none of which
 * are Sanity-driven either.
 */
export type PhilosophyIconKey = "precision" | "reliability" | "growth";

export interface AboutPageContent {
  heroHeadlineLines: string[];
  heroSubheadline?: string;
  heroImage: ImageWithAlt;
  ownerStory: BodyBlock[];
  philosophyValues: { icon: PhilosophyIconKey; title: string; description: string }[];
  stats: { label: string; value: string }[];
  photoGallery: ImageWithAlt[];
  cta: { label: string; url: string };
  seo: SeoFields;
}

export const ABOUT_PAGE_CONTENT: AboutPageContent = {
  heroHeadlineLines: ["Prémium szerviz.", "Szenvedéllyel."],
  heroImage: {
    url: "/placeholders/photo-placeholder.svg",
    alt: "Royal-Team szerviz csapata munka közben",
  },
  ownerStory: [
    {
      type: "paragraph",
      text: "A Royal-Team Autószerviz az autós szenvedélyből nőtte ki magát. Az alapítás mögött egyszerű elv áll: olyan szervizet teremteni, amelyik az autótulajdonosokat ugyanolyan igényességgel kezeli, mint saját autóját a tulajdonosa.",
    },
    {
      type: "paragraph",
      text: "15 évnyi tapasztalattal és folyamatos szakmai fejlődéssel ma Ercsi egyik legelismertebb teljesítmény-orientált autószervizét üzemeltetjük. Különös szakértelmünk van Mercedes-AMG, BMW M és más nagysebességű modelleknél.",
    },
    {
      type: "paragraph",
      text: "Nem gondolkodunk átlagosan. Minden munkánkba beleviszük azt az igényességet, amit egy igazi autórajongó elvárna.",
    },
  ],
  philosophyValues: [
    {
      icon: "precision",
      title: "Precizitás",
      description:
        'Minden egyes csavar egy döntés. Nem fogadjuk el a "jó elég" megoldást. Csak a tökéletes.',
    },
    {
      icon: "reliability",
      title: "Megbízhatóság",
      description:
        "Amit megígérünk, azt teljesítjük. Határidőre, garanciával, rejtett költségek nélkül.",
    },
    {
      icon: "growth",
      title: "Folyamatos fejlődés",
      description:
        "A technológia fejlődik. Mi is. Folyamatos képzéssel és beruházással mindig az élen.",
    },
  ],
  stats: [
    { label: "Év tapasztalat", value: "15+" },
    { label: "Elvégzett szerviz", value: "3000+" },
    { label: "Google értékelés", value: "4.9★" },
    { label: "Garancia", value: "100%" },
  ],
  photoGallery: [
    {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Royal-Team szerviz műhely belülről",
    },
    {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Diagnosztikai munkaállomás a műhelyben",
    },
    {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Emelőn álló gépjármű karbantartás közben",
    },
    {
      url: "/placeholders/photo-placeholder.svg",
      alt: "Precíziós szerszámok a szerelőállomáson",
    },
  ],
  cta: {
    label: "Kapcsolatfelvétel →",
    url: "/kapcsolat",
  },
  seo: {
    metaTitle: "Rólunk — Royal-Team Autószerviz",
    metaDescription:
      "Ismerje meg a Royal-Team Autószervizt — 15 év tapasztalat, teljesítmény-orientált szemlélet és igényesség minden munkában.",
  },
};
