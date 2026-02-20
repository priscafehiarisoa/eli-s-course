"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import { useTheme } from "@/app/components/ThemeProvider";
import { useLanguage } from "@/app/components/LanguageProvider";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/70 backdrop-blur-lg shadow-lg"
          : ""
      }`}
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-8 transition-all duration-300 ${scrolled ? "py-2" : "py-5"}`}>
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-ballet-slipper"
          >
            {t.home}
          </Link>
          <Link
            href="/courses"
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-ballet-slipper"
          >
            {t.courses}
          </Link>
        </div>

        {/* Right side: theme, language, login */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:text-ballet-slipper"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* Language switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "fr" : "en")}
            className="flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-foreground/70 transition-colors hover:text-ballet-slipper"
            aria-label="Switch language"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {language.toUpperCase()}
          </button>

          {/*/!* Login link *!/*/}
          {/*<Link*/}
          {/*  href="/login"*/}
          {/*  className="flex items-center gap-1 text-sm font-medium text-foreground/70 transition-colors hover:text-ballet-slipper"*/}
          {/*>*/}
          {/*  Log in*/}
          {/*  <svg*/}
          {/*    xmlns="http://www.w3.org/2000/svg"*/}
          {/*    width="16"*/}
          {/*    height="16"*/}
          {/*    viewBox="0 0 24 24"*/}
          {/*    fill="none"*/}
          {/*    stroke="currentColor"*/}
          {/*    strokeWidth="2"*/}
          {/*    strokeLinecap="round"*/}
          {/*    strokeLinejoin="round"*/}
          {/*  >*/}
          {/*    <line x1="5" y1="12" x2="19" y2="12" />*/}
          {/*    <polyline points="12 5 19 12 12 19" />*/}
          {/*  </svg>*/}
          {/*</Link>*/}
        </div>
      </div>
    </nav>
  );
}

