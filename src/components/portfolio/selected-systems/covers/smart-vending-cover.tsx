import styles from "@/styles/portfolio/project-covers.module.scss";

export function SmartVendingCover() {
  return (
    <div
      className={`${styles.cover} ${styles.vending}`}
      data-project-cover="vending-device-flow"
      aria-hidden="true"
    >
      <div className={styles.vendingSurface}>
        <div className={styles.vendingMachine} data-cover-step>
          <span className={styles.vendingScreen}>QR</span>
          <span className={styles.vendingDoor} />
        </div>
        <ol className={styles.vendingStack}>
          {[
            "QR scan",
            "API validation",
            "Transaction state",
            "MQTT command",
            "Physical release",
          ].map((step) => (
            <li key={step} data-cover-step>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
