import Image from "next/image";
import { Container } from "@/components/container";
import type { AboutPageContent } from "@/lib/mock/about-page";

/** Renders `photoGallery` minus its first entry, which the owner-story
 * section already uses — see that section's comment. */
export function PhotoGallerySection({ content }: { content: AboutPageContent }) {
  const images = content.photoGallery.slice(1);
  if (images.length === 0) return null;

  return (
    <section className="bg-background pb-20">
      <Container>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {images.map((image) => (
            <div key={image.url + image.alt} className="group h-64 overflow-hidden">
              <Image
                src={image.url}
                alt={image.alt}
                width={600}
                height={450}
                className="h-full w-full object-cover brightness-75 transition-all duration-700 group-hover:scale-105 group-hover:brightness-90"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
