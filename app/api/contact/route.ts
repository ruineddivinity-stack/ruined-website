import { NextResponse } from "next/server";
import { isResendConfigured, sendContactEmail } from "@/lib/resend";

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const MAX_LENGTH = 5000;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Please fill out every field." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  if (
    name.length > 200 ||
    subject.length > 200 ||
    message.length > MAX_LENGTH
  ) {
    return NextResponse.json(
      { error: "One of your fields is too long." },
      { status: 400 },
    );
  }

  if (!isResendConfigured()) {
    return NextResponse.json(
      { error: "Contact form isn't configured yet. Email us directly instead." },
      { status: 503 },
    );
  }

  try {
    await sendContactEmail({ name, email, subject, message });
  } catch (err) {
    console.error("Contact form send error:", err);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
