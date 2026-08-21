import { type NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";

// Public by design — email clients load this with no auth of their own.
// Locked to the broadcast-flyers/ prefix so it can't be used to read
// anything else out of the (private) Blob store.
export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname");
  if (!pathname || !pathname.startsWith("broadcast-flyers/")) {
    return NextResponse.json({ error: "Missing or invalid pathname" }, { status: 400 });
  }

  const result = await get(pathname, { access: "private" }).catch(() => null);
  if (!result || result.statusCode !== 200) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      "Cache-Control": "public, max-age=2592000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
