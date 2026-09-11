import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { PortableTextContent } from "@/components/portable-text";
import { buildPageMetadata, isRealImage } from "@/lib/seo";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/lib/sanity/queries/blog-posts";
import { BlogPostAuthorBar } from "./_components/blog-post-author-bar";
import { BlogPostHero } from "./_components/blog-post-hero";
import { BlogPostRelatedArticles } from "./_components/blog-post-related-articles";
import { BlogPostRelatedServiceCard } from "./_components/blog-post-related-service";

interface BlogPostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const entries = await getBlogPostSlugs();
  return entries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return buildPageMetadata({
    title: post.seo?.metaTitle || `${post.title} — Royal-Team Autószerviz`,
    description: post.seo?.metaDescription || post.excerpt,
    path: `/blog/${slug}`,
    noIndex: post.seo?.noIndex,
    image: isRealImage(post.heroImage) ? post.heroImage : undefined,
    ogType: "article",
    publishedTime: post.publishedAt ?? undefined,
  });
}

/**
 * Structure matches `design-reference/figma-app/src/app/App.tsx`'s
 * `// ─── Blog Article Page` section: hero, then a two-column content grid
 * (article body + sidebar), tags at the end of the article column, no
 * closing CTA banner (the sidebar's related-service card is the
 * reference's actual conversion path for this page).
 */
export default async function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const hasSidebarContent = post.relatedServices.length > 0 || post.relatedPosts.length > 0;

  return (
    <>
      <BlogPostHero post={post} />

      <section className="bg-background py-16">
        <Container>
          <div className={hasSidebarContent ? "grid gap-12 lg:grid-cols-3" : "mx-auto max-w-3xl"}>
            <div className={hasSidebarContent ? "lg:col-span-2" : ""}>
              {post.author && <BlogPostAuthorBar author={post.author} />}

              <div className="space-y-4 text-sm leading-relaxed text-foreground/70">
                {post.excerpt && (
                  <p className="text-base leading-relaxed text-foreground/85">{post.excerpt}</p>
                )}
                {post.body.length > 0 && <PortableTextContent value={post.body} />}
              </div>

              {post.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2 border-t border-gold/10 pt-8">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-gold/15 px-3 py-1.5 font-mono-label text-[10px] text-foreground/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {hasSidebarContent && (
              <div className="space-y-6">
                {post.relatedServices[0] && (
                  <BlogPostRelatedServiceCard service={post.relatedServices[0]} />
                )}
                {post.relatedPosts.length > 0 && (
                  <BlogPostRelatedArticles posts={post.relatedPosts} />
                )}
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
