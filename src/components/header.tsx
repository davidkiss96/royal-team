"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { Logo } from "./logo";
import { NAV_LINKS } from "@/lib/site-config";

// Scroll-linked nav background threshold, and the nav-link breakpoint below,
// both preserved exactly from the approved Figma reference (docs/design-system.md
// Section 10 / Section 6 — see the note on the xl breakpoint below).
const SCROLL_THRESHOLD = 60;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface HeaderProps {
  /**
   * Sourced from Sanity `BusinessSettings` by the (server) root layout and
   * passed down as props — `Header` is a Client Component (scroll/menu
   * state), so it can't call the server-only `getBusinessSettings()` itself.
   */
  phone: string;
  phoneHref: string;
}

export function Header({ phone, phoneHref }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Reset the mobile menu on navigation. Adjusting state during render
  // (rather than in an effect) per React's own guidance for "reset state
  // when a prop changes": https://react.dev/learn/you-might-not-need-an-effect
  const [menuOpenForPathname, setMenuOpenForPathname] = useState(pathname);
  if (pathname !== menuOpenForPathname) {
    setMenuOpenForPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-border bg-background/95 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" aria-label="Royal-Team Autószerviz – Főoldal" className={`flex items-center gap-3 ${focusRing}`}>
          <Logo size={50} priority />
          <span className="hidden leading-none sm:block">
            <span className="block font-heading text-sm font-bold uppercase tracking-[0.18em] text-gold">
              Royal-Team
            </span>
            <span className="mt-0.5 block font-mono-label text-[10px] uppercase tracking-[0.12em] text-foreground/40">
              Autószerviz
            </span>
          </span>
        </Link>

        {/*
          NOTE: the approved reference app gates the desktop nav / hamburger
          at the `xl` breakpoint (1280px), not `lg` (1024px) as
          docs/design-system.md Section 6 states — verified directly in
          design-reference/figma-app/src/app/App.tsx (Navigation component).
          Reproduced here as actually built, with the discrepancy flagged
          for the doc to be corrected separately.
        */}
        <nav aria-label="Fő navigáció" className="hidden items-center gap-6 xl:flex">
          {NAV_LINKS.map(({ label, href }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`font-heading text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-200 ${focusRing} ${
                  active ? "text-gold" : "text-foreground/50 hover:text-foreground/90"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={phoneHref}
            className={`hidden items-center gap-2 font-mono-label text-xs font-medium text-gold transition-colors hover:text-gold-bright md:flex ${focusRing}`}
          >
            <PhoneIcon className="h-[14px] w-[14px]" />
            {phone}
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Menü bezárása" : "Menü megnyitása"}
            className={`p-2 text-foreground/60 xl:hidden ${focusRing}`}
          >
            {menuOpen ? <CloseIcon className="h-[22px] w-[22px]" /> : <MenuIcon className="h-[22px] w-[22px]" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-nav" className="border-b border-border bg-background/98 backdrop-blur-xl xl:hidden">
          <nav aria-label="Fő navigáció" className="space-y-1 px-6 py-6">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`block border-b border-border/20 py-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${focusRing} ${
                    active ? "text-gold" : "text-foreground/50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <a
              href={phoneHref}
              className={`flex items-center gap-2 pt-4 font-mono-label text-xs font-medium text-gold ${focusRing}`}
            >
              <PhoneIcon className="h-[14px] w-[14px]" />
              {phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
