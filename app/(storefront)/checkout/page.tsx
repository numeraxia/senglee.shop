"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { MIN_ORDER, formatPrice } from "@/lib/data";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, meetsMinimum, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (cart.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Add products to reach the RM500 minimum before checkout.</p>
          <Link href="/products" className="badge" style={{ display: "inline-block", marginTop: 16 }}>
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!meetsMinimum) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          total,
          delivery_address: address,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Checkout failed. Please try again.");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      clearCart();
      router.push(`/checkout/success?order=${data.orderId ?? "pending"}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", marginBottom: 32 }}>
        Checkout
      </h1>
      <div className="checkout-grid">
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <label>
            Delivery Address
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full delivery address in Malaysia"
            />
          </label>
          <label>
            Phone Number
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 012-3456789"
            />
          </label>
          {!meetsMinimum && (
            <div className="auth-error">
              Minimum order is {formatPrice(MIN_ORDER)}. Add RM {(MIN_ORDER - total).toFixed(2)} more.
            </div>
          )}
          <button type="submit" disabled={!meetsMinimum || loading}>
            {loading ? "Processing..." : "Pay with Stripe"}
          </button>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Payment processing requires Stripe keys in .env.local. Without them, a demo order will be
            created.
          </p>
        </form>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="checkout-line">
              <span>
                {item.name} × {item.qty}
              </span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="checkout-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
