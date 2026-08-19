import { NextResponse } from "next/server";
import { getSession, isAdminUser } from "@/lib/session";
import { sendBroadcastEmail } from "@/lib/resend";

function textToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map(
      (para) =>
        `<p style="margin:0 0 16px;">${para.trim().replace(/\n/g, "<br />")}</p>`,
    )
    .join("");
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!isAdminUser(session) || !session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { subject, body } = await request.json().catch(() => ({}));
  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json(
      { error: "Subject and message are required." },
      { status: 400 },
    );
  }

  try {
    const { sent, failed } = await sendBroadcastEmail({
      subject: `[TEST] ${subject.trim()}`,
      html: textToHtml(body.trim()),
      recipients: [session.email],
    });

    return NextResponse.json({ success: true, sent, failed, total: 1 });
  } catch (err) {
    console.error("Test send failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Send failed. Please try again." },
      { status: 500 },
    );
  }
}
