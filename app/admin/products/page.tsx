import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProductUpload } from "@/components/admin/ProductUpload";

export default async function AdminProductsPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const admin = createAdminClient();
  let productCount = 0;

  if (admin) {
    const { count } = await admin.from("products").select("*", { count: "exact", head: true });
    productCount = count ?? 0;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Products</h1>
        <p>Upload an Excel file to bulk import or update products. Current catalog: {productCount} items.</p>
      </div>
      <ProductUpload />
    </div>
  );
}
