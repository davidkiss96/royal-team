import { toPlainText } from "@portabletext/react";
import { Container } from "@/components/container";
import { PortableTextContent } from "@/components/portable-text";
import { SectionLabel } from "@/components/section-label";
import { getAboutPage } from "@/lib/sanity/queries/about-page";
import { splitOwnerStory } from "./owner-story-content";

/**
 * The closing "Pontosan tudjuk, mit és miért kell megjavítani" beat of
 * `ownerStory`, promoted from an inline `h2` in the middle of the text
 * column to its own large editorial statement section.
 *
 * The bold closing line ("Pontos diagnosztika. Szakszerű javítás.
 * Folyamatos fejlődés.") is not new copy — it's `AboutPage.philosophyValues`
 * `title`s (the same three values `PhilosophySection` renders as cards
 * further down the page) joined into one line, since that exact phrase
 * doesn't appear verbatim anywhere in `ownerStory` itself.
 */
export async function ClosingStatementSection() {
  const { ownerStory, philosophyValues } = await getAboutPage();
  const { closing, extra } = splitOwnerStory(ownerStory);
  if (!closing) return null;

  const heading = toPlainText(closing.heading);
  const closingLine =
    philosophyValues.length > 0 ? `${philosophyValues.map((value) => value.title).join(". ")}.` : null;

  console.log(closingLine);

  return (
    <section className="border-t border-gold/8 bg-background py-24">
      <Container className="text-center">
        <div className="mx-auto max-w-3xl">
          <SectionLabel>A filozófiánk</SectionLabel>
          <h2 className="mt-4 mb-8 font-heading text-3xl font-black text-foreground md:text-4xl">{heading}</h2>
          <div className="space-y-4 text-sm leading-relaxed text-foreground/55">
            <PortableTextContent value={closing.body} />
          </div>

          {extra.length > 0 && (
            <div className="mt-8 space-y-4 text-left text-sm leading-relaxed text-foreground/55">
              <PortableTextContent value={extra} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
