import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminDashboardPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const settings = await getSiteSettings();
  const admin = createAdminClient();

  let productCount = 0;
  let orderCount = 0;

  if (admin) {
    const [{ count: products }, { count: orders }] = await Promise.all([
      admin.from("products").select("*", { count: "exact", head: true }),
      admin.from("orders").select("*", { count: "exact", head: true }),
    ]);
    productCount = products ?? 0;
    orderCount = orders ?? 0;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user.email}</p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span>Products</span>
          <strong>{productCount}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Orders</span>
          <strong>{orderCount}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Min order</span>
          <strong>RM {settings.min_order_amount.toFixed(2)}</strong>
        </div>
      </div>

      <div className="admin-card-grid">
        <Link href="/admin/settings" className="admin-action-card">
          <h2>Site Settings</h2>
          <p>Edit store name, logo, company details, contact info, and footer.</p>
        </Link>
        <Link href="/admin/products" className="admin-action-card">
          <h2>Bulk Product Upload</h2>
          <p>Import or update products from an Excel (.xlsx) file.</p>
        </Link>
      </div>
    </div>
  );
}
