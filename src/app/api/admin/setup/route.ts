import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Only usable in development OR when no admin exists yet
export async function POST(req: NextRequest) {
  try {
    // Block if an admin already exists (unless setup token is provided)
    const adminCount = await prisma.adminUser.count();
    const setupToken = process.env.ADMIN_SETUP_TOKEN;
    const providedToken = req.headers.get("x-setup-token");

    if (adminCount > 0 && (!setupToken || providedToken !== setupToken)) {
      return NextResponse.json({ error: "Setup already completed." }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ error: "name, email and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.adminUser.create({
      data: { name, email, password: hashed },
    });

    return NextResponse.json({ success: true, email: user.email, name: user.name });
  } catch (err) {
    console.error("[setup] error:", err);
    return NextResponse.json({ error: "Erreur serveur. Vérifiez les logs." }, { status: 500 });
  }
}
