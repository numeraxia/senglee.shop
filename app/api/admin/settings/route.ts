import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/site-settings";
import type { SiteSettings } from "@/lib/types";

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
    tagline: body.tagline?.trim(),
    hero_title: body.hero_title?.trim(),
    hero_subtitle: body.hero_subtitle?.trim(),
    top_bar_message: body.top_bar_message?.trim(),
    contact_email: body.contact_email?.trim() || null,
    contact_phone: body.contact_phone?.trim() || null,
    min_order_amount: Number(body.min_order_amount),
    updated_at: new Date().toISOString(),
  };

  if (
    !payload.store_name ||
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

  return NextResponse.json({
    store_name: data.store_name,
    tagline: data.tagline,
    hero_title: data.hero_title,
    hero_subtitle: data.hero_subtitle,
    top_bar_message: data.top_bar_message,
    contact_email: data.contact_email,
    contact_phone: data.contact_phone,
    min_order_amount: Number(data.min_order_amount),
  } satisfies SiteSettings);
}
