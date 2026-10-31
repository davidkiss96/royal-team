import { toPlainText } from "@portabletext/react";
import { Container } from "@/components/container";
import { PortableTextContent } from "@/components/portable-text";
import { SectionLabel } from "@/components/section-label";
import { getAboutPage } from "@/lib/sanity/queries/about-page";
import { splitOwnerStory } from "./owner-story-content";

/**
 * The "Egyre több szolgáltatás, egy helyen" beat of `ownerStory` — split out
 * of the flowing intro text (`OwnerStorySection`) into its own 2×2
 * editorial card grid so the four services read as distinct offerings
 * instead of four more paragraphs in the same text column
 * (`owner-story-content.ts` does the actual splitting).
 *
 * Card descriptions are shown as a plain, `line-clamp`-ed teaser (not run
 * through `PortableTextContent`) purely so a long paragraph can't blow out
 * card height in the grid — the full Sanity text is still in the DOM,
 * nothing is truncated server-side.
 */
export async function ServicesHighlightSection() {
  const { ownerStory } = await getAboutPage();
  const { services } = splitOwnerStory(ownerStory);
  if (!services || services.items.length === 0) return null;

  const heading = toPlainText(services.heading);

  return (
    <section className="bg-secondary py-20">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <SectionLabel>Szolgáltatások</SectionLabel>
          <h2 className="mt-4 mb-4 font-heading text-4xl font-black text-foreground">{heading}</h2>
          {services.body.length > 0 && (
            <div className="text-sm leading-relaxed text-foreground/55">
              <PortableTextContent value={services.body} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {services.items.map((item) => (
            <div
              key={item.key}
              className="border border-gold/10 bg-background/60 p-8 transition-all hover:border-gold/35"
            >
              {item.number && (
                <span className="font-mono-label text-xs tracking-[0.3em] text-gold">
                  {item.number}
                </span>
              )}
              <h3 className="mt-2 mb-3 font-heading text-xl font-black text-foreground">
                {item.title}
              </h3>
              {item.body.length > 0 && (
                <p className="line-clamp-3 text-sm leading-relaxed text-foreground/55">
                  {toPlainText(item.body)}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
