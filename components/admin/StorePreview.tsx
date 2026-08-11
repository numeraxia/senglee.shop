"use client";

import { LogoImage } from "@/components/LogoImage";
import type { SiteSettings } from "@/lib/types";

function MultilineText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, index) => (
        <span key={`${line}-${index}`}>
          {index > 0 && <br />}
          {line}
        </span>
      ))}
    </>
  );
}

export function StorePreview({ settings }: { settings: SiteSettings }) {
  return (
    <div className="store-preview">
      <p className="store-preview-label">Live preview</p>
      <div className="store-preview-topbar">{settings.top_bar_message}</div>
      <div className="store-preview-header">
        {settings.logo_url ? (
          <LogoImage
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
        {settings.company_name && <strong>{settings.company_name}</strong>}
        {settings.company_registration_number && (
          <span>Reg. No: {settings.company_registration_number}</span>
        )}
        {settings.company_address && (
          <span>
            <MultilineText text={settings.company_address} />
          </span>
        )}
        {settings.business_hours && (
          <span>
            <strong>Operating hours</strong>
            <br />
            <MultilineText text={settings.business_hours} />
          </span>
        )}
        {settings.contact_phone && <span>📞 {settings.contact_phone}</span>}
        {settings.contact_email && <span>✉️ {settings.contact_email}</span>}
        {settings.footer_note && <span className="store-preview-footer-note">{settings.footer_note}</span>}
        {(settings.terms_url || settings.privacy_url) && (
          <span className="store-preview-footer-links">
            {settings.terms_url && "Terms of service"}
            {settings.terms_url && settings.privacy_url && " · "}
            {settings.privacy_url && "Privacy policy"}
          </span>
        )}
        {settings.company_name && <span>© {settings.company_name}</span>}
      </div>
    </div>
  );
}
