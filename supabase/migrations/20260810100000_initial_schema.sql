-- BulkMart wholesale schema

create extension if not exists "pgcrypto";

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text not null default '🛒',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  image_label text not null,
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  is_promo boolean not null default false,
  is_new boolean not null default false,
  stock int not null default 0 check (stock >= 0),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled')),
  total numeric(10, 2) not null check (total >= 0),
  items jsonb not null default '[]'::jsonb,
  delivery_address text,
  phone text,
  stripe_session_id text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id or user_id is null);

-- Seed categories
insert into public.categories (name, slug, icon, sort_order) values
  ('Promotion', 'promotion', '🔥', 1),
  ('Bread', 'bread', '🍞', 2),
  ('Drinks', 'drinks', '🥤', 3),
  ('Milk Powder', 'milk-powder', '🥛', 4),
  ('Laundry', 'laundry', '🧼', 5),
  ('Coffee & Tea', 'coffee-tea', '☕', 6),
  ('Groceries', 'groceries', '🛒', 7),
  ('Chocolate', 'chocolate', '🍫', 8),
  ('Cleaning', 'cleaning', '🧴', 9),
  ('Snacks', 'snacks', '🍿', 10)
on conflict (slug) do nothing;

-- Seed products (using category slugs)
insert into public.products (name, slug, description, price, image_label, category_id, is_promo, is_new, stock)
select
  v.name, v.slug, v.description, v.price, v.image_label,
  c.id, v.is_promo, v.is_new, v.stock
from (values
  ('Planta Margarine', 'planta-margarine', 'Margarine 6×2.5kg — perfect for bakeries and food service.', 170.90, 'Margarine 6×2.5kg', 'promotion', true, false, 50),
  ('Nona Ketupat Mini', 'nona-ketupat-mini', 'Ketupat Mini 18×30×20g — festive bulk pack.', 109.50, 'Ketupat Mini 18×30×20g', 'promotion', true, false, 40),
  ('Sunquick Cordial', 'sunquick-cordial', 'Cordial Orange 6×700ml — refreshing bulk drinks.', 65.90, 'Cordial Orange 6×700ml', 'drinks', true, false, 80),
  ('KCA Tissue Dapur', 'kca-tissue-dapur', 'Kitchen Tissue 8×90s — household essential.', 82.50, 'Kitchen Tissue 8×90s', 'cleaning', true, false, 100),
  ('Kickapoo', 'kickapoo', 'Energy Drink 12×1.5L — wholesale carton pricing.', 30.90, 'Energy Drink 12×1.5L', 'drinks', true, false, 120),
  ('Maggi Curry 24×85g', 'maggi-curry', 'Instant Noodles 24pk — new arrival.', 45.00, 'Instant Noodles 24pk', 'snacks', false, true, 200),
  ('Jacob''s Crackers', 'jacobs-crackers', 'Biscuits 20×150g — crispy bulk pack.', 52.80, 'Biscuits 20×150g', 'snacks', false, true, 90),
  ('Knife Cooking Oil', 'knife-cooking-oil', 'Cooking Oil 6×5L — kitchen staple.', 128.00, 'Cooking Oil 6×5L', 'groceries', false, true, 60),
  ('Kellogg''s Corn Flakes', 'kelloggs-corn-flakes', 'Cereal 12×500g — breakfast bulk.', 89.90, 'Cereal 12×500g', 'groceries', false, true, 45)
) as v(name, slug, description, price, image_label, cat_slug, is_promo, is_new, stock)
join public.categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;
