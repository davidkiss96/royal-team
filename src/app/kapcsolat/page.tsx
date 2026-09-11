import type { Metadata } from "next";
import { Container } from "@/components/container";
import { buildPageMetadata } from "@/lib/seo";
import { ContactForm } from "./_components/contact-form";
import { ContactHero } from "./_components/contact-hero";
import { ContactInfo } from "./_components/contact-info";

export const metadata: Metadata = buildPageMetadata({
  title: "Kapcsolat — Royal-Team Autószerviz",
  description:
    "Lépjen kapcsolatba a Royal-Team Autószerviz csapatával — telefon, e-mail, cím és kapcsolatfelvételi űrlap.",
  path: "/kapcsolat",
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <section className="bg-background pb-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-5">
            <ContactInfo />

            <div className="border border-gold/12 bg-card p-8 lg:col-span-3 lg:p-10">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
