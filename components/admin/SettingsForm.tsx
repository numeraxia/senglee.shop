"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/types";

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
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
    setMessage("Settings saved successfully.");
    router.refresh();
  };

  const update = (field: keyof SiteSettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form className="admin-form auth-form" onSubmit={handleSubmit}>
      {error && <div className="auth-error">{error}</div>}
      {message && <div className="auth-success">{message}</div>}

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
        Brand tag (header/footer badge)
        <input
          type="text"
          required
          value={settings.brand_tag}
          onChange={(e) => update("brand_tag", e.target.value)}
        />
      </label>

      <label>
        Tagline / meta description
        <input
          type="text"
          required
          value={settings.tagline}
          onChange={(e) => update("tagline", e.target.value)}
        />
      </label>

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

      <h2 className="admin-form-section">Footer</h2>

      <label>
        Business hours
        <input
          type="text"
          placeholder="e.g. 09:00 AM - 05:00 PM"
          value={settings.business_hours ?? ""}
          onChange={(e) => update("business_hours", e.target.value)}
        />
      </label>

      <label>
        Company name (copyright)
        <input
          type="text"
          placeholder="e.g. Seng Lee Shop Sdn Bhd"
          value={settings.company_name ?? ""}
          onChange={(e) => update("company_name", e.target.value)}
        />
      </label>

      <label>
        Footer note
        <input
          type="text"
          placeholder="e.g. Invoice will be available when the order is completed."
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

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
