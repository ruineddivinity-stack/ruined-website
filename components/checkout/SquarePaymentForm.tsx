"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => SquarePayments;
    };
  }
}

type SquarePaymentMethod = {
  attach: (element: HTMLElement, options?: Record<string, unknown>) => Promise<void>;
  tokenize: () => Promise<{
    status: string;
    token?: string;
    errors?: { message: string }[];
  }>;
  destroy: () => Promise<void>;
};

type SquarePaymentRequest = {
  update: (options: Record<string, unknown>) => void;
};

type SquarePayments = {
  card: (options?: Record<string, unknown>) => Promise<SquarePaymentMethod>;
  applePay: (paymentRequest: SquarePaymentRequest) => Promise<SquarePaymentMethod>;
  googlePay: (paymentRequest: SquarePaymentRequest) => Promise<SquarePaymentMethod>;
  paymentRequest: (options: Record<string, unknown>) => SquarePaymentRequest;
};

const SDK_SRC =
  process.env.NEXT_PUBLIC_SQUARE_ENV === "production"
    ? "https://web.squarecdn.com/v1/square.js"
    : "https://sandbox.web.squarecdn.com/v1/square.js";

type Kind = "card" | "applePay" | "googlePay";

type Props = {
  amount: number;
  disabled?: boolean;
  onToken: (sourceId: string) => void;
  onError: (message: string) => void;
};

export function SquarePaymentForm({ amount, disabled, onToken, onError }: Props) {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const applePayContainerRef = useRef<HTMLDivElement>(null);
  const googlePayContainerRef = useRef<HTMLDivElement>(null);

  const paymentRequestRef = useRef<SquarePaymentRequest | null>(null);
  const cardMethodRef = useRef<SquarePaymentMethod | null>(null);
  const applePayMethodRef = useRef<SquarePaymentMethod | null>(null);
  const googlePayMethodRef = useRef<SquarePaymentMethod | null>(null);

  const [sdkReady, setSdkReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [applePayReady, setApplePayReady] = useState(false);
  const [googlePayReady, setGooglePayReady] = useState(false);
  const [processing, setProcessing] = useState<Kind | null>(null);

  useEffect(() => {
    if (window.Square) {
      setSdkReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = SDK_SRC;
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () =>
      onError("Could not load the payment form. Please refresh and try again.");
    document.body.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initializes the card field and wallet buttons exactly once when the SDK
  // is ready. `amount` is intentionally not a dependency here — see the
  // separate effect below for why re-running this on every price change
  // was breaking the card field.
  useEffect(() => {
    if (!sdkReady || !window.Square || amount <= 0) return;

    const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
    if (!appId || !locationId) {
      onError("Payments are not configured yet.");
      return;
    }

    let cancelled = false;

    (async () => {
      const payments = window.Square!.payments(appId, locationId);

      try {
        const card = await payments.card({
          style: {
            ".input-container": {
              borderColor: "#c3ccd3",
              borderRadius: "12px",
              borderWidth: "1px",
            },
            ".input-container.is-focus": {
              borderColor: "#5686ac",
            },
            ".input-container.is-error": {
              borderColor: "#c4544a",
            },
            input: {
              color: "#1b1e22",
              fontSize: "14px",
              fontWeight: "500",
            },
            "input.is-focus": {
              color: "#1b1e22",
            },
            "input.is-error": {
              color: "#c4544a",
            },
            ".message-text": {
              color: "#9aa1a9",
            },
            ".message-icon": {
              color: "#9aa1a9",
            },
            ".message-text.is-error": {
              color: "#c4544a",
            },
            ".message-icon.is-error": {
              color: "#c4544a",
            },
          },
        });
        if (cancelled) return;
        if (cardContainerRef.current) {
          await card.attach(cardContainerRef.current);
          cardMethodRef.current = card;
          setCardReady(true);
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Square card initialization failed", err);
        onError(
          "The card payment form couldn't load. Please refresh the page and try again.",
        );
        return;
      }

      const paymentRequest = payments.paymentRequest({
        countryCode: "US",
        currencyCode: "USD",
        total: { amount: amount.toFixed(2), label: "Total" },
      });
      paymentRequestRef.current = paymentRequest;

      try {
        const applePay = await payments.applePay(paymentRequest);
        if (cancelled) return;
        if (applePayContainerRef.current) {
          await applePay.attach(applePayContainerRef.current, {
            buttonColor: "black",
          });
          applePayMethodRef.current = applePay;
          setApplePayReady(true);
        }
      } catch (err) {
        console.warn("Apple Pay unavailable:", err);
        setApplePayReady(false);
      }

      try {
        const googlePay = await payments.googlePay(paymentRequest);
        if (cancelled) return;
        if (googlePayContainerRef.current) {
          await googlePay.attach(googlePayContainerRef.current, {
            buttonColor: "black",
          });
          googlePayMethodRef.current = googlePay;
          setGooglePayReady(true);
        }
      } catch (err) {
        console.warn("Google Pay unavailable:", err);
        setGooglePayReady(false);
      }
    })();

    return () => {
      cancelled = true;
      cardMethodRef.current?.destroy?.();
      applePayMethodRef.current?.destroy?.();
      googlePayMethodRef.current?.destroy?.();
      cardMethodRef.current = null;
      applePayMethodRef.current = null;
      googlePayMethodRef.current = null;
      paymentRequestRef.current = null;
      setCardReady(false);
      setApplePayReady(false);
      setGooglePayReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdkReady]);

  // Keeps the Apple Pay / Google Pay sheets' displayed total in sync with
  // the cart (e.g. after applying an affiliate code) without tearing down
  // and recreating the whole payment form. The previous version re-ran the
  // full init effect on every amount change, which destroys and reattaches
  // the card field's iframe — but Square's destroy() isn't awaited by
  // React's cleanup, so the rebuild could race the still-in-flight
  // destroy() on the same DOM node and silently fail to reattach, making
  // the card field disappear.
  useEffect(() => {
    paymentRequestRef.current?.update({
      total: { amount: amount.toFixed(2), label: "Total" },
    });
  }, [amount]);

  const tokenize = async (method: SquarePaymentMethod | null, kind: Kind) => {
    if (!method || disabled || processing) return;
    setProcessing(kind);
    try {
      const result = await method.tokenize();
      if (result.status === "OK" && result.token) {
        onToken(result.token);
      } else {
        onError(
          result.errors?.[0]?.message ??
            "Payment could not be processed. Please try again.",
        );
      }
    } catch {
      onError("Payment could not be processed. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {/* Always mounted (never conditional on *Ready) so the ref exists
            before Square tries to attach to it — these flags only flip true
            *after* a successful attach, so gating the div on them made the
            attach permanently unable to find its container. */}
        <div
          ref={applePayContainerRef}
          role="button"
          className={
            applePayReady
              ? "h-12 w-full cursor-pointer"
              : "h-0 w-full overflow-hidden"
          }
          onClick={() => tokenize(applePayMethodRef.current, "applePay")}
        />
        <div
          ref={googlePayContainerRef}
          role="button"
          className={
            googlePayReady
              ? "h-12 w-full cursor-pointer"
              : "h-0 w-full overflow-hidden"
          }
          onClick={() => tokenize(googlePayMethodRef.current, "googlePay")}
        />
        {(applePayReady || googlePayReady) && (
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-fg-faint">
            <span className="h-px flex-1 bg-border" />
            <span>Or pay with card</span>
            <span className="h-px flex-1 bg-border" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {["Visa", "Mastercard", "Amex", "Discover"].map((brand) => (
          <Badge key={brand} tone="steel">
            {brand}
          </Badge>
        ))}
        <Badge tone="chrome">Apple Pay</Badge>
        <Badge tone="chrome">Google Pay</Badge>
      </div>

      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Card Details
        </span>
        <div className="mt-2 max-w-[420px] rounded-2xl border border-border bg-surface-2 p-3">
          <div ref={cardContainerRef} />
        </div>
      </div>

      <Button
        type="button"
        disabled={!cardReady || disabled || processing !== null}
        onClick={() => tokenize(cardMethodRef.current, "card")}
        className="mt-2 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {processing === "card" ? "Processing…" : `Pay $${amount.toFixed(2)}`}
      </Button>
    </div>
  );
}
