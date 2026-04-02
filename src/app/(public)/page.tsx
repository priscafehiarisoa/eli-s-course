"use client";

import Link from "next/link";
import FeaturedCourses from "@/app/components/FeaturedCourses";
import { useLanguage } from "@/app/components/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();
  const mainImage = "/principal.jpeg";

  return (
    <div className="relative min-h-screen overflow-hidden px-6 sm:px-10">
      <div className="pointer-events-none absolute inset-0 grid-overlay" />

      <section className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 pt-28 lg:flex-row lg:pt-32">
        <div className="flex max-w-xl flex-col gap-8 lg:w-1/2">
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-6xl lg:mt-10">
            {t("home.title")}
          </h1>
          <p className="text-lg leading-8 text-foreground/60">
            {t("home.subtitle")}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/courses" className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background shadow-sm shadow-accent/30 transition-colors hover:bg-ballet-slipper">
              {t("home.cta")}
            </Link>
          </div>
        </div>

        <div className="relative hidden h-[400px] w-1/2 lg:block lg:w-1/2">
          <div className="absolute left-3 h-full w-1/2 overflow-hidden rounded-2xl shadow-2xl">
            <img src={mainImage} alt="People collaborating" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <FeaturedCourses />
    </div>
  );
}
