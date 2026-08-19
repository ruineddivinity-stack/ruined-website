import { NextResponse } from "next/server";
import { unsubscribeEmail, verifyUnsubscribeToken } from "@/lib/subscribers";

function page(title: string, message: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${title} | RUINED</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#030304;color:#f4f5f6;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:420px;text-align:center;padding:32px;">
    <h1 style="font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">${title}</h1>
    <p style="color:#9aa1a9;font-size:14px;line-height:1.6;margin-top:12px;">${message}</p>
  </div>
</body>
</html>`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";
  const token = url.searchParams.get("token") || "";

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return new NextResponse(
      page("Invalid link", "This unsubscribe link is invalid or has expired."),
      { status: 400, headers: { "Content-Type": "text/html" } },
    );
  }

  await unsubscribeEmail(email);

  return new NextResponse(
    page("Unsubscribed", `${email} has been removed from the RUINED mailing list.`),
    { headers: { "Content-Type": "text/html" } },
  );
}
