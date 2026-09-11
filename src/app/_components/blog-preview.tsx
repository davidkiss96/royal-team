import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import { formatHungarianDate } from "@/lib/format-date";
import { estimateReadingMinutes } from "@/lib/reading-time";
import { getHomepageContent } from "@/lib/sanity/queries/homepage";

export async function BlogPreview() {
  const { latestBlogPosts } = await getHomepageContent();
  if (latestBlogPosts.length === 0) return null;

  return (
    <section className="bg-background py-20">
      <Container>
        <div className="mb-12 flex items-end justify-between">
          <div>
            <SectionLabel>Tudástár</SectionLabel>
            <h2 className="font-heading text-3xl font-black text-foreground md:text-4xl">
              Legújabb <span className="text-gold">cikkeink.</span>
            </h2>
          </div>
          <Button href="/blog" variant="outline" className="hidden md:inline-flex">
            Blog →
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {latestBlogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden border border-gold/8 bg-card transition-all duration-500 hover:border-gold/30"
            >
              <div className="h-44 overflow-hidden">
                <Image
                  src={post.heroImage.url}
                  alt={post.heroImage.alt}
                  width={500}
                  height={300}
                  className="h-full w-full object-cover brightness-65 transition-all duration-700 group-hover:scale-105 group-hover:brightness-80"
                />
              </div>
              <div className="p-6">
                <h3 className="mt-2 mb-3 font-heading text-base leading-snug font-black text-foreground">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between font-mono-label text-[10px] text-foreground/30">
                  <span>{post.publishedAt && formatHungarianDate(post.publishedAt)}</span>
                  <span>{estimateReadingMinutes(post.excerpt)} perc olvasás</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button href="/blog" variant="outline">
            Blog →
          </Button>
        </div>
      </Container>
    </section>
  );
}
