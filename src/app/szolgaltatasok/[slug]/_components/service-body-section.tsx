import Image from "next/image";
import { Container } from "@/components/container";
import { PortableTextContent } from "@/components/portable-text";
import { SectionLabel } from "@/components/section-label";
import type { ServiceDetail } from "@/lib/sanity/queries/services";

/**
 * Generalized version of the reference DPF page's "Problem" section — no
 * new field was needed for this: it's exactly what `body` (Portable Text)
 * is for once generalized past DPF-specific content (paragraphs plus,
 * where relevant, a bullet list), per docs/content-model.md Section 0 item
 * 8. The secondary image uses `gallery`'s first entry, falling back to
 * `heroImage` for services without a gallery.
 */
export function ServiceBodySection({ service }: { service: ServiceDetail }) {
  const image = service.gallery?.[0] ?? service.heroImage;

  return (
    <section className="bg-background py-20">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionLabel>Részletek</SectionLabel>
            <h2 className="mb-6 font-heading text-4xl font-black text-foreground">
              A szolgáltatásról
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-foreground/55">
              <PortableTextContent value={service.body} />
            </div>
          </div>

          <div className="relative">
            <Image
              src={image.url}
              alt={image.alt}
              width={700}
              height={520}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-[460px] w-full object-cover brightness-75"
            />
            <div className="absolute top-0 right-0 h-12 w-12 border-t-2 border-r-2 border-gold" />
            <div className="absolute bottom-0 left-0 h-12 w-12 border-b-2 border-l-2 border-gold" />
          </div>
        </div>
      </Container>
    </section>
  );
}
