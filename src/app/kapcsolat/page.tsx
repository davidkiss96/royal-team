import type { Metadata } from "next";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import { buildPageMetadata } from "@/lib/seo";
import { ContactForm } from "./_components/contact-form";
import { ContactInfo } from "./_components/contact-info";

export const metadata: Metadata = buildPageMetadata({
  title: "Kapcsolat — Royal-Team Autószerviz",
  description:
    "Lépjen kapcsolatba a Royal-Team Autószerviz csapatával — telefon, e-mail, cím és kapcsolatfelvételi űrlap.",
  path: "/kapcsolat",
});

export default function ContactPage() {
  return (
    <section className="bg-background pt-40 pb-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-5 lg:items-center">
          <div className="space-y-10 lg:col-span-2">
            <div>
              <SectionLabel>Lépjen kapcsolatba velünk</SectionLabel>
              <h1 className="font-heading text-5xl font-black text-foreground md:text-6xl">
                Kapcsolat
              </h1>
              <GoldDivider className="mt-4" />
              <p className="mt-6 text-sm leading-relaxed text-foreground/45">
                Kérdése van, vagy árajánlatot kérne? Keressen minket telefonon,
                e-mailben, vagy töltse ki az alábbi űrlapot — hamarosan
                jelentkezünk.
              </p>
            </div>

            <ContactInfo />
          </div>

          <div className="border border-gold/12 bg-card p-8 lg:col-span-3 lg:p-10">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
