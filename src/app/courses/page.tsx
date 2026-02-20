"use client";

import { useState } from "react";
import { IconSearch, IconX } from "@tabler/icons-react";
import { courses } from "@/app/data/courses";
import type { Course, CourseLevel } from "@/app/data/courses";
import CourseCard from "@/app/components/CourseCard";
import CourseDetailModal from "@/app/components/CourseDetailModal";

const levels: ("all" | CourseLevel)[] = [
  "all",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLevel, setActiveLevel] = useState<"all" | CourseLevel>("all");
  const [search, setSearch] = useState("");

  const filtered = courses.filter((c) => {
    const matchesLevel = activeLevel === "all" || c.level === activeLevel;
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.level.toLowerCase().includes(query) ||
      c.modules.some((m) => m.title.toLowerCase().includes(query));
    return matchesLevel && matchesSearch;
  });

  return (
    <>
      <div className="min-h-screen px-10 mt-20">
        <div className="mx-auto max-w-7xl pt-32 pb-20">
          {/* Header */}
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Browse
            </p>
            <h1 className="mt-2 text-4xl font-bold text-foreground md:text-5xl">
              All Courses
            </h1>
            <p className="mt-3 max-w-lg text-base text-foreground/50">
              Find the perfect German course for your level. Filter by
              proficiency and start learning at your own pace.
            </p>
          </div>

          {/* Search bar + Level filter */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-sm">
              <IconSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses, modules…"
                className="w-full rounded-full border border-foreground/10 bg-foreground/5 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground"
                >
                  <IconX size={16} />
                </button>
              )}
            </div>

            {/* Level filter */}
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    activeLevel === level
                      ? "bg-accent text-background"
                      : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                  }`}
                >
                  {level === "all" ? "All Levels" : level}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={setSelectedCourse}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-12 text-center text-foreground/40">
              No courses found{search ? ` for "${search}"` : " for this level"}.
            </p>
          )}
        </div>
      </div>

      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </>
  );
}

