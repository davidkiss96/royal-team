import { Mail, MapPin, Phone } from "lucide-react";
import { GoogleMapEmbed } from "@/components/google-map-embed";
import { formatAddress } from "@/lib/format-address";
import { getBusinessSettings } from "@/lib/sanity/queries/business-settings";

export async function ContactInfo() {
  const settings = await getBusinessSettings();
  const workshopAddress = formatAddress(settings.address);

  const infoItems = [
    {
      icon: Phone,
      title: "Telefon",
      lines: [settings.phone, "H–P: 8:00–18:00"],
      href: `tel:${settings.phone.replace(/\s+/g, "")}`,
    },
    {
      icon: MapPin,
      title: "Cím (műhely)",
      lines: [settings.address.addressLine1, workshopAddress],
    },
    {
      icon: Mail,
      title: "E-mail",
      lines: [settings.email],
      href: `mailto:${settings.email}`,
    },
  ];

  return (
    <div className="space-y-7 lg:col-span-2">
      {infoItems.map(({ icon: Icon, title, lines, href }) => (
        <div key={title} className="flex gap-5">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-gold/25">
            <Icon size={16} className="text-gold" />
          </div>
          <div>
            <p className="mb-1.5 text-[10px] tracking-widest text-foreground/30 uppercase">
              {title}
            </p>
            {lines.map((line) =>
              href ? (
                <a
                  key={line}
                  href={href}
                  className="block font-heading text-sm font-medium text-foreground transition-colors hover:text-gold"
                >
                  {line}
                </a>
              ) : (
                <p key={line} className="font-heading text-sm font-medium text-foreground">
                  {line}
                </p>
              ),
            )}
          </div>
        </div>
      ))}

      <GoogleMapEmbed address={workshopAddress} />
    </div>
  );
}
