import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginWithPassword } from "@/lib/wp-auth";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const result = await loginWithPassword(email, password);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, result.jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return NextResponse.json({ success: true });
}
