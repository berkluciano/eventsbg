"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations, type Locale } from "@/lib/translations";

type AnyTranslation = typeof translations.bg | typeof translations.en;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: AnyTranslation;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "bg",
  setLocale: () => {},
  t: translations.bg as AnyTranslation,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("bg");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "en" || saved === "bg") setLocaleState(saved);
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
