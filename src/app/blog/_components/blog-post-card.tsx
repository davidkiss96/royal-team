import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { formatHungarianDate } from "@/lib/format-date";
import { estimateReadingMinutes } from "@/lib/reading-time";
import type { BlogPostListItem } from "@/lib/sanity/queries/blog-posts";

interface BlogPostCardProps {
  post: BlogPostListItem;
  index: number;
}

/**
 * The horizontal article-card layout from the reference's `// ─── Blog
 * Page` section (`design-reference/figma-app/src/app/App.tsx`) — image on
 * the left (2/5 columns), content on the right (3/5), not a vertical
 * image-top card. The reference's single `category` badge is played by
 * `tags[0]` here (docs/content-model.md Section 0 item 11) — no badge
 * renders when a post has no tags yet.
 */
export function BlogPostCard({ post, index }: BlogPostCardProps) {
  return (
    <RevealOnScroll delayMs={Math.min(index, 6) * 80}>
      <Link
        href={`/blog/${post.slug}`}
        className="group grid overflow-hidden border border-gold/8 transition-all duration-500 hover:border-gold/30 lg:grid-cols-5"
      >
        <div className="relative h-56 overflow-hidden lg:col-span-2 lg:h-auto">
          <Image
            src={post.heroImage.url}
            alt={post.heroImage.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover brightness-65 transition-all duration-700 group-hover:scale-[1.04] group-hover:brightness-75"
          />
        </div>
        <div className="flex flex-col justify-center bg-card p-8 lg:col-span-3 lg:p-10">
          <div className="mb-4 flex items-center gap-3">
            {post.tags[0] && (
              <span className="border border-gold/25 bg-gold/8 px-3 py-1.5 font-mono-label text-[10px] text-gold">
                {post.tags[0]}
              </span>
            )}
            <span className="font-mono-label text-[10px] text-foreground/50">
              {estimateReadingMinutes(post.excerpt)} perc olvasás
            </span>
          </div>
          <h2 className="mb-4 font-heading text-xl leading-tight font-black text-foreground md:text-2xl">
            {post.title}
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-foreground/45">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            {post.publishedAt && (
              <span className="font-mono-label text-[10px] text-foreground/50">
                {formatHungarianDate(post.publishedAt)}
              </span>
            )}
            <div className="flex items-center gap-1.5 text-xs text-gold transition-all group-hover:gap-2.5">
              <span className="font-heading text-[10px] font-bold tracking-wider uppercase">
                Olvasás
              </span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </Link>
    </RevealOnScroll>
  );
}
