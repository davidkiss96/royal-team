"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_CONSENT_STATE,
  hasConsent as evaluateConsent,
  type ConsentCategory,
  type ConsentState,
  type OptionalConsentCategory,
} from "./types";
import { readStoredConsent, writeStoredConsent } from "./storage";

/**
 * The one place consent state lives for the whole app — a small external
 * store (React's `useSyncExternalStore`, the primitive built for exactly
 * this: state that comes from outside React and must render identically on
 * the server and during client hydration before switching to the real,
 * persisted value). No Context/Provider is needed since there is exactly
 * one store for the whole app, the same way a module-level store would work
 * without one.
 *
 * `getServerSnapshot` always returns the privacy-safe default, so server
 * output and the first client render match; `getSnapshot` lazily reads the
 * visitor's stored choice once on the client, then serves it from memory.
 */
let clientState: ConsentState = DEFAULT_CONSENT_STATE;
let hasReadStorage = false;
const listeners = new Set<() => void>();

function getSnapshot(): ConsentState {
  if (!hasReadStorage) {
    hasReadStorage = true;
    const stored = readStoredConsent();
    if (stored) clientState = stored;
  }
  return clientState;
}

function getServerSnapshot(): ConsentState {
  return DEFAULT_CONSENT_STATE;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function updateState(next: ConsentState) {
  clientState = next;
  hasReadStorage = true;
  writeStoredConsent(next);
  listeners.forEach((listener) => listener());
}

interface UseConsentResult {
  hasConsent: (category: ConsentCategory) => boolean;
  /** Grants one optional category and persists the change. */
  grant: (category: OptionalConsentCategory) => void;
  /** Revokes one optional category and persists the change. */
  revoke: (category: OptionalConsentCategory) => void;
}

export function useConsent(): UseConsentResult {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    hasConsent: (category) => evaluateConsent(state, category),
    grant: (category) => updateState({ ...state, [category]: true }),
    revoke: (category) => updateState({ ...state, [category]: false }),
  };
}
