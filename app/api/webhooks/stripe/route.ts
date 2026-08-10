import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret || webhookSecret.startsWith("whsec_...")) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (!supabase) {
    console.error("Webhook received but Supabase admin client is not configured");
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;

      if (!orderId) {
        console.warn("checkout.session.completed without order_id metadata");
        break;
      }

      if (session.payment_status !== "paid") {
        break;
      }

      const { error } = await supabase
        .from("orders")
        .update({
          status: "paid",
          stripe_session_id: session.id,
        })
        .eq("id", orderId)
        .eq("status", "pending");

      if (error) {
        console.error("Failed to mark order as paid:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
      }

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;

      if (!orderId) break;

      await supabase
        .from("orders")
        .update({ status: "cancelled", stripe_session_id: session.id })
        .eq("id", orderId)
        .eq("status", "pending");

      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
