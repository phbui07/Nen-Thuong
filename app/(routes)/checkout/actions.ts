"use server";

import { getCurrentUser, isAdmin } from "@/lib/auth";
import { MAX_QUANTITY } from "@/lib/constants";
import { ProductUnavailableError, createOrder, getOrder, setStripeSession } from "@/lib/db/orders";
import { getStoreSettings } from "@/lib/db/settings";
import { availablePaymentMethods, getStripe, isStripeConfigured } from "@/lib/payments";
import type { Orders, PaymentMethod } from "@/types-db";
import { headers } from "next/headers";

export interface PlaceOrderInput {
  name: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: PaymentMethod;
  items: { productId: string; qty: number }[];
}

// `error` is a key in the checkout.errors dictionary
export type CheckoutResult = { ok: true; redirectUrl: string } | { ok: false; error: string };

const MAX_LINES = 50;

export async function placeOrder(input: PlaceOrderInput): Promise<CheckoutResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "auth" };

  const name = String(input.name ?? "").trim();
  const phone = String(input.phone ?? "").replace(/[\s.()-]/g, "");
  const address = String(input.address ?? "").trim();
  const note = String(input.note ?? "").trim().slice(0, 500);
  if (name.length < 2 || name.length > 100) return { ok: false, error: "name" };
  if (!/^\+?\d{9,15}$/.test(phone)) return { ok: false, error: "phone" };
  if (address.length < 5 || address.length > 300) return { ok: false, error: "address" };

  // Merge repeated products and keep quantities in range
  const quantities = new Map<string, number>();
  for (const item of Array.isArray(input.items) ? input.items : []) {
    const qty = Math.floor(Number(item?.qty));
    if (typeof item?.productId !== "string" || !Number.isFinite(qty) || qty < 1) continue;
    quantities.set(item.productId, Math.min(MAX_QUANTITY, (quantities.get(item.productId) ?? 0) + qty));
  }
  if (quantities.size === 0) return { ok: false, error: "empty" };
  if (quantities.size > MAX_LINES) return { ok: false, error: "failed" };

  try {
    const methods = availablePaymentMethods(await getStoreSettings());
    if (!methods.includes(input.paymentMethod)) return { ok: false, error: "method" };

    const order = await createOrder({
      userId: user.id,
      customerName: name,
      phone,
      email: user.email,
      address,
      note,
      paymentMethod: input.paymentMethod,
      items: [...quantities].map(([productId, qty]) => ({ productId, qty })),
    });

    if (order.paymentMethod === "stripe") {
      return { ok: true, redirectUrl: await startCardPayment(order) };
    }
    return { ok: true, redirectUrl: `/orders/${order.id}?placed=1` };
  } catch (error) {
    if (error instanceof ProductUnavailableError) return { ok: false, error: "unavailable" };
    console.error("Could not place order:", error);
    return { ok: false, error: "failed" };
  }
}

// Lets a customer retry an unfinished card payment from the order page
export async function payOrderByCard(orderId: string): Promise<CheckoutResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "auth" };
  try {
    const order = await getOrder(orderId);
    if (!order || (order.userId !== user.id && !(await isAdmin()))) return { ok: false, error: "failed" };
    if (order.isPaid || order.paymentMethod !== "stripe" || !isStripeConfigured()) {
      return { ok: false, error: "method" };
    }
    return { ok: true, redirectUrl: await startCardPayment(order) };
  } catch (error) {
    console.error("Could not start card payment:", error);
    return { ok: false, error: "failed" };
  }
}

async function siteOrigin() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

async function startCardPayment(order: Orders): Promise<string> {
  const origin = await siteOrigin();
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    // VND has no minor unit in Stripe, so amounts are whole đồng (no ×100)
    line_items: order.items.map((item) => ({
      quantity: item.qty,
      price_data: { currency: "vnd", unit_amount: item.price, product_data: { name: item.name } },
    })),
    customer_email: order.email || undefined,
    client_reference_id: order.id,
    metadata: { orderId: order.id, code: order.code },
    success_url: `${origin}/orders/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/orders/${order.id}?cancelled=1`,
  });
  await setStripeSession(order.id, session.id);
  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return session.url;
}
