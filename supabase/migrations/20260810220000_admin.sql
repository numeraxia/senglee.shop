-- Admin: site settings singleton + product write policies

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  store_name text not null default 'BulkMart',
  tagline text not null default 'Wholesale Retail | Order Bulk, Save More',
  hero_title text not null default 'Get great value by ordering bulk in cartons!',
  hero_subtitle text not null default 'Order bulk today, with next-working day delivery. Minimum order RM500 to checkout — your favourite products are now nearer and cheaper!',
  top_bar_message text not null default 'Free delivery on orders over RM500 • Next-day delivery across Malaysia',
  contact_email text,
  contact_phone text,
  min_order_amount numeric(10, 2) not null default 500 check (min_order_amount >= 0),
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "Site settings are viewable by everyone"
  on public.site_settings for select
  using (true);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;
