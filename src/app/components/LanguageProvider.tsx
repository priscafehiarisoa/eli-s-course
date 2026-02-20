"use client";

import { createContext, useContext, useState } from "react";

type Language = "en" | "fr";

type Translations = {
  courses: string;
  home: string;
  language: string;
};

const translations: Record<Language, Translations> = {
  en: {
    courses: "Courses",
    home: "Home",
    language: "Language",
  },
  fr: {
    courses: "Cours",
    home: "Accueil",
    language: "Langue",
  },
};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

