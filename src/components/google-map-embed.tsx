"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { useState } from "react";

interface GoogleMapEmbedProps {
  /** Full postal address, used for the placeholder label, the iframe title, and the maps.google.com query. */
  address: string;
  className?: string;
}

/**
 * Click-to-load Google Maps embed (required by the Contact page brief).
 * Nothing from Google loads until the visitor explicitly clicks "Térkép
 * betöltése" — before that, this renders a styled placeholder with no
 * iframe and no network request to Google at all, so no third-party
 * cookie/tracking request happens without an explicit visitor action.
 */
export function GoogleMapEmbed({ address, className = "" }: GoogleMapEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const externalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  if (loaded) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="relative h-72 overflow-hidden border border-gold/15">
          <iframe
            src={embedSrc}
            title={`Térkép — ${address}`}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href={externalMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono-label text-xs text-gold transition-colors hover:text-gold-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <ExternalLink size={13} />
          Megnyitás Google Térképen
        </a>
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-72 flex-col items-center justify-center gap-3 overflow-hidden border border-gold/15 bg-secondary px-6 text-center ${className}`}
    >
      <div className="absolute top-2 left-2 h-5 w-5 border-t border-l border-gold/60" />
      <div className="absolute top-2 right-2 h-5 w-5 border-t border-r border-gold/60" />
      <div className="absolute bottom-2 left-2 h-5 w-5 border-b border-l border-gold/60" />
      <div className="absolute right-2 bottom-2 h-5 w-5 border-r border-b border-gold/60" />

      <div className="flex h-10 w-10 items-center justify-center border border-gold/40 bg-gold/10">
        <MapPin size={18} className="text-gold" />
      </div>
      <p className="font-heading text-sm font-semibold text-foreground">{address}</p>
      <p className="max-w-xs text-xs leading-relaxed text-foreground/40">
        A térképet a Google Maps szolgáltatja. Betöltéskor a Google adatokat
        (pl. IP-cím) gyűjthet — bővebben az{" "}
        <a href="/adatvedelem" className="text-gold hover:underline">
          Adatvédelmi tájékoztatóban
        </a>
        .
      </p>
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="mt-1 inline-flex items-center gap-2 border border-gold/50 px-6 py-2.5 font-heading text-xs font-bold tracking-[0.2em] text-gold uppercase transition-all duration-300 hover:border-gold hover:bg-gold/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Térkép betöltése
      </button>
    </div>
  );
}
