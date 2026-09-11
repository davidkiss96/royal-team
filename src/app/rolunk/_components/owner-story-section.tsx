import Image from "next/image";
import { Container } from "@/components/container";
import { PortableTextContent } from "@/components/portable-text";
import { SectionLabel } from "@/components/section-label";
import { getAboutPage } from "@/lib/sanity/queries/about-page";

/** `photoGallery[0]` is this section's companion image — no dedicated
 * "story image" field exists on `AboutPage` (docs/content-model.md Section
 * 9), mirroring the Service/Project detail pages' `gallery[0]` fallback
 * pattern. Falls back to `heroImage` when the gallery is empty, same as
 * before the migration. */
export async function OwnerStorySection() {
  const { ownerStory, photoGallery, heroImage } = await getAboutPage();
  if (ownerStory.length === 0) return null;

  const image = photoGallery[0] ?? heroImage;

  return (
    <section className="bg-background py-20">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionLabel>Az alapítóról</SectionLabel>
            <h2 className="mb-6 font-heading text-4xl font-black text-foreground">
              Szenvedély a
              <br />
              <span className="text-gold">motorok iránt.</span>
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-foreground/55">
              <PortableTextContent value={ownerStory} />
            </div>
          </div>

          <div className="relative">
            <Image
              src={image.url}
              alt={image.alt}
              width={700}
              height={600}
              className="h-[500px] w-full object-cover brightness-75"
            />
            <div className="absolute top-0 left-0 h-12 w-12 border-t-2 border-l-2 border-gold" />
            <div className="absolute right-0 bottom-0 h-12 w-12 border-r-2 border-b-2 border-gold" />
          </div>
        </div>
      </Container>
    </section>
  );
}
