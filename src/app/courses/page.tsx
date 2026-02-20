"use client";

import { useState } from "react";
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

  const filtered =
    activeLevel === "all"
      ? courses
      : courses.filter((c) => c.level === activeLevel);

  return (
    <>
      <div className="min-h-screen px-10">
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

          {/* Level filter */}
          <div className="mb-8 flex flex-wrap gap-2">
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
              No courses found for this level.
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

