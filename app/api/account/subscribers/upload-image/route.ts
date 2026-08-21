import { NextResponse } from "next/server";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { getSession, isAdminUser } from "@/lib/session";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_WIDTH = 640;

export async function POST(request: Request) {
  const session = await getSession();
  if (!isAdminUser(session)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("image");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No image uploaded." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Image is too large — keep it under 10MB." },
      { status: 400 },
    );
  }

  let resized: Buffer;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    resized = await sharp(buffer)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 80 })
      .toBuffer();
  } catch (err) {
    console.error("Flyer image resize failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Couldn't process that image: ${message}` },
      { status: 500 },
    );
  }

  const pathname = `broadcast-flyers/${crypto.randomUUID()}.jpg`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010";

  try {
    await put(pathname, resized, {
      access: "private",
      contentType: "image/jpeg",
    });
    const url = `${siteUrl}/api/flyer?pathname=${encodeURIComponent(pathname)}`;
    return NextResponse.json({ url, sizeKb: Math.round(resized.length / 1024) });
  } catch (err) {
    console.error("Flyer image upload failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Couldn't upload the image: ${message}` },
      { status: 500 },
    );
  }
}
