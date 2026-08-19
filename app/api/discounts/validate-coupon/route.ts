import { NextResponse } from "next/server";
import { getCouponByCode } from "@/lib/woocommerce";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  if (!code) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const coupon = await getCouponByCode(code);
  if (!coupon) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    amount: coupon.amount,
  });
}
