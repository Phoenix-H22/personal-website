import type { ExperienceEntry } from "@/content/experience";
import { CompanyLogoFrame } from "@/components/concept-v3-rebuild/shared/company-logo-frame";
import { formatDateRange } from "./format";
import styles from "@/styles/concept-v3-rebuild/career-reel.module.scss";

interface ExperienceStoryProps {
  entry: ExperienceEntry;
  path: "main" | "independent";
  eraLabel?: string;
}

function ownershipStatement(
  entry: ExperienceEntry,
  path: "main" | "independent",
) {
  if (path === "independent") {
    if (entry.id === "phoenix-techs") {
      return "Independent product and engineering studio — long-running ownership across product and client systems.";
    }
    if (entry.id === "upwork-freelance") {
      return "Independent responsibility across international client delivery and remote product work.";
    }
  }
  return entry.mission;
}

function highlightsFor(
  entry: ExperienceEntry,
  path: "main" | "independent",
) {
  if (entry.id === "upwork-freelance" && path === "independent") {
    return [
      "Independent client delivery across product backends",
      "Global and remote product engineering",
      "Ownership progression across engagements",
    ];
  }
  const limit =
    entry.era === "entering-production"
      ? 2
      : entry.era === "owning-production-systems"
        ? 3
        : 3;
  return entry.highlights
    .filter((item) => !/top rated|100%\s*jss|job success/i.test(item))
    .slice(0, limit);
}

function splitProof(value: string) {
  const match = value.match(
    /(\d[\d,]*(?:\.\d+)?%?\+?|\d[\d,]*K\+?)\s+(.+)$/i,
  );
  if (!match) return { value, hint: "Impact" };
  return { value: match[1], hint: match[2] };
}

function techLabel(entry: ExperienceEntry) {
  if (entry.id === "kayanac-erp-rejoin") {
    return "Laravel · MySQL · ERP";
  }
  return entry.technologies.slice(0, 5).join(" · ");
}

export function ExperienceStory({
  entry,
  path,
  eraLabel,
}: ExperienceStoryProps) {
  const period = formatDateRange(
    entry.startDate,
    entry.endDate,
    entry.isCurrent,
  );
  const highlights = highlightsFor(entry, path);
  const outcomes = entry.outcomes.slice(0, 2);
  const tech = techLabel(entry);
  const kicker =
    path === "independent" ? "Freelance" : eraLabel ?? "Career";
  const isKayanacCurrent = entry.id === "kayanac-erp-rejoin";

  return (
    <article
      className={[
        styles.story,
        path === "independent" ? styles.storyIndependent : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-experience-story
      data-company={entry.id}
      data-era={entry.era}
      data-path={path}
    >
      <div className={styles.storySpread}>
        <div className={styles.storyIdentity}>
          <CompanyLogoFrame
            logo={entry.logo}
            company={entry.company}
            companyShortName={entry.companyShortName}
            size="xl"
          />
          <div className={styles.storyIdentityCopy}>
            <p className={styles.storyKicker}>{kicker}</p>
            <h3 className={styles.storyCompany}>{entry.company}</h3>
            <p className={styles.storyRole}>{entry.role}</p>
            <p className={styles.storyMeta}>
              {period}
              {entry.location ? (
                <>
                  <span aria-hidden="true"> · </span>
                  {entry.location}
                </>
              ) : null}
            </p>
            {entry.isCurrent ? (
              <span className={styles.storyCurrent}>
                <span className={styles.storyCurrentDot} aria-hidden="true" />
                Current
              </span>
            ) : null}
          </div>
        </div>

        <div className={styles.storyRule} aria-hidden="true" />

        <div className={styles.storyBody}>
          <p className={styles.storyOwnership} data-story-ownership>
            {ownershipStatement(entry, path)}
          </p>

          {!isKayanacCurrent && highlights.length > 0 ? (
            <ul className={styles.storyHighlights} data-story-work>
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}

          {!isKayanacCurrent && outcomes.length > 0 ? (
            <ul className={styles.proofStrip} data-story-proof>
              {outcomes.map((item) => {
                const proof = splitProof(item);
                return (
                  <li key={item} className={styles.proofItem}>
                    <span className={styles.proofValue}>{proof.value}</span>
                    <span className={styles.proofHint}>{proof.hint}</span>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {tech ? <p className={styles.storyTech}>{tech}</p> : null}

          {isKayanacCurrent ? (
            <p className={styles.storyPrevious}>
              <span className={styles.storyPreviousLabel}>
                Previously at Kayanac
              </span>
              <span className={styles.storyPreviousMeta}>
                Mar 2025 – Jun 2025 · Contract
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
