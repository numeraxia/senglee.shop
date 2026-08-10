import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { ThresholdBar } from "@/components/ThresholdBar";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { TopBar } from "@/components/TopBar";
import { getSiteSettings } from "@/lib/site-settings";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <CartProvider>
      <TopBar />
      <Header storeName={settings.store_name} brandTag={settings.brand_tag} />
      <ThresholdBar />
      {children}
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
