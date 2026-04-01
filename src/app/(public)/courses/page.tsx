"use client";

import { useState, useEffect } from "react";
import { IconSearch, IconX } from "@tabler/icons-react";
import type { DbCourse } from "@/app/types/course";
import { getCourseTitle, getCourseDescription } from "@/app/types/course";
import CourseCard from "@/app/components/CourseCard";
import CourseDetailModal from "@/app/components/CourseDetailModal";
import { useLanguage } from "@/app/components/LanguageProvider";

const LEVELS = ["all", "A1", "A2", "B1", "B2", "C1", "C2"] as const;
type LevelFilter = (typeof LEVELS)[number];

export default function CoursesPage() {
  const [courses, setCourses] = useState<DbCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<DbCourse | null>(null);
  const [activeLevel, setActiveLevel] = useState<LevelFilter>("all");
  const [search, setSearch] = useState("");
  const { language, t } = useLanguage();

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data: DbCourse[]) => { setCourses(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) => {
    const matchesLevel = activeLevel === "all" || c.level === activeLevel;
    const query = search.toLowerCase();
    const title = getCourseTitle(c, language).toLowerCase();
    const desc = getCourseDescription(c, language).toLowerCase();
    const matchesSearch =
      !query ||
      title.includes(query) ||
      desc.includes(query) ||
      c.level.toLowerCase().includes(query) ||
      c.modules.some((m) => m.titleDe.toLowerCase().includes(query));
    return matchesLevel && matchesSearch;
  });

  return (
    <>
      <div className="min-h-screen px-10 mt-20">
        <div className="mx-auto max-w-7xl pt-32 pb-20">
          {/* Header */}
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              {t("courses.label")}
            </p>
            <h1 className="mt-2 text-4xl font-bold text-foreground md:text-5xl">
              {t("courses.title")}
            </h1>
            <p className="mt-3 max-w-lg text-base text-foreground/50">
              {t("courses.subtitle")}
            </p>
          </div>

          {/* Search bar + Level filter */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("courses.searchPlaceholder")}
                className="w-full rounded-full border border-foreground/10 bg-foreground/5 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground">
                  <IconX size={16} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    activeLevel === level
                      ? "bg-accent text-background"
                      : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                  }`}
                >
                  {level === "all" ? t("courses.allLevels") : level}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl bg-foreground/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} onSelect={setSelectedCourse} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="mt-12 text-center text-foreground/40">
              {search ? t("courses.noResultsFor", { search }) : t("courses.noResultsLevel")}
            </p>          )}
        </div>
      </div>
      <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </>
  );
}