"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AppliedCoupon } from "./discounts";

export type CartItem = {
  slug: string;
  qty: number;
  variationId?: number;
  variationLabel?: string;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  coupon: AppliedCoupon | null;
  setCoupon: (coupon: AppliedCoupon | null) => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (
    slug: string,
    qty?: number,
    variation?: { id: number; label: string },
  ) => void;
  removeItem: (slug: string, variationId?: number) => void;
  updateQty: (slug: string, qty: number, variationId?: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "ruined-cart";
const COUPON_STORAGE_KEY = "ruined-cart-coupon";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage on mount — window is unavailable
    // during SSR, so this can't be done via a lazy useState initializer.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
      const rawCoupon = window.localStorage.getItem(COUPON_STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (rawCoupon) setCoupon(JSON.parse(rawCoupon));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (coupon) {
      window.localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
    } else {
      window.localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [coupon, hydrated]);

  const addItem = (
    slug: string,
    qty = 1,
    variation?: { id: number; label: string },
  ) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.slug === slug && i.variationId === variation?.id,
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [
        ...prev,
        {
          slug,
          qty,
          variationId: variation?.id,
          variationLabel: variation?.label,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (slug: string, variationId?: number) => {
    setItems((prev) =>
      prev.filter((i) => !(i.slug === slug && i.variationId === variationId)),
    );
  };

  const updateQty = (slug: string, qty: number, variationId?: number) => {
    if (qty <= 0) {
      removeItem(slug, variationId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.slug === slug && i.variationId === variationId ? { ...i, qty } : i,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        count,
        coupon,
        setCoupon,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
