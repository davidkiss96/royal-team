import { Clock, MapPin, Phone, type LucideIcon } from "lucide-react";
import { Container } from "@/components/container";
import { getBusinessSettings } from "@/lib/sanity/queries/business-settings";

/**
 * Sourced from the real `BusinessSettings` Sanity singleton
 * (docs/content-model.md Section 7) — phone and address can't drift from
 * the Contact page/legal pages, since all read from the same document.
 * Opening hours aren't part of the seeded business data yet
 * (`BusinessSettings.openingHours` has no source content — see
 * `src/scripts/seed-sanity.ts`), so that copy stays as placeholder text
 * pending a real value, unchanged from before this migration.
 */
export async function ContactStrip() {
  const settings = await getBusinessSettings();

  const items: {
    icon: LucideIcon;
    label: string;
    value: string;
    detail: string;
  }[] = [
    {
      icon: Phone,
      label: "Telefon",
      value: settings.phone,
      detail: "H-P: 8:00 – 18:00",
    },
    {
      icon: MapPin,
      label: "Cím",
      value: `${settings.address.city}, ${settings.address.addressLine1}`,
      detail: `${settings.address.postalCode} ${settings.address.city}`,
    },
    {
      icon: Clock,
      label: "Nyitvatartás",
      value: "H–P: 8:00–18:00",
      detail: "Szo: 8:00–13:00",
    },
  ];

  return (
    <section className="bg-background py-14">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, label, value, detail }) => (
            <div
              key={label}
              className="flex items-start gap-4 border border-gold/8 p-6 transition-all hover:border-gold/30"
            >
              <Icon size={18} className="mt-0.5 flex-shrink-0 text-gold" />
              <div>
                <p className="mb-1 text-[10px] tracking-wider text-foreground/50 uppercase">
                  {label}
                </p>
                <p className="font-heading text-sm font-semibold text-foreground">
                  {value}
                </p>
                <p className="mt-0.5 text-xs text-foreground/50">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
