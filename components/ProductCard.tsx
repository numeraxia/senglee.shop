"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
  variant?: "carousel" | "grid";
}

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
    });
  };

  return (
    <div className={`product-card ${variant === "grid" ? "product-card-grid" : ""}`}>
      {product.is_promo && <span className="product-badge">PROMO</span>}
      {product.is_new && !product.is_promo && <span className="product-badge new">NEW</span>}
      <Link href={`/products/${product.slug}`}>
        <div className="product-img">{product.image_label}</div>
        <h3>{product.name}</h3>
      </Link>
      <p className="product-price">{formatPrice(product.price)}</p>
      <button type="button" className="add-cart-btn" onClick={handleAdd}>
        Add to Cart
      </button>
    </div>
  );
}
