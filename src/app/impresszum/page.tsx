import type { Metadata } from "next";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import { BUSINESS_SETTINGS, formatAddress } from "@/lib/mock/business-settings";

export const metadata: Metadata = {
  title: "Impresszum — Royal-Team Autószerviz",
  description: "A Royal-Team Autószerviz Kft. törvény által előírt impresszuma.",
};

const FACT_SECTIONS: { title: string; items: [string, string][] }[] = [
  {
    title: "Szolgáltató adatai",
    items: [
      ["Cégnév", BUSINESS_SETTINGS.legalCompanyName],
      ["Székhely", `${formatAddress(BUSINESS_SETTINGS.registeredOffice)}, Magyarország`],
      ["Cégjegyzékszám", BUSINESS_SETTINGS.legalRegistrationNumber],
      ["Adószám", BUSINESS_SETTINGS.legalTaxNumber],
      ["Ügyvezető", BUSINESS_SETTINGS.managingDirector],
    ],
  },
  {
    title: "Telephely / szolgáltatás helye",
    items: [
      ["Műhely címe", `${formatAddress(BUSINESS_SETTINGS.address)}, Magyarország`],
    ],
  },
  {
    title: "Elérhetőség",
    items: [
      ["Telefon", BUSINESS_SETTINGS.phone],
      ["E-mail", BUSINESS_SETTINGS.email],
      ["Weboldal", BUSINESS_SETTINGS.website],
    ],
  },
  {
    title: "Tárhely- és infrastruktúra-szolgáltató",
    items: [
      ["Szolgáltató neve", "Cloudflare, Inc."],
      ["Cím", "101 Townsend St, San Francisco, CA 94107, Egyesült Államok"],
      ["Weboldal", "www.cloudflare.com"],
    ],
  },
  {
    title: "Szerzői jogok",
    items: [
      ["Copyright", `© ${new Date().getFullYear()} ${BUSINESS_SETTINGS.legalCompanyName}`],
      [
        "Tartalom",
        "Minden jog fenntartva. A weboldalon szereplő tartalmak, képek és grafikák szerzői jogi védelem alatt állnak, azok a Royal-Team Autószerviz Kft. előzetes írásbeli engedélye nélkül nem használhatók fel.",
      ],
    ],
  },
];

export default function ImpresszumPage() {
  return (
    <>
      <section className="bg-background pt-40 pb-16">
        <Container>
          <SectionLabel>Jogi információk</SectionLabel>
          <h1 className="font-heading text-5xl font-black text-foreground md:text-6xl">
            Impresszum
          </h1>
          <GoldDivider className="mt-4" />
        </Container>
      </section>

      <section className="bg-background pb-24">
        <Container className="max-w-3xl space-y-10">
          {FACT_SECTIONS.map((section) => (
            <div key={section.title} className="border border-gold/10 p-6 lg:p-8">
              <h2 className="mb-5 border-b border-gold/10 pb-4 font-heading text-lg font-black text-gold">
                {section.title}
              </h2>
              <dl className="space-y-3">
                {section.items.map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-4">
                    <dt className="col-span-1 text-xs text-foreground/30">{key}</dt>
                    <dd className="col-span-2 text-xs text-foreground/75">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
