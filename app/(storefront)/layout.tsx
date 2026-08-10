import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { ThresholdBar } from "@/components/ThresholdBar";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/FAQSection";
import { TopBar } from "@/components/TopBar";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <TopBar />
      <Header />
      <ThresholdBar />
      {children}
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
