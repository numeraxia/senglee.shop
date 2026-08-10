export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_label: string;
  category_id: string | null;
  is_promo: boolean;
  is_new: boolean;
  stock: number;
  created_at?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  slug?: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  status: "pending" | "paid" | "processing" | "shipped" | "completed" | "cancelled";
  total: number;
  items: CartItem[];
  delivery_address: string | null;
  created_at: string;
}

export interface SiteSettings {
  store_name: string;
  brand_tag: string;
  logo_url: string | null;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  top_bar_message: string;
  contact_email: string | null;
  contact_phone: string | null;
  business_hours: string | null;
  company_name: string | null;
  footer_note: string | null;
  terms_url: string | null;
  privacy_url: string | null;
  min_order_amount: number;
}
