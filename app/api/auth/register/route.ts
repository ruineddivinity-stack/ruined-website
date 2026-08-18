import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { registerUser, loginWithPassword } from "@/lib/wp-auth";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(request: Request) {
  const { email, password, displayName } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const result = await registerUser(email, password, displayName);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Some plugin configs don't return a JWT on registration — log in explicitly instead.
  const jwt = result.jwt ?? (await getJwtViaLogin(email, password));
  if (!jwt) {
    return NextResponse.json(
      {
        error:
          "Account created, but automatic sign-in failed. Try signing in manually.",
      },
      { status: 202 },
    );
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return NextResponse.json({ success: true });
}

async function getJwtViaLogin(email: string, password: string) {
  const login = await loginWithPassword(email, password);
  return "jwt" in login ? login.jwt : null;
}
