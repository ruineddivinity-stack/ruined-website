"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

type Result =
  | { type: "success"; sent: number; failed: number; total: number; test?: boolean }
  | { type: "error"; message: string };

export function BroadcastForm({ subscriberCount }: { subscriberCount: number }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState<"test" | "send" | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [confirming, setConfirming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    setUploadingImage(true);
    setImageError(null);

    const form = new FormData();
    form.append("image", file);

    try {
      const res = await fetch("/api/account/subscribers/upload-image", {
        method: "POST",
        body: form,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setImageError(json.error ?? "Upload failed.");
        return;
      }
      setImageUrl(json.url);
    } catch {
      setImageError("Upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendTest = async () => {
    setLoading("test");
    setResult(null);
    setConfirming(false);

    const res = await fetch("/api/account/subscribers/send-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body, imageUrl }),
    });

    const json = await res.json().catch(() => ({}));
    setLoading(null);

    if (!res.ok) {
      setResult({ type: "error", message: json.error ?? "Test send failed." });
      return;
    }
    setResult({ type: "success", sent: json.sent, failed: json.failed, total: json.total, test: true });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setLoading("send");
    setResult(null);

    const res = await fetch("/api/account/subscribers/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body, imageUrl }),
    });

    const json = await res.json().catch(() => ({}));
    setLoading(null);
    setConfirming(false);

    if (!res.ok) {
      setResult({ type: "error", message: json.error ?? "Send failed." });
      return;
    }

    setResult({
      type: "success",
      sent: json.sent,
      failed: json.failed,
      total: json.total,
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Subject
        </span>
        <input
          type="text"
          required
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            setConfirming(false);
          }}
          placeholder="Back in stock: BPC-157"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
        />
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Flyer image (optional)
        </span>
        {imageUrl ? (
          <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div className="flex-1 text-xs text-fg-muted">
              This image will show at the top of the email.
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="text-xs font-semibold text-danger hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            disabled={uploadingImage}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file);
            }}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg file:mr-3 file:rounded-lg file:border-0 file:bg-steel-600/30 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-steel-300 focus:border-steel-500 focus:outline-none"
          />
        )}
        {uploadingImage && (
          <p className="text-xs text-fg-faint">Uploading and compressing…</p>
        )}
        {imageError && <p className="text-xs text-danger">{imageError}</p>}
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Message
        </span>
        <textarea
          required
          rows={8}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setConfirming(false);
          }}
          placeholder={"Write the email body here. Blank lines start a new paragraph."}
          className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
        />
      </label>

      {result?.type === "error" && (
        <p className="text-sm text-danger">{result.message}</p>
      )}
      {result?.type === "success" && (
        <p className="text-sm text-steel-400">
          {result.test ? "Test sent to your own email." : `Sent to ${result.sent} of ${result.total} subscribers${result.failed > 0 ? ` (${result.failed} failed)` : ""}.`}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={loading !== null || uploadingImage || !subject || !body}
          onClick={sendTest}
          className="justify-center"
        >
          {loading === "test" ? "Sending test…" : "Send Test to Myself"}
        </Button>

        <Button
          type="submit"
          disabled={loading !== null || uploadingImage}
          className="justify-center">
          {loading === "send"
            ? "Sending…"
            : confirming
              ? `Confirm — send to ${subscriberCount} subscriber${subscriberCount === 1 ? "" : "s"}`
              : "Send Broadcast"}
        </Button>
      </div>
      {confirming && loading === null && (
        <p className="text-xs text-fg-faint">
          Click again to confirm. This emails everyone on the list right away.
        </p>
      )}
    </form>
  );
}
