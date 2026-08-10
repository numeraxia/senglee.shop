import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailActions } from "@/components/ProductDetailActions";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/data";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="page-container">
      <Link href="/products" className="badge" style={{ display: "inline-block", marginBottom: 24 }}>
        ← Back to products
      </Link>
      <div className="product-detail">
        <div className="product-detail-img">{product.image_label}</div>
        <div className="product-detail-info">
          {product.is_promo && <span className="product-badge">PROMO</span>}
          {product.is_new && !product.is_promo && <span className="product-badge new">NEW</span>}
          <h1>{product.name}</h1>
          <p className="product-price">{formatPrice(product.price)}</p>
          <p>{product.description}</p>
          <ProductDetailActions product={product} />
        </div>
      </div>
    </div>
  );
}
