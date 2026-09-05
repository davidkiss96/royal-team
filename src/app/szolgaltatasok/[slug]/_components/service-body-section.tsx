import Image from "next/image";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import type { Service } from "@/lib/mock/services";

/**
 * Generalized version of the reference DPF page's "Problem" section — no
 * new field was needed for this: it's exactly what `body` (Portable Text)
 * is for once generalized past DPF-specific content (paragraphs plus,
 * where relevant, a bullet list), per docs/content-model.md Section 0 item
 * 8. The secondary image uses `gallery`'s first entry, falling back to
 * `heroImage` for services without a gallery.
 */
export function ServiceBodySection({ service }: { service: Service }) {
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
              {service.body.map((block, index) =>
                block.type === "paragraph" ? (
                  <p key={index}>{block.text}</p>
                ) : (
                  <div key={index} className="space-y-2.5 pt-2">
                    {block.items.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-foreground/55">
                        <div className="h-1.5 w-1.5 flex-shrink-0 bg-gold" />
                        {item}
                      </div>
                    ))}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="relative">
            <Image
              src={image.url}
              alt={image.alt}
              width={700}
              height={520}
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
