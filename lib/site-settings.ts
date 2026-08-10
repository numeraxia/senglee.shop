import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  store_name: "BulkMart",
  brand_tag: "Wholesale",
  logo_url: null,
  tagline: "Wholesale Retail | Order Bulk, Save More",
  hero_title: "Get great value by ordering bulk in cartons!",
  hero_subtitle:
    "Order bulk today, with next-working day delivery. Minimum order RM500 to checkout — your favourite products are now nearer and cheaper!",
  top_bar_message: "Free delivery on orders over RM500 • Next-day delivery across Malaysia",
  contact_email: null,
  contact_phone: null,
  business_hours: null,
  company_name: null,
  footer_note: null,
  terms_url: null,
  privacy_url: null,
  min_order_amount: Number(process.env.MIN_ORDER_AMOUNT ?? 500),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  noStore();
  const supabase = await createClient();
  if (!supabase) return DEFAULT_SITE_SETTINGS;

  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (error || !data) return DEFAULT_SITE_SETTINGS;

  return {
    store_name: data.store_name,
    brand_tag: data.brand_tag ?? "Wholesale",
    logo_url: data.logo_url,
    tagline: data.tagline,
    hero_title: data.hero_title,
    hero_subtitle: data.hero_subtitle,
    top_bar_message: data.top_bar_message,
    contact_email: data.contact_email,
    contact_phone: data.contact_phone,
    business_hours: data.business_hours,
    company_name: data.company_name,
    footer_note: data.footer_note,
    terms_url: data.terms_url,
    privacy_url: data.privacy_url,
    min_order_amount: Number(data.min_order_amount),
  };
}
