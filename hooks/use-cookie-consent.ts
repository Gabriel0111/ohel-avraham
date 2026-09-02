"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  CONSENT_COOKIE,
  COOKIE_CONSENT_CHANGED_EVENT,
  readConsent,
  writeConsent,
  type ConsentValue,
} from "@/lib/cookie-consent";

function subscribe(callback: () => void) {
  window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, callback);
  return () => window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, callback);
}

interface CookieConsentState {
  /** null until read on the client, then "all" | "necessary". */
  consent: ConsentValue | null;
  /** True once the client has read the cookie (avoids an SSR flash). */
  ready: boolean;
  /** True when the user opted into non-essential (third-party) cookies. */
  acceptedAll: boolean;
  set: (value: ConsentValue) => void;
}

export function useCookieConsent(): CookieConsentState {
  // Cookies are an external store: read via getSnapshot, re-read whenever our
  // change event fires. getServerSnapshot returns the pre-hydration values.
  const consent = useSyncExternalStore(subscribe, readConsent, () => null);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const set = useCallback((value: ConsentValue) => {
    writeConsent(value);
    window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGED_EVENT));
  }, []);

  return { consent, ready, acceptedAll: consent === "all", set };
}

export { CONSENT_COOKIE };
