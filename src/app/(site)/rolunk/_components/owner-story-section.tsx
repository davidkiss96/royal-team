import { toPlainText } from "@portabletext/react";
import Image from "next/image";
import { Container } from "@/components/container";
import { PortableTextContent } from "@/components/portable-text";
import { SectionLabel } from "@/components/section-label";
import { getAboutPage } from "@/lib/sanity/queries/about-page";
import { splitOwnerStory } from "./owner-story-content";

/** `photoGallery[0]` is this section's companion image — no dedicated
 * "story image" field exists on `AboutPage` (docs/content-model.md Section
 * 9), mirroring the Service/Project detail pages' `gallery[0]` fallback
 * pattern. Falls back to `heroImage` when the gallery is empty, same as
 * before the migration.
 *
 * The image column uses `fill` inside a `min-h` box rather than a fixed
 * pixel height so it stretches to match whatever height the intro text
 * actually renders at (`items-stretch` on the grid), instead of a fixed
 * height picked for the old, much longer wall of text this section used to
 * hold before `ServicesHighlightSection`/`ClosingStatementSection` split
 * the rest of `ownerStory` out.
 */
export async function OwnerStorySection() {
  const { ownerStory, photoGallery, heroImage } = await getAboutPage();
  const { intro } = splitOwnerStory(ownerStory);
  if (!intro) return null;

  const image = photoGallery[0] ?? heroImage;
  const heading = toPlainText(intro.heading);

  return (
    <section className="bg-background py-20">
      <Container>
        <div className="grid items-stretch gap-16 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h2 className="mt-4 mb-6 font-heading text-4xl font-black text-foreground md:text-5xl">{heading}</h2>
            <div className="space-y-4 text-sm leading-relaxed text-foreground/55">
              <PortableTextContent value={intro.body} />
            </div>
          </div>

          <div className="relative min-h-80 overflow-hidden">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover brightness-75"
            />
            <div className="absolute top-0 left-0 h-12 w-12 border-t-2 border-l-2 border-gold" />
            <div className="absolute right-0 bottom-0 h-12 w-12 border-r-2 border-b-2 border-gold" />
          </div>
        </div>
      </Container>
    </section>
  );
}
