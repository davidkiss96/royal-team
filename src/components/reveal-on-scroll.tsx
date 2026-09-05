"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}

/**
 * Scroll-triggered fade/rise-in entrance (docs/design-system.md Section 10)
 * — a real, repeated pattern in the approved design, reproduced with
 * IntersectionObserver + a CSS transition rather than the reference's
 * Framer Motion dependency, since a one-time opacity/transform reveal
 * doesn't need an animation library. Skips the animation entirely under
 * `prefers-reduced-motion`.
 */
export function RevealOnScroll({
  children,
  delayMs = 0,
  className = "",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Deferred to the next frame rather than called synchronously here,
      // per React's guidance against setState directly in an effect body.
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
