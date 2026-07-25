import styles from "@/styles/portfolio/project-covers.module.scss";

export function VirtualClinicCover() {
  return (
    <div
      className={`${styles.cover} ${styles.clinic}`}
      data-project-cover="virtual-clinic-loop"
      aria-hidden="true"
    >
      <div className={styles.clinicSurface}>
        <p className={styles.coverEyebrow}>Care interaction loop</p>
        <ul className={styles.clinicLoop}>
          {[
            "Patient interaction",
            "Mobile / web",
            "API",
            "AI workflow",
            "Hardware",
          ].map((node) => (
            <li key={node} data-cover-step>
              {node}
            </li>
          ))}
        </ul>
        <p className={styles.clinicCapstone} data-cover-step>
          Capstone A+
        </p>
      </div>
    </div>
  );
}
