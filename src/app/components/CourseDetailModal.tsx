"use client";

import Link from "next/link";
import type { DbCourse } from "@/app/types/course";
import { getCourseTitle, getCourseDescription } from "@/app/types/course";
import {
  IconX,
  IconCalendar,
  IconClock,
  IconUsers,
  IconBook,
  IconCircleCheck,
} from "@tabler/icons-react";
import { useLanguage } from "@/app/components/LanguageProvider";

const levelColors: Record<string, string> = {
  A1: "bg-success/20 text-success",
  A2: "bg-pistachio/20 text-pistachio",
  B1: "bg-sage/20 text-sage",
  B2: "bg-accent/20 text-accent",
  C1: "bg-ballet-slipper/20 text-ballet-slipper",
  C2: "bg-bubblegum/20 text-bubblegum",
};

const DE_WEEKDAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const DE_MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];
function formatDateDe(isoDate: string): string {
  const d = new Date(isoDate);
  return `${DE_WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()}. ${DE_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

interface CourseDetailModalProps {
  course: DbCourse | null;
  onClose: () => void;
}

export default function CourseDetailModal({ course, onClose }: CourseDetailModalProps) {
  const { language, t } = useLanguage();

  if (!course) return null;

  const title = getCourseTitle(course, language);
  const description = getCourseDescription(course, language);
  const startDate = formatDateDe(course.startDate);
  const enrolled = course._count?.enrollments ?? 0;
  const spotsLeft = course.maxCapacity - enrolled;
  const enrollmentPercent = Math.round((enrolled / course.maxCapacity) * 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-peacock/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-2xl">
        {/* Hero image */}
        <div className="relative h-56 w-full shrink-0 overflow-hidden">
          {course.image ? (
            <img src={course.image} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-foreground/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-peacock/80 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/20 text-white backdrop-blur-sm transition-colors hover:bg-background/40"
          >
            <IconX size={18} />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${levelColors[course.level]}`}>
                {course.level}
              </span>
              <span className="text-xs font-medium text-white/70">
                {t(`levels.${course.level}`)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <p className="text-sm leading-relaxed text-foreground/70">{description}</p>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-foreground/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <IconClock size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground/50">{t("courseDetail.schedule")}</p>
                <p className="text-sm font-semibold text-foreground">{course.scheduleDays}</p>
                <p className="text-sm text-foreground/70">{course.scheduleTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-foreground/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <IconCalendar size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground/50">{t("courseDetail.startDate")}</p>
                <p className="text-sm font-semibold text-foreground">{startDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-foreground/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <IconUsers size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground/50">{t("courseDetail.enrolled")}</p>
                <p className="text-sm font-semibold text-foreground">{enrolled} / {course.maxCapacity}</p>
                <div className="mt-1 h-1.5 w-24 rounded-full bg-foreground/10">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${enrollmentPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-foreground/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                <IconBook size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground/50">{t("courseDetail.modules")}</p>
                <p className="text-sm font-semibold text-foreground">{course.modules.length} modules</p>
              </div>
            </div>
          </div>

          {/* Modules */}
          {course.modules.length > 0 && (
            <div>
              <h3 className="mb-4 text-base font-bold text-foreground">{t("courseDetail.courseModules")}</h3>
              <div className="space-y-3">
                {course.modules.map((mod, i) => (
                  <div key={mod.id} className="flex gap-3 rounded-xl border border-foreground/5 bg-foreground/[0.02] p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <IconCircleCheck size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{i + 1}. {mod.titleDe}</p>
                      <p className="mt-0.5 text-xs text-foreground/50">{mod.descriptionDe}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 border-t border-foreground/10 bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-foreground">{course.price}</span>
              <span className="ml-2 text-sm text-foreground/50">
                {t("courseDetail.spotsLeft", { count: String(spotsLeft) })}
              </span>
            </div>
            <Link
              href={`/enroll/${course.id}`}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-ballet-slipper"
            >
              {t("courseDetail.enrollNow")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

