import type { Metadata } from "next";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import { getBlogPosts } from "@/lib/sanity/queries/blog-posts";
import { BlogPostCard } from "./_components/blog-post-card";

export const metadata: Metadata = {
  title: "Blog — Royal-Team Autószerviz",
  description:
    "Szakmai tartalmak, tippek és útmutatók autótulajdonosoknak — a Royal-Team szakembereinek tollából.",
};

/**
 * Structure/copy match `design-reference/figma-app/src/app/App.tsx`'s
 * `// ─── Blog Page` section exactly: a plain (imageless) hero, then a
 * vertical stack of horizontal article cards — not the image-hero-overlay
 * pattern `/szolgaltatasok`/`/projektek` use, and not a 3-column card grid.
 * No closing CTA banner either: the reference has none on this page.
 */
export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <section className="bg-background pt-40 pb-16">
        <Container>
          <SectionLabel>Tudástár</SectionLabel>
          <h1 className="font-heading text-5xl font-black text-foreground md:text-6xl">
            Blog & <span className="text-gold">Cikkek</span>
          </h1>
          <GoldDivider className="mt-4" />
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/40">
            Szakmai tartalmak, tippek és útmutatók autótulajdonosoknak — a
            Royal-Team szakembereinek tollából.
          </p>
        </Container>
      </section>

      <section className="bg-background pb-20">
        <Container className="space-y-5">
          {posts.length > 0 ? (
            posts.map((post, index) => <BlogPostCard key={post.slug} post={post} index={index} />)
          ) : (
            <p className="text-center text-sm text-foreground/40">
              Jelenleg nincs elérhető cikk — nézzen vissza hamarosan.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
