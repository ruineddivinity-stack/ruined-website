import { NextResponse } from "next/server";
import { wpFetch } from "@/lib/wp-origin-fetch";

// Temporary diagnostic — reports presence/shape of the register auth env
// vars without exposing their actual values, and the RAW response our own
// wpFetch mechanism gets from WORDPRESS_URL for a harmless GET. Delete after use.
export async function GET() {
  const field = process.env.WP_REGISTER_AUTH_KEY_FIELD;
  const value = process.env.WP_REGISTER_AUTH_KEY;
  const wpUrl = process.env.WOOCOMMERCE_URL;

  let raw: unknown = null;
  try {
    const res = await wpFetch(`${wpUrl}/wp-json/`, { cache: "no-store" });
    const text = await res.text();
    raw = {
      status: res.status,
      url: res.url,
      redirected: res.redirected,
      server: res.headers.get("server"),
      location: res.headers.get("location"),
      bodyPreview: text.slice(0, 300),
    };
  } catch (err) {
    raw = { fetchError: err instanceof Error ? err.message : String(err) };
  }

  let registerRaw: unknown = null;
  try {
    const testEmail = `debug-route-${Date.now()}@ruined-dev.test`;
    const res = await wpFetch(`${wpUrl}/wp-json/simple-jwt-login/v1/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: "TestPassword123",
        ...(field && value ? { [field]: value } : {}),
      }),
      cache: "no-store",
    });
    const text = await res.text();
    registerRaw = {
      status: res.status,
      url: res.url,
      redirected: res.redirected,
      server: res.headers.get("server"),
      location: res.headers.get("location"),
      bodyPreview: text.slice(0, 500),
      testEmail,
    };
  } catch (err) {
    registerRaw = { fetchError: err instanceof Error ? err.message : String(err) };
  }

  // Same endpoint, but a plain 2-key body (matching login's shape exactly)
  // — isolates whether it's the auth-key field or the endpoint/path itself.
  let registerNoAuthRaw: unknown = null;
  try {
    const testEmail = `debug-noauth-${Date.now()}@ruined-dev.test`;
    const res = await wpFetch(`${wpUrl}/wp-json/simple-jwt-login/v1/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: "TestPassword123" }),
      cache: "no-store",
    });
    const text = await res.text();
    registerNoAuthRaw = { status: res.status, bodyPreview: text.slice(0, 500), testEmail };
  } catch (err) {
    registerNoAuthRaw = { fetchError: err instanceof Error ? err.message : String(err) };
  }

  // Login endpoint, but via the exact same wpFetch call shape used above,
  // for a clean side-by-side against the failing/succeeding register calls.
  let loginRaw: unknown = null;
  try {
    const res = await wpFetch(`${wpUrl}/wp-json/simple-jwt-login/v1/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nonexistent@ruined-dev.test", password: "wrong" }),
      cache: "no-store",
    });
    const text = await res.text();
    loginRaw = { status: res.status, bodyPreview: text.slice(0, 500) };
  } catch (err) {
    loginRaw = { fetchError: err instanceof Error ? err.message : String(err) };
  }

  return NextResponse.json({
    wpUrl,
    fieldSet: !!field,
    fieldLength: field?.length ?? 0,
    fieldPreview: field ? `${field.slice(0, 4)}...${field.slice(-4)}` : null,
    valueSet: !!value,
    valueLength: value?.length ?? 0,
    valuePreview: value ? `${value.slice(0, 4)}...${value.slice(-4)}` : null,
    raw,
    registerRaw,
    registerNoAuthRaw,
    loginRaw,
  });
}
