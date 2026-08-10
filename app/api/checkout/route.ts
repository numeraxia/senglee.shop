import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import type { CartItem } from "@/lib/types";

interface CheckoutBody {
  items: CartItem[];
  total: number;
  delivery_address: string;
  phone: string;
}

export async function POST(request: Request) {
  try {
    const body: CheckoutBody = await request.json();
    const { items, total, delivery_address, phone } = body;

    if (!items?.length || total < 500) {
      return NextResponse.json({ error: "Minimum order is RM500" }, { status: 400 });
    }

    const supabase = await createClient();
    let userId: string | null = null;

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    }

    const orderId = crypto.randomUUID();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    if (supabase) {
      await supabase.from("orders").insert({
        id: orderId,
        user_id: userId,
        status: "pending",
        total,
        items,
        delivery_address,
        phone,
      });
    }

    const stripe = getStripe();

    if (!stripe) {
      return NextResponse.json({
        orderId,
        message: "Demo order created (Stripe not configured)",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "myr",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      })),
      metadata: { order_id: orderId },
      success_url: `${appUrl}/checkout/success?order=${orderId}`,
      cancel_url: `${appUrl}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
