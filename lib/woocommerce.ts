import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { BundledItem, Order, Product, ProductVariation } from "./types";
import { wpFetch } from "./wp-origin-fetch";
import { PICKUP_METHOD_ID } from "./discounts";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

type WcImage = { src: string };
type WcCategory = { id: number; name: string };

type WcBundledItem = {
  product_id: number;
  title: string;
  quantity_default: number;
};

type WcProduct = {
  id: number;
  name: string;
  slug: string;
  type: string;
  status: string;
  price: string;
  regular_price: string;
  on_sale: boolean;
  featured: boolean;
  stock_status: "instock" | "outofstock" | "onbackorder";
  description: string;
  short_description: string;
  images: WcImage[];
  categories: WcCategory[];
  bundled_items?: WcBundledItem[];
};

type WcVariation = {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: "instock" | "outofstock" | "onbackorder";
  attributes: { option: string }[];
  // WooCommerce's REST API returns `[]` (not null) for a variation with no
  // image explicitly set, alongside the usual single-object shape.
  image: WcImage | WcImage[] | null;
};

async function fetchVariations(productId: number): Promise<ProductVariation[]> {
  const wcVariations = await wcFetch<WcVariation[]>(
    `products/${productId}/variations?per_page=100`,
  );
  return wcVariations
    .map((v) => {
      const regularPrice = Number.parseFloat(v.regular_price || v.price) || 0;
      const price = Number.parseFloat(v.price) || regularPrice;
      return {
        id: v.id,
        label: v.attributes[0]?.option ?? "",
        price,
        regularPrice,
        onSale: v.on_sale && price < regularPrice,
        inStock: v.stock_status === "instock",
        image: (Array.isArray(v.image) ? v.image[0] : v.image)?.src ?? null,
      };
    })
    .sort((a, b) => {
      // WooCommerce returns variations in creation order, not dose order —
      // sort ascending by the numeric MG value in the label (e.g. "10MG" ->
      // 10) so the cheapest/lowest dose is always first and default.
      const na = Number.parseFloat(a.label);
      const nb = Number.parseFloat(b.label);
      if (Number.isNaN(na) || Number.isNaN(nb)) return a.price - b.price;
      return na - nb;
    });
}

function authHeader() {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error(
      "Missing WOOCOMMERCE_CONSUMER_KEY / WOOCOMMERCE_CONSUMER_SECRET env vars",
    );
  }
  const token = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString(
    "base64",
  );
  return `Basic ${token}`;
}

async function wcFetch<T>(path: string): Promise<T> {
  if (!WOOCOMMERCE_URL) {
    throw new Error("Missing WOOCOMMERCE_URL env var");
  }
  const res = await wpFetch(`${WOOCOMMERCE_URL}/wp-json/wc/v3/${path}`, {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) {
    throw new Error(`WooCommerce API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

async function wcMutate<T>(
  path: string,
  method: "POST" | "PUT",
  body: unknown,
): Promise<T> {
  if (!WOOCOMMERCE_URL) {
    throw new Error("Missing WOOCOMMERCE_URL env var");
  }
  const res = await wpFetch(`${WOOCOMMERCE_URL}/wp-json/wc/v3/${path}`, {
    method,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WooCommerce API error ${res.status}: ${path} ${text}`);
  }
  return res.json() as Promise<T>;
}

const SIZE_PATTERN = /\b\d+(?:\.\d+)?\s?(?:MG|ML|IU)\b/i;

// Per-dose products that have since been merged into a single variable
// product (see the GLP-3 (RT) / TESA merge). Existing Bundle products'
// bundled_items still reference the old (now-private) product IDs, so
// "What's Included" would otherwise link nowhere and show no image. This
// maps those legacy IDs to where the dose now lives — add an entry here
// each time another product gets folded into a variable product.
const LEGACY_VARIATION_PRODUCTS: Record<
  number,
  { slug: string; label: string; image: string }
> = {
  1212: {
    slug: "glp-3-rt",
    label: "10MG",
    image: "https://wp.ruinedrx.com/wp-content/uploads/2026/06/glp3-10mg.png",
  },
  19: {
    slug: "glp-3-rt",
    label: "20MG",
    image:
      "https://wp.ruinedrx.com/wp-content/uploads/2026/08/retatrutide-20mg.png",
  },
  143: {
    slug: "glp-3-rt",
    label: "30MG",
    image:
      "https://wp.ruinedrx.com/wp-content/uploads/2026/08/retatrutide-30mg.png",
  },
  3172: {
    slug: "glp-3-rt",
    label: "50MG",
    image:
      "https://wp.ruinedrx.com/wp-content/uploads/2026/08/retatrutide-50mg.png",
  },
  22: {
    slug: "tesa",
    label: "10MG",
    image:
      "https://wp.ruinedrx.com/wp-content/uploads/2026/08/tesamorelin-10mg.png",
  },
  2927: {
    slug: "tesa",
    label: "20MG",
    image:
      "https://wp.ruinedrx.com/wp-content/uploads/2026/08/tesamorelin-20mg.png",
  },
  165: {
    slug: "ghk-cu",
    label: "50MG",
    image: "https://wp.ruinedrx.com/wp-content/uploads/2026/05/ghk-cu-50mg.png",
  },
  2922: {
    slug: "ghk-cu",
    label: "100MG",
    image:
      "https://wp.ruinedrx.com/wp-content/uploads/2026/08/ghk-cu-100mg.png",
  },
  169: {
    slug: "mots-c",
    label: "10MG",
    image:
      "https://wp.ruinedrx.com/wp-content/uploads/2026/08/mots-c-10mg.png",
  },
  2918: {
    slug: "mots-c",
    label: "20MG",
    image:
      "https://wp.ruinedrx.com/wp-content/uploads/2026/08/mots-c-20mg.png",
  },
  2920: {
    slug: "mots-c",
    label: "40MG",
    image:
      "https://wp.ruinedrx.com/wp-content/uploads/2026/08/mots-c-40mg.png",
  },
  171: {
    slug: "nad",
    label: "500MG",
    image: "https://wp.ruinedrx.com/wp-content/uploads/2026/08/nad-500mg.png",
  },
  2913: {
    slug: "nad",
    label: "1000MG",
    image:
      "https://wp.ruinedrx.com/wp-content/uploads/2026/08/nad-1000mg.png",
  },
};

function mapWcProduct(
  wc: WcProduct,
  imageLookup?: Map<number, { slug: string; image: string | null }>,
  variations: ProductVariation[] | null = null,
): Product {
  const sizeMatch = wc.name.match(SIZE_PATTERN);
  let regularPrice = Number.parseFloat(wc.regular_price || wc.price) || 0;
  let price = Number.parseFloat(wc.price) || regularPrice;
  let onSale = wc.on_sale && price < regularPrice;
  let inStock = wc.stock_status === "instock";

  if (variations && variations.length > 0) {
    const defaultVariation =
      variations.find((v) => v.inStock) ?? variations[0];
    price = defaultVariation.price;
    regularPrice = defaultVariation.regularPrice;
    onSale = defaultVariation.onSale;
    inStock = variations.some((v) => v.inStock);
  }

  const bundledItems: BundledItem[] | null = wc.bundled_items?.length
    ? wc.bundled_items.map((b) => {
        const match = imageLookup?.get(b.product_id);
        const legacy = LEGACY_VARIATION_PRODUCTS[b.product_id];
        return {
          productId: b.product_id,
          title: b.title,
          quantity: b.quantity_default || 1,
          slug: match?.slug ?? legacy?.slug ?? null,
          image: match?.image ?? legacy?.image ?? null,
          variationLabel: legacy?.label ?? null,
        };
      })
    : null;

  return {
    id: wc.id,
    slug: wc.slug,
    name: wc.name,
    category: wc.categories[0]?.name ?? "Uncategorized",
    categories: wc.categories.map((c) => c.name),
    type: wc.type,
    price,
    regularPrice,
    onSale,
    size: sizeMatch ? sizeMatch[0].toUpperCase() : null,
    featured: wc.featured,
    variations,
    image: wc.images[0]?.src ?? null,
    description: wc.description,
    shortDescription: wc.short_description,
    inStock,
    bundledItems,
  };
}

// wpFetch bypasses Next's patched global fetch (it has to, for the DNS-pin
// workaround above), so none of Next's built-in fetch caching applies here —
// every call would otherwise be a fresh, uncached round trip to WordPress.
// unstable_cache adds that caching back (shared across requests, revalidated
// periodically); the outer React cache() dedupes repeat calls within the
// same request (e.g. the root layout and a page both asking for products).
export const getAllProducts = cache(
  unstable_cache(
    async (): Promise<Product[]> => {
      const wcProducts = await wcFetch<WcProduct[]>(
        "products?per_page=100&status=publish&orderby=menu_order&order=asc",
      );
      return Promise.all(
        wcProducts.map(async (wc) => {
          const variations =
            wc.type === "variable" ? await fetchVariations(wc.id) : null;
          return mapWcProduct(wc, undefined, variations);
        }),
      );
    },
    ["get-all-products"],
    { revalidate: 60 },
  ),
);

export const getProductBySlug = cache(
  unstable_cache(
    async (slug: string): Promise<Product | null> => {
      const wcProducts = await wcFetch<WcProduct[]>(
        `products?slug=${encodeURIComponent(slug)}&status=publish`,
      );
      const wc = wcProducts[0];
      if (!wc) return null;

      const variations =
        wc.type === "variable" ? await fetchVariations(wc.id) : null;

      if (!wc.bundled_items?.length) {
        return mapWcProduct(wc, undefined, variations);
      }

      // Reuse the (also cached) full catalog instead of a second full fetch,
      // just to look up bundled items' images/slugs.
      const allProducts = await getAllProducts();
      const imageLookup = new Map(
        allProducts.map((p) => [p.id, { slug: p.slug, image: p.image }]),
      );

      return mapWcProduct(wc, imageLookup, variations);
    },
    ["get-product-by-slug"],
    { revalidate: 60 },
  ),
);

type WcOrder = {
  id: number;
  number: string;
  date_created: string;
  status: string;
  total: string;
  line_items: { name: string; quantity: number; total: string }[];
  shipping_lines?: { method_id: string }[];
};

type WcCoupon = {
  id: number;
  code: string;
  amount: string;
  discount_type: string;
  usage_count: number;
};

export type CouponDetails = {
  id: number;
  code: string;
  amount: number;
  discountType: string;
  usageCount: number;
};

export async function getCouponById(
  couponId: number,
): Promise<CouponDetails | null> {
  const wc = await wcFetch<WcCoupon>(`coupons/${couponId}`);
  if (!wc?.id) return null;

  return {
    id: wc.id,
    code: wc.code,
    amount: Number.parseFloat(wc.amount) || 0,
    discountType: wc.discount_type,
    usageCount: wc.usage_count,
  };
}

type WcCouponLookup = WcCoupon & {
  date_expires: string | null;
  usage_limit: number | null;
  individual_use: boolean;
};

export async function getCouponByCode(
  code: string,
): Promise<CouponDetails | null> {
  const trimmed = code.trim();
  if (!trimmed) return null;

  const results = await wcFetch<WcCouponLookup[]>(
    `coupons?code=${encodeURIComponent(trimmed)}`,
  );
  const wc = results[0];
  if (!wc?.id) return null;

  if (wc.date_expires && new Date(wc.date_expires) < new Date()) return null;
  if (wc.usage_limit && wc.usage_count >= wc.usage_limit) return null;

  return {
    id: wc.id,
    code: wc.code,
    amount: Number.parseFloat(wc.amount) || 0,
    discountType: wc.discount_type,
    usageCount: wc.usage_count,
  };
}

export type OrderAddress = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
};

export type CreateOrderInput = {
  lineItems: {
    productId: number;
    quantity: number;
    variationId?: number;
    metaData?: { key: string; value: string }[];
    /** Explicit price override (e.g. "0.00" for a free gift) — bypasses
     * WooCommerce's default of pricing the line at the product's own listed
     * price, which matters because a percent coupon computes its discount
     * off each line's real price, not off any fee-line offset. */
    subtotal?: string;
    total?: string;
  }[];
  feeLines?: { name: string; amount: number }[];
  couponCode?: string;
  billing: OrderAddress;
  shipping?: OrderAddress;
  shippingTotal?: number;
  shippingMethodTitle?: string;
  isPickup?: boolean;
  customerId?: number;
  customerNote?: string;
  metaData?: { key: string; value: string }[];
};

type WcCreatedOrder = {
  id: number;
  order_key: string;
  status: string;
  total: string;
  currency: string;
};

function mapAddress(addr: OrderAddress) {
  return {
    first_name: addr.firstName,
    last_name: addr.lastName,
    address_1: addr.address1,
    city: addr.city,
    state: addr.state,
    postcode: addr.postcode,
    country: addr.country,
    ...(addr.email ? { email: addr.email } : {}),
    ...(addr.phone ? { phone: addr.phone } : {}),
  };
}

export async function createOrder(input: CreateOrderInput): Promise<{
  id: number;
  orderKey: string;
  total: number;
  currency: string;
}> {
  const payload: Record<string, unknown> = {
    payment_method: "ruined_square_hosted",
    payment_method_title: "Credit / Debit Card",
    set_paid: false,
    status: "pending",
    billing: mapAddress(input.billing),
    shipping: mapAddress(input.shipping ?? input.billing),
    line_items: input.lineItems.map((li) => ({
      product_id: li.productId,
      quantity: li.quantity,
      ...(li.variationId ? { variation_id: li.variationId } : {}),
      ...(li.metaData && li.metaData.length > 0 ? { meta_data: li.metaData } : {}),
      ...(li.subtotal !== undefined ? { subtotal: li.subtotal } : {}),
      ...(li.total !== undefined ? { total: li.total } : {}),
    })),
  };

  if (input.feeLines && input.feeLines.length > 0) {
    payload.fee_lines = input.feeLines.map((f) => ({
      name: f.name,
      total: f.amount.toFixed(2),
    }));
  }

  if (input.couponCode) {
    payload.coupon_lines = [{ code: input.couponCode }];
  }

  if (input.metaData && input.metaData.length > 0) {
    payload.meta_data = input.metaData;
  }

  if (input.isPickup) {
    payload.shipping_lines = [
      {
        method_id: PICKUP_METHOD_ID,
        method_title: input.shippingMethodTitle ?? "Local Pickup",
        total: "0.00",
      },
    ];
  } else if (input.shippingTotal && input.shippingTotal > 0) {
    payload.shipping_lines = [
      {
        method_id: "flat_rate",
        method_title: input.shippingMethodTitle ?? "Standard Shipping",
        total: input.shippingTotal.toFixed(2),
      },
    ];
  }

  if (input.customerId) payload.customer_id = input.customerId;
  if (input.customerNote) payload.customer_note = input.customerNote;

  const wc = await wcMutate<WcCreatedOrder>("orders", "POST", payload);
  return {
    id: wc.id,
    orderKey: wc.order_key,
    total: Number.parseFloat(wc.total) || 0,
    currency: wc.currency,
  };
}

export async function getOrder(
  id: number,
): Promise<(Order & { orderKey: string; currency: string }) | null> {
  try {
    const wc = await wcFetch<
      WcOrder & { order_key: string; currency: string }
    >(`orders/${id}`);
    if (!wc?.id) return null;
    return {
      id: wc.id,
      number: wc.number,
      date: wc.date_created,
      status: wc.status,
      total: Number.parseFloat(wc.total) || 0,
      lineItems: wc.line_items.map((li) => ({
        name: li.name,
        quantity: li.quantity,
        total: Number.parseFloat(li.total) || 0,
      })),
      isPickup: wc.shipping_lines?.some((l) => l.method_id === PICKUP_METHOD_ID) ?? false,
      orderKey: wc.order_key,
      currency: wc.currency,
    };
  } catch {
    return null;
  }
}

export async function getCustomerOrders(customerId: number): Promise<Order[]> {
  const wcOrders = await wcFetch<WcOrder[]>(
    `orders?customer=${customerId}&per_page=50&orderby=date&order=desc`,
  );

  return wcOrders.map((o) => ({
    id: o.id,
    number: o.number,
    date: o.date_created,
    status: o.status,
    total: Number.parseFloat(o.total) || 0,
    lineItems: o.line_items.map((li) => ({
      name: li.name,
      quantity: li.quantity,
      total: Number.parseFloat(li.total) || 0,
    })),
    isPickup: o.shipping_lines?.some((l) => l.method_id === PICKUP_METHOD_ID) ?? false,
  }));
}
