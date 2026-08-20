import "server-only";
import crypto from "crypto";
import { wpFetch } from "./wp-origin-fetch";

const WORDPRESS_URL = process.env.WOOCOMMERCE_URL;
const SUBSCRIBERS_SECRET = process.env.WP_SUBSCRIBERS_SECRET;

export function unsubscribeToken(email: string): string {
  const secret = SUBSCRIBERS_SECRET || "";
  return crypto
    .createHmac("sha256", secret)
    .update(email.trim().toLowerCase())
    .digest("hex")
    .slice(0, 32);
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = unsubscribeToken(email);
  if (!expected || expected.length !== token.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export type Subscriber = {
  email: string;
  createdAt: string;
};

async function subscribersAjax<T>(
  action: string,
  params: Record<string, string>,
): Promise<T> {
  if (!WORDPRESS_URL) throw new Error("Missing WOOCOMMERCE_URL env var");
  if (!SUBSCRIBERS_SECRET) {
    throw new Error("Missing WP_SUBSCRIBERS_SECRET env var");
  }

  const body = new URLSearchParams({
    action,
    secret: SUBSCRIBERS_SECRET,
    ...params,
  });

  const res = await wpFetch(`${WORDPRESS_URL}/wp-admin/admin-ajax.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const json = (await res.json().catch(() => null)) as {
    success?: boolean;
    data?: T & { message?: string };
  } | null;
  if (!json?.success) {
    const userMessage: string | undefined = json?.data?.message;
    if (userMessage) {
      throw new UserFacingError(userMessage);
    }
    console.error(
      `Subscribers bridge error (${action}): ${res.status} ${JSON.stringify(json)}`,
    );
    throw new Error("bridge_failure");
  }
  return json.data as T;
}

class UserFacingError extends Error {}

export async function subscribeEmail(
  email: string,
): Promise<{ ok: true } | { error: string }> {
  try {
    await subscribersAjax<{ message: string }>("ruined_subscribe", { email });
    return { ok: true };
  } catch (err) {
    if (err instanceof UserFacingError) {
      return { error: err.message };
    }
    console.error("subscribeEmail failed:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function unsubscribeEmail(email: string): Promise<boolean> {
  try {
    await subscribersAjax<{ message: string }>("ruined_unsubscribe", {
      email,
    });
    return true;
  } catch {
    return false;
  }
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  const raw = await subscribersAjax<{
    count: number;
    subscribers: Array<{ email: string; created_at: string }>;
  }>("ruined_subscribers_list", {});

  return raw.subscribers.map((s) => ({
    email: s.email,
    createdAt: s.created_at,
  }));
}
