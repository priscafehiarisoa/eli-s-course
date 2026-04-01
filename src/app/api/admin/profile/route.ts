import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function getUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.adminUser.findUnique({ where: { id: session.user.id } });
}

// GET /api/admin/profile
export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ name: user.name, email: user.email });
}

// PATCH /api/admin/profile  — update name/email OR change password
export async function PATCH(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // ── Change password ────────────────────────────────────────
  if (body.newPassword !== undefined) {
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Données manquantes." }, { status: 400 });
    }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 400 });
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { password: hashed },
    });
    return NextResponse.json({ success: true });
  }

  // ── Update profile ─────────────────────────────────────────
  const { name, email } = body;
  if (!name || !email) {
    return NextResponse.json({ error: "Données manquantes." }, { status: 400 });
  }

  // Check email uniqueness (exclude current user)
  const existing = await prisma.adminUser.findFirst({
    where: { email, NOT: { id: user.id } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Cet e-mail est déjà utilisé." },
      { status: 400 }
    );
  }

  const updated = await prisma.adminUser.update({
    where: { id: user.id },
    data: { name, email },
  });
  return NextResponse.json({ name: updated.name, email: updated.email });
}
