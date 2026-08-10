"use client";

import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

interface ProductDetailActionsProps {
  product: Product;
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const { addToCart } = useCart();

  return (
    <button
      type="button"
      className="add-cart-btn"
      style={{ maxWidth: 280 }}
      onClick={() =>
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          slug: product.slug,
        })
      }
    >
      Add to Cart
    </button>
  );
}
