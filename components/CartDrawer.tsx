"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useSiteSettings } from "@/lib/site-settings-context";
import { formatPrice } from "@/lib/data";

export function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isOpen,
    closeCart,
    removeFromCart,
    updateQty,
    total,
    meetsMinimum,
  } = useCart();
  const { min_order_amount: minOrder } = useSiteSettings();

  const handleCheckout = () => {
    if (!meetsMinimum) return;
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-drawer-header">
          <h3>Cart</h3>
          <button className="cart-close" type="button" onClick={closeCart} aria-label="Close cart">
            ×
          </button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <p style={{ color: "var(--text-muted)", padding: "24px" }}>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div>
                  {item.slug ? (
                    <Link href={`/products/${item.slug}`} className="cart-item-name" onClick={closeCart}>
                      {item.name}
                    </Link>
                  ) : (
                    <span className="cart-item-name">{item.name}</span>
                  )}
                  <div className="cart-qty-controls">
                    <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease">
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase">
                      +
                    </button>
                    <button type="button" className="cart-remove" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
                <span className="cart-item-price">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="cart-minimum">Minimum order: {formatPrice(minOrder)}</p>
          <button
            type="button"
            className={`checkout-btn ${meetsMinimum ? "active" : ""}`}
            disabled={!meetsMinimum}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
      <div
        className={`cart-overlay ${isOpen ? "visible" : ""}`}
        onClick={closeCart}
        onKeyDown={(e) => e.key === "Escape" && closeCart()}
        role="presentation"
      />
    </>
  );
}

interface HeroSearchProps {
  defaultQuery?: string;
}

export function HeroSearch({ defaultQuery = "" }: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/products?search=${encodeURIComponent(q)}`);
    else router.push("/products");
  };

  return (
    <form className="hero-search" onSubmit={handleSearch}>
      <input
        type="search"
        placeholder="Search products..."
        aria-label="Search products"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
