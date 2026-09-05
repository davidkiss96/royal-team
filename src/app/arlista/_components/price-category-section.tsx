import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { formatPriceDisplay } from "@/lib/format-price";
import type { PriceCategory } from "@/lib/mock/price-categories";

interface PriceCategorySectionProps {
  category: PriceCategory;
  delayMs: number;
}

export function PriceCategorySection({ category, delayMs }: PriceCategorySectionProps) {
  const activeItems = category.items.filter((item) => item.isActive);
  if (activeItems.length === 0) return null;

  return (
    <RevealOnScroll delayMs={delayMs}>
      <div>
        <div className="mb-5 flex items-center gap-4">
          <div className="h-7 w-1 bg-gold" />
          <h2 className="font-heading text-lg font-black tracking-wide text-foreground uppercase">
            {category.title}
          </h2>
          <div className="h-px flex-1 bg-gold/15" />
        </div>
        <div className="divide-y divide-gold/8">
          {activeItems.map((item) => {
            const display = formatPriceDisplay(item);
            return (
              <div
                key={item.name}
                className="group flex items-start justify-between gap-6 px-2 py-4 transition-colors hover:bg-gold/3"
              >
                <div className="flex-1">
                  <p className="font-heading text-sm font-semibold text-foreground transition-colors group-hover:text-foreground/90">
                    {item.name}
                  </p>
                  {item.note && (
                    <p className="mt-0.5 font-mono-label text-[11px] text-foreground/35">
                      {item.note}
                    </p>
                  )}
                </div>
                <span
                  className={`flex-shrink-0 font-heading text-base font-black ${
                    item.priceType === "quote" ? "text-emerald-400" : "text-gold"
                  }`}
                >
                  {display}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </RevealOnScroll>
  );
}
