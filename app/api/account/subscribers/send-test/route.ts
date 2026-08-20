import { NextResponse } from "next/server";
import { getSession, isAdminUser } from "@/lib/session";
import { sendBroadcastEmail, getEmailStatus } from "@/lib/resend";
import { broadcastBodyToHtml } from "@/lib/email-template";

export async function POST(request: Request) {
  const session = await getSession();
  if (!isAdminUser(session) || !session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { subject, body, imageUrl } = await request.json().catch(() => ({}));
  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json(
      { error: "Subject and message are required." },
      { status: 400 },
    );
  }

  try {
    const { sent, failed, ids } = await sendBroadcastEmail({
      subject: `[TEST] ${subject.trim()}`,
      html: broadcastBodyToHtml({ text: body.trim(), imageUrl }),
      recipients: [session.email],
    });

    const statuses = await Promise.all(ids.map((id) => getEmailStatus(id)));

    return NextResponse.json({ success: true, sent, failed, total: 1, statuses });
  } catch (err) {
    console.error("Test send failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Send failed. Please try again." },
      { status: 500 },
    );
  }
}
