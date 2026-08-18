import "server-only";
import type { Order, Product } from "./types";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

type WcImage = { src: string };
type WcCategory = { id: number; name: string };

type WcProduct = {
  id: number;
  name: string;
  slug: string;
  type: string;
  status: string;
  price: string;
  regular_price: string;
  on_sale: boolean;
  stock_status: "instock" | "outofstock" | "onbackorder";
  description: string;
  short_description: string;
  images: WcImage[];
  categories: WcCategory[];
};

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

async function wcFetch<T>(path: string, revalidate = 300): Promise<T> {
  if (!WOOCOMMERCE_URL) {
    throw new Error("Missing WOOCOMMERCE_URL env var");
  }
  const res = await fetch(`${WOOCOMMERCE_URL}/wp-json/wc/v3/${path}`, {
    headers: { Authorization: authHeader() },
    next: { revalidate },
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
  const res = await fetch(`${WOOCOMMERCE_URL}/wp-json/wc/v3/${path}`, {
    method,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WooCommerce API error ${res.status}: ${path} ${text}`);
  }
  return res.json() as Promise<T>;
}

const SIZE_PATTERN = /\b\d+(?:\.\d+)?\s?(?:MG|ML|IU)\b/i;

function mapWcProduct(wc: WcProduct): Product {
  const sizeMatch = wc.name.match(SIZE_PATTERN);
  const regularPrice = Number.parseFloat(wc.regular_price || wc.price) || 0;
  const price = Number.parseFloat(wc.price) || regularPrice;

  return {
    id: wc.id,
    slug: wc.slug,
    name: wc.name,
    category: wc.categories[0]?.name ?? "Uncategorized",
    categories: wc.categories.map((c) => c.name),
    type: wc.type,
    price,
    regularPrice,
    onSale: wc.on_sale && price < regularPrice,
    size: sizeMatch ? sizeMatch[0].toUpperCase() : null,
    image: wc.images[0]?.src ?? null,
    description: wc.description,
    shortDescription: wc.short_description,
    inStock: wc.stock_status === "instock",
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const wcProducts = await wcFetch<WcProduct[]>(
    "products?per_page=100&status=publish",
  );
  return wcProducts.map(mapWcProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const wcProducts = await wcFetch<WcProduct[]>(
    `products?slug=${encodeURIComponent(slug)}&status=publish`,
  );
  const wc = wcProducts[0];
  return wc ? mapWcProduct(wc) : null;
}

type WcOrder = {
  id: number;
  number: string;
  date_created: string;
  status: string;
  total: string;
  line_items: { name: string; quantity: number; total: string }[];
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
  const wc = await wcFetch<WcCoupon>(`coupons/${couponId}`, 0);
  if (!wc?.id) return null;

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
  lineItems: { productId: number; quantity: number }[];
  feeLines?: { name: string; amount: number }[];
  billing: OrderAddress;
  shipping?: OrderAddress;
  shippingTotal?: number;
  customerId?: number;
  customerNote?: string;
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
    })),
  };

  if (input.feeLines && input.feeLines.length > 0) {
    payload.fee_lines = input.feeLines.map((f) => ({
      name: f.name,
      total: f.amount.toFixed(2),
    }));
  }

  if (input.shippingTotal && input.shippingTotal > 0) {
    payload.shipping_lines = [
      {
        method_id: "flat_rate",
        method_title: "Standard Shipping",
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
    >(`orders/${id}`, 0);
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
    0,
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
  }));
}
