import { NextResponse } from "next/server";
import { getSession, isAdminUser } from "@/lib/session";
import { getEmailStatus } from "@/lib/resend";

export async function GET(request: Request) {
  const session = await getSession();
  if (!isAdminUser(session)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  const status = await getEmailStatus(id);
  return NextResponse.json({ status });
}
