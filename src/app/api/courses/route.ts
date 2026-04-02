import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { EnrollmentStatus } from "@/generated/prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";

const COURSES_CACHE_TAG = "courses";

async function fetchCoursesFromDb(includePast: boolean, startOfTodayIso: string) {
  const startOfToday = new Date(startOfTodayIso);

  const courses = await prisma.course.findMany({
    where: includePast ? undefined : { startDate: { gte: startOfToday } },
    include: {
      translations: true,
      modules: { orderBy: { order: "asc" } },
    },
    orderBy: { startDate: "asc" },
  });

  if (courses.length === 0) return [];

  const activeByCourse = await prisma.enrollment.groupBy({
    by: ["courseId"],
    where: {
      courseId: { in: courses.map((course) => course.id) },
      status: { in: [EnrollmentStatus.PENDING, EnrollmentStatus.CONFIRMED] },
    },
    _count: {
      _all: true,
    },
  });

  const activeCountMap = new Map(activeByCourse.map((item) => [item.courseId, item._count._all]));

  return courses.map((course) => ({
    ...course,
    _count: {
      enrollments: activeCountMap.get(course.id) ?? 0,
    },
  }));
}

// GET /api/courses
export async function GET(req: NextRequest) {
  try {
    const includePast = new URL(req.url).searchParams.get("includePast") === "true";
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    if (includePast) {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const cacheKey = includePast
      ? "courses:includePast"
      : `courses:public:${startOfToday.toISOString().slice(0, 10)}`;
    const getCachedCourses = unstable_cache(
      () => fetchCoursesFromDb(includePast, startOfToday.toISOString()),
      [cacheKey],
      { tags: [COURSES_CACHE_TAG], revalidate: 120 }
    );

    const coursesWithActiveCounts = await getCachedCourses();

    return NextResponse.json(coursesWithActiveCounts);
  } catch (error) {
    console.error("[courses/GET] failed:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

// POST /api/courses
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      slug, level, image, price, maxCapacity,
      startDate, scheduleDays, scheduleTime,
      translations, modules,
    } = body;

    if (!slug || !level || !price || !maxCapacity || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        slug, level, image, price,
        maxCapacity: Number(maxCapacity),
        startDate: new Date(startDate),
        scheduleDays, scheduleTime,
        translations: translations
          ? { create: translations }
          : undefined,
        modules: modules
          ? { create: modules }
          : undefined,
      },
      include: { translations: true, modules: true },
    });

    revalidateTag(COURSES_CACHE_TAG, "max");
    revalidateTag(`course:${course.id}`, "max");
    revalidateTag(`course:${course.slug}`, "max");

    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
