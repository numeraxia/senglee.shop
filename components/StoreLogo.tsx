import Image from "next/image";
import Link from "next/link";

interface StoreLogoProps {
  storeName: string;
  brandTag: string;
  logoUrl?: string | null;
  variant?: "header" | "footer";
}

export function StoreLogo({
  storeName,
  brandTag,
  logoUrl,
  variant = "header",
}: StoreLogoProps) {
  return (
    <Link href="/" className={`logo ${variant === "footer" ? "logo-footer" : ""}`}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={storeName}
          width={variant === "footer" ? 160 : 140}
          height={variant === "footer" ? 48 : 40}
          className="logo-image"
          priority={variant === "header"}
        />
      ) : (
        <>
          <span className="logo-text">{storeName}</span>
          <span className="logo-tag">{brandTag}</span>
        </>
      )}
    </Link>
  );
}
