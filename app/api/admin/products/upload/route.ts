import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { parseProductWorkbook, importProducts } from "@/lib/admin/products-import";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const buffer = await file.arrayBuffer();
    const rows = parseProductWorkbook(buffer);

    if (!rows.length) {
      return NextResponse.json({ error: "No product rows found in the spreadsheet" }, { status: 400 });
    }

    const result = await importProducts(admin, rows);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to parse Excel file";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
