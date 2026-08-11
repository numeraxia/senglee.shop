-- Company legal details for footer and admin settings

alter table public.site_settings
  add column if not exists company_address text,
  add column if not exists company_registration_number text;
