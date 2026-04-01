import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  DEFAULT_EMAIL_TEMPLATES,
  EMAIL_TEMPLATE_KINDS,
  ENROLLMENT_EMAIL_TOKENS,
  type EmailTemplateStore,
  type SupportedLocale,
  type EmailTemplateKind,
} from "@/lib/enrollmentEmailTemplate";
import { getEmailTemplates, saveEmailTemplates } from "@/lib/enrollmentEmailTemplate.server";
import { sendEnrollmentCancellation, sendEnrollmentConfirmation, sendPaymentConfirmation } from "@/lib/email";
import { writeAuditEvent } from "@/lib/audit";
import { isValidEmail, normalizeText } from "@/lib/validation";

function isTemplateKind(value: unknown): value is EmailTemplateKind {
  return typeof value === "string" && EMAIL_TEMPLATE_KINDS.includes(value as EmailTemplateKind);
}

function isLocale(value: unknown): value is SupportedLocale {
  return value === "en" || value === "fr" || value === "de";
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

// GET /api/admin/email-template
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const templates = await getEmailTemplates();
  return NextResponse.json({
    templates,
    tokens: ENROLLMENT_EMAIL_TOKENS,
    kinds: EMAIL_TEMPLATE_KINDS,
  });
}

// PATCH /api/admin/email-template
export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const templates = body?.templates as EmailTemplateStore | undefined;

    if (!templates || typeof templates !== "object") {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const updated = await saveEmailTemplates(templates);

    await writeAuditEvent({
      action: "enrollment_email_template.updated",
      actorId: admin.id,
      actorEmail: admin.email ?? undefined,
    });

    return NextResponse.json({
      success: true,
      templates: updated,
      tokens: ENROLLMENT_EMAIL_TOKENS,
      kinds: EMAIL_TEMPLATE_KINDS,
    });
  } catch (error) {
    console.error("[admin/email-template] update failed:", error);
    return NextResponse.json({ error: "Failed to update email template." }, { status: 500 });
  }
}

// DELETE /api/admin/email-template — reset all templates to defaults
export async function DELETE() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updated = await saveEmailTemplates(DEFAULT_EMAIL_TEMPLATES);
  await writeAuditEvent({
    action: "enrollment_email_template.reset",
    actorId: admin.id,
    actorEmail: admin.email ?? undefined,
  });

  return NextResponse.json({
    success: true,
    templates: updated,
    tokens: ENROLLMENT_EMAIL_TOKENS,
    kinds: EMAIL_TEMPLATE_KINDS,
  });
}

// POST /api/admin/email-template — send a test email for a specific kind
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const kind = isTemplateKind(body?.kind) ? body.kind : "enrollment";
    const locale = isLocale(body?.locale) ? body.locale : "fr";
    const requestedEmail = normalizeText(body?.to).toLowerCase();
    const to = requestedEmail || (admin.email ?? "");

    if (!to || !isValidEmail(to)) {
      return NextResponse.json({ error: "Valid test recipient email is required." }, { status: 400 });
    }

    if (kind === "enrollment") {
      await sendEnrollmentConfirmation({
        to,
        firstName: "Marie",
        lastName: "Dupont",
        courseTitle: "Allemand B1 - Conversation",
        startDate: "Lundi, 14 septembre 2026",
        scheduleDays: "Lundi / Mercredi",
        scheduleTime: "18:00 - 20:00",
        price: "299 EUR",
        locale,
      });
    }

    if (kind === "cancellation") {
      await sendEnrollmentCancellation({
        to,
        firstName: "Marie",
        lastName: "Dupont",
        courseTitle: "Allemand B1 - Conversation",
        startDate: "Lundi, 14 septembre 2026",
        scheduleDays: "Lundi / Mercredi",
        scheduleTime: "18:00 - 20:00",
        price: "299 EUR",
        locale,
      });
    }

    if (kind === "payment") {
      await sendPaymentConfirmation({
        to,
        firstName: "Marie",
        lastName: "Dupont",
        courseTitle: "Allemand B1 - Conversation",
        amount: "299 EUR",
        paymentDate: "14 septembre 2026",
        locale,
      });
    }

    await writeAuditEvent({
      action: "enrollment_email_template.test_sent",
      actorId: admin.id,
      actorEmail: admin.email ?? undefined,
      details: { to, locale, kind },
    });

    return NextResponse.json({ success: true, to, kind });
  } catch (error) {
    console.error("[admin/email-template] test send failed:", error);
    return NextResponse.json({ error: "Failed to send test email." }, { status: 500 });
  }
}
