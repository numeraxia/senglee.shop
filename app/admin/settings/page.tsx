import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";
import { getSiteSettings } from "@/lib/site-settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const settings = await getSiteSettings();

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Site Settings</h1>
        <p>Update the information shown on your storefront homepage and header.</p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
