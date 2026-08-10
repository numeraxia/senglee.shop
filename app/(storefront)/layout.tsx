import type { Metadata } from "next";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { ThresholdBar } from "@/components/ThresholdBar";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { TopBar } from "@/components/TopBar";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettingsProvider } from "@/lib/site-settings-context";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `${settings.store_name} - ${settings.tagline}`,
    description: settings.hero_subtitle,
  };
}

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <SiteSettingsProvider settings={settings}>
      <CartProvider minOrderAmount={settings.min_order_amount}>
        <TopBar />
        <Header />
        <ThresholdBar />
        {children}
        <Footer />
        <CartDrawer />
      </CartProvider>
    </SiteSettingsProvider>
  );
}
