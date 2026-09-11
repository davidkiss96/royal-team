import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { formatHungarianDate } from "@/lib/format-date";
import { estimateReadingMinutes } from "@/lib/reading-time";
import type { BlogPostDetail } from "@/lib/sanity/queries/blog-posts";

/**
 * Matches `design-reference/figma-app/src/app/App.tsx`'s `// ─── Blog
 * Article Page` hero: a dark, cropped hero image with a bottom-anchored
 * heading, no excerpt subheading (the excerpt renders as the article's
 * lead paragraph instead, per the reference's content layout).
 *
 * The reference's meta row shows only a tag badge + read time and puts the
 * publish date inside the author bar instead — but that bar only renders
 * here when a real `Author` reference exists (no fake bylines, per this
 * feature's standing rule), so the date is shown here unconditionally to
 * make sure it's never silently lost when a post has no author.
 */
export function BlogPostHero({ post }: { post: BlogPostDetail }) {
  return (
    <section className="relative flex min-h-[400px] items-end overflow-hidden lg:h-[55vh]">
      <Image
        src={post.heroImage.url}
        alt={post.heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover brightness-[0.3]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <Container className="relative w-full pt-40 pb-14">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-2 font-mono-label text-[10px] tracking-widest text-gold/70 uppercase transition-colors hover:text-gold"
        >
          ← Vissza a bloghoz
        </Link>

        <div className="mb-4 flex items-center gap-3">
          {post.tags[0] && (
            <span className="border border-gold/30 bg-gold/10 px-3 py-1.5 font-mono-label text-[10px] text-gold">
              {post.tags[0]}
            </span>
          )}
          <span className="font-mono-label text-[10px] text-white/35">
            {estimateReadingMinutes(post.excerpt)} perc olvasás
          </span>
          {post.publishedAt && (
            <span className="font-mono-label text-[10px] text-white/35">
              {formatHungarianDate(post.publishedAt)}
            </span>
          )}
        </div>

        <h1 className="max-w-3xl font-heading text-4xl leading-tight font-black text-white md:text-5xl lg:text-6xl">
          {post.title}
        </h1>
      </Container>
    </section>
  );
}
