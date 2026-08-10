-- Footer and branding fields for site_settings

alter table public.site_settings
  add column if not exists brand_tag text not null default 'Wholesale',
  add column if not exists business_hours text,
  add column if not exists company_name text,
  add column if not exists footer_note text,
  add column if not exists terms_url text,
  add column if not exists privacy_url text;
