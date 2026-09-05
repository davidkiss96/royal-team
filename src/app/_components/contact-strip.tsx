import { Clock, MapPin, Phone, type LucideIcon } from "lucide-react";
import { Container } from "@/components/container";
import { PHONE_DISPLAY } from "@/lib/site-config";

/**
 * Static site copy standing in for `BusinessSettings` (docs/content-model.md
 * Section 7) — address/hours aren't wired to real data yet since Sanity
 * isn't introduced in this step. The address shown is still the reference
 * prototype's unconfirmed placeholder ("Ercsi, Autó utca 12."), not the
 * confirmed real address (Móricz Zsigmond utca 60.) recorded in the docs —
 * left as-is here since BusinessSettings itself doesn't exist yet to source
 * it from, and swapping in the real address piecemeal risks it drifting
 * from that single future source of truth.
 */
const CONTACT_STRIP_ITEMS: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}[] = [
  {
    icon: Phone,
    label: "Telefon",
    value: PHONE_DISPLAY,
    detail: "H-P: 8:00 – 18:00",
  },
  {
    icon: MapPin,
    label: "Cím",
    value: "Ercsi, Autó utca 12.",
    detail: "1XXX Ercsi",
  },
  {
    icon: Clock,
    label: "Nyitvatartás",
    value: "H–P: 8:00–18:00",
    detail: "Szo: 8:00–13:00",
  },
];

export function ContactStrip() {
  return (
    <section className="bg-background py-14">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {CONTACT_STRIP_ITEMS.map(({ icon: Icon, label, value, detail }) => (
            <div
              key={label}
              className="flex items-start gap-4 border border-gold/8 p-6 transition-all hover:border-gold/30"
            >
              <Icon size={18} className="mt-0.5 flex-shrink-0 text-gold" />
              <div>
                <p className="mb-1 text-[10px] tracking-wider text-foreground/35 uppercase">
                  {label}
                </p>
                <p className="font-heading text-sm font-semibold text-foreground">
                  {value}
                </p>
                <p className="mt-0.5 text-xs text-foreground/35">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
