-- Store logo URL + public storage bucket for brand assets

alter table public.site_settings
  add column if not exists logo_url text;

insert into storage.buckets (id, name, public)
values ('store-assets', 'store-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read store assets" on storage.objects;
create policy "Public read store assets"
  on storage.objects for select
  using (bucket_id = 'store-assets');
