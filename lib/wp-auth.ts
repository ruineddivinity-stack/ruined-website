import "server-only";
import { wpFetch } from "./wp-origin-fetch";

const WORDPRESS_URL = process.env.WOOCOMMERCE_URL;

export type WpUser = {
  id: number;
  username: string;
  email: string;
  displayName: string;
};

type JwtAuthSuccess = {
  success: true;
  data: { jwt: string; refresh_token?: string };
};
type JwtAuthError = {
  success: false;
  data: { message: string; errorCode: number };
};

export async function loginWithPassword(
  email: string,
  password: string,
): Promise<{ jwt: string } | { error: string }> {
  if (!WORDPRESS_URL) throw new Error("Missing WOOCOMMERCE_URL env var");

  const res = await wpFetch(
    `${WORDPRESS_URL}/wp-json/simple-jwt-login/v1/auth`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    },
  );

  const json = (await res.json()) as JwtAuthSuccess | JwtAuthError;

  if (!json.success) {
    return { error: json.data.message || "Invalid email or password." };
  }
  return { jwt: json.data.jwt };
}

type ValidateResponse = {
  success: boolean;
  data?: {
    user?: {
      ID: string;
      user_login: string;
      user_email: string;
      display_name: string;
    };
  };
};

export async function validateJwt(jwt: string): Promise<WpUser | null> {
  if (!WORDPRESS_URL) throw new Error("Missing WOOCOMMERCE_URL env var");

  const res = await wpFetch(
    `${WORDPRESS_URL}/wp-json/simple-jwt-login/v1/auth/validate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ JWT: jwt }),
      cache: "no-store",
    },
  );

  if (!res.ok) return null;
  const json = (await res.json()) as ValidateResponse;
  const user = json.data?.user;
  if (!json.success || !user) return null;

  return {
    id: Number(user.ID),
    username: user.user_login,
    email: user.user_email,
    displayName: user.display_name,
  };
}

type RegisterSuccess = {
  success: true;
  id: number;
  jwt?: string;
};
type RegisterError = {
  success: false;
  data?: { message: string; errorCode: number };
  message?: string;
};

export async function registerUser(
  email: string,
  password: string,
  displayName?: string,
): Promise<{ jwt: string | null } | { error: string }> {
  if (!WORDPRESS_URL) throw new Error("Missing WOOCOMMERCE_URL env var");

  // Simple JWT Login's "require auth key on register" setting expects the
  // code under a site-specific field NAME (its randomized "Auth Code Key"
  // setting) — not a fixed "AUTH_KEY" field. Sending it under the wrong key
  // is silently ignored by the plugin, so registration fails validation
  // ("Invalid Auth Code") regardless of whether the code value is correct.
  const authKeyField = process.env.WP_REGISTER_AUTH_KEY_FIELD;
  const authKeyValue = process.env.WP_REGISTER_AUTH_KEY;

  const res = await wpFetch(`${WORDPRESS_URL}/wp-json/simple-jwt-login/v1/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      ...(displayName ? { display_name: displayName } : {}),
      ...(authKeyField && authKeyValue ? { [authKeyField]: authKeyValue } : {}),
    }),
    cache: "no-store",
  });

  const json = (await res.json()) as RegisterSuccess | RegisterError;

  if (!res.ok || !json.success) {
    const message =
      (json as RegisterError).data?.message ||
      (json as RegisterError).message ||
      "Unable to create an account.";
    return { error: message };
  }

  return { jwt: json.jwt ?? null };
}

type SimpleSuccess = { success: true; message?: string };
type SimpleError = { success: false; data?: { message: string } };

export async function requestPasswordReset(
  email: string,
): Promise<{ ok: true } | { error: string }> {
  if (!WORDPRESS_URL) throw new Error("Missing WOOCOMMERCE_URL env var");

  const res = await wpFetch(
    `${WORDPRESS_URL}/wp-json/simple-jwt-login/v1/user/reset_password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
    },
  );

  const json = (await res.json()) as SimpleSuccess | SimpleError;
  if (!res.ok || !json.success) {
    const message =
      (json as SimpleError).data?.message ||
      "Unable to send a reset code. Check the email and try again.";
    return { error: message };
  }
  return { ok: true };
}

export async function confirmPasswordReset(
  email: string,
  code: string,
  newPassword: string,
): Promise<{ ok: true } | { error: string }> {
  if (!WORDPRESS_URL) throw new Error("Missing WOOCOMMERCE_URL env var");

  const res = await wpFetch(
    `${WORDPRESS_URL}/wp-json/simple-jwt-login/v1/user/reset_password`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, new_password: newPassword }),
      cache: "no-store",
    },
  );

  const json = (await res.json()) as SimpleSuccess | SimpleError;
  if (!res.ok || !json.success) {
    const message =
      (json as SimpleError).data?.message ||
      "That reset code is invalid or expired.";
    return { error: message };
  }
  return { ok: true };
}
