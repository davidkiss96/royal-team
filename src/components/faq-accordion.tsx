"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

/**
 * The FAQ accordion pattern (docs/design-system.md Section 7) — one shared
 * component rather than the reference's two near-duplicate implementations
 * (homepage + DPF page). Height animates via a CSS grid-rows transition
 * (0fr -> 1fr) instead of a JS-measured height or an animation library —
 * no new dependency for what's a well-supported, purely CSS technique.
 */
export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className="overflow-hidden border border-gold/10 bg-card transition-colors hover:border-gold/25"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gold/4"
            >
              <span className="pr-8 font-heading text-sm font-semibold text-foreground">
                {item.question}
              </span>
              <ChevronDown
                size={17}
                className={`flex-shrink-0 text-gold transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="border-t border-gold/8 px-6 pt-4 pb-5 text-sm leading-relaxed text-foreground/50">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
