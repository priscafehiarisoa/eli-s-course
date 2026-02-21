"use client";

import type { Course } from "@/app/data/courses";
import {
  IconCalendar,
  IconClock,
  IconUsers,
  IconArrowRight,
} from "@tabler/icons-react";

const levelColors: Record<string, string> = {
  A1: "bg-success/30 text-success",
  A2: "bg-pistachio/30 text-pistachio",
  B1: "bg-sage/30 text-sage",
  B2: "bg-accent/30 text-accent",
  C1: "bg-ballet-slipper/30 text-ballet-slipper",
  C2: "bg-bubblegum/30 text-bubblegum",
};

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
}

export default function CourseCard({ course, onSelect }: CourseCardProps) {
  const startDate = new Date(course.startDate).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <button
      type="button"
      onClick={() => onSelect(course)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-background/10 bg-sapphire text-left shadow-sm transition-all hover:shadow-lg "
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold text-background">{course.title}
        {/* Level badge */}
        <span
            className={` rounded-full mx-3 px-3 pt-1 pb-1 text-xs font-bold bg-peacock/20 text-bubblegum`}
        >
          {course.level}
        </span>
        </h3>
        <p className="text-sm text-balance/50 line-clamp-2">
          {course.description}
        </p>

        {/* Schedule */}
        <div className="flex flex-col gap-1.5 text-sm text-balance/70">
          <div className="flex items-center gap-2">
            <IconClock size={15} className="text-primary" />
            <span>
              {course.schedule.days}, {course.schedule.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IconCalendar size={15} className="text-primary" />
            <span>Ab {startDate}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-background/5 pt-3">
          <div className="flex items-center font-semibold gap-1.5 text-sm text-balance/50">
            <IconUsers size={15} />
            <span>
              {course.enrolled}/{course.maxCapacity}
            </span>
          </div>
          <span className="text-lg font-bold text-background">
            {course.price}
          </span>
        </div>

        {/* CTA hint */}
        <div className="flex items-center gap-1 text-sm font-bold text-bubblegum transition-transform hover:underline ">
          View details
          <IconArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </button>
  );
}

