"use client";

import Image from "next/image";
import type { SiteSettings } from "@/lib/types";

export function StorePreview({ settings }: { settings: SiteSettings }) {
  return (
    <div className="store-preview">
      <p className="store-preview-label">Live preview</p>
      <div className="store-preview-topbar">{settings.top_bar_message}</div>
      <div className="store-preview-header">
        {settings.logo_url ? (
          <Image
            src={settings.logo_url}
            alt={settings.store_name}
            width={120}
            height={36}
            className="logo-image"
          />
        ) : (
          <div className="store-preview-logo">
            <span className="logo-text">{settings.store_name}</span>
            <span className="logo-tag">{settings.brand_tag}</span>
          </div>
        )}
      </div>
      <div className="store-preview-hero">
        <strong>{settings.hero_title}</strong>
        <p>{settings.hero_subtitle}</p>
      </div>
      <div className="store-preview-footer">
        {settings.contact_phone && <span>📞 {settings.contact_phone}</span>}
        {settings.contact_email && <span>✉️ {settings.contact_email}</span>}
        {settings.company_name && <span>© {settings.company_name}</span>}
      </div>
    </div>
  );
}
