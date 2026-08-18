import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session";
import { validateJwt } from "@/lib/wp-auth";
import { submitAffiliateApplication } from "@/lib/affiliate";

export async function POST(request: Request) {
  const store = await cookies();
  const jwt = store.get(SESSION_COOKIE)?.value;
  if (!jwt) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const user = await validateJwt(jwt);
  if (!user) {
    return NextResponse.json(
      { error: "Your session expired. Sign in again." },
      { status: 401 },
    );
  }

  const { couponCode } = await request.json();
  if (!couponCode || couponCode.trim().length < 3) {
    return NextResponse.json(
      { error: "Enter a coupon code that's at least 3 characters." },
      { status: 400 },
    );
  }

  const nameParts = (user.displayName || user.username).trim().split(/\s+/);
  const firstName = nameParts[0] ?? user.username;
  const lastName = nameParts.slice(1).join(" ") || firstName;

  const result = await submitAffiliateApplication({
    username: user.username,
    email: user.email,
    firstName,
    lastName,
    couponCode: couponCode.trim(),
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: result.message,
    autoAccepted: result.autoAccepted,
  });
}
