import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findByEmail } from "@/lib/users";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const { email, password } = body;

  if (!email || !password)
    return NextResponse.json(
      { error: "Missing email or password" },
      { status: 400 }
    );

  const user = findByEmail(email);
  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );

  // respond with user info (but never include password)
  return NextResponse.json(
    { token },
    { status: 200 }
  );
}
