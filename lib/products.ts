import { CATEGORIES, PRODUCTS } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  if (!supabase) return CATEGORIES;

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (error || !data?.length) return CATEGORIES;
  return data as Category[];
}

export async function getProducts(options?: {
  promo?: boolean;
  isNew?: boolean;
  categorySlug?: string;
  search?: string;
}): Promise<Product[]> {
  const supabase = await createClient();
  if (!supabase) return filterMockProducts(options);

  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (options?.promo) query = query.eq("is_promo", true);
  if (options?.isNew) query = query.eq("is_new", true);
  if (options?.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.categorySlug)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (options?.search) {
    query = query.ilike("name", `%${options.search}%`);
  }

  const { data, error } = await query;
  if (error || !data?.length) return filterMockProducts(options);
  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  if (!supabase) {
    return PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (error || !data) {
    return PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  return data as Product;
}

function filterMockProducts(options?: {
  promo?: boolean;
  isNew?: boolean;
  categorySlug?: string;
  search?: string;
}): Product[] {
  let results = [...PRODUCTS];

  if (options?.promo) results = results.filter((p) => p.is_promo);
  if (options?.isNew) results = results.filter((p) => p.is_new);
  if (options?.categorySlug) {
    const cat = CATEGORIES.find((c) => c.slug === options.categorySlug);
    if (cat) {
      if (options.categorySlug === "promotion") {
        results = results.filter((p) => p.is_promo);
      } else {
        results = results.filter((p) => p.category_id === cat.id);
      }
    }
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(q));
  }

  return results;
}
