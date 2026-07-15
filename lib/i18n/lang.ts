// Server-safe language helpers. Kept out of `context.tsx` (a "use client"
// module) so the server layout can call them — exports of a client module
// become client references and can't run on the server.

import type { Language } from "./translations";

export const LANG_COOKIE = "lang";
export const LANGUAGES: readonly Language[] = ["en", "fr", "he"];

export function isLanguage(
  value: string | null | undefined,
): value is Language {
  return value != null && (LANGUAGES as readonly string[]).includes(value);
}

// Flag + short label per UI language — shown as-is (not translated) in the
// nav language switcher and the admin people table, same convention a native
// language switcher uses (each language names itself).
export const LANGUAGE_META: Record<Language, { label: string; flag: string }> = {
  en: { label: "EN", flag: "🇬🇧" },
  fr: { label: "FR", flag: "🇫🇷" },
  he: { label: "HE", flag: "🇮🇱" },
};
