import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { HeroSearch } from "@/components/CartDrawer";
import { getProducts } from "@/lib/products";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = params.category;
  const search = params.search;

  const products = await getProducts({
    categorySlug: category,
    search,
    promo: category === "promotion" ? true : undefined,
  });

  const title = search
    ? `Search: ${search}`
    : category
      ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "All Products";

  return (
    <div className="page-container">
      <div className="section-header" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem" }}>{title}</h1>
      </div>
      <div style={{ marginBottom: 32, maxWidth: 420 }}>
        <HeroSearch defaultQuery={search ?? ""} />
      </div>
      {products.length === 0 ? (
        <div className="empty-state">
          <h2>No products found</h2>
          <p>Try a different search or browse all products.</p>
          <Link href="/products" className="badge" style={{ display: "inline-block", marginTop: 16 }}>
            View all products
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
