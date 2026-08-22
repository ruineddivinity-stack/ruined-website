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
import { GIFT_TIERS, getGiftTier, BUNDLE_FREE_ITEM_SLUG } from "./discounts";
import { resolveCartLines } from "./cart-lines";
import type { Product } from "./types";

export type CartItem = {
  slug: string;
  qty: number;
  variationId?: number;
  variationLabel?: string;
  /** True for a line auto-added by the gift-tier ladder — never user-editable. */
  isGift?: boolean;
  /** True for a vial (or the free 5th item) picked into a Build-a-Bundle. */
  isBundlePick?: boolean;
  /** Shared by every line in one bundle instance — used to add/remove the set as a unit. */
  bundleId?: string;
};

export type BundlePick = {
  slug: string;
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
  addBundle: (picks: BundlePick[]) => void;
  removeBundle: (bundleId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "ruined-cart";
const COUPON_STORAGE_KEY = "ruined-cart-coupon";

export function CartProvider({
  children,
  products,
}: {
  children: ReactNode;
  products: Product[];
}) {
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

  // Auto-add/remove free-gift lines as the paid subtotal crosses a
  // GIFT_TIERS threshold — the cart itself is the source of truth for what
  // gift the customer currently qualifies for, not just a checkout-time
  // calculation. Gift lines carry isGift:true and are never user-editable.
  const nonGiftItemsKey = JSON.stringify(items.filter((i) => !i.isGift));
  useEffect(() => {
    if (!hydrated) return;
    const nonGiftItems = items.filter((i) => !i.isGift);
    // Bundle-picked vials are excluded from the tier-eligibility subtotal —
    // they already earn their own free BAC water as part of the bundle deal,
    // so counting them here would grant a confusing second one on top of it.
    const subtotal = resolveCartLines(
      nonGiftItems.filter((i) => !i.isBundlePick),
      products,
    ).reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
    const tier = getGiftTier(subtotal);

    // If a bundle is already in the cart, it always includes its own free
    // BAC Water — never hand out a second, physical one for hitting a
    // regular-item tier that happens to grant the same product. Any other
    // (different) item a tier grants — like GHK-CU — still comes through
    // normally.
    const bundleAlreadyGrantsBacWater = items.some(
      (i) => i.isGift && i.bundleId && i.slug === BUNDLE_FREE_ITEM_SLUG,
    );

    const desiredGifts: CartItem[] = [];
    if (tier) {
      for (const spec of tier.items) {
        if (spec.slug === BUNDLE_FREE_ITEM_SLUG && bundleAlreadyGrantsBacWater) {
          continue;
        }
        const product = products.find((p) => p.slug === spec.slug);
        if (!product) continue;
        const variation = spec.variationLabel
          ? product.variations?.find((v) => v.label === spec.variationLabel)
          : undefined;
        const inStock = variation ? variation.inStock : product.inStock;
        if (!inStock) continue;
        desiredGifts.push({
          slug: product.slug,
          qty: 1,
          variationId: variation?.id,
          variationLabel: variation?.label,
          isGift: true,
        });
      }
    }

    const keyOf = (list: CartItem[]) =>
      list
        .map((i) => `${i.slug}:${i.variationId ?? ""}`)
        .sort()
        .join(",");
    // Bundle-linked gift lines (the free 5th item a bundle grants) aren't
    // managed by this tier ladder — leave them alone so this reconciliation
    // doesn't wipe them out on every cycle.
    const bundleGiftItems = items.filter((i) => i.isGift && i.bundleId);
    const currentGiftKey = keyOf(items.filter((i) => i.isGift && !i.bundleId));
    const desiredGiftKey = keyOf(desiredGifts);

    if (currentGiftKey !== desiredGiftKey) {
      setItems([...nonGiftItems, ...bundleGiftItems, ...desiredGifts]);
    }
    // Deliberately keyed on the non-gift portion only (via nonGiftItemsKey) —
    // reacting to `items` directly would re-fire on every gift-line write
    // this effect itself makes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, products, nonGiftItemsKey]);

  const addItem = (
    slug: string,
    qty = 1,
    variation?: { id: number; label: string },
  ) => {
    setItems((prev) => {
      // Never merge into a gift or bundle-picked line for the same
      // product — those are managed exclusively by the gift ladder and
      // addBundle/removeBundle. A normal "Add to cart" always gets its own
      // regular line, even if the same product is also sitting in a bundle.
      const existing = prev.find(
        (i) =>
          i.slug === slug &&
          i.variationId === variation?.id &&
          !i.isGift &&
          !i.isBundlePick,
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
      prev.filter(
        (i) =>
          !(
            i.slug === slug &&
            i.variationId === variationId &&
            !i.isGift &&
            !i.isBundlePick
          ),
      ),
    );
  };

  const updateQty = (slug: string, qty: number, variationId?: number) => {
    if (qty <= 0) {
      removeItem(slug, variationId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.slug === slug &&
        i.variationId === variationId &&
        !i.isGift &&
        !i.isBundlePick
          ? { ...i, qty }
          : i,
      ),
    );
  };

  const addBundle = (picks: BundlePick[]) => {
    const bundleId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `bundle-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const bundleItems: CartItem[] = [
      ...picks.map((p) => ({
        slug: p.slug,
        qty: 1,
        variationId: p.variationId,
        variationLabel: p.variationLabel,
        isBundlePick: true,
        bundleId,
      })),
      {
        slug: BUNDLE_FREE_ITEM_SLUG,
        qty: 1,
        isGift: true,
        isBundlePick: true,
        bundleId,
      },
    ];
    setItems((prev) => [...prev, ...bundleItems]);
    setIsOpen(true);
  };

  const removeBundle = (bundleId: string) => {
    setItems((prev) => prev.filter((i) => i.bundleId !== bundleId));
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
        addBundle,
        removeBundle,
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
