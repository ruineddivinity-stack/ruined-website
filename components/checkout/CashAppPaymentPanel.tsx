"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/Button";
import { CashAppIcon } from "@/components/checkout/CashAppIcon";
import { CASHAPP_TAG } from "@/lib/discounts";

export function CashAppPaymentPanel({
  amount,
  orderNumber,
  onConfirm,
}: {
  amount: number;
  orderNumber: string;
  onConfirm: () => void;
}) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const payUrl = `https://cash.app/${CASHAPP_TAG}/${amount.toFixed(2)}`;

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(payUrl, {
      width: 220,
      margin: 1,
      color: { dark: "#0a0b0d", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [payUrl]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 rounded-3xl border border-border bg-surface/60 p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00D632]/15">
        <CashAppIcon />
      </span>

      <div>
        <h2 className="font-display text-xl font-black uppercase tracking-tight text-fg">
          Send Payment
        </h2>
        <p className="mt-1.5 text-sm text-fg-muted">
          Scan the code or open CashApp and send{" "}
          <span className="font-semibold text-fg">${amount.toFixed(2)}</span>{" "}
          to <span className="font-semibold text-fg">{CASHAPP_TAG}</span>.
        </p>
      </div>

      <div className="flex h-[236px] w-[236px] items-center justify-center rounded-2xl bg-white p-2">
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrDataUrl} alt="CashApp payment QR code" width={220} height={220} />
        ) : (
          <span className="text-xs text-black/50">Generating code…</span>
        )}
      </div>

      <div className="w-full rounded-2xl border border-border-soft bg-surface px-5 py-4 text-left text-sm leading-relaxed text-fg-muted">
        Put{" "}
        <span className="font-semibold text-fg">Order #{orderNumber}</span> in
        the CashApp payment note. Once you&rsquo;ve sent it, tap confirm below
        and we&rsquo;ll take it from there.
      </div>

      <div className="w-full rounded-2xl border-2 border-danger bg-danger/15 px-5 py-4 text-left">
        <p className="text-sm font-black uppercase leading-relaxed text-danger">
          Do NOT mention peptides or any product names in the CashApp note
          &mdash; only your order number. Mentioning them will get you a
          warning and can get you banned from buying.
        </p>
      </div>

      <Button type="button" onClick={onConfirm} className="w-full justify-center">
        I&rsquo;ve Sent the Payment — Confirm
      </Button>
    </div>
  );
}
