"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface PromoCarouselProps {
  products: Product[];
}

export function PromoCarousel({ products }: PromoCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "prev" | "next") => {
    carouselRef.current?.scrollBy({ left: dir === "prev" ? -260 : 260, behavior: "smooth" });
  };

  return (
    <div className="promo-carousel-wrap">
      <button type="button" className="carousel-btn prev" aria-label="Previous" onClick={() => scroll("prev")}>
        ‹
      </button>
      <div className="promo-carousel" ref={carouselRef}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="carousel" />
        ))}
      </div>
      <button type="button" className="carousel-btn next" aria-label="Next" onClick={() => scroll("next")}>
        ›
      </button>
    </div>
  );
}

interface CategoriesGridProps {
  categories: { id: string; name: string; slug: string; icon: string }[];
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  return (
    <div className="categories-grid">
      {categories.map((cat) => (
        <Link key={cat.id} href={`/products?category=${cat.slug}`} className="category-card">
          <div className="cat-icon">{cat.icon}</div>
          <span>{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
