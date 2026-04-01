"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconUsers,
  IconSend,
  IconCircleCheck,
} from "@tabler/icons-react";
import type { DbCourse } from "@/app/types/course";
import { getCourseTitle, getCourseDescription } from "@/app/types/course";
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

export default function EnrollPage() {
  const params = useParams();
  const { language, t } = useLanguage();

  const [course, setCourse] = useState<DbCourse | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    street: "",
    postalCode: "",
    city: "",
    email: "",
    consent: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!params?.courseId) return;
    fetch(`/api/courses/${params.courseId}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); setLoadingCourse(false); return null; }
        return r.json();
      })
      .then((data) => { if (data) { setCourse(data); setLoadingCourse(false); } })
      .catch(() => { setNotFound(true); setLoadingCourse(false); });
  }, [params?.courseId]);

  if (loadingCourse) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-48 animate-pulse rounded-full bg-foreground/10" />
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center px-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {t("enroll.notFound")}
          </h1>
          <p className="mt-2 text-foreground/50">
            {t("enroll.notFoundDesc")}
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-ballet-slipper"
          >
            <IconArrowLeft size={16} />
            {t("enroll.backToCourses")}
          </Link>
        </div>
      </div>
    );
  }

  const title = getCourseTitle(course, language);
  const description = getCourseDescription(course, language);
  const startDate = formatDateDe(course.startDate);
  const enrolled = course._count?.enrollments ?? 0;
  const spotsLeft = course.maxCapacity - enrolled;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!course) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          street: form.street,
          postalCode: form.postalCode,
          city: form.city,
          email: form.email,
          courseId: course.id,
          locale: language,
          consent: form.consent,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setSubmitError(data.error || t("enroll.errorGeneric"));
      }
    } catch {
      setSubmitError(t("enroll.errorGeneric"));
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-10">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <IconCircleCheck size={32} className="text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("enroll.successTitle")}
          </h1>
          <p className="mt-3 text-foreground/60">
            {t("enroll.successDesc", {
              course: title,
              email: form.email,
            })}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/courses"
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-ballet-slipper"
            >
              {t("enroll.browseMore")}
            </Link>
            <Link
              href="/"
              className="rounded-full border border-foreground/15 px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5"
            >
              {t("enroll.backToHome")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-10">
      <div className="mx-auto max-w-5xl pt-32 pb-20">
        {/* Back link */}
        <Link
          href="/courses"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/50 transition-colors hover:text-foreground"
        >
          <IconArrowLeft size={16} />
          {t("enroll.backToCourses")}
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Left — Form */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-foreground">
              {t("enroll.title")}
            </h1>
            <p className="mt-2 text-foreground/50">
              {t("enroll.subtitle")}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Name row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-1.5 block text-sm font-medium text-foreground/70"
                  >
                    {t("enroll.lastName")}{" "}
                    <span className="text-accent">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Dupont"
                    className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-1.5 block text-sm font-medium text-foreground/70"
                  >
                    {t("enroll.firstName")}{" "}
                    <span className="text-accent">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Marie"
                    className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Street */}
              <div>
                <label
                  htmlFor="street"
                  className="mb-1.5 block text-sm font-medium text-foreground/70"
                >
                  {t("enroll.street")}{" "}
                  <span className="text-accent">*</span>
                </label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  required
                  value={form.street}
                  onChange={handleChange}
                  placeholder="Musterstraße 12"
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Postal code + City */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="postalCode"
                    className="mb-1.5 block text-sm font-medium text-foreground/70"
                  >
                    {t("enroll.postalCode")}{" "}
                    <span className="text-accent">*</span>
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    required
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="75001"
                    className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="city"
                    className="mb-1.5 block text-sm font-medium text-foreground/70"
                  >
                    {t("enroll.city")}{" "}
                    <span className="text-accent">*</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Paris"
                    className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-foreground/70"
                >
                  {t("enroll.email")}{" "}
                  <span className="text-accent">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="marie.dupont@example.com"
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Consent */}
              <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  {t("enroll.dataProtection")}
                </h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    checked={form.consent}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 rounded border-foreground/30 accent-accent"
                  />
                  <span className="text-sm leading-relaxed text-foreground/60">
                    {t("enroll.consentText")}{" "}
                    <span className="text-accent">*</span>
                  </span>
                </label>
              </div>

              {/* Course full warning */}
              {spotsLeft <= 0 && (
                <div className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
                  {t("enroll.courseFull")}
                </div>
              )}

              {/* Submit error */}
              {submitError && (
                <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-500">
                  {submitError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !form.consent || spotsLeft <= 0}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-ballet-slipper disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  t("enroll.submitting")
                ) : (
                  <>
                    <IconSend size={16} />
                    {t("enroll.submit")}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right — Course summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 rounded-2xl border border-foreground/10 bg-foreground/[0.02] overflow-hidden">
              {/* Course image */}
              {course.image && (
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={course.image}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-peacock/60 to-transparent" />
                </div>
              )}

              {/* Course info */}
              <div className="p-5 space-y-4">
                <h2 className="text-lg font-bold text-foreground">
                  {title}
                </h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-sm font-bold ${levelColors[course.level]}`}
                  >
                    {course.level}
                  </span>
                  <span className="text-sm font-medium text-foreground/60">
                    {t(`levels.${course.level}`)}
                  </span>
                </div>
                <p className="text-sm text-foreground/50 leading-relaxed">
                  {description}
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm text-foreground/60">
                    <IconClock size={16} className="text-primary" />
                    <span>
                      {course.scheduleDays}, {course.scheduleTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-foreground/60">
                    <IconCalendar size={16} className="text-primary" />
                    <span>
                      {t("enroll.startingFrom")} {startDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-foreground/60">
                    <IconUsers size={16} className="text-primary" />
                    <span>
                      {enrolled}/{course.maxCapacity} —{" "}
                      <strong className="text-accent">
                        {t("enroll.spotsLeft", { count: String(spotsLeft) })}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Modules preview */}
                <div>
                  <p className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-2">
                    {t("courseDetail.modules")}
                  </p>
                  <ul className="space-y-1.5">
                    {course.modules.map((mod) => (
                      <li
                        key={mod.id}
                        className="flex items-start gap-2 text-sm text-foreground/50"
                      >
                        <IconCircleCheck
                          size={14}
                          className="mt-0.5 shrink-0 text-primary"
                        />
                        {mod.titleDe}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <div className="border-t border-foreground/10 pt-4 flex items-center justify-between">
                  <span className="text-xs text-foreground/50">
                    {t("enroll.totalLabel")}
                  </span>
                  <span className="text-xl font-bold text-foreground">
                    {course.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

