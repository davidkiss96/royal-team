import { Settings } from "lucide-react";
import { Button } from "@/components/button";
import { SERVICE_ICONS } from "@/lib/service-icons";
import type { BlogPostRelatedService } from "@/lib/sanity/queries/blog-posts";

/**
 * The sidebar "DPF Tisztítás & Szerviz" CTA card from the reference's
 * `// ─── Blog Article Page` section — generalized to whichever `Service`
 * the post's `relatedServices` reference actually points to (the reference
 * hardcodes copy for one specific service; this reads the real `Service`'s
 * own `title`/`summary` instead, docs/content-model.md Section 0 item 11).
 * Only the first related service renders, matching the reference's single
 * sidebar card.
 */
export function BlogPostRelatedServiceCard({ service }: { service: BlogPostRelatedService }) {
  const Icon = SERVICE_ICONS[service.slug] ?? Settings;

  return (
    <div className="border border-gold/20 bg-card p-6">
      <div className="mb-4 flex h-8 w-8 items-center justify-center border border-gold/30 bg-gold/10">
        <Icon size={14} className="text-gold" />
      </div>
      <h3 className="mb-2 font-heading text-base font-black text-foreground">{service.title}</h3>
      <p className="mb-5 text-xs leading-relaxed text-foreground/40">{service.summary}</p>
      <Button href={`/szolgaltatasok/${service.slug}`} className="w-full py-3 text-sm">
        {service.title} →
      </Button>
    </div>
  );
}
