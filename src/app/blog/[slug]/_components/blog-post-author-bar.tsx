import { User } from "lucide-react";
import Image from "next/image";
import type { BlogPostAuthor } from "@/lib/sanity/queries/blog-posts";

/**
 * The author-bar component from the reference's `// ─── Blog Article Page`
 * section — a small avatar box + name/role. The reference always renders
 * this with a hardcoded generic byline ("Royal-Team szerkesztőség"); this
 * implementation only renders it when a real `Author` reference exists
 * (this feature's standing rule against inventing fake authors), so it
 * simply doesn't appear on any of today's seeded posts (none have an
 * author yet). The reference's decorative icon-box avatar is kept as the
 * fallback when a real author has no `photo`.
 */
export function BlogPostAuthorBar({ author }: { author: BlogPostAuthor }) {
  return (
    <div className="mb-8 flex items-center gap-4 border-b border-gold/10 pb-8">
      {author.photo ? (
        <Image
          src={author.photo.url}
          alt={author.photo.alt}
          width={40}
          height={40}
          className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-gold/25 bg-gold/10">
          <User size={16} className="text-gold" />
        </div>
      )}
      <div>
        <p className="font-heading text-sm font-semibold text-foreground">{author.name}</p>
        {author.role && <p className="font-mono-label text-[10px] text-foreground/30">{author.role}</p>}
      </div>
    </div>
  );
}
