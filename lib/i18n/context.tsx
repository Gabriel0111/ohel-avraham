"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type Language } from "./translations";

type T = (typeof translations)[Language];

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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Language | null;
    if (stored && stored in translations) {
      setLangState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  return useContext(LanguageContext);
}

export function useEnumLabel() {
  const { t } = useContext(LanguageContext);
  return {
    sector: (v: string) =>
      (t.enums.sector as Record<string, string>)[v] ?? v,
    ethnicity: (v: string) =>
      (t.enums.ethnicity as Record<string, string>)[v] ?? v,
    gender: (v: string) =>
      (t.enums.gender as Record<string, string>)[v] ?? v,
    kashrout: (v: string) =>
      (t.enums.kashrout as Record<string, string>)[v] ?? v,
  };
}
