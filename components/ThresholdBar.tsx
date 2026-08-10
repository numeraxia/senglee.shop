"use client";

import { useCart } from "@/lib/cart-context";
import { MIN_ORDER, formatPrice } from "@/lib/data";

export function ThresholdBar() {
  const { deliveryPercent } = useCart();

  return (
    <div className="threshold-bar">
      <div className="threshold-content">
        <span className="threshold-label">Free Delivery</span>
        <div className="threshold-track">
          <div className="threshold-fill" style={{ width: `${deliveryPercent}%` }} />
        </div>
        <span className="threshold-value">{deliveryPercent}%</span>
      </div>
      <div className="threshold-content">
        <span className="threshold-label">Self-pickup</span>
        <span className="threshold-value">{deliveryPercent}%</span>
      </div>
    </div>
  );
}

export { MIN_ORDER, formatPrice };
