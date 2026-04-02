import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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

    const courses = await prisma.course.findMany({
      where: includePast ? undefined : { startDate: { gte: startOfToday } },
      include: {
        translations: true,
        modules: { orderBy: { order: "asc" } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { startDate: "asc" },
    });
    return NextResponse.json(courses);
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

    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
