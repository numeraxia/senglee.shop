import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  store_name: "BulkMart",
  tagline: "Wholesale Retail | Order Bulk, Save More",
  hero_title: "Get great value by ordering bulk in cartons!",
  hero_subtitle:
    "Order bulk today, with next-working day delivery. Minimum order RM500 to checkout — your favourite products are now nearer and cheaper!",
  top_bar_message: "Free delivery on orders over RM500 • Next-day delivery across Malaysia",
  contact_email: null,
  contact_phone: null,
  min_order_amount: Number(process.env.MIN_ORDER_AMOUNT ?? 500),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  if (!supabase) return DEFAULT_SITE_SETTINGS;

  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (error || !data) return DEFAULT_SITE_SETTINGS;

  return {
    store_name: data.store_name,
    tagline: data.tagline,
    hero_title: data.hero_title,
    hero_subtitle: data.hero_subtitle,
    top_bar_message: data.top_bar_message,
    contact_email: data.contact_email,
    contact_phone: data.contact_phone,
    min_order_amount: Number(data.min_order_amount),
  };
}
