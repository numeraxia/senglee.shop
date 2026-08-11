import Link from "next/link";
import { LogoImage } from "@/components/LogoImage";

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
        <LogoImage
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
