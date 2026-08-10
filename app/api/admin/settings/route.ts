import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/site-settings";
import type { SiteSettings } from "@/lib/types";

function mapSettings(data: Record<string, unknown>): SiteSettings {
  return {
    store_name: String(data.store_name),
    brand_tag: String(data.brand_tag ?? "Wholesale"),
    logo_url: (data.logo_url as string | null) ?? null,
    tagline: String(data.tagline),
    hero_title: String(data.hero_title),
    hero_subtitle: String(data.hero_subtitle),
    top_bar_message: String(data.top_bar_message),
    contact_email: (data.contact_email as string | null) ?? null,
    contact_phone: (data.contact_phone as string | null) ?? null,
    business_hours: (data.business_hours as string | null) ?? null,
    company_name: (data.company_name as string | null) ?? null,
    footer_note: (data.footer_note as string | null) ?? null,
    terms_url: (data.terms_url as string | null) ?? null,
    privacy_url: (data.privacy_url as string | null) ?? null,
    min_order_amount: Number(data.min_order_amount),
  };
}

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body: Partial<SiteSettings> = await request.json();

  const payload = {
    store_name: body.store_name?.trim(),
    brand_tag: body.brand_tag?.trim(),
    logo_url: body.logo_url?.trim() || null,
    tagline: body.tagline?.trim(),
    hero_title: body.hero_title?.trim(),
    hero_subtitle: body.hero_subtitle?.trim(),
    top_bar_message: body.top_bar_message?.trim(),
    contact_email: body.contact_email?.trim() || null,
    contact_phone: body.contact_phone?.trim() || null,
    business_hours: body.business_hours?.trim() || null,
    company_name: body.company_name?.trim() || null,
    footer_note: body.footer_note?.trim() || null,
    terms_url: body.terms_url?.trim() || null,
    privacy_url: body.privacy_url?.trim() || null,
    min_order_amount: Number(body.min_order_amount),
    updated_at: new Date().toISOString(),
  };

  if (
    !payload.store_name ||
    !payload.brand_tag ||
    !payload.tagline ||
    !payload.hero_title ||
    !payload.hero_subtitle ||
    !payload.top_bar_message ||
    Number.isNaN(payload.min_order_amount) ||
    payload.min_order_amount < 0
  ) {
    return NextResponse.json({ error: "Invalid settings data" }, { status: 400 });
  }

  const { data, error } = await admin
    .from("site_settings")
    .update(payload)
    .eq("id", 1)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");

  return NextResponse.json(mapSettings(data));
}
