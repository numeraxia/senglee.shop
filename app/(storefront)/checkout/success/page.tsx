import Link from "next/link";

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderId = params.order ?? "pending";

  return (
    <div className="page-container">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>✓</div>
        <h1>Order Placed!</h1>
        <p>Thank you for your bulk order. Your order ID is:</p>
        <p style={{ fontWeight: 700, fontSize: "1.1rem", margin: "16px 0" }}>{orderId}</p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Invoice will be available when the order is completed.
        </p>
        <Link href="/products" className="add-cart-btn" style={{ display: "inline-block", marginTop: 24, textDecoration: "none" }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
