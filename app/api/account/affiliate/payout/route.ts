import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getAffiliateCoupons, requestPayout } from "@/lib/affiliate";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { couponId } = await request.json();
  if (!couponId) {
    return NextResponse.json({ error: "Missing couponId." }, { status: 400 });
  }

  const ownedCoupons = await getAffiliateCoupons(session.username);
  const owns = ownedCoupons.includes(couponId);
  if (!owns) {
    return NextResponse.json({ error: "Coupon not found." }, { status: 403 });
  }

  const success = await requestPayout(couponId, session.username);
  if (!success) {
    return NextResponse.json(
      { error: "Payout request failed. Try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
