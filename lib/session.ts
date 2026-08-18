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
