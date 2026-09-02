// Client-side cookie-consent state. The app currently sets only strictly
// necessary cookies itself; third-party cookies (Google sign-in / Maps) are the
// reason a choice is offered. `useCookieConsent()` exposes the choice so
// non-essential integrations can be gated on it later.

export const CONSENT_COOKIE = "cookie_consent";
export type ConsentValue = "all" | "necessary";

const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/** Fired to reopen the banner from a "Cookie settings" control. */
export const OPEN_COOKIE_SETTINGS_EVENT = "open-cookie-settings";
/** Fired after the stored choice changes, so other listeners can re-read it. */
export const COOKIE_CONSENT_CHANGED_EVENT = "cookie-consent-changed";

export function readConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)`),
  );
  const value = match ? decodeURIComponent(match[1]) : null;
  return value === "all" || value === "necessary" ? value : null;
}

export function writeConsent(value: ConsentValue): void {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
