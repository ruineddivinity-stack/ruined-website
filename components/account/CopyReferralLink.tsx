"use client";

import { useState } from "react";

export function CopyReferralLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — clipboard access can fail silently (permissions, insecure context)
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        readOnly
        value={link}
        onFocus={(e) => e.target.select()}
        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-fg focus:border-steel-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-steel-500"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
