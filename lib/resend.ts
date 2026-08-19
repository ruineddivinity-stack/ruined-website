import "server-only";
import { Resend } from "resend";
import { unsubscribeToken } from "./subscribers";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "RUINED <news@ruinedrx.com>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010";
const BATCH_SIZE = 100;

export function isResendConfigured(): boolean {
  return Boolean(RESEND_API_KEY);
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export async function sendBroadcastEmail({
  subject,
  html,
  recipients,
}: {
  subject: string;
  html: string;
  recipients: string[];
}): Promise<{ sent: number; failed: number }> {
  if (!RESEND_API_KEY) {
    throw new Error(
      "Missing RESEND_API_KEY env var — connect a Resend account first.",
    );
  }
  if (recipients.length === 0) {
    return { sent: 0, failed: 0 };
  }

  const resend = new Resend(RESEND_API_KEY);
  let sent = 0;
  let failed = 0;
  let lastError: string | null = null;

  for (const batch of chunk(recipients, BATCH_SIZE)) {
    const payload = batch.map((email) => {
      const token = unsubscribeToken(email);
      const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
      return {
        from: FROM_EMAIL,
        to: [email],
        subject,
        html: `${html}<hr style="margin-top:32px;border:none;border-top:1px solid #26292e" /><p style="font-size:11px;color:#9aa1a9;margin-top:16px">You're receiving this because you subscribed at ruinedrx.com. <a href="${unsubscribeUrl}" style="color:#9aa1a9">Unsubscribe</a></p>`,
      };
    });

    const { data, error } = await resend.batch.send(payload);
    if (error) {
      failed += batch.length;
      lastError = `${error.name}: ${error.message}`;
      console.error("Resend batch send error:", error);
      continue;
    }
    sent += data?.data?.length ?? batch.length;
  }

  if (sent === 0 && failed > 0 && lastError) {
    throw new Error(lastError);
  }

  return { sent, failed };
}
