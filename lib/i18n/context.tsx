"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type Language } from "./translations";
import { LANG_COOKIE, isLanguage } from "./lang";
import { parseError, type ErrorKey } from "@/lib/errors";

type T = (typeof translations)[Language];

const LANG_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: T;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({
  children,
  initialLang = "en",
}: {
  children: ReactNode;
  initialLang?: Language;
}) {
  // Seeded from the server-read cookie so SSR and the first client render agree
  // on the language — no flash of English that then flips back.
  const [lang, setLangState] = useState<Language>(initialLang);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(LANG_COOKIE, newLang);
    // Cookie is the SSR source of truth; keep it in sync on every change.
    document.cookie = `${LANG_COOKIE}=${newLang}; path=/; max-age=${LANG_MAX_AGE}; samesite=lax`;
  };

  // One-time migration for users who chose a language before it was stored in a
  // cookie (legacy localStorage-only). Runs only while no cookie exists, so the
  // common cookie-backed path never re-renders and never flickers.
  useEffect(() => {
    if (readCookie(LANG_COOKIE)) return;
    const stored = localStorage.getItem(LANG_COOKIE);
    if (isLanguage(stored) && stored !== lang) {
      setLang(stored);
    }
  }, [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  return useContext(LanguageContext);
}

/**
 * Returns a parser that turns any Better Auth / Convex error into a clean,
 * localized string ready to hand straight to `toast.error(...)`. Unknown
 * codes fall back to `fallbackKey` (default `unexpected`) so a call site can
 * supply a more specific default, e.g. `profileCreateFailed`. Mirrors the
 * `useEnumLabel` idiom (reads `useT()`, returns a mapper).
 */
export function useErrorMessage() {
  const { t } = useContext(LanguageContext);
  return (e: unknown, fallbackKey: ErrorKey = "unexpected"): string => {
    const parsed = parseError(e);
    const key = parsed.key === "unexpected" ? fallbackKey : parsed.key;
    const data = parsed.data;
    const entry = (
      t.errors as Record<
        string,
        string | ((d?: Record<string, unknown>) => string)
      >
    )[key];
    const resolved = entry ?? t.errors.unexpected;
    return typeof resolved === "function" ? resolved(data) : resolved;
  };
}

export function useEnumLabel() {
  const { t } = useContext(LanguageContext);
  return {
    sector: (v: string) => (t.enums.sector as Record<string, string>)[v] ?? v,
    ethnicity: (v: string) =>
      (t.enums.ethnicity as Record<string, string>)[v] ?? v,
    gender: (v: string) => (t.enums.gender as Record<string, string>)[v] ?? v,
    kashrout: (v: string) =>
      (t.enums.kashrout as Record<string, string>)[v] ?? v,
  };
}
