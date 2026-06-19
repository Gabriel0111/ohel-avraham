import type { Country } from "react-phone-number-input";

// ISO 639-1 codes for the languages we support — kept as a literal tuple so the
// Zod/Convex validators derive a proper string-literal union (not `string[]`).
export const LANGUAGE_VALUES = [
  "he",
  "en",
  "fr",
  "ru",
  "es",
  "ar",
  "am",
  "de",
  "it",
  "pt",
] as const;

export type LanguageCode = (typeof LANGUAGE_VALUES)[number];

export interface LanguageOption {
  /** Stored value (ISO 639-1 code). */
  value: LanguageCode;
  /** Native display name shown on the chip. */
  label: string;
  /** ISO country code used to render the flag. */
  country: Country;
}

// Languages commonly spoken across the Israeli host/guest community. The
// `country` field maps each language to a representative flag.
export const LANGUAGES: readonly LanguageOption[] = [
  { value: "he", label: "עברית", country: "IL" },
  { value: "en", label: "English", country: "US" },
  { value: "fr", label: "Français", country: "FR" },
  { value: "ru", label: "Русский", country: "RU" },
  { value: "es", label: "Español", country: "ES" },
  { value: "ar", label: "العربية", country: "SA" },
  { value: "am", label: "አማርኛ", country: "ET" },
  { value: "de", label: "Deutsch", country: "DE" },
  { value: "it", label: "Italiano", country: "IT" },
  { value: "pt", label: "Português", country: "BR" },
];

const LANGUAGE_BY_CODE = new Map(LANGUAGES.map((l) => [l.value, l]));

/** Resolve a stored language code to its option (label + flag), if known. */
export const getLanguage = (code: string): LanguageOption | undefined =>
  LANGUAGE_BY_CODE.get(code as LanguageCode);
