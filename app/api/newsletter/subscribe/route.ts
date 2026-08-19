import { NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/subscribers";

export async function POST(request: Request) {
  const { email } = await request.json().catch(() => ({ email: undefined }));

  if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const result = await subscribeEmail(email.trim());

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
