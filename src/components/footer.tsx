import Link from "next/link";
import { PhoneIcon } from "./icons";
import { Logo } from "./logo";
import { FOOTER_LEGAL_LINKS, NAV_LINKS, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site-config";

interface FooterServiceLink {
  title: string;
  href: string;
}

interface FooterProps {
  /**
   * The reference design's "Szervizeink" footer column lists live Service
   * documents (docs/design-system.md Section 8) — there's no Sanity content
   * yet, so this is optional and the column is simply omitted until a page
   * has real services to pass in, rather than hardcoding placeholder names
   * into a shared, content-agnostic component.
   */
  services?: FooterServiceLink[];
}

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export function Footer({ services = [] }: FooterProps) {
  const hasServices = services.length > 0;

  return (
    <footer className="border-t border-gold/8 bg-background pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={`mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 ${
            hasServices ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <Logo size={40} />
              <div>
                <div className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-gold">
                  Royal-Team
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wider text-foreground/25">
                  Autószerviz Kft.
                </div>
              </div>
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-foreground/35">
              Prémium autószerviz Ercsi szívében. Diagnosztika,
              teljesítményfejlesztés, karbantartás — kompromisszumok nélkül.
            </p>
            <a
              href={PHONE_HREF}
              className={`flex items-center gap-2 font-mono-label text-xs text-gold transition-colors hover:text-gold-bright ${focusRing}`}
            >
              <PhoneIcon className="h-[13px] w-[13px]" />
              {PHONE_DISPLAY}
            </a>
          </div>

          <nav aria-label="Navigáció">
            <h2 className="mb-5 font-heading text-xs font-bold uppercase tracking-widest text-foreground">
              Navigáció
            </h2>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`text-xs text-foreground/30 transition-colors hover:text-gold ${focusRing}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {hasServices && (
            <nav aria-label="Szervizeink">
              <h2 className="mb-5 font-heading text-xs font-bold uppercase tracking-widest text-foreground">
                Szervizeink
              </h2>
              <ul className="space-y-3">
                {services.map(({ title, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`text-xs text-foreground/30 transition-colors hover:text-gold ${focusRing}`}
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

        <div className="flex flex-col items-center justify-between gap-4 text-[10px] text-foreground/20 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Royal-Team Autószerviz Kft. · Minden
            jog fenntartva.
          </p>
          <div className="flex items-center gap-5">
            {FOOTER_LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`text-foreground/25 transition-colors hover:text-gold ${focusRing}`}
              >
                {label}
              </Link>
            ))}
            <span className="font-mono-label">Ercsi, Magyarország</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
