import type { Metadata } from "next";
import { AccentHeading } from "@/components/accent-heading";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import { buildPageMetadata } from "@/lib/seo";
import { getPageCopy } from "@/lib/sanity/queries/page-copy";
import { ContactForm } from "./_components/contact-form";
import { ContactInfo } from "./_components/contact-info";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getPageCopy("contactPage");
  return buildPageMetadata({ title: meta.title, description: meta.description, path: "/kapcsolat" });
}

export default async function ContactPage() {
  const { header } = await getPageCopy("contactPage");

  return (
    <section className="bg-background pt-40 pb-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-5 lg:items-center">
          <div className="space-y-10 lg:col-span-2">
            <div>
              <SectionLabel>{header.label}</SectionLabel>
              <h1 className="font-heading text-5xl font-black text-foreground md:text-6xl">
                <AccentHeading value={header.title} />
              </h1>
              <GoldDivider className="mt-4" />
              <p className="mt-6 text-sm leading-relaxed text-foreground/45">{header.intro}</p>
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
