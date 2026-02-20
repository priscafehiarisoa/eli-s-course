"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconUsers,
  IconSend,
  IconCircleCheck,
} from "@tabler/icons-react";
import { courses } from "@/app/data/courses";

const levelLabels: Record<string, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper-Intermediate",
  C1: "Advanced",
  C2: "Proficiency",
};

const levelColors: Record<string, string> = {
  A1: "bg-success/20 text-success",
  A2: "bg-pistachio/20 text-pistachio",
  B1: "bg-sage/20 text-sage",
  B2: "bg-accent/20 text-accent",
  C1: "bg-ballet-slipper/20 text-ballet-slipper",
  C2: "bg-bubblegum/20 text-bubblegum",
};

export default function EnrollPage() {
  const params = useParams();
  const router = useRouter();
  const course = courses.find((c) => c.id === params.courseId);

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

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center px-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Course not found
          </h1>
          <p className="mt-2 text-foreground/50">
            The course you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-ballet-slipper"
          >
            <IconArrowLeft size={16} />
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(course.startDate).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const spotsLeft = course.maxCapacity - course.enrolled;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-10">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <IconCircleCheck size={32} className="text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Enrollment Confirmed!
          </h1>
          <p className="mt-3 text-foreground/60">
            You have successfully enrolled in{" "}
            <strong>{course.title}</strong>. A confirmation email has been sent
            to <strong>{form.email}</strong>.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/courses"
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-ballet-slipper"
            >
              Browse more courses
            </Link>
            <Link
              href="/"
              className="rounded-full border border-foreground/15 px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5"
            >
              Back to home
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
          Back to courses
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Left — Form */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-foreground">Enrollment</h1>
            <p className="mt-2 text-foreground/50">
              Fill in your details to enroll in this course.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Name row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-1.5 block text-sm font-medium text-foreground/70"
                  >
                    Nom <span className="text-accent">*</span>
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
                    Prénom <span className="text-accent">*</span>
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
                  Rue <span className="text-accent">*</span>
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
                    Code postale <span className="text-accent">*</span>
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
                    Ville <span className="text-accent">*</span>
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
                  Adresse E-Mail <span className="text-accent">*</span>
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
                  Data Protection
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
                  <span className="text-xs leading-relaxed text-foreground/60">
                    I agree that my personal data (last name, first name,
                    address, email) may be collected and processed as part of
                    my enrollment in this course. This data will be used solely
                    for the management of my enrollment and will not be shared
                    with third parties without my consent. I may request the
                    deletion of my data at any time by contacting the training
                    organization.{" "}
                    <span className="text-accent">*</span>
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !form.consent}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-ballet-slipper disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  "Inscription en cours..."
                ) : (
                  <>
                    <IconSend size={16} />
                    Confirmer l&apos;inscription
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right — Course summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 rounded-2xl border border-foreground/10 bg-foreground/[0.02] overflow-hidden">
              {/* Course image */}
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-peacock/60 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${levelColors[course.level]}`}
                  >
                    {course.level}
                  </span>
                  <span className="text-xs font-medium text-white/80">
                    {levelLabels[course.level]}
                  </span>
                </div>
              </div>

              {/* Course info */}
              <div className="p-5 space-y-4">
                <h2 className="text-lg font-bold text-foreground">
                  {course.title}
                </h2>
                <p className="text-xs text-foreground/50 leading-relaxed">
                  {course.description}
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm text-foreground/60">
                    <IconClock size={16} className="text-primary" />
                    <span>
                      {course.schedule.days}, {course.schedule.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-foreground/60">
                    <IconCalendar size={16} className="text-primary" />
                    <span>Ab {startDate}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-foreground/60">
                    <IconUsers size={16} className="text-primary" />
                    <span>
                      {course.enrolled}/{course.maxCapacity} enrolled —{" "}
                      <strong className="text-accent">
                        {spotsLeft} spots left
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Modules preview */}
                <div>
                  <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">
                    Modules
                  </p>
                  <ul className="space-y-1.5">
                    {course.modules.map((mod, i) => (
                      <li
                        key={mod.title}
                        className="flex items-start gap-2 text-xs text-foreground/50"
                      >
                        <IconCircleCheck
                          size={14}
                          className="mt-0.5 shrink-0 text-primary"
                        />
                        {mod.title}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <div className="border-t border-foreground/10 pt-4 flex items-center justify-between">
                  <span className="text-xs text-foreground/50">Total</span>
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

