"use client";

import type { DbCourse } from "@/app/types/course";
import { getCourseTitle, getCourseDescription } from "@/app/types/course";
import { IconCalendar, IconClock, IconUsers, IconArrowRight } from "@tabler/icons-react";
import { useLanguage } from "@/app/components/LanguageProvider";

const DE_MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];
function formatDateDe(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()}. ${DE_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

interface CourseCardProps {
  course: DbCourse;
  onSelect: (course: DbCourse) => void;
}

export default function CourseCard({ course, onSelect }: CourseCardProps) {
  const { language, t } = useLanguage();
  const title = getCourseTitle(course, language);
  const description = getCourseDescription(course, language);
  const startDate = formatDateDe(course.startDate);
  const enrolled = course._count?.enrollments ?? 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(course)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-sapphire text-left shadow-sm transition-all hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {course.image ? (
          <img
            src={course.image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-foreground/5" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold text-foreground">
          {title}
          <span className="rounded-full mx-3 px-3 pt-1 pb-1 text-xs font-bold bg-peacock/20 text-bubblegum">
            {course.level}
          </span>
        </h3>
        <p className="text-sm text-balance/50 line-clamp-2">{description}</p>

        {/* Schedule */}
        <div className="flex flex-col gap-1.5 text-sm text-balance/70">
          <div className="flex items-center gap-2">
            <IconClock size={15} className="text-primary" />
            <span>{course.scheduleDays}, {course.scheduleTime}</span>
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
            <span>{enrolled}/{course.maxCapacity}</span>
          </div>
          <span className="text-lg font-bold text-foreground">{course.price}</span>
        </div>

        {/* CTA hint */}
        <div className="flex items-center gap-1 text-sm font-bold text-accent transition-transform hover:underline">
          {t("courses.viewDetails")}
          <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}
