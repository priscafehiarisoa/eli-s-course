"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import { useLanguage } from "@/app/components/LanguageProvider";
import type { Language } from "@/app/components/LanguageProvider";

const languages: Language[] = ["en", "fr", "de"];

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/70 backdrop-blur-lg shadow-lg" : ""
      }`}
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-8 transition-all duration-300 ${scrolled ? "py-2" : "py-5"}`}>
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-foreground/70 transition-colors hover:text-ballet-slipper">
            {t("nav.home")}
          </Link>
          <Link href="/courses" className="text-sm font-medium text-foreground/70 transition-colors hover:text-ballet-slipper">
            {t("nav.courses")}
          </Link>
        </div>

        {/* Right side: language switcher */}
        <div className="relative flex items-center gap-4">
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="flex h-9 items-center gap-1.5 rounded-full border border-foreground/15 px-3 text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground"
            aria-label="Switch language"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {language.toUpperCase()}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown */}
          {langOpen && (
            <div className="absolute right-0 top-12 w-28 rounded-xl border border-foreground/10 bg-background shadow-lg overflow-hidden z-50">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setLangOpen(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-foreground/5 ${
                    language === lang ? "text-accent" : "text-foreground/70"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 EN" : lang === "fr" ? "🇫🇷 FR" : "🇩🇪 DE"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
