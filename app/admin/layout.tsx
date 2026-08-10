import Link from "next/link";
import { getAdminUser } from "@/lib/admin/auth";
import { getSiteSettings } from "@/lib/site-settings";
import { AdminSignOut } from "@/components/admin/AdminSignOut";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/products", label: "Products" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, settings] = await Promise.all([getAdminUser(), getSiteSettings()]);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Link href="/admin">{settings.store_name} Admin</Link>
          <span>Content management</span>
        </div>
        {user && (
          <nav className="admin-nav">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        <div className="admin-sidebar-footer">
          {user ? (
            <>
              <p className="admin-user">{user.email}</p>
              <AdminSignOut />
            </>
          ) : (
            <Link href="/admin/login">Admin login</Link>
          )}
          <Link href="/" className="admin-back-link">
            ← Back to store
          </Link>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
