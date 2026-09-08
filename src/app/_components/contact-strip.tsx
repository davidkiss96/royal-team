import { Clock, MapPin, Phone, type LucideIcon } from "lucide-react";
import { Container } from "@/components/container";
import { BUSINESS_SETTINGS } from "@/lib/mock/business-settings";
import { PHONE_DISPLAY } from "@/lib/site-config";

/**
 * Static site copy standing in for `BusinessSettings` (docs/content-model.md
 * Section 7) — sourced from the shared `BUSINESS_SETTINGS` mock so the
 * address shown here can't drift from the Contact page/legal pages. Hours
 * aren't part of the confirmed business data yet, so that copy stays as
 * placeholder text pending a real value.
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
    value: `${BUSINESS_SETTINGS.address.city}, ${BUSINESS_SETTINGS.address.addressLine1}`,
    detail: `${BUSINESS_SETTINGS.address.postalCode} ${BUSINESS_SETTINGS.address.city}`,
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
