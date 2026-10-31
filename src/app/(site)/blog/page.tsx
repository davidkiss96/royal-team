import type { Metadata } from "next";
import { AccentHeading } from "@/components/accent-heading";
import { Container } from "@/components/container";
import { GoldDivider } from "@/components/gold-divider";
import { SectionLabel } from "@/components/section-label";
import { buildPageMetadata } from "@/lib/seo";
import { getBlogPosts } from "@/lib/sanity/queries/blog-posts";
import { getPageCopy } from "@/lib/sanity/queries/page-copy";
import { BlogPostCard } from "./_components/blog-post-card";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getPageCopy("blogPage");
  return buildPageMetadata({ title: meta.title, description: meta.description, path: "/blog" });
}

/**
 * Structure/copy match the Figma prototype's `App.tsx` (git `28d95d4`)
 * `// ─── Blog Page` section exactly: a plain (imageless) hero, then a
 * vertical stack of horizontal article cards — not the image-hero-overlay
 * pattern `/szolgaltatasok`/`/projektek` use, and not a 3-column card grid.
 * No closing CTA banner either: the reference has none on this page.
 */
export default async function BlogPage() {
  const [posts, { header }] = await Promise.all([getBlogPosts(), getPageCopy("blogPage")]);

  return (
    <>
      <section className="bg-background pt-40 pb-16">
        <Container>
          <SectionLabel>{header.label}</SectionLabel>
          <h1 className="font-heading text-5xl font-black text-foreground md:text-6xl">
            <AccentHeading value={header.title} />
          </h1>
          <GoldDivider className="mt-4" />
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/40">{header.intro}</p>
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
