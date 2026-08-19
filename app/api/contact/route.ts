import { NextResponse } from "next/server";
import { isResendConfigured, sendContactEmail } from "@/lib/resend";

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const MAX_LENGTH = 5000;
const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Please fill out every field." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  if (
    name.length > 200 ||
    subject.length > 200 ||
    message.length > MAX_LENGTH
  ) {
    return NextResponse.json(
      { error: "One of your fields is too long." },
      { status: 400 },
    );
  }

  const photoEntries = formData.getAll("photos").filter(
    (entry): entry is File => entry instanceof File && entry.size > 0,
  );

  if (photoEntries.length > MAX_PHOTOS) {
    return NextResponse.json(
      { error: `You can attach up to ${MAX_PHOTOS} photos.` },
      { status: 400 },
    );
  }

  for (const photo of photoEntries) {
    if (!photo.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files can be attached." },
        { status: 400 },
      );
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json(
        { error: `"${photo.name}" is over the 5MB limit per photo.` },
        { status: 400 },
      );
    }
  }

  if (!isResendConfigured()) {
    return NextResponse.json(
      { error: "Contact form isn't configured yet. Email us directly instead." },
      { status: 503 },
    );
  }

  try {
    const attachments = await Promise.all(
      photoEntries.map(async (photo) => ({
        filename: photo.name || "photo.jpg",
        content: Buffer.from(await photo.arrayBuffer()),
      })),
    );

    await sendContactEmail({ name, email, subject, message, attachments });
  } catch (err) {
    console.error("Contact form send error:", err);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
