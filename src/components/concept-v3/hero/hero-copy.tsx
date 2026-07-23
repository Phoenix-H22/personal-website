import type { ExternalLink, ProofEngineHeroContent } from "@/lib/proof-engine/types";
import styles from "@/styles/concept-v3/proof-engine.module.scss";

interface HeroCopyProps {
  content: Pick<
    ProofEngineHeroContent,
    "eyebrow" | "name" | "headline" | "headlineEmphasis" | "summary"
  >;
}

function emphasizeHeadline(headline: string, emphasis?: string) {
  if (!emphasis || !headline.includes(emphasis)) {
    return headline;
  }

  const index = headline.lastIndexOf(emphasis);
  return (
    <>
      {headline.slice(0, index)}
      <span className={styles.headlineEmphasis}>{emphasis}</span>
      {headline.slice(index + emphasis.length)}
    </>
  );
}

export function HeroCopy({ content }: HeroCopyProps) {
  return (
    <>
      <p className={styles.eyebrow}>{content.eyebrow}</p>
      <h1 id="proof-engine-name" className={styles.name}>
        {content.name}
      </h1>
      <p className={styles.headline}>
        {emphasizeHeadline(content.headline, content.headlineEmphasis)}
      </p>
      <p className={styles.summary}>{content.summary}</p>
    </>
  );
}

interface HeroActionsProps {
  primaryAction: ExternalLink;
  secondaryAction: ExternalLink;
  socialActions: ExternalLink[];
}

export function HeroActions({
  primaryAction,
  secondaryAction,
  socialActions,
}: HeroActionsProps) {
  return (
    <>
      <div className={styles.actions}>
        <a
          className={styles.actionPrimary}
          href={primaryAction.href}
          aria-label={primaryAction.ariaLabel ?? primaryAction.label}
        >
          {primaryAction.label}
        </a>
        <a
          className={styles.actionSecondary}
          href={secondaryAction.href}
          aria-label={secondaryAction.ariaLabel ?? secondaryAction.label}
          target={secondaryAction.isExternal ? "_blank" : undefined}
          rel={secondaryAction.isExternal ? "noreferrer" : undefined}
        >
          {secondaryAction.label}
        </a>
      </div>
      <ul className={styles.socials}>
        {socialActions.map((action) => (
          <li key={action.href}>
            <a
              href={action.href}
              aria-label={action.ariaLabel ?? action.label}
              target={action.isExternal ? "_blank" : undefined}
              rel={action.isExternal ? "noreferrer" : undefined}
            >
              {action.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
