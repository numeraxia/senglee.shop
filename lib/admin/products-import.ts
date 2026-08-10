import * as XLSX from "xlsx";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface ProductImportRow {
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_label: string;
  category_slug: string | null;
  is_promo: boolean;
  is_new: boolean;
  stock: number;
}

export interface ImportResult {
  imported: number;
  updated: number;
  errors: string[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  return normalized === "true" || normalized === "yes" || normalized === "1" || normalized === "y";
}

function getCell(row: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") {
      return row[key];
    }
  }
  return undefined;
}

export function parseProductWorkbook(buffer: ArrayBuffer): ProductImportRow[] {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  return rows
    .map((row, index) => {
      const name = String(getCell(row, ["name", "Name", "product_name"]) ?? "").trim();
      if (!name) return null;

      const slugRaw = String(getCell(row, ["slug", "Slug"]) ?? "").trim();
      const slug = slugRaw || slugify(name);
      const price = Number(getCell(row, ["price", "Price"]));
      const imageLabel = String(getCell(row, ["image_label", "image label", "Image Label"]) ?? name).trim();
      const categorySlug = String(getCell(row, ["category_slug", "category", "Category"]) ?? "")
        .trim()
        .toLowerCase() || null;

      if (Number.isNaN(price) || price < 0) {
        throw new Error(`Row ${index + 2}: invalid price for "${name}"`);
      }

      return {
        name,
        slug,
        description: String(getCell(row, ["description", "Description"]) ?? "").trim() || null,
        price,
        image_label: imageLabel,
        category_slug: categorySlug,
        is_promo: parseBoolean(getCell(row, ["is_promo", "promo", "Is Promo"])),
        is_new: parseBoolean(getCell(row, ["is_new", "new", "Is New"])),
        stock: Math.max(0, Number(getCell(row, ["stock", "Stock"]) ?? 0) || 0),
      } satisfies ProductImportRow;
    })
    .filter((row): row is ProductImportRow => row !== null);
}

export async function importProducts(
  supabase: SupabaseClient,
  rows: ProductImportRow[]
): Promise<ImportResult> {
  const result: ImportResult = { imported: 0, updated: 0, errors: [] };

  const { data: categories, error: catError } = await supabase.from("categories").select("id, slug");
  if (catError) {
    result.errors.push(catError.message);
    return result;
  }

  const categoryMap = new Map((categories ?? []).map((cat) => [cat.slug, cat.id]));

  for (const row of rows) {
    let categoryId: string | null = null;
    if (row.category_slug) {
      categoryId = categoryMap.get(row.category_slug) ?? null;
      if (!categoryId) {
        result.errors.push(`"${row.name}": unknown category slug "${row.category_slug}"`);
        continue;
      }
    }

    const { data: existing } = await supabase.from("products").select("id").eq("slug", row.slug).maybeSingle();

    const payload = {
      name: row.name,
      slug: row.slug,
      description: row.description,
      price: row.price,
      image_label: row.image_label,
      category_id: categoryId,
      is_promo: row.is_promo,
      is_new: row.is_new,
      stock: row.stock,
    };

    if (existing) {
      const { error } = await supabase.from("products").update(payload).eq("id", existing.id);
      if (error) {
        result.errors.push(`"${row.name}": ${error.message}`);
      } else {
        result.updated += 1;
      }
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        result.errors.push(`"${row.name}": ${error.message}`);
      } else {
        result.imported += 1;
      }
    }
  }

  return result;
}

export function buildProductTemplateWorkbook(): Buffer {
  const rows = [
    {
      name: "Planta Margarine",
      slug: "planta-margarine",
      description: "Margarine 6×2.5kg — perfect for bakeries and food service.",
      price: 170.9,
      image_label: "Margarine 6×2.5kg",
      category_slug: "promotion",
      is_promo: true,
      is_new: false,
      stock: 50,
    },
  ];

  const sheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Products");
  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
}
