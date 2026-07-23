import styles from "@/styles/concept-v3/proof-engine.module.scss";

export function HeroAtmosphere() {
  return (
    <div className={styles.atmosphere} aria-hidden="true">
      <div className={styles.atmosphereFog} />
      <div className={styles.atmosphereDepth} />
      <div className={`${styles.atmosphereTrace} ${styles.atmosphereTraceA}`} />
      <div className={`${styles.atmosphereTrace} ${styles.atmosphereTraceB}`} />
      <div className={styles.atmosphereGrain} />
      <div className={styles.atmosphereVignette} />
    </div>
  );
}
