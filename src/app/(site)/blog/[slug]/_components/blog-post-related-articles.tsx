import Image from "next/image";
import Link from "next/link";
import { estimateReadingMinutes } from "@/lib/reading-time";
import type { BlogPostListItem } from "@/lib/sanity/queries/blog-posts";

/**
 * The "Kapcsolódó cikkek" sidebar section from the reference's `// ───
 * Blog Article Page` section. The reference always shows "the other two
 * `ARTICLES`" (a prototype simplification); this shows the real
 * `relatedPosts` resolved by `getBlogPostBySlug` — other recent posts,
 * not an editor-curated relationship (docs/content-model.md Section 0
 * item 11).
 */
export function BlogPostRelatedArticles({ posts }: { posts: BlogPostListItem[] }) {
  return (
    <div className="border border-gold/10 bg-card p-6">
      <h2 className="mb-5 font-heading text-xs font-bold tracking-widest text-foreground/50 uppercase">
        Kapcsolódó cikkek
      </h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex gap-3">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden">
              <Image
                src={post.heroImage.url}
                alt={post.heroImage.alt}
                fill
                sizes="56px"
                className="object-cover brightness-75 transition-all group-hover:brightness-90"
              />
            </div>
            <div className="flex-1">
              <p className="font-heading text-xs leading-snug font-semibold text-foreground/80 transition-colors group-hover:text-gold">
                {post.title}
              </p>
              <p className="mt-1 font-mono-label text-[10px] text-foreground/50">
                {estimateReadingMinutes(post.excerpt)} perc olvasás
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
