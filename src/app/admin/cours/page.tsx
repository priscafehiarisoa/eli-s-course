"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconPlus, IconEdit, IconTrash, IconUsers, IconArrowLeft, IconCheck, IconX,
} from "@tabler/icons-react";

type CourseTranslation = { locale: string; title: string; description: string };
type Course = {
  id: string;
  slug: string;
  level: string;
  image: string;
  price: string;
  maxCapacity: number;
  startDate: string;
  scheduleDays: string;
  scheduleTime: string;
  translations: CourseTranslation[];
  _count?: { enrollments: number };
};

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const EMPTY_FORM = {
  slug: "", level: "A1", image: "", price: "", maxCapacity: "",
  startDate: "", scheduleDays: "", scheduleTime: "",
  titleEn: "", descriptionEn: "",
  titleFr: "", descriptionFr: "",
  titleDe: "", descriptionDe: "",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    const res = await fetch("/api/courses");
    const data = await res.json();
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingSlug(null);
    setError("");
    setShowForm(true);
  };

  const openEdit = (course: Course) => {
    const en = course.translations.find((t) => t.locale === "en");
    const fr = course.translations.find((t) => t.locale === "fr");
    const de = course.translations.find((t) => t.locale === "de");
    setForm({
      slug: course.slug,
      level: course.level,
      image: course.image,
      price: course.price,
      maxCapacity: String(course.maxCapacity),
      startDate: course.startDate.split("T")[0],
      scheduleDays: course.scheduleDays,
      scheduleTime: course.scheduleTime,
      titleEn: en?.title || "", descriptionEn: en?.description || "",
      titleFr: fr?.title || "", descriptionFr: fr?.description || "",
      titleDe: de?.title || "", descriptionDe: de?.description || "",
    });
    setEditingSlug(course.slug);
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      slug: form.slug,
      level: form.level,
      image: form.image,
      price: form.price,
      maxCapacity: Number(form.maxCapacity),
      startDate: form.startDate,
      scheduleDays: form.scheduleDays,
      scheduleTime: form.scheduleTime,
      translations: [
        { locale: "en", title: form.titleEn, description: form.descriptionEn },
        { locale: "fr", title: form.titleFr, description: form.descriptionFr },
        { locale: "de", title: form.titleDe, description: form.descriptionDe },
      ],
    };

    const url = editingSlug ? `/api/courses/${editingSlug}` : "/api/courses";
    const method = editingSlug ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowForm(false);
      fetchCourses();
    } else {
      const data = await res.json();
      setError(data.error || "An error occurred");
    }
    setSaving(false);
  };

  const handleDelete = async (slug: string) => {
    const res = await fetch(`/api/courses/${slug}`, { method: "DELETE" });
    setDeleteConfirm(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to delete course");
    }
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-background px-6 pt-8 pb-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/" className="mb-2 inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground">
              <IconArrowLeft size={14} /> Back to site
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
            <p className="mt-1 text-sm text-foreground/50">{courses.length} courses total</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/enrollments"
              className="flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm font-semibold text-foreground/70 hover:bg-foreground/5">
              <IconUsers size={16} /> Enrollments
            </Link>
            <button onClick={openCreate}
              className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-ballet-slipper">
              <IconPlus size={16} /> New Course
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && !showForm && (
          <div className="mb-6 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-4 text-red-400 hover:text-red-600">
              <IconX size={16} />
            </button>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="py-20 text-center text-foreground/40">Loading...</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-foreground/10">
            <table className="w-full text-sm">
              <thead className="bg-foreground/5 text-left">
                <tr>
                  <th className="px-5 py-3 font-semibold text-foreground/60">Course</th>
                  <th className="px-5 py-3 font-semibold text-foreground/60">Level</th>
                  <th className="px-5 py-3 font-semibold text-foreground/60">Start Date</th>
                  <th className="px-5 py-3 font-semibold text-foreground/60">Capacity</th>
                  <th className="px-5 py-3 font-semibold text-foreground/60">Price</th>
                  <th className="px-5 py-3 font-semibold text-foreground/60">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {courses.map((course) => {
                  const title = course.translations.find((t) => t.locale === "en")?.title || course.slug;
                  return (
                    <tr key={course.id} className="hover:bg-foreground/[0.02]">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-foreground">{title}</p>
                        <p className="text-xs text-foreground/40">{course.slug}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">
                          {course.level}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-foreground/60">
                        {new Date(course.startDate).toLocaleDateString("de-DE")}
                      </td>
                      <td className="px-5 py-4 text-foreground/60">
                        <span className="font-semibold text-foreground">{course._count?.enrollments ?? 0}</span>
                        /{course.maxCapacity}
                      </td>
                      <td className="px-5 py-4 font-semibold text-foreground">{course.price}</td>
                      <td className="px-5 py-4">
                        {deleteConfirm === course.slug ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground/50">Delete?</span>
                            <button onClick={() => handleDelete(course.slug)} className="text-red-500 hover:text-red-600">
                              <IconCheck size={16} />
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-foreground/40 hover:text-foreground">
                              <IconX size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button onClick={() => openEdit(course)} className="text-foreground/40 hover:text-accent">
                              <IconEdit size={16} />
                            </button>
                            <button onClick={() => setDeleteConfirm(course.slug)} className="text-foreground/40 hover:text-red-500">
                              <IconTrash size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {courses.length === 0 && (
              <p className="py-16 text-center text-foreground/30">No courses yet. Create your first one!</p>
            )}
          </div>
        )}
      </div>

      {/* Slide-in Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative h-full w-full max-w-xl overflow-y-auto bg-background shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-foreground/10 bg-background px-6 py-4">
              <h2 className="text-lg font-bold text-foreground">
                {editingSlug ? "Edit Course" : "New Course"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-foreground/40 hover:text-foreground">
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
              {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
              )}

              {/* Basic fields */}
              <fieldset className="space-y-4">
                <legend className="text-xs font-bold uppercase tracking-wider text-foreground/40 mb-2">General</legend>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Slug</label>
                    <input className="input" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="german-a1" disabled={!!editingSlug} />
                  </div>
                  <div>
                    <label className="label">Level</label>
                    <select className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                      {LEVELS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Price</label>
                    <input className="input" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="€299" />
                  </div>
                  <div>
                    <label className="label">Max Capacity</label>
                    <input className="input" type="number" required value={form.maxCapacity}
                      onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })} placeholder="20" />
                  </div>
                </div>
                <div>
                  <label className="label">Start Date</label>
                  <input className="input" type="date" required value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Schedule Days</label>
                    <input className="input" value={form.scheduleDays} onChange={(e) => setForm({ ...form, scheduleDays: e.target.value })}
                      placeholder="Montag–Freitag" />
                  </div>
                  <div>
                    <label className="label">Schedule Time</label>
                    <input className="input" value={form.scheduleTime} onChange={(e) => setForm({ ...form, scheduleTime: e.target.value })}
                      placeholder="18:00–20:00 Uhr" />
                  </div>
                </div>
                <div>
                  <label className="label">Image URL</label>
                  <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..." />
                </div>
              </fieldset>

              {/* Translations */}
              {[
                { lang: "🇬🇧 English", titleKey: "titleEn", descKey: "descriptionEn" },
                { lang: "🇫🇷 French", titleKey: "titleFr", descKey: "descriptionFr" },
                { lang: "🇩🇪 German", titleKey: "titleDe", descKey: "descriptionDe" },
              ].map(({ lang, titleKey, descKey }) => (
                <fieldset key={lang} className="space-y-3">
                  <legend className="text-xs font-bold uppercase tracking-wider text-foreground/40 mb-2">{lang}</legend>
                  <div>
                    <label className="label">Title</label>
                    <input className="input" value={(form as any)[titleKey]}
                      onChange={(e) => setForm({ ...form, [titleKey]: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <textarea className="input resize-none" rows={3} value={(form as any)[descKey]}
                      onChange={(e) => setForm({ ...form, [descKey]: e.target.value })} />
                  </div>
                </fieldset>
              ))}

              <button type="submit" disabled={saving}
                className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-white hover:bg-ballet-slipper disabled:opacity-50">
                {saving ? "Saving..." : editingSlug ? "Save Changes" : "Create Course"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* <style jsx>{`
        .label { display: block; margin-bottom: 6px; font-size: 0.75rem; font-weight: 600; color: rgba(var(--foreground), 0.6); }
        .input { width: 100%; border-radius: 0.75rem; border: 1px solid rgba(var(--foreground), 0.12); background: rgba(var(--foreground), 0.03); padding: 0.5rem 0.75rem; font-size: 0.875rem; outline: none; }
      `}</style> */}
    </div>
  );
}

