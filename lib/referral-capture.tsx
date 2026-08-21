"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";

const STORAGE_KEY = "ruined-referral-code";
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

type StoredReferral = { code: string; expires: number };

export function getStoredReferralCode(): string | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredReferral;
    if (!parsed.code || Date.now() > parsed.expires) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.code;
  } catch {
    return null;
  }
}

export function ReferralCapture() {
  const searchParams = useSearchParams();
  const { coupon, setCoupon } = useCart();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (!ref) return;
    const stored: StoredReferral = {
      code: ref.trim().toUpperCase(),
      expires: Date.now() + EXPIRY_MS,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // ignore
    }
    if (!coupon) {
      setCoupon({ code: "FRIEND10", discountType: "percent", amount: 10 });
    }
    // Only react to a fresh ?ref= appearing, not to coupon/setCoupon identity churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return null;
}
