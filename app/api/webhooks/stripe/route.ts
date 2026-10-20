import { markPaidByStripeSession } from "@/lib/db/orders";
import { getStripe, isStripeConfigured } from "@/lib/payments";
import type Stripe from "stripe";

// Stripe calls this after a card payment. Point a Stripe webhook at
// https://<your-site>/api/webhooks/stripe for "checkout.session.completed".
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!isStripeConfigured() || !secret || !signature) {
    return new Response("Stripe webhook is not configured", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    // Verifies the request really came from Stripe
    event = getStripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch (error) {
    console.error("Invalid Stripe webhook signature:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    if (session.payment_status === "paid") {
      await markPaidByStripeSession(session.id);
    }
  }
  return new Response("ok");
}
