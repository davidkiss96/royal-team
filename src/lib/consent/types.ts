/**
 * Consent categories this site can request. "necessary" always evaluates to
 * true and is never stored — it exists here only so `hasConsent` has one
 * uniform API for every category. Every other member of this union is an
 * "optional" category: it must have a default in `DEFAULT_CONSENT_STATE`
 * below (TypeScript enforces this — add a category here and the file won't
 * compile until you do), and it is off by default until the visitor grants
 * it.
 *
 * V1 only uses "externalServices" (Google Maps). Adding a future V2 category
 * (e.g. "analytics" | "marketing") is a one-line addition to this union plus
 * a default in `DEFAULT_CONSENT_STATE` — no other file in `src/lib/consent`
 * needs to change.
 */
export type ConsentCategory = "necessary" | "externalServices";

export type OptionalConsentCategory = Exclude<ConsentCategory, "necessary">;

export type ConsentState = {
  [K in OptionalConsentCategory]: boolean;
};

/** Privacy-safe default: every optional category starts ungranted. */
export const DEFAULT_CONSENT_STATE: ConsentState = {
  externalServices: false,
};

/**
 * The single place that decides whether a category is granted. Deliberately
 * knows nothing about Google Maps, GA4, Meta Pixel, or any other vendor —
 * callers (feature components) are the ones that know which category they
 * depend on.
 */
export function hasConsent(state: ConsentState, category: ConsentCategory): boolean {
  if (category === "necessary") return true;
  return state[category] === true;
}
