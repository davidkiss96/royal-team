import { DEFAULT_CONSENT_STATE, type ConsentState } from "./types";

const STORAGE_KEY = "royal-team:consent";
const STORAGE_VERSION = 1;

interface StoredConsentPayload {
  version: number;
  state: ConsentState;
}

// Derived from the defaults (rather than hand-listed) so this file doesn't
// become a second place to update when a category is added in `types.ts`.
const KNOWN_CATEGORIES = Object.keys(DEFAULT_CONSENT_STATE) as (keyof ConsentState)[];

function isValidConsentState(value: unknown): value is ConsentState {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return KNOWN_CATEGORIES.every((key) => typeof record[key] === "boolean");
}

/**
 * Reads the visitor's previously stored consent choice. Returns `null` for
 * a first visit, a missing key, a different storage version, or any
 * malformed/unknown value — callers should treat `null` as "no consent
 * granted yet" (the privacy-safe default), never throw.
 */
export function readStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredConsentPayload> | null;
    if (!parsed || parsed.version !== STORAGE_VERSION || !isValidConsentState(parsed.state)) {
      return null;
    }

    return parsed.state;
  } catch {
    return null;
  }
}

/**
 * Persists the visitor's consent choice. Silently no-ops if storage is
 * unavailable (private browsing, quota exceeded, disabled) — consent simply
 * won't survive a reload in that case, which is the safe failure mode.
 */
export function writeStoredConsent(state: ConsentState): void {
  if (typeof window === "undefined") return;

  try {
    const payload: StoredConsentPayload = { version: STORAGE_VERSION, state };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore — see writeStoredConsent doc comment above.
  }
}
