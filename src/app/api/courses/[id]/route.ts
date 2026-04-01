import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/courses/:id  — find by cuid id OR slug (for public enroll page)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = await prisma.course.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        translations: true,
        modules: { orderBy: { order: "asc" } },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

// PUT /api/courses/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      level, image, price, maxCapacity,
      startDate, scheduleDays, scheduleTime,
      translations,
    } = body;

    // Resolve the real cuid so translation upserts use the correct courseId
    const existing = await prisma.course.findUnique({ where: { slug: id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    const courseId = existing.id;

    const course = await prisma.course.update({
      where: { slug: id },
      data: {
        level,
        image,
        price,
        maxCapacity: maxCapacity ? Number(maxCapacity) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        scheduleDays,
        scheduleTime,
        translations: translations
          ? {
              upsert: translations.map((t: { locale: string; title: string; description: string }) => ({
                where: { courseId_locale: { courseId, locale: t.locale } },
                update: { title: t.title, description: t.description },
                create: { locale: t.locale, title: t.title, description: t.description },
              })),
            }
          : undefined,
      },
      include: { translations: true, modules: true },
    });

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

// DELETE /api/courses/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.course.delete({ where: { slug: id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
