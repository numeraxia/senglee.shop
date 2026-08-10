"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_CATEGORIES } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { useSiteSettings } from "@/lib/site-settings-context";
import { StoreLogo } from "@/components/StoreLogo";

export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const settings = useSiteSettings();

  return (
    <header className="header">
      <div className="header-inner">
        <button
          className="mobile-menu-btn"
          aria-label="Toggle menu"
          onClick={() => setNavOpen(!navOpen)}
        >
          <span />
          <span />
          <span />
        </button>
        <StoreLogo
          storeName={settings.store_name}
          brandTag={settings.brand_tag}
          logoUrl={settings.logo_url}
        />
        <nav className={`nav ${navOpen ? "open" : ""}`}>
          <div className="nav-item dropdown">
            <button className="dropdown-trigger" type="button">
              <span>Categories</span>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path fill="currentColor" d="M6 8L2 4h8z" />
              </svg>
            </button>
            <div className="dropdown-menu categories-dropdown">
              <div className="dropdown-grid">
                {NAV_CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/products?category=${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, "-"))}`}
                    className="cat-link"
                  >
                    {cat}
                  </Link>
                ))}
                <Link href="/products" className="cat-link">
                  See All →
                </Link>
              </div>
            </div>
          </div>
          <Link href="/#faq" className="nav-item">
            FAQs
          </Link>
        </nav>
        <div className="header-actions">
          <button className="location-btn" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Enter your address</span>
          </button>
          <Link href="/account" className="account-link">
            My Account
          </Link>
          <Link href="/account/login" className="account-link">
            Login
          </Link>
          <Link href="/account/register" className="account-link">
            Register
          </Link>
          <button className="cart-btn" type="button" onClick={openCart} aria-label="Open cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="cart-count">{itemCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
