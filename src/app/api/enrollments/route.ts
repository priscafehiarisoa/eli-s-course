import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendEnrollmentConfirmation } from "@/lib/email";
import { Prisma } from "@/generated/prisma/client";
import { revalidateTag } from "next/cache";
import { limitByKey } from "@/lib/rateLimit";
import {
  isReasonableLength,
  isValidEmail,
  isValidPostalCode,
  normalizeText,
} from "@/lib/validation";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;
const MAX_ENROLLMENT_ATTEMPTS = 8;
const ENROLLMENT_RATE_WINDOW_MS = 5 * 60 * 1000;

class EnrollmentFlowError extends Error {
  code: "COURSE_NOT_FOUND" | "COURSE_FULL" | "ALREADY_ENROLLED";

  constructor(code: "COURSE_NOT_FOUND" | "COURSE_FULL" | "ALREADY_ENROLLED") {
    super(code);
    this.code = code;
  }
}

type ParsedEnrollmentInput = {
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  email: string;
  courseId: string;
  locale: "en" | "fr" | "de";
  consent: boolean;
};

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return parsed;
}

function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

function parseEnrollmentPayload(body: any): ParsedEnrollmentInput {
  const localeValue = normalizeText(body?.locale);

  return {
    firstName: normalizeText(body?.firstName),
    lastName: normalizeText(body?.lastName),
    street: normalizeText(body?.street),
    postalCode: normalizeText(body?.postalCode),
    city: normalizeText(body?.city),
    email: normalizeText(body?.email).toLowerCase(),
    courseId: normalizeText(body?.courseId),
    locale: localeValue === "fr" || localeValue === "de" ? localeValue : "en",
    consent: body?.consent === true,
  };
}

function validateEnrollmentInput(input: ParsedEnrollmentInput): string | null {
  if (!input.firstName || !input.lastName || !input.street || !input.postalCode || !input.city || !input.email || !input.courseId) {
    return "Missing required fields";
  }

  if (!isReasonableLength(input.firstName, 2, 80) || !isReasonableLength(input.lastName, 2, 80)) {
    return "Invalid name format";
  }

  if (!isReasonableLength(input.street, 4, 120) || !isReasonableLength(input.city, 2, 80)) {
    return "Invalid address format";
  }

  if (!isValidPostalCode(input.postalCode)) {
    return "Invalid postal code";
  }

  if (!isValidEmail(input.email)) {
    return "Invalid email";
  }

  if (!input.consent) {
    return "You must accept the data usage policy.";
  }

  return null;
}

async function createEnrollmentWithRetry(input: {
  courseId: string;
  email: string;
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  locale: "en" | "fr" | "de";
}) {
  const maxRetries = 2;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const course = await tx.course.findUnique({
            where: { id: input.courseId },
            include: {
              translations: true,
            },
          });

          if (!course) {
            throw new EnrollmentFlowError("COURSE_NOT_FOUND");
          }

          const activeEnrollments = await tx.enrollment.count({
            where: {
              courseId: input.courseId,
              status: { in: ["PENDING", "CONFIRMED"] },
            },
          });

          if (activeEnrollments >= course.maxCapacity) {
            throw new EnrollmentFlowError("COURSE_FULL");
          }

          const existing = await tx.enrollment.findFirst({
            where: { email: input.email, courseId: input.courseId },
            select: { id: true },
          });
          if (existing) {
            throw new EnrollmentFlowError("ALREADY_ENROLLED");
          }

          const enrollment = await tx.enrollment.create({
            data: {
              firstName: input.firstName,
              lastName: input.lastName,
              street: input.street,
              postalCode: input.postalCode,
              city: input.city,
              email: input.email,
              courseId: input.courseId,
              startDate: course.startDate,
              consent: true,
            },
          });

          return { enrollment, course };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      );
    } catch (error: any) {
      if (error instanceof EnrollmentFlowError) throw error;
      if (error?.code === "P2002") {
        throw new EnrollmentFlowError("ALREADY_ENROLLED");
      }
      if (error?.code === "P2034" && attempt < maxRetries) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Enrollment transaction exhausted retries");
}

// GET /api/enrollments?courseId=...&status=...&search=...
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
    const limit = Math.min(
      parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT),
      MAX_LIMIT
    );
    const skip = (page - 1) * limit;

    const where: Prisma.EnrollmentWhereInput = {
      ...(courseId && { courseId }),
      ...(status && { status: status as any }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [enrollments, total] = await prisma.$transaction([
      prisma.enrollment.findMany({
        where,
        include: {
          course: {
            include: { translations: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.enrollment.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      data: enrollments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("[enrollments/GET] failed:", error);
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }
}

// POST /api/enrollments
export async function POST(req: NextRequest) {
  try {
    const clientId = getClientIdentifier(req);
    const rate = limitByKey(`enroll:${clientId}`, MAX_ENROLLMENT_ATTEMPTS, ENROLLMENT_RATE_WINDOW_MS);
    if (!rate.ok) {
      return NextResponse.json(
        { error: "Too many attempts. Please retry later." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const input = parseEnrollmentPayload(body);
    const validationError = validateEnrollmentInput(input);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { enrollment, course } = await createEnrollmentWithRetry({
      courseId: input.courseId,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      street: input.street,
      postalCode: input.postalCode,
      city: input.city,
      locale: input.locale,
    });

    // Send confirmation email (non-blocking — don't fail enrollment if email fails)
    const courseTitle =
      course.translations.find((t) => t.locale === input.locale)?.title ||
      course.translations.find((t) => t.locale === "en")?.title ||
      course.slug;

    const DE_WEEKDAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    const DE_MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    const d = course.startDate;
    const dt = new Date(d);
    const formattedDate = `${DE_WEEKDAYS[dt.getUTCDay()]}, ${dt.getUTCDate()}. ${DE_MONTHS[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;

    sendEnrollmentConfirmation({
      to: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      courseTitle,
      startDate: formattedDate,
      scheduleDays: course.scheduleDays,
      scheduleTime: course.scheduleTime,
      price: course.price,
      locale: input.locale,
    }).catch((err) => console.error("[email] enrollment confirmation failed:", err));

    revalidateTag("courses", "max");
    revalidateTag(`course:${input.courseId}`, "max");

    return NextResponse.json({ success: true, enrollment }, { status: 201 });
  } catch (error) {
    if (error instanceof EnrollmentFlowError) {
      if (error.code === "COURSE_NOT_FOUND") {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
      }
      if (error.code === "COURSE_FULL") {
        return NextResponse.json({ error: "Course is full" }, { status: 409 });
      }
      if (error.code === "ALREADY_ENROLLED") {
        return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
      }
    }
    console.error("[enrollments/POST] failed:", error);
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 });
  }
}
