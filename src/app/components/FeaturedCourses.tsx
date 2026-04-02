"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import type { DbCourse } from "@/app/types/course";
import CourseCard from "@/app/components/CourseCard";
import CourseDetailModal from "@/app/components/CourseDetailModal";
import { useLanguage } from "@/app/components/LanguageProvider";

export default function FeaturedCourses() {
  const [courses, setCourses] = useState<DbCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<DbCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => {
        if (!r.ok) {
          throw new Error("Failed to fetch courses");
        }
        return r.json();
      })
      .then((data: DbCourse[]) => setCourses(data.slice(0, 3)))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  let content: React.ReactNode;
  if (fetchError) {
    content = (
      <p className="text-center text-sm text-foreground/50 py-12">
        Impossible de charger les cours pour le moment.
      </p>
    );
  } else if (loading) {
    content = (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl bg-foreground/5" />
        ))}
      </div>
    );
  } else if (courses.length === 0) {
    content = (
      <p className="text-center text-sm text-foreground/50 py-12">
        Aucun cours a venir pour le moment.
      </p>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onSelect={setSelectedCourse} />
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="relative mx-auto max-w-7xl py-24 ">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              {t("featured.label")}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
              {t("featured.title")}
            </h2>
            <p className="mt-3 max-w-lg text-base text-foreground/50">
              {t("featured.subtitle")}
            </p>
          </div>
          <Link
            href="/courses"
            className="flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-ballet-slipper"
          >
            {t("featured.viewAll")}
            <IconArrowRight size={16} />
          </Link>
        </div>

        {/* Cards grid */}
        {content}
      </section>

      <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </>
  );
}

