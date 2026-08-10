import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-container">
      <div className="empty-state">
        <h2>Page not found</h2>
        <p>The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="badge" style={{ display: "inline-block", marginTop: 16 }}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
