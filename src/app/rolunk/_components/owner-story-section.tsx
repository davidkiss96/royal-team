import Image from "next/image";
import { BodyBlocks } from "@/components/body-blocks";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import type { AboutPageContent } from "@/lib/mock/about-page";

/** `photoGallery[0]` is this section's companion image — see the mock
 * data's module comment for why (no dedicated "story image" field exists,
 * and this mirrors the Service/Project detail pages' `gallery[0]`
 * fallback pattern). */
export function OwnerStorySection({ content }: { content: AboutPageContent }) {
  const image = content.photoGallery[0] ?? content.heroImage;

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
            <BodyBlocks blocks={content.ownerStory} />
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
