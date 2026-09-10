import Image from "next/image";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import type { ProjectDetail } from "@/lib/sanity/queries/projects";

export function ProjectGallery({ project }: { project: ProjectDetail }) {
  if (!project.gallery || project.gallery.length === 0) return null;

  return (
    <section className="bg-background py-20">
      <Container>
        <SectionLabel>Fotók</SectionLabel>
        <h2 className="mb-8 font-heading text-3xl font-black text-foreground">
          A munka <span className="text-gold">folyamata</span>
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {project.gallery.map((image, index) => (
            <div
              key={image.url + index}
              className={`group overflow-hidden ${index === 0 ? "col-span-2" : ""}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                width={600}
                height={400}
                className="h-52 w-full object-cover brightness-75 transition-all duration-700 group-hover:scale-105 group-hover:brightness-90"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
