import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { limitByKey } from "@/lib/rateLimit";
import { isReasonableLength, isValidEmail, normalizeText } from "@/lib/validation";

const CONTACT_RATE_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_MAX_HITS = 5;

function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

// POST /api/contact
export async function POST(req: NextRequest) {
  try {
    const clientId = getClientIdentifier(req);
    const rate = limitByKey(`contact:${clientId}`, CONTACT_MAX_HITS, CONTACT_RATE_WINDOW_MS);
    if (!rate.ok) {
      return NextResponse.json(
        { error: "Too many messages. Please retry later." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const name = normalizeText(body?.name);
    const email = normalizeText(body?.email).toLowerCase();
    const subject = normalizeText(body?.subject);
    const message = normalizeText(body?.message);

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!isReasonableLength(name, 2, 100)) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!isReasonableLength(subject, 3, 140) || !isReasonableLength(message, 10, 5000)) {
      return NextResponse.json({ error: "Invalid subject or message length" }, { status: 400 });
    }

    const contact = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    return NextResponse.json({ success: true, contact }, { status: 201 });
  } catch (error) {
    console.error("[contact/POST] failed:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

