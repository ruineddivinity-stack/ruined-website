import { NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/subscribers";
import { sendWelcomeEmail } from "@/lib/resend";

export async function POST(request: Request) {
  const { email } = await request.json().catch(() => ({ email: undefined }));

  if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const trimmedEmail = email.trim();
  const result = await subscribeEmail(trimmedEmail);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Subscribing succeeded regardless of whether the welcome email goes out —
  // never fail the request over a transactional-email hiccup.
  sendWelcomeEmail(trimmedEmail).catch((err) =>
    console.error("Welcome email failed:", err),
  );

  return NextResponse.json({ success: true });
}
