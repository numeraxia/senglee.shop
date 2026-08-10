import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { buildProductTemplateWorkbook } from "@/lib/admin/products-import";

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const buffer = buildProductTemplateWorkbook();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="product-upload-template.xlsx"',
    },
  });
}
