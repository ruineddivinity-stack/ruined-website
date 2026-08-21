import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getReferralBalance } from "@/lib/referral";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ balance: 0 });
  }

  const balance = await getReferralBalance(session.username);
  return NextResponse.json({ balance });
}
