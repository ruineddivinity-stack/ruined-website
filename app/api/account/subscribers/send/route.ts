import { NextResponse } from "next/server";
import { getSession, isAdminUser } from "@/lib/session";
import { getAllSubscribers } from "@/lib/subscribers";
import { sendBroadcastEmail } from "@/lib/resend";

function textToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((para) => `<p>${para.trim().replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!isAdminUser(session)) {
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
    const subscribers = await getAllSubscribers();
    const recipients = subscribers.map((s) => s.email);

    const { sent, failed } = await sendBroadcastEmail({
      subject: subject.trim(),
      html: textToHtml(body.trim()),
      recipients,
    });

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: recipients.length,
    });
  } catch (err) {
    console.error("Broadcast send failed:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error && err.message.startsWith("Missing RESEND")
            ? err.message
            : "Send failed. Please try again.",
      },
      { status: 500 },
    );
  }
}
