"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function ProductUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ imported: number; updated: number; errors: string[] } | null>(
    null
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please choose an Excel file.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/products/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Upload failed");
      return;
    }

    setResult(data);
    setFile(null);
    router.refresh();
  };

  return (
    <div className="admin-upload-panel">
      <div className="admin-info-box">
        <h2>Excel format</h2>
        <p>Required columns: <code>name</code>, <code>price</code>. Optional: <code>slug</code>, <code>description</code>, <code>image_label</code>, <code>category_slug</code>, <code>is_promo</code>, <code>is_new</code>, <code>stock</code>.</p>
        <p>Existing products are matched by <code>slug</code> and updated. New slugs are inserted.</p>
        <a href="/api/admin/products/template" className="admin-template-link" download>
          Download template (.xlsx)
        </a>
      </div>

      <form className="admin-form auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        {result && (
          <div className="auth-success">
            Imported {result.imported} product(s), updated {result.updated}.
            {result.errors.length > 0 && (
              <ul className="admin-error-list">
                {result.errors.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <label>
          Excel file (.xlsx)
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <button type="submit" disabled={loading || !file}>
          {loading ? "Uploading..." : "Upload & Import"}
        </button>
      </form>
    </div>
  );
}
