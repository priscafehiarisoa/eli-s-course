"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  IconArrowLeft, IconSearch, IconX, IconCheck, IconClock, IconBan,
  IconCalendar, IconCreditCard, IconUsers,
} from "@tabler/icons-react";

const DE_MONTHS = [
  "Jan.", "Feb.", "März", "Apr.", "Mai", "Juni",
  "Juli", "Aug.", "Sep.", "Okt.", "Nov.", "Dez.",
];
function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()}. ${DE_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function getCourseTitle(translations: { locale: string; title: string }[], slug: string): string {
  return translations.find((translation) => translation.locale === "en")?.title || slug;
}

type Enrollment = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  startDate: string;
  paymentDate: string | null;
  createdAt: string;
  course: {
    slug: string;
    level: string;
    translations: { locale: string; title: string }[];
  };
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

const STATUS_STYLES = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
};

const STATUS_ICONS = {
  PENDING:   <IconClock size={12} />,
  CONFIRMED: <IconCheck size={12} />,
  CANCELLED: <IconBan size={12} />,
};

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [courses, setCourses] = useState<{ slug: string; title: string }[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [emailWarning, setEmailWarning] = useState<string | null>(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (courseFilter !== "all") params.set("courseId", courseFilter);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await fetch(`/api/enrollments?${params.toString()}`);
    const payload = await res.json();
    const data = Array.isArray(payload) ? payload : (payload.data ?? []);
    const meta = Array.isArray(payload)
      ? {
          page,
          limit,
          total: data.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }
      : payload.pagination;
    setEnrollments(data);
    setPagination(meta);
    setLoading(false);
  }, [search, statusFilter, courseFilter, page, limit]);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, courseFilter, limit]);

  // Load courses for filter dropdown
  useEffect(() => {
    fetch("/api/courses?includePast=true").then((r) => r.json()).then((data) => {
      setCourses(
        data.map((c: any) => ({
          slug: c.id,
          title: getCourseTitle(c.translations, c.slug),
        }))
      );
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    setEmailWarning(null);
    const res = await fetch(`/api/enrollments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        ...(status === "CONFIRMED" && { paymentDate: new Date().toISOString() }),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setEmailWarning(data.error || "Unable to update enrollment status.");
    }
    await fetchEnrollments();
    setUpdating(null);
  };

  const cancelEnrollment = async (id: string) => {
    setUpdating(id);
    setEmailWarning(null);
    const res = await fetch(`/api/enrollments/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setEmailWarning(data.error || "Unable to cancel enrollment.");
    }
    await fetchEnrollments();
    setUpdating(null);
  };

  const filtered = enrollments.filter((e) => {
    if (dateFrom && new Date(e.startDate) < new Date(dateFrom)) return false;
    if (dateTo && new Date(e.startDate) > new Date(dateTo)) return false;
    return true;
  });

  const counts = {
    all: filtered.length,
    PENDING: filtered.filter((e) => e.status === "PENDING").length,
    CONFIRMED: filtered.filter((e) => e.status === "CONFIRMED").length,
    CANCELLED: filtered.filter((e) => e.status === "CANCELLED").length,
  };

  const pageNumbers = (() => {
    const totalPages = pagination.totalPages;
    const current = pagination.page;
    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, current + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();

  const startItem = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="min-h-screen bg-background px-6 pt-8 pb-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin/cours" className="mb-2 inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground">
              <IconArrowLeft size={14} /> Back to courses
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Enrollments</h1>
            <p className="mt-1 text-sm text-foreground/50">
              {loading ? "Loading..." : `${startItem}-${endItem} of ${pagination.total} results`}
            </p>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-3">
            {(["PENDING", "CONFIRMED", "CANCELLED"] as const).map((s) => (
              <div key={s} className={`rounded-xl px-4 py-2.5 text-center ${STATUS_STYLES[s]}`}>
                <p className="text-lg font-bold">{counts[s]}</p>
                <p className="text-xs font-medium capitalize">{s.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Email warning */}
        {emailWarning && (
          <div className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-yellow-400/30 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            <span><strong>Email not sent:</strong> {emailWarning}</span>
            <button onClick={() => setEmailWarning(null)} className="shrink-0 text-yellow-600 hover:text-yellow-900"><IconX size={14} /></button>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or email..."
              className="w-full rounded-full border border-foreground/10 bg-foreground/5 py-2 pl-9 pr-8 text-sm outline-none focus:border-primary"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground">
                <IconX size={14} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="flex gap-2">
            {["all", "PENDING", "CONFIRMED", "CANCELLED"].map((s) => (
              <button key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  statusFilter === s ? "bg-accent text-white" : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                }`}>
                {s === "all" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>{c.title}</option>
            ))}
          </select>

          {/* Date range filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground/50">From</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              aria-label="Start date from"
              className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <span className="text-xs text-foreground/50">To</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              aria-label="Start date to"
              className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm outline-none focus:border-primary"
            />
            {(dateFrom || dateTo) && (
              <button
                onClick={() => { setDateFrom(""); setDateTo(""); }}
                className="text-foreground/30 hover:text-foreground"
              >
                <IconX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 text-center text-foreground/40">Loading...</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-foreground/10">
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-sm">
                <thead className="bg-foreground/5 text-left">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-foreground/60">Student</th>
                    <th className="px-5 py-3 font-semibold text-foreground/60">Course</th>
                    <th className="px-5 py-3 font-semibold text-foreground/60">
                      <span className="flex items-center gap-1"><IconCalendar size={13} /> Start Date</span>
                    </th>
                    <th className="px-5 py-3 font-semibold text-foreground/60">
                      <span className="flex items-center gap-1"><IconCreditCard size={13} /> Payment</span>
                    </th>
                    <th className="px-5 py-3 font-semibold text-foreground/60">Status</th>
                    <th className="px-5 py-3 font-semibold text-foreground/60">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                  {filtered.map((e) => {
                    const courseTitle = getCourseTitle(e.course.translations, e.course.slug);
                    return (
                      <tr key={e.id} className="hover:bg-foreground/[0.02]">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-foreground">{e.lastName} {e.firstName}</p>
                          <p className="text-xs text-foreground/40">{e.email}</p>
                          <p className="text-xs text-foreground/30">{e.city}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-foreground">{courseTitle}</p>
                          <span className="mt-1 inline-block rounded-full bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                            {e.course.level}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-foreground/60 text-xs">
                          {formatDate(e.startDate)}
                        </td>
                        <td className="px-5 py-4 text-foreground/60 text-xs">
                          {e.paymentDate
                            ? formatDate(e.paymentDate)
                            : <span className="text-foreground/30">—</span>}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[e.status]}`}>
                            {STATUS_ICONS[e.status]}
                            {e.status.charAt(0) + e.status.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            {e.status !== "CANCELLED" && (
                              <button
                                onClick={() => cancelEnrollment(e.id)}
                                disabled={updating === e.id}
                                className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50">
                                Annuler l'inscription
                              </button>
                            )}
                            {e.status !== "CONFIRMED" && (
                              <button
                                onClick={() => updateStatus(e.id, "CONFIRMED")}
                                disabled={updating === e.id}
                                className="rounded-lg bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 hover:bg-green-200 disabled:opacity-50">
                                Confirmation de paiement
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <IconUsers size={32} className="mx-auto mb-3 text-foreground/20" />
                <p className="text-foreground/30">No enrollments found</p>
              </div>
            )}

            {pagination.total > 0 && (
              <div className="flex flex-col gap-4 border-t border-foreground/10 bg-foreground/[0.02] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <span>Rows per page</span>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="rounded-full border border-foreground/10 bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                  >
                    {[10, 25, 50, 100].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination.hasPrevPage}
                    className="rounded-full border border-foreground/15 px-3 py-1.5 text-xs font-semibold text-foreground/70 transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {pageNumbers.map((n) => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`h-8 min-w-8 rounded-full px-2 text-xs font-semibold transition-colors ${
                          n === pagination.page
                            ? "bg-accent text-white"
                            : "border border-foreground/10 text-foreground/70 hover:bg-foreground/5"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={!pagination.hasNextPage}
                    className="rounded-full border border-foreground/15 px-3 py-1.5 text-xs font-semibold text-foreground/70 transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

