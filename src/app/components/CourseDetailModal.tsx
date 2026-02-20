"use client";

import type { Course } from "@/app/data/courses";
import {
  IconX,
  IconCalendar,
  IconClock,
  IconUsers,
  IconBook,
  IconCircleCheck,
} from "@tabler/icons-react";

const levelColors: Record<string, string> = {
  A1: "bg-success/20 text-success",
  A2: "bg-pistachio/20 text-pistachio",
  B1: "bg-sage/20 text-sage",
  B2: "bg-accent/20 text-accent",
  C1: "bg-ballet-slipper/20 text-ballet-slipper",
  C2: "bg-bubblegum/20 text-bubblegum",
};

const levelLabels: Record<string, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper-Intermediate",
  C1: "Advanced",
  C2: "Proficiency",
};

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
}

export default function CourseDetailModal({
  course,
  onClose,
}: CourseDetailModalProps) {
  if (!course) return null;

  const startDate = new Date(course.startDate).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const spotsLeft = course.maxCapacity - course.enrolled;
  const enrollmentPercent = Math.round(
    (course.enrolled / course.maxCapacity) * 100,
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-peacock/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-2xl">
        {/* Hero image */}
        <div className="relative h-56 w-full shrink-0 overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-peacock/80 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/20 text-white backdrop-blur-sm transition-colors hover:bg-background/40"
          >
            <IconX size={18} />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${levelColors[course.level]}`}
              >
                {course.level}
              </span>
              <span className="text-xs font-medium text-white/70">
                {levelLabels[course.level]}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">{course.title}</h2>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Description */}
          <p className="text-sm leading-relaxed text-foreground/70">
            {course.description}
          </p>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-foreground/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <IconClock size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground/50">
                  Schedule
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {course.schedule.days}
                </p>
                <p className="text-sm text-foreground/70">
                  {course.schedule.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-foreground/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <IconCalendar size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground/50">
                  Start Date
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {startDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-foreground/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <IconUsers size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground/50">
                  Enrolled
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {course.enrolled} / {course.maxCapacity}
                </p>
                {/* Progress bar */}
                <div className="mt-1 h-1.5 w-24 rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${enrollmentPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-foreground/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                <IconBook size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground/50">
                  Modules
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {course.modules.length} modules
                </p>
              </div>
            </div>
          </div>

          {/* Modules */}
          <div>
            <h3 className="mb-4 text-base font-bold text-foreground">
              Course Modules
            </h3>
            <div className="space-y-3">
              {course.modules.map((mod, i) => (
                <div
                  key={mod.title}
                  className="flex gap-3 rounded-xl border border-foreground/5 bg-foreground/[0.02] p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <IconCircleCheck size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {i + 1}. {mod.title}
                    </p>
                    <p className="mt-0.5 text-xs text-foreground/50">
                      {mod.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 border-t border-foreground/10 bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-foreground">
                {course.price}
              </span>
              <span className="ml-2 text-sm text-foreground/50">
                {spotsLeft} spots left
              </span>
            </div>
            <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-ballet-slipper">
              Enroll now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

