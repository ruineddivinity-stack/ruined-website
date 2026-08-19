import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { saveAffiliateBankInfo, type BankInfo } from "@/lib/affiliate";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  const accountHolder =
    typeof body?.accountHolder === "string" ? body.accountHolder.trim() : "";
  const bankName = typeof body?.bankName === "string" ? body.bankName.trim() : "";
  const accountNumber =
    typeof body?.accountNumber === "string" ? body.accountNumber.trim() : "";
  const routingNumber =
    typeof body?.routingNumber === "string" ? body.routingNumber.trim() : "";
  const accountType =
    body?.accountType === "savings" ? "savings" : "checking";

  if (!accountHolder || !bankName || !accountNumber || !routingNumber) {
    return NextResponse.json(
      { error: "Please fill out every field." },
      { status: 400 },
    );
  }

  if (!/^\d{4,17}$/.test(accountNumber)) {
    return NextResponse.json(
      { error: "Enter a valid account number." },
      { status: 400 },
    );
  }

  if (!/^\d{9}$/.test(routingNumber)) {
    return NextResponse.json(
      { error: "Routing numbers are 9 digits." },
      { status: 400 },
    );
  }

  const info: BankInfo = {
    accountHolder,
    bankName,
    accountNumber,
    routingNumber,
    accountType,
  };

  const saved = await saveAffiliateBankInfo(session.username, info);
  if (!saved) {
    return NextResponse.json(
      { error: "Could not save your bank details. Try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
