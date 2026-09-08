/**
 * Mock data shaped to match the approved `BusinessSettings` singleton
 * (docs/content-model.md Section 7) — operational/business facts only, not
 * marketing content. This is the single source of truth for the company's
 * real contact and legal data everywhere it's needed (header/footer phone
 * link, the homepage contact strip, the Contact page, and the two legal
 * pages) so it's never hand-typed twice with a risk of drifting apart.
 *
 * Extends the documented `content-model.md` shape with a few fields that
 * document explicitly needs but the content model hadn't yet enumerated in
 * full: `registeredOffice` (the company's official "székhely", distinct
 * from `address`, which — per `content-model.md` Section 7 — is the
 * workshop/service location the rest of the site displays), plus
 * `legalTaxNumber` and `managingDirector` alongside the already-documented
 * `legalCompanyName`/`legalRegistrationNumber`. All four are genuine
 * operational/legal facts of the same kind already approved for this
 * singleton, not a new kind of content.
 */

export interface BusinessAddress {
  addressLine1: string;
  city: string;
  postalCode: string;
}

export interface BusinessSettings {
  businessName: string;
  phone: string;
  phoneHref: string;
  email: string;
  website: string;
  websiteHref: string;
  /** Workshop / service location — where customers physically visit. */
  address: BusinessAddress;
  /** Registered office ("székhely") — the company's official legal address, distinct from the workshop. */
  registeredOffice: BusinessAddress;
  legalCompanyName: string;
  legalRegistrationNumber: string;
  legalTaxNumber: string;
  managingDirector: string;
}

export const BUSINESS_SETTINGS: BusinessSettings = {
  businessName: "Royal-Team Autószerviz",
  phone: "+36 30 607 3022",
  phoneHref: "tel:+36306073022",
  email: "szerviz@royalteam.hu",
  website: "royalteamszerviz.hu",
  websiteHref: "https://royalteamszerviz.hu",
  address: {
    addressLine1: "Móricz Zsigmond utca 60.",
    city: "Ercsi",
    postalCode: "2451",
  },
  registeredOffice: {
    addressLine1: "Bercsényi Miklós utca 5. 1. em. 4. ajtó",
    city: "Ercsi",
    postalCode: "2451",
  },
  legalCompanyName: "Royal-Team Autószerviz Kft.",
  legalRegistrationNumber: "07-09-036112",
  legalTaxNumber: "32661879-2-07",
  managingDirector: "Király Tibor Márk",
};

/** "2451 Ercsi, Móricz Zsigmond utca 60." — the workshop address in a single display line. */
export function formatAddress(address: BusinessAddress): string {
  return `${address.postalCode} ${address.city}, ${address.addressLine1}`;
}
