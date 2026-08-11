import type { Category, Product } from "./types";

export const CATEGORIES: Category[] = [
  { id: "1", name: "Promotion", slug: "promotion", icon: "🔥", sort_order: 1 },
  { id: "2", name: "Bread", slug: "bread", icon: "🍞", sort_order: 2 },
  { id: "3", name: "Drinks", slug: "drinks", icon: "🥤", sort_order: 3 },
  { id: "4", name: "Milk Powder", slug: "milk-powder", icon: "🥛", sort_order: 4 },
  { id: "5", name: "Laundry", slug: "laundry", icon: "🧼", sort_order: 5 },
  { id: "6", name: "Coffee & Tea", slug: "coffee-tea", icon: "☕", sort_order: 6 },
  { id: "7", name: "Groceries", slug: "groceries", icon: "🛒", sort_order: 7 },
  { id: "8", name: "Chocolate", slug: "chocolate", icon: "🍫", sort_order: 8 },
  { id: "9", name: "Cleaning", slug: "cleaning", icon: "🧴", sort_order: 9 },
  { id: "10", name: "Snacks", slug: "snacks", icon: "🍿", sort_order: 10 },
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Planta Margarine",
    slug: "planta-margarine",
    description: "Margarine 6×2.5kg — perfect for bakeries and food service.",
    price: 170.9,
    image_label: "Margarine 6×2.5kg",
    category_id: "1",
    is_promo: true,
    is_new: false,
    stock: 50,
  },
  {
    id: "p2",
    name: "Nona Ketupat Mini",
    slug: "nona-ketupat-mini",
    description: "Ketupat Mini 18×30×20g — festive bulk pack.",
    price: 109.5,
    image_label: "Ketupat Mini 18×30×20g",
    category_id: "1",
    is_promo: true,
    is_new: false,
    stock: 40,
  },
  {
    id: "p3",
    name: "Sunquick Cordial",
    slug: "sunquick-cordial",
    description: "Cordial Orange 6×700ml — refreshing bulk drinks.",
    price: 65.9,
    image_label: "Cordial Orange 6×700ml",
    category_id: "3",
    is_promo: true,
    is_new: false,
    stock: 80,
  },
  {
    id: "p4",
    name: "KCA Tissue Dapur",
    slug: "kca-tissue-dapur",
    description: "Kitchen Tissue 8×90s — household essential.",
    price: 82.5,
    image_label: "Kitchen Tissue 8×90s",
    category_id: "9",
    is_promo: true,
    is_new: false,
    stock: 100,
  },
  {
    id: "p5",
    name: "Kickapoo",
    slug: "kickapoo",
    description: "Energy Drink 12×1.5L — wholesale carton pricing.",
    price: 30.9,
    image_label: "Energy Drink 12×1.5L",
    category_id: "3",
    is_promo: true,
    is_new: false,
    stock: 120,
  },
  {
    id: "p6",
    name: "Maggi Curry 24×85g",
    slug: "maggi-curry",
    description: "Instant Noodles 24pk — new arrival.",
    price: 45.0,
    image_label: "Instant Noodles 24pk",
    category_id: "10",
    is_promo: false,
    is_new: true,
    stock: 200,
  },
  {
    id: "p7",
    name: "Jacob's Crackers",
    slug: "jacobs-crackers",
    description: "Biscuits 20×150g — crispy bulk pack.",
    price: 52.8,
    image_label: "Biscuits 20×150g",
    category_id: "10",
    is_promo: false,
    is_new: true,
    stock: 90,
  },
  {
    id: "p8",
    name: "Knife Cooking Oil",
    slug: "knife-cooking-oil",
    description: "Cooking Oil 6×5L — kitchen staple.",
    price: 128.0,
    image_label: "Cooking Oil 6×5L",
    category_id: "7",
    is_promo: false,
    is_new: true,
    stock: 60,
  },
  {
    id: "p9",
    name: "Kellogg's Corn Flakes",
    slug: "kelloggs-corn-flakes",
    description: "Cereal 12×500g — breakfast bulk.",
    price: 89.9,
    image_label: "Cereal 12×500g",
    category_id: "7",
    is_promo: false,
    is_new: true,
    stock: 45,
  },
];

export const NAV_CATEGORIES = [
  "Promotion",
  "Bread & Bakery",
  "Drinks",
  "Milk & Dairy",
  "Groceries",
  "Snacks",
  "Cleaning",
  "Personal Care",
  "Household",
];

export const FAQS = [
  {
    question: "What is the minimum order value for online shopping?",
    answer: "We accept orders with a minimum value of RM500.00 and above.",
  },
  {
    question: "Is this service available across the whole of Malaysia?",
    answer:
      "The service is available within Central Region (Kuala Lumpur and Selangor), Southern Region (Negeri Sembilan, Melaka, Johor), Northern Region (Perak, Penang, Kedah, Perlis) and Southern East Coast (Terengganu, Pahang).",
  },
  {
    question: "What is the cutoff time for orders?",
    answer:
      "The cutoff time is at 1 p.m. daily. Orders placed before 1 p.m. will be processed and available for pick-up or delivery on the next working day.",
  },
  {
    question: "How do I qualify for free delivery?",
    answer:
      "Orders above RM500.00 that exceed 0.5 meter cube in volume qualify for free delivery. Volume is updated automatically on our website.",
  },
  {
    question: "What payment methods can I use?",
    answer: "You can pay using credit/debit card (Visa or Mastercard) or online banking.",
  },
];

export function formatPrice(amount: number): string {
  return `RM ${amount.toFixed(2)}`;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return [];
  if (categorySlug === "promotion") {
    return PRODUCTS.filter((p) => p.is_promo);
  }
  return PRODUCTS.filter((p) => p.category_id === category.id);
}
