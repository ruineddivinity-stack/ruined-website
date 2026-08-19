import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getAffiliateBankStatus } from "@/lib/affiliate";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const hasBankInfo = await getAffiliateBankStatus(session.username);
  return NextResponse.json({ hasBankInfo });
}
