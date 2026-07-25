import styles from "@/styles/portfolio/project-covers.module.scss";

/** Art-directed Flagship cover — operational route, not Hero KPI strip. */
export function MerchantOperationsCover() {
  return (
    <div
      className={`${styles.cover} ${styles.merchant}`}
      data-project-cover="merchant-operations"
      aria-hidden="true"
    >
      <div className={styles.merchantSurface}>
        <p className={styles.coverEyebrow}>Operations route</p>
        <ol className={styles.merchantFlow}>
          {[
            "Commerce events",
            "Webhook intake",
            "Normalization",
            "Operational state",
          ].map((label) => (
            <li key={label} data-cover-step>
              <span className={styles.flowDot} />
              <span>{label}</span>
            </li>
          ))}
        </ol>
        <div className={styles.merchantSplit}>
          <span data-cover-step>Reconciliation</span>
          <span data-cover-step>Reporting</span>
        </div>
      </div>
    </div>
  );
}
