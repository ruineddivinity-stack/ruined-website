import { NextResponse } from "next/server";
import { confirmPasswordReset } from "@/lib/wp-auth";

export async function POST(request: Request) {
  const { email, code, newPassword } = await request.json();

  if (!email || !code || !newPassword) {
    return NextResponse.json(
      { error: "Email, code, and new password are all required." },
      { status: 400 },
    );
  }
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const result = await confirmPasswordReset(email, code, newPassword);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
