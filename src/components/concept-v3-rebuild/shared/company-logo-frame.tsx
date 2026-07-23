import Image from "next/image";

import type { ContentAsset } from "@/content/education";
import styles from "@/styles/concept-v3-rebuild/career.module.scss";

/**
 * Shared company logo resolver for Career Filmstrip, Independent Track,
 * and Experience Story. Single path through the typed portfolio asset
 * registry via `entry.logo` — no per-component URL lookup.
 *
 * Fallback initials render only when the registry value is genuinely null.
 */
interface CompanyLogoFrameProps {
  logo: ContentAsset;
  company: string;
  companyShortName?: string | null;
  size?: "sm" | "md" | "lg" | "xl" | "pedestal";
  className?: string;
  /** Prefer eager — filmstrip logos live in a horizontal scroller where
   *  native lazy-loading often never resolves `src`. */
  loading?: "eager" | "lazy";
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

/** JPG/JPEG company marks often ship with baked light backgrounds. */
function needsWhiteBackground(src: string): boolean {
  const lowerSrc = src.toLowerCase();
  return lowerSrc.endsWith(".jpg") || lowerSrc.endsWith(".jpeg");
}

const sizeMap = {
  sm: { width: 32, height: 32 },
  md: { width: 44, height: 44 },
  lg: { width: 56, height: 56 },
  xl: { width: 72, height: 72 },
  pedestal: { width: 44, height: 44 },
};

export function CompanyLogoFrame({
  logo,
  company,
  companyShortName,
  size = "md",
  className,
  loading = "eager",
}: CompanyLogoFrameProps) {
  const { width, height } = sizeMap[size];
  const initials = getInitials(company, companyShortName);

  if (!logo?.src) {
    return (
      <div
        className={`${styles.logoFrame} ${className ?? ""}`}
        style={{ width, height }}
        aria-hidden="true"
        data-company-logo="fallback"
      >
        <div className={styles.logoFallback}>{initials}</div>
      </div>
    );
  }

  const whiteBg = needsWhiteBackground(logo.src);
  // Filmstrip / independent chips sit in overflow scrollers where native
  // lazy-loading leaves `src` empty. Force priority for compact career sizes.
  const forcePriority = size === "pedestal" || size === "sm";

  return (
    <div
      className={`${styles.logoFrame} ${whiteBg ? styles.logoFrameWhiteBg : ""} ${className ?? ""}`}
      style={{ width, height }}
      data-company-logo={logo.src}
    >
      <Image
        src={logo.src}
        alt={logo.alt}
        width={width}
        height={height}
        priority={forcePriority}
        loading={forcePriority ? "eager" : loading}
        // Keep original PNG/WebP bytes for tiny career frames — the optimizer
        // can crush dark-on-black marks into an unreadable near-black plate.
        unoptimized={forcePriority}
        decoding="async"
        draggable={false}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}

/** Alias matching the shared-component contract in the patch brief. */
export const CompanyLogo = CompanyLogoFrame;
