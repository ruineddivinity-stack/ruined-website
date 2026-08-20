"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => SquarePayments;
    };
  }
}

type SquareTokenizable = {
  tokenize: () => Promise<{
    status: string;
    token?: string;
    errors?: { message: string }[];
  }>;
  destroy: () => Promise<void>;
};

// Card and Google Pay render into a container Square manages for you.
// Apple Pay does not — Apple requires its own native button element, and
// you call tokenize() directly from that button's click handler instead.
type SquarePaymentMethod = SquareTokenizable & {
  attach: (element: HTMLElement, options?: Record<string, unknown>) => Promise<void>;
};

type SquarePaymentRequest = {
  update: (options: Record<string, unknown>) => void;
};

type SquarePayments = {
  card: (options?: Record<string, unknown>) => Promise<SquarePaymentMethod>;
  applePay: (paymentRequest: SquarePaymentRequest) => Promise<SquareTokenizable>;
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
  const googlePayContainerRef = useRef<HTMLDivElement>(null);

  const paymentRequestRef = useRef<SquarePaymentRequest | null>(null);
  const cardMethodRef = useRef<SquarePaymentMethod | null>(null);
  const applePayMethodRef = useRef<SquareTokenizable | null>(null);
  const googlePayMethodRef = useRef<SquarePaymentMethod | null>(null);

  const [sdkReady, setSdkReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [applePayReady, setApplePayReady] = useState(false);
  const [googlePayReady, setGooglePayReady] = useState(false);
  const [processing, setProcessing] = useState<Kind | null>(null);
  const [pressedKind, setPressedKind] = useState<Kind | null>(null);

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
        applePayMethodRef.current = applePay;
        setApplePayReady(true);
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
            buttonType: "long",
            buttonSizeMode: "fill",
            buttonRadius: 12,
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

  const tokenize = async (method: SquareTokenizable | null, kind: Kind) => {
    if (processing) return;
    if (disabled) {
      onError("Please fill in your contact and shipping details first.");
      return;
    }
    if (!method) return;
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
        {/* Apple Pay has no attach() — Apple requires its own native button
            element instead of a Square-rendered container, so this is a
            plain button using the -apple-pay-button system appearance
            (Safari-only; see .apple-pay-button in globals.css), tokenizing
            directly on click as Apple's integration requires. The border +
            press scale live on this wrapper, not the button itself — the
            native system appearance ignores border/transform applied
            directly to it. */}
        {applePayReady && (
          <div
            className={`overflow-hidden rounded-xl border border-chrome-500 transition-transform duration-100 ${
              pressedKind === "applePay" ? "scale-[0.97]" : "scale-100"
            }`}
            onPointerDown={() => setPressedKind("applePay")}
            onPointerUp={() => setPressedKind(null)}
            onPointerLeave={() => setPressedKind(null)}
            onPointerCancel={() => setPressedKind(null)}
          >
            <button
              type="button"
              aria-label="Apple Pay"
              className="apple-pay-button"
              onClick={() => tokenize(applePayMethodRef.current, "applePay")}
            />
          </div>
        )}
        {/* Always mounted at full size (never conditional on googlePayReady)
            so the ref exists *and already has real h-12/w-full dimensions*
            before Square tries to attach to it — Square sizes the button it
            renders against whatever the container measures at attach time,
            so a container collapsed to zero height produced a button that
            never actually filled the space, even after the class changed
            later. The outer wrapper handles show/hide via opacity instead
            of height, so the box dimensions stay constant throughout. */}
        <div
          className={`overflow-hidden rounded-xl border border-chrome-500 transition-all duration-100 ${
            googlePayReady
              ? `opacity-100 ${pressedKind === "googlePay" ? "scale-[0.97]" : "scale-100"}`
              : "pointer-events-none h-0 opacity-0"
          }`}
          onPointerDown={() => googlePayReady && setPressedKind("googlePay")}
          onPointerUp={() => setPressedKind(null)}
          onPointerLeave={() => setPressedKind(null)}
          onPointerCancel={() => setPressedKind(null)}
        >
          <div
            ref={googlePayContainerRef}
            role="button"
            className="h-12 w-full cursor-pointer"
            onClick={() => tokenize(googlePayMethodRef.current, "googlePay")}
          />
        </div>
        {(applePayReady || googlePayReady) && (
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-fg-faint">
            <span className="h-px flex-1 bg-border" />
            <span>Or pay with card</span>
            <span className="h-px flex-1 bg-border" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <VisaIcon />
        <MastercardIcon />
        <AmexIcon />
        <DiscoverIcon />
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

function VisaIcon() {
  return (
    <svg width="34" height="22" viewBox="0 0 34 22" aria-label="Visa" role="img">
      <rect width="34" height="22" rx="4" fill="#1434CB" />
      <text
        x="17"
        y="15.5"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="10"
        fill="#ffffff"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg width="34" height="22" viewBox="0 0 34 22" aria-label="Mastercard" role="img">
      <rect width="34" height="22" rx="4" fill="#16191c" />
      <circle cx="14" cy="11" r="6.5" fill="#EB001B" />
      <circle cx="20" cy="11" r="6.5" fill="#F79E1B" fillOpacity="0.85" />
    </svg>
  );
}

function AmexIcon() {
  return (
    <svg width="34" height="22" viewBox="0 0 34 22" aria-label="American Express" role="img">
      <rect width="34" height="22" rx="4" fill="#2E77BC" />
      <text
        x="17"
        y="14.5"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="7.5"
        fill="#ffffff"
      >
        AMEX
      </text>
    </svg>
  );
}

function DiscoverIcon() {
  return (
    <svg width="34" height="22" viewBox="0 0 34 22" aria-label="Discover" role="img">
      <rect width="34" height="22" rx="4" fill="#1b1e22" />
      <circle cx="25" cy="11" r="7" fill="#FF6000" />
      <text
        x="13"
        y="14"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="6"
        fill="#ffffff"
      >
        DISC
      </text>
    </svg>
  );
}
