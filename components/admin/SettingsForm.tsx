"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/types";
import { StorePreview } from "@/components/admin/StorePreview";

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to save settings");
      return;
    }

    setSettings(data);
    setMessage("Settings saved. Your storefront has been updated.");
    router.refresh();
  };

  const update = (field: keyof SiteSettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (file: File | null) => {
    if (!file) return;

    setUploadingLogo(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/logo/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploadingLogo(false);

    if (!res.ok) {
      setError(data.error ?? "Logo upload failed");
      return;
    }

    setSettings((prev) => ({ ...prev, logo_url: data.logo_url }));
    setMessage("Logo uploaded and saved.");
    router.refresh();
  };

  return (
    <div className="admin-settings-grid">
      <form className="admin-form auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <h2 className="admin-form-section">Branding</h2>

        <label>
          Store name
          <input
            type="text"
            required
            value={settings.store_name}
            onChange={(e) => update("store_name", e.target.value)}
          />
        </label>

        <label>
          Brand tag (shown when no logo)
          <input
            type="text"
            required
            value={settings.brand_tag}
            onChange={(e) => update("brand_tag", e.target.value)}
          />
        </label>

        <label>
          Logo image
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => handleLogoUpload(e.target.files?.[0] ?? null)}
            disabled={uploadingLogo}
          />
        </label>

        <label>
          Logo URL (optional — paste external image link)
          <input
            type="url"
            placeholder="https://..."
            value={settings.logo_url ?? ""}
            onChange={(e) => update("logo_url", e.target.value)}
          />
        </label>

        {settings.logo_url && (
          <button
            type="button"
            className="admin-clear-logo"
            onClick={() => update("logo_url", "")}
          >
            Remove logo (use text branding)
          </button>
        )}

        <label>
          Tagline / meta description
          <input
            type="text"
            required
            value={settings.tagline}
            onChange={(e) => update("tagline", e.target.value)}
          />
        </label>

        <h2 className="admin-form-section">Homepage</h2>

        <label>
          Top bar message
          <input
            type="text"
            required
            value={settings.top_bar_message}
            onChange={(e) => update("top_bar_message", e.target.value)}
          />
        </label>

        <label>
          Hero title
          <input
            type="text"
            required
            value={settings.hero_title}
            onChange={(e) => update("hero_title", e.target.value)}
          />
        </label>

        <label>
          Hero subtitle
          <textarea
            required
            rows={4}
            value={settings.hero_subtitle}
            onChange={(e) => update("hero_subtitle", e.target.value)}
          />
        </label>

        <label>
          Minimum order amount (RM)
          <input
            type="number"
            min={0}
            step={0.01}
            required
            value={settings.min_order_amount}
            onChange={(e) => update("min_order_amount", Number(e.target.value))}
          />
        </label>

        <h2 className="admin-form-section">Contact</h2>

        <label>
          Contact email
          <input
            type="email"
            value={settings.contact_email ?? ""}
            onChange={(e) => update("contact_email", e.target.value)}
          />
        </label>

        <label>
          Contact phone
          <input
            type="text"
            value={settings.contact_phone ?? ""}
            onChange={(e) => update("contact_phone", e.target.value)}
          />
        </label>

        <h2 className="admin-form-section">Company details</h2>

        <label>
          Legal company name
          <input
            type="text"
            placeholder="e.g. Seng Lee Shop Sdn Bhd"
            value={settings.company_name ?? ""}
            onChange={(e) => update("company_name", e.target.value)}
          />
        </label>

        <label>
          Company registration number
          <input
            type="text"
            placeholder="e.g. 1234567-A (SSM / ROC)"
            value={settings.company_registration_number ?? ""}
            onChange={(e) => update("company_registration_number", e.target.value)}
          />
        </label>

        <label>
          Company address
          <textarea
            rows={3}
            placeholder="Full registered business address"
            value={settings.company_address ?? ""}
            onChange={(e) => update("company_address", e.target.value)}
          />
        </label>

        <label>
          Operating hours
          <textarea
            rows={3}
            placeholder={"e.g.\nMon–Fri: 9:00 AM – 5:00 PM\nSat: 9:00 AM – 1:00 PM\nSun & public holidays: Closed"}
            value={settings.business_hours ?? ""}
            onChange={(e) => update("business_hours", e.target.value)}
          />
        </label>

        <h2 className="admin-form-section">Footer</h2>

        <label>
          Footer note
          <input
            type="text"
            value={settings.footer_note ?? ""}
            onChange={(e) => update("footer_note", e.target.value)}
          />
        </label>

        <label>
          Terms of service URL
          <input
            type="url"
            placeholder="https://..."
            value={settings.terms_url ?? ""}
            onChange={(e) => update("terms_url", e.target.value)}
          />
        </label>

        <label>
          Privacy policy URL
          <input
            type="url"
            placeholder="https://..."
            value={settings.privacy_url ?? ""}
            onChange={(e) => update("privacy_url", e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading || uploadingLogo}>
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>

      <StorePreview settings={settings} />
    </div>
  );
}
