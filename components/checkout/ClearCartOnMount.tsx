"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";

// Clearing the cart from the checkout page itself (before navigating away)
// re-renders CheckoutClient with an empty cart while the navigation to this
// page is still in flight, flashing its "Your cart is empty" state. Doing
// it here instead, after this page has already mounted, avoids that race
// entirely.
export function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
