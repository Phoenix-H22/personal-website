import styles from "@/styles/portfolio/project-covers.module.scss";

interface NabdMessagingCoverProps {
  logoSrc: string | null;
}

export function NabdMessagingCover({ logoSrc }: NabdMessagingCoverProps) {
  return (
    <div
      className={`${styles.cover} ${styles.nabd}`}
      data-project-cover="messaging-router"
      aria-hidden="true"
    >
      <div className={styles.nabdSurface}>
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.nabdLogo}
            src={logoSrc}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <p className={styles.coverEyebrow}>Message routing</p>
        <div className={styles.nabdEvent} data-cover-step>
          Commerce event
        </div>
        <div className={styles.nabdBranch} />
        <ul className={styles.nabdChannels}>
          {[
            { channel: "WhatsApp", state: "routed" },
            { channel: "Telegram", state: "queued" },
            { channel: "Email", state: "delivered" },
          ].map((item) => (
            <li key={item.channel} data-cover-step>
              <span>{item.channel}</span>
              <span className={styles.nabdState}>{item.state}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
