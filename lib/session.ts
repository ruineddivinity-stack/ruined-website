import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { validateJwt, type WpUser } from "./wp-auth";

export const SESSION_COOKIE = "ruined_session";

export const getSession = cache(async (): Promise<WpUser | null> => {
  const store = await cookies();
  const jwt = store.get(SESSION_COOKIE)?.value;
  if (!jwt) return null;
  return validateJwt(jwt);
});

export function isAdminUser(user: WpUser | null): boolean {
  const adminEmail = process.env.WP_ADMIN_EMAIL;
  if (!user || !adminEmail) return false;
  return user.email.toLowerCase() === adminEmail.toLowerCase();
}
