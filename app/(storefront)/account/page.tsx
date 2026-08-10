import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountActions } from "@/components/AccountActions";

export default async function AccountPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="auth-card">
        <h1>My Account</h1>
        <p>Sign in to view orders and manage your wholesale account.</p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 16 }}>
          Authentication will be enabled once Supabase credentials are added.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/account/login" className="add-cart-btn" style={{ textAlign: "center", textDecoration: "none" }}>
            Login
          </Link>
          <Link
            href="/account/register"
            className="add-cart-btn"
            style={{
              textAlign: "center",
              textDecoration: "none",
              background: "var(--bg)",
              color: "var(--text)",
              border: "2px solid var(--border)",
            }}
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "Customer";

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem" }}>My Account</h1>
          <p style={{ color: "var(--text-muted)" }}>Welcome, {displayName}</p>
        </div>
        <AccountActions />
      </div>

      <section>
        <h2 style={{ fontFamily: "var(--font-display)", marginBottom: 16 }}>Recent Orders</h2>
        {!orders?.length ? (
          <div className="empty-state" style={{ padding: 32 }}>
            <p>No orders yet. Start shopping to place your first bulk order!</p>
            <Link href="/products" className="badge" style={{ display: "inline-block", marginTop: 12 }}>
              Browse products
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: "var(--bg-card)",
                  padding: 20,
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600 }}>Order #{order.id.slice(0, 8)}</span>
                  <span
                    style={{
                      textTransform: "capitalize",
                      color: "var(--primary)",
                      fontWeight: 600,
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: 4 }}>
                  RM {Number(order.total).toFixed(2)} •{" "}
                  {new Date(order.created_at).toLocaleDateString("en-MY")}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
