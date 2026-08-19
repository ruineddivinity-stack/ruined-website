"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setError(null);

    const incoming = Array.from(fileList);
    const nonImage = incoming.find((f) => !f.type.startsWith("image/"));
    if (nonImage) {
      setError("Only image files can be attached.");
      return;
    }
    const tooLarge = incoming.find((f) => f.size > MAX_PHOTO_BYTES);
    if (tooLarge) {
      setError(`"${tooLarge.name}" is over the 5MB limit per photo.`);
      return;
    }

    setPhotos((prev) => {
      const combined = [...prev, ...incoming];
      if (combined.length > MAX_PHOTOS) {
        setError(`You can attach up to ${MAX_PHOTOS} photos.`);
        return prev;
      }
      return combined;
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("subject", subject);
    formData.set("message", message);
    photos.forEach((photo) => formData.append("photos", photo));

    const res = await fetch("/api/contact", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong. Try again.");
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-steel-500/30 bg-surface px-6 py-10 text-center">
        <p className="text-sm font-semibold text-fg">Message sent.</p>
        <p className="text-xs text-fg-muted">
          Thanks for reaching out — a real person will reply to{" "}
          <span className="text-fg">{email}</span> within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          placeholder="Jane Researcher"
          value={name}
          onChange={setName}
        />
        <Field
          label="Email"
          type="email"
          placeholder="you@lab.com"
          value={email}
          onChange={setEmail}
        />
      </div>
      <Field
        label="Subject"
        placeholder="Question about an order"
        value={subject}
        onChange={setSubject}
      />
      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Message
        </span>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
        />
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Documentation Upload{" "}
          <span className="font-normal normal-case text-fg-faint">
            (optional — for damaged, defective, or incorrect items)
          </span>
        </span>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => addFiles(e.target.files)}
          className="hidden"
          id="contact-photos"
        />

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-6 py-10 text-center transition-colors ${
            dragActive
              ? "border-steel-400 bg-steel-700/15"
              : "border-border bg-surface/40"
          }`}
        >
          <UploadIcon className="h-6 w-6 text-steel-300" />
          <p className="text-sm text-fg-muted">
            Drag &amp; drop files, or{" "}
            <label
              htmlFor="contact-photos"
              className="cursor-pointer text-steel-400 underline underline-offset-2 hover:text-steel-300"
            >
              choose files to upload
            </label>
          </p>
          <p className="text-xs text-fg-faint">
            You can upload up to {MAX_PHOTOS} photos, 5MB each.
          </p>
        </div>

        {photos.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-2">
            {photos.map((photo, i) => (
              <li
                key={`${photo.name}-${i}`}
                className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-fg-muted"
              >
                <span className="max-w-[10rem] truncate">{photo.name}</span>
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  aria-label={`Remove ${photo.name}`}
                  className="text-fg-faint hover:text-danger"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" disabled={loading} className="w-fit">
        {loading ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
        {label}
      </span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
      />
    </label>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 16V4M12 4 7 9M12 4l5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}
