import "server-only";
import { Resend } from "resend";
import { unsubscribeToken } from "./subscribers";
import { wrapBroadcastHtml } from "./email-template";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "RUINED <news@ruinedrx.com>";
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "support@ruinedrx.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010";
const BATCH_SIZE = 100;

export function isResendConfigured(): boolean {
  return Boolean(RESEND_API_KEY);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ id: string | null }> {
  if (!RESEND_API_KEY) {
    throw new Error(
      "Missing RESEND_API_KEY env var — connect a Resend account first.",
    );
  }

  const resend = new Resend(RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [CONTACT_TO_EMAIL],
    replyTo: email,
    subject: `[Contact] ${subject}`,
    html: `
      <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `,
  });

  if (error) {
    throw new Error(`${error.name}: ${error.message}`);
  }

  return { id: data?.id ?? null };
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
}): Promise<{ sent: number; failed: number; ids: string[] }> {
  if (!RESEND_API_KEY) {
    throw new Error(
      "Missing RESEND_API_KEY env var — connect a Resend account first.",
    );
  }
  if (recipients.length === 0) {
    return { sent: 0, failed: 0, ids: [] };
  }

  const resend = new Resend(RESEND_API_KEY);
  let sent = 0;
  let failed = 0;
  let lastError: string | null = null;
  const ids: string[] = [];

  for (const batch of chunk(recipients, BATCH_SIZE)) {
    const payload = batch.map((email) => {
      const token = unsubscribeToken(email);
      const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
      return {
        from: FROM_EMAIL,
        to: [email],
        subject,
        html: wrapBroadcastHtml({ bodyHtml: html, unsubscribeUrl }),
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
    for (const item of data?.data ?? []) {
      if (item.id) ids.push(item.id);
    }
  }

  if (sent === 0 && failed > 0 && lastError) {
    throw new Error(lastError);
  }

  return { sent, failed, ids };
}

export async function getEmailStatus(id: string) {
  if (!RESEND_API_KEY) return null;
  const resend = new Resend(RESEND_API_KEY);
  const { data, error } = await resend.emails.get(id);
  if (error) return { error: `${error.name}: ${error.message}` };
  return data;
}
