import type { BrandCoreArtifact } from "@/lib/proof-engine/types";
import styles from "@/styles/concept-v3/artifacts.module.scss";

export type AKCoreVariant = "mark" | "illuminated" | "transition";

interface AKCoreProps {
  artifact: BrandCoreArtifact;
  variant?: AKCoreVariant;
  size?: number;
  decorative?: boolean;
  className?: string;
}

export function AKCore({
  artifact,
  variant = "mark",
  size = 72,
  decorative = false,
  className,
}: AKCoreProps) {
  const title = decorative ? undefined : artifact.title;

  return (
    <div
      className={[styles.akCore, styles.akCoreMono, className ?? ""]
        .filter(Boolean)
        .join(" ")}
      style={{ width: size, height: size }}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      data-variant={variant}
    >
      <svg
        className={styles.akCoreSvg}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className={styles.akCorePath}
          d="M18 48 L32 12 L46 48"
        />
        <path className={styles.akCorePath} d="M24 34 H40" />
        <path
          className={styles.akCorePath}
          d="M12 50 H22 M42 50 H52"
        />
        <circle className={styles.akCoreFill} cx="32" cy="12" r="2.2" />
        <circle className={styles.akCoreFill} cx="18" cy="48" r="1.8" />
        <circle className={styles.akCoreFill} cx="46" cy="48" r="1.8" />
      </svg>
    </div>
  );
}
