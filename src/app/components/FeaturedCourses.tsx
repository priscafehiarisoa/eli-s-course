"use client";

import { useState } from "react";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { courses } from "@/app/data/courses";
import type { Course } from "@/app/data/courses";
import CourseCard from "@/app/components/CourseCard";
import CourseDetailModal from "@/app/components/CourseDetailModal";

export default function FeaturedCourses() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const featured = courses.slice(0, 3);

  return (
    <>
      <section className="relative mx-auto max-w-7xl py-24 mt-30">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Our Courses
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
              Start learning German today
            </h2>
            <p className="mt-3 max-w-lg text-base text-foreground/50">
              From beginner to proficiency — pick the level that matches your
              goals and join a class that fits your schedule.
            </p>
          </div>
          <Link
            href="/courses"
            className="flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-ballet-slipper"
          >
            View all courses
            <IconArrowRight size={16} />
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSelect={setSelectedCourse}
            />
          ))}
        </div>
      </section>

      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </>
  );
}

