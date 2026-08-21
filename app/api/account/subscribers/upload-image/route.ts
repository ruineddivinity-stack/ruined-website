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

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const resized = await sharp(buffer)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 80 })
      .toBuffer();

    const blob = await put(`broadcast-flyers/${crypto.randomUUID()}.jpg`, resized, {
      access: "public",
      contentType: "image/jpeg",
    });

    return NextResponse.json({ url: blob.url, sizeKb: Math.round(resized.length / 1024) });
  } catch (err) {
    console.error("Flyer image processing failed:", err);
    const message = err instanceof Error ? err.message : "";
    const isAuthIssue =
      /token|credential|not authorized|no store/i.test(message);
    return NextResponse.json(
      {
        error: isAuthIssue
          ? "The Blob store isn't connected to this project yet — open the store in the Vercel dashboard, go to its Projects tab, and connect it to this project (then redeploy)."
          : "Couldn't process that image. Try a different file.",
      },
      { status: 500 },
    );
  }
}
