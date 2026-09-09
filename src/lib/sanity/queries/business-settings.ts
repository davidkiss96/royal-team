import { sanityClient } from "../client";

/**
 * First real content-type query in this module (docs/development-guidelines.md
 * Section 19 — one module per content type under `src/lib/sanity/queries/`,
 * created now that a page actually needs it).
 *
 * `BusinessSettings` is a singleton with a deterministic `_id`
 * (docs/content-model.md Section 7, `studio/schemaTypes/documents/business-settings.ts`),
 * so it's fetched directly by `_id` rather than queried as a document type
 * and picked out in JavaScript. Only the fields the current frontend
 * consumers (contact strip, contact page, legal pages) actually use are
 * requested (docs/development-guidelines.md Section 8) — `businessName`,
 * `addressLine2`, `openingHours`, `logo`, brand colors, and `socialLinks`
 * all exist on the schema but have no consumer yet, so they're omitted here.
 */
const BUSINESS_SETTINGS_ID = "businessSettings";

const BUSINESS_SETTINGS_QUERY = `*[_id == "${BUSINESS_SETTINGS_ID}"][0]{
  phone,
  email,
  website,
  address{
    addressLine1,
    city,
    postalCode
  },
  registeredOffice{
    addressLine1,
    city,
    postalCode
  },
  legalCompanyName,
  legalRegistrationNumber,
  legalTaxNumber,
  managingDirector
}`;

/**
 * A revalidation window chosen for a low-frequency-editing, operational
 * settings document (docs/architecture.md Section 6.1) — long enough to
 * avoid refetching on every request, short enough that a Studio edit shows
 * up on the live site within a minute without a redeploy.
 */
const REVALIDATE_SECONDS = 60;

export interface BusinessSettingsAddress {
  addressLine1: string;
  city: string;
  postalCode: string;
}

/**
 * Mirrors the `businessSettings` Sanity schema type
 * (docs/development-guidelines.md Section 18 naming convention), narrowed to
 * the fields queried above. `legalCompanyName`/`legalRegistrationNumber`/
 * `legalTaxNumber`/`managingDirector` aren't Studio-required (content-model.md
 * marks them "Recommended before launch"), but are typed as required here
 * since every current consumer is a legal/contact-facing page that has no
 * meaningful fallback if they're absent — a missing value is a content gap
 * to fix in Studio, not a case for the frontend to design around.
 */
export interface BusinessSettings {
  phone: string;
  email: string;
  website: string;
  address: BusinessSettingsAddress;
  registeredOffice: BusinessSettingsAddress;
  legalCompanyName: string;
  legalRegistrationNumber: string;
  legalTaxNumber: string;
  managingDirector: string;
}

/**
 * Fetches the `BusinessSettings` singleton. Safe to call from React Server
 * Components (and only from server-side code — this uses the read-only
 * `sanityClient`, docs/architecture.md Section 15).
 *
 * The singleton is expected to always exist in a correctly configured
 * environment, so a missing document is treated as a configuration error
 * (task requirement, docs/development-guidelines.md Section 13) rather than
 * silently rendering blank business/legal information — it throws, which
 * Next.js surfaces via its default server-error handling (logged server-side,
 * generic message shown to visitors) unless a route-level `error.tsx` is
 * added later.
 */
export async function getBusinessSettings(): Promise<BusinessSettings> {
  const settings = await sanityClient.fetch<BusinessSettings | null>(
    BUSINESS_SETTINGS_QUERY,
    {},
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  if (!settings) {
    throw new Error(
      `BusinessSettings singleton document (_id: "${BUSINESS_SETTINGS_ID}") not found in Sanity. ` +
        "This is a content configuration error, not an expected empty state — create the document in Sanity Studio.",
    );
  }

  return settings;
}
