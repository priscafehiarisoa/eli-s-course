import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendEnrollmentCancellation, sendPaymentConfirmation } from "@/lib/email";
import { writeAuditEvent } from "@/lib/audit";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CANCELLED"],
  CANCELLED: [],
};

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

// PATCH /api/enrollments/:id  — update payment status / date
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status, paymentDate } = body;

    const existing = await prisma.enrollment.findUnique({
      where: { id },
      select: { id: true, status: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    if (status && status !== existing.status) {
      const allowed = ALLOWED_TRANSITIONS[existing.status] ?? [];
      if (!allowed.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status transition: ${existing.status} -> ${status}` },
          { status: 400 }
        );
      }
    }

    const effectiveStatus = status || existing.status;

    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentDate && { paymentDate: new Date(paymentDate) }),
        ...(effectiveStatus === "CONFIRMED" && !paymentDate && { paymentDate: new Date() }),
      },
      include: { course: { include: { translations: true } } },
    });

    await writeAuditEvent({
      action: "enrollment.payment_confirmed",
      actorId: admin.id,
      actorEmail: admin.email ?? undefined,
      enrollmentId: id,
      details: {
        fromStatus: existing.status,
        toStatus: effectiveStatus,
      },
    });

    return NextResponse.json(enrollment);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 });
  }
}

// DELETE /api/enrollments/:id — cancel enrollment, free spot, and notify student
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: { course: { include: { translations: true, enrollments: true } } },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    const courseTitle =
      enrollment.course.translations.find((t) => t.locale === "en")?.title ||
      enrollment.course.translations[0]?.title ||
      enrollment.course.slug;

    const cancellationDate = new Date(enrollment.course.startDate).toLocaleDateString("de-DE");

    let emailError: string | null = null;
    try {
      await sendEnrollmentCancellation({
        to: enrollment.email,
        firstName: enrollment.firstName,
        lastName: enrollment.lastName,
        courseTitle,
        startDate: cancellationDate,
        scheduleDays: enrollment.course.scheduleDays,
        scheduleTime: enrollment.course.scheduleTime,
        price: enrollment.course.price,
        locale: (enrollment as any).locale || "en",
      });
    } catch (err) {
      console.error("[email] cancellation failed:", err);
      emailError = err instanceof Error ? err.message : "Unknown email error";
    }

    await prisma.enrollment.delete({ where: { id } });

    await writeAuditEvent({
      action: "enrollment.cancelled",
      actorId: admin.id,
      actorEmail: admin.email ?? undefined,
      enrollmentId: id,
      details: {
        emailWarning: emailError,
      },
    });

    return NextResponse.json({ success: true, ...(emailError && { emailWarning: emailError }) });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete enrollment" }, { status: 500 });
  }
}

// POST /api/enrollments/:id/payment-email  — send payment confirmation email
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: { course: { include: { translations: true } } },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    if (enrollment.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Cannot send payment confirmation for a cancelled enrollment." },
        { status: 400 }
      );
    }

    if (enrollment.status !== "CONFIRMED") {
      return NextResponse.json(
        { error: "Payment confirmation can only be sent for confirmed enrollments." },
        { status: 400 }
      );
    }

    const courseTitle =
      enrollment.course.translations.find((t) => t.locale === "en")?.title ||
      enrollment.course.translations[0]?.title ||
      enrollment.course.slug;

    const paymentDate = enrollment.paymentDate
      ? new Date(enrollment.paymentDate).toLocaleDateString("de-DE")
      : new Date().toLocaleDateString("de-DE");

    let emailError: string | null = null;
    try {
      await sendPaymentConfirmation({
        to: enrollment.email,
        firstName: enrollment.firstName,
        lastName: enrollment.lastName,
        courseTitle,
        amount: enrollment.course.price,
        paymentDate,
        locale: (enrollment as any).locale || "en",
      });
    } catch (err) {
      console.error("[email] payment confirmation failed:", err);
      emailError = err instanceof Error ? err.message : "Unknown email error";
    }

    await writeAuditEvent({
      action: "enrollment.payment_email.sent",
      actorId: admin.id,
      actorEmail: admin.email ?? undefined,
      enrollmentId: id,
      details: {
        warning: emailError,
      },
    });

    return NextResponse.json({ success: true, ...(emailError && { emailWarning: emailError }) });
  } catch (error) {
    console.error("[enrollments/POST] unexpected error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

