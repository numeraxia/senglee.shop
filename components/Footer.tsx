import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { StoreLogo } from "@/components/StoreLogo";

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

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <StoreLogo
            storeName={settings.store_name}
            brandTag={settings.brand_tag}
            logoUrl={settings.logo_url}
            variant="footer"
          />
        </div>

        {(settings.company_name ||
          settings.company_registration_number ||
          settings.company_address ||
          settings.business_hours) && (
          <div className="footer-company">
            {settings.company_name && <p className="footer-company-name">{settings.company_name}</p>}
            {settings.company_registration_number && (
              <p className="footer-company-reg">Reg. No: {settings.company_registration_number}</p>
            )}
            {settings.company_address && (
              <p className="footer-company-address">
                <MultilineText text={settings.company_address} />
              </p>
            )}
            {settings.business_hours && (
              <div className="footer-company-hours">
                <strong>Operating hours</strong>
                <p>
                  <MultilineText text={settings.business_hours} />
                </p>
              </div>
            )}
          </div>
        )}

        <div className="footer-info">
          {settings.contact_phone && <p>📞 {settings.contact_phone}</p>}
          {settings.contact_email && <p>✉️ {settings.contact_email}</p>}
        </div>

        {settings.footer_note && <p className="footer-note">{settings.footer_note}</p>}

        {(settings.terms_url || settings.privacy_url) && (
          <div className="footer-links">
            {settings.terms_url && (
              <Link href={settings.terms_url} target="_blank" rel="noopener noreferrer">
                Terms of service
              </Link>
            )}
            {settings.privacy_url && (
              <Link href={settings.privacy_url} target="_blank" rel="noopener noreferrer">
                Privacy policy
              </Link>
            )}
          </div>
        )}

        {settings.company_name && (
          <p className="footer-copy">© {settings.company_name}. All rights reserved.</p>
        )}
      </div>
    </footer>
  );
}
