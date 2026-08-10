import Link from "next/link";
import { HeroSearch } from "@/components/CartDrawer";
import { CategoriesGrid } from "@/components/PromoCarousel";
import { PromoCarousel } from "@/components/PromoCarousel";
import { ProductCard } from "@/components/ProductCard";
import { FAQSection } from "@/components/FAQSection";
import { getCategories, getProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";

export default async function HomePage() {
  const [categories, promoProducts, newProducts, settings] = await Promise.all([
    getCategories(),
    getProducts({ promo: true }),
    getProducts({ isNew: true }),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>{settings.hero_title}</h1>
          <p>{settings.hero_subtitle}</p>
          <HeroSearch />
        </div>
        <div className="hero-visual">
          <div className="hero-cards">
            <div className="hero-card">Free Delivery</div>
            <div className="hero-card">RM{settings.min_order_amount} Min</div>
            <div className="hero-card">Next Day</div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <h2>Categories</h2>
        <CategoriesGrid categories={categories} />
      </section>

      <section className="promo-section">
        <div className="section-header">
          <h2>
            Promotion <Link href="/products?category=promotion" className="badge">See all</Link>
          </h2>
        </div>
        <PromoCarousel products={promoProducts} />
      </section>

      <section className="new-section">
        <div className="section-header">
          <h2>New in Bulksales</h2>
          <span className="new-badge">NEW</span>
        </div>
        <div className="products-grid">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="how-section">
        <h2>How it works</h2>
        <p className="how-intro">
          Open to all customers in Central, Southern, Northern Region and East Coast — orders from
          RM{settings.min_order_amount} to checkout.
        </p>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <h3>Browse and shop</h3>
            <p>Add your desired products to your cart and see your basket threshold increase!</p>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <h3>Pick a location</h3>
            <p>Select your location for stock availability and closest outlets for self-pickup.</p>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <h3>Check out</h3>
            <p>Based on your eligibility, you&apos;ll get either self-pickup or free delivery.</p>
          </div>
          <div className="step-card">
            <div className="step-num">4</div>
            <h3>Sit back and wait</h3>
            <p>Once ready, receive or pick up your order by showing your order ID!</p>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <h2>Benefits</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">💰</div>
            <h3>Top products at low prices</h3>
            <p>
              We offer our hottest products across groceries, snacks and household items at bulk
              prices.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🎁</div>
            <h3>Continuous special offers</h3>
            <p>We provide special offers on seasonal and daily goods throughout the year.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⭐</div>
            <h3>Earn rewards</h3>
            <p>Earn 8x points with every RM1 spent when you check out with our partner cards!</p>
          </div>
        </div>
      </section>

      <FAQSection />
    </>
  );
}
