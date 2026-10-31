import { Clock, MapPin, Phone, type LucideIcon } from "lucide-react";
import { Container } from "@/components/container";
import { formatOpeningHours } from "@/lib/format-opening-hours";
import { getBusinessSettings } from "@/lib/sanity/queries/business-settings";

/**
 * Sourced from the real `BusinessSettings` Sanity singleton
 * (docs/content-model.md Section 7) — phone and address can't drift from
 * the Contact page/legal pages, since all read from the same document.
 * Opening hours come from `BusinessSettings.openingHours` too (same
 * formatting as the Contact page); while they're not filled in, the hours
 * card and the phone card's hours line are left out rather than showing
 * made-up times.
 */
export async function ContactStrip() {
  const settings = await getBusinessSettings();
  // "H–P: 8:00–18:00, Szo: 8:00–13:00" → first range as the headline, the rest below.
  const [firstHours, ...otherHours] = formatOpeningHours(settings.openingHours)?.split(", ") ?? [];

  const items: {
    icon: LucideIcon;
    label: string;
    value: string;
    detail?: string;
  }[] = [
    {
      icon: Phone,
      label: "Telefon",
      value: settings.phone,
      detail: firstHours,
    },
    {
      icon: MapPin,
      label: "Cím",
      value: `${settings.address.city}, ${settings.address.addressLine1}`,
      detail: `${settings.address.postalCode} ${settings.address.city}`,
    },
    ...(firstHours
      ? [{ icon: Clock, label: "Nyitvatartás", value: firstHours, detail: otherHours.join(", ") || undefined }]
      : []),
  ];

  return (
    <section className="bg-background py-14">
      <Container>
        <div className={`grid grid-cols-1 gap-6 ${items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
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
                {detail && <p className="mt-0.5 text-xs text-foreground/50">{detail}</p>}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
