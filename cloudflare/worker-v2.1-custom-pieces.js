/**
 * Cloudflare Worker - Sister Stripe Bridge v0.2.1
 *
 * Required secrets:
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET
 *   BRIDGE_SHARED_SECRET
 *
 * Required vars:
 *   SECONDARY_SITE_ORIGIN
 *   PRIMARY_STATUS_ENDPOINT
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, service: "sister-stripe-gateway", version: "0.2.1" });
    }

    if (request.method === "POST" && url.pathname === "/stripe/checkout/create") {
      if (!constantTimeishEqual(request.headers.get("X-Bridge-Secret") || "", env.BRIDGE_SHARED_SECRET || "")) {
        return json({ ok:false, error:"Unauthorized" }, 401);
      }

      let body;
      try { body = await request.json(); }
      catch { return json({ ok:false, error:"Invalid JSON" }, 400); }

      const amount = Number(body.amount);
      const currency = String(body.currency || "").toLowerCase();
      const paymentRef = String(body.payment_ref || "");
      const successUrl = String(body.success_url || "");
      const cancelUrl = String(body.cancel_url || "");
      const orderId = String(body.primary_order_id || "");
      const orderKey = String(body.primary_order_key || "");

      if (!Number.isInteger(amount) || amount <= 0 || !/^[a-z]{3}$/.test(currency) || !paymentRef) {
        return json({ ok:false, error:"Invalid payment request" }, 400);
      }

      const secondaryOrigin = String(env.SECONDARY_SITE_ORIGIN || "").replace(/\/$/, "");
      if (!secondaryOrigin || !sameOrigin(successUrl, secondaryOrigin) || !sameOrigin(cancelUrl, secondaryOrigin)) {
        return json({ ok:false, error:"Invalid return URL" }, 400);
      }

      const rawItems = Array.isArray(body.items) ? body.items : [];
      const items = [];
      for (const rawItem of rawItems) {
        const sku = String(rawItem && rawItem.sku || "").trim().toUpperCase();
        const qty = Number(rawItem && rawItem.qty || 1);
        const lineAmount = Number(rawItem && rawItem.amount || 0);
        const match = /^CP-(\d{3,})$/.exec(sku);
        if (!match || !Number.isInteger(qty) || qty < 1 || qty > 100 || !Number.isInteger(lineAmount) || lineAmount <= 0) {
          return json({ ok:false, error:"Invalid sister catalog item" }, 400);
        }
        items.push({
          sku,
          qty,
          lineAmount,
          displayName: `Custom Piece ${Number(match[1])}`,
        });
      }

      if (items.length === 0) {
        return json({ ok:false, error:"No sister catalog items supplied" }, 400);
      }

      const weightTotal = items.reduce((sum, item) => sum + item.lineAmount, 0);
      if (weightTotal <= 0 || amount < items.length) {
        return json({ ok:false, error:"Unable to allocate checkout total" }, 400);
      }

      let allocated = 0;
      const allocations = items.map((item) => {
        const cents = Math.floor((amount * item.lineAmount) / weightTotal);
        allocated += cents;
        return cents;
      });
      let remainder = amount - allocated;
      for (let i = 0; remainder > 0; i = (i + 1) % allocations.length) {
        allocations[i] += 1;
        remainder -= 1;
      }
      if (allocations.some((value) => value <= 0)) {
        return json({ ok:false, error:"Unable to allocate checkout total" }, 400);
      }

      const form = new URLSearchParams();
      form.set("mode", "payment");
      form.set("client_reference_id", paymentRef);
      form.set("success_url", successUrl);
      form.set("cancel_url", cancelUrl);

      items.forEach((item, index) => {
        form.set(`line_items[${index}][price_data][currency]`, currency);
        form.set(`line_items[${index}][price_data][unit_amount]`, String(allocations[index]));
        form.set(`line_items[${index}][price_data][product_data][name]`, item.displayName);
        if (item.qty > 1) {
          form.set(`line_items[${index}][price_data][product_data][description]`, `Quantity ${item.qty}`);
        }
        form.set(`line_items[${index}][quantity]`, "1");
      });

      form.set("metadata[payment_ref]", paymentRef);
      form.set("metadata[primary_order_id]", orderId);
      form.set("metadata[primary_order_key]", orderKey);
      form.set("payment_intent_data[metadata][payment_ref]", paymentRef);

      const stripeResp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Idempotency-Key": `checkout-${paymentRef}`,
        },
        body: form.toString(),
      });

      const stripe = await stripeResp.json();
      if (!stripeResp.ok) {
        return json({ ok:false, error:"Stripe checkout creation failed" }, 502);
      }

      return json({ ok:true, checkout_url:stripe.url, session_id:stripe.id });
    }

    if (request.method === "POST" && url.pathname === "/stripe/webhook") {
      const raw = await request.text();
      const sigHeader = request.headers.get("Stripe-Signature") || "";

      if (!await verifyStripeSignature(raw, sigHeader, env.STRIPE_WEBHOOK_SECRET)) {
        return json({ ok:false, error:"Invalid Stripe signature" }, 400);
      }

      let event;
      try { event = JSON.parse(raw); }
      catch { return json({ ok:false, error:"Invalid webhook JSON" }, 400); }

      if (event.type === "checkout.session.completed") {
        const session = event.data && event.data.object ? event.data.object : {};
        if (session.payment_status === "paid") {
          const md = session.metadata || {};
          const endpoint = String(env.PRIMARY_STATUS_ENDPOINT || "");

          if (endpoint && md.primary_order_id && md.primary_order_key && md.payment_ref) {
            const resp = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type":"application/json" },
              body: JSON.stringify({
                bridge_secret: env.BRIDGE_SHARED_SECRET,
                order_id: md.primary_order_id,
                order_key: md.primary_order_key,
                payment_ref: md.payment_ref,
                status: "paid"
              })
            });

            if (!resp.ok) {
              return json({ ok:false, error:"Primary status sync failed" }, 502);
            }
          }
        }
      }

      return json({ received:true });
    }

    return json({ ok:false, error:"Not found" }, 404);
  }
};

function sameOrigin(candidate, origin) {
  try {
    return new URL(candidate).origin === new URL(origin).origin;
  } catch {
    return false;
  }
}

async function verifyStripeSignature(payload, header, secret) {
  if (!secret || !header) return false;

  const parts = header.split(",");
  let timestamp = null;
  const signatures = [];

  for (const part of parts) {
    const [k, v] = part.split("=", 2);
    if (k === "t") timestamp = v;
    if (k === "v1") signatures.push(v);
  }

  if (!timestamp || signatures.length === 0) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > 300) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name:"HMAC", hash:"SHA-256" },
    false,
    ["sign"]
  );

  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signedPayload)
  );

  const expected = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, "0")).join("");
  return signatures.some(sig => timingSafeHexEqual(sig, expected));
}

function timingSafeHexEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function constantTimeishEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function json(data, status=200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type":"application/json; charset=utf-8" }
  });
}
