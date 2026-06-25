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
