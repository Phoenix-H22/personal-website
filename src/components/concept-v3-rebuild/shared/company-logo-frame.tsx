import Image from "next/image";

import type { ContentAsset } from "@/content/education";
import styles from "@/styles/concept-v3-rebuild/career.module.scss";

interface CompanyLogoFrameProps {
  logo: ContentAsset;
  company: string;
  companyShortName?: string | null;
  size?: "sm" | "md" | "lg" | "xl" | "pedestal";
  className?: string;
}

function getInitials(company: string, shortName?: string | null): string {
  const name = shortName || company;
  const words = name.split(/[\s\-_]+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function needsWhiteBackground(src: string): boolean {
  const lowerSrc = src.toLowerCase();
  return lowerSrc.endsWith(".jpg") || lowerSrc.endsWith(".jpeg");
}

const sizeMap = {
  sm: { width: 32, height: 32 },
  md: { width: 44, height: 44 },
  lg: { width: 56, height: 56 },
  xl: { width: 72, height: 72 },
  pedestal: { width: 40, height: 40 },
};

export function CompanyLogoFrame({
  logo,
  company,
  companyShortName,
  size = "md",
  className,
}: CompanyLogoFrameProps) {
  const { width, height } = sizeMap[size];
  const initials = getInitials(company, companyShortName);

  if (!logo) {
    return (
      <div
        className={`${styles.logoFrame} ${className ?? ""}`}
        style={{ width, height }}
        aria-hidden="true"
      >
        <div className={styles.logoFallback}>{initials}</div>
      </div>
    );
  }

  const whiteBg = needsWhiteBackground(logo.src);

  return (
    <div
      className={`${styles.logoFrame} ${whiteBg ? styles.logoFrameWhiteBg : ""} ${className ?? ""}`}
      style={{ width, height }}
    >
      <Image
        src={logo.src}
        alt={logo.alt}
        width={width}
        height={height}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
