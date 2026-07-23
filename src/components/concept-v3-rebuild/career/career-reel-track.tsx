import type { RefObject } from "react";

import type { ExperienceEntry } from "@/content/experience";
import { CareerCompanyNode } from "./career-company-node";
import styles from "@/styles/concept-v3-rebuild/career-reel.module.scss";

interface CareerReelTrackProps {
  primary: ExperienceEntry[];
  selectedId: string;
  path: "main" | "independent";
  onSelect: (id: string) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
  progressRef: RefObject<HTMLDivElement | null>;
  signalRef: RefObject<HTMLDivElement | null>;
  registerNode: (id: string, el: HTMLButtonElement | null) => void;
}

export function CareerReelTrack({
  primary,
  selectedId,
  path,
  onSelect,
  scrollRef,
  progressRef,
  signalRef,
  registerNode,
}: CareerReelTrackProps) {
  const index = Math.max(
    0,
    primary.findIndex((entry) => entry.id === selectedId),
  );
  const progress =
    path === "main" && primary.length > 1
      ? (index / (primary.length - 1)) * 100
      : path === "main"
        ? 100
        : 0;

  return (
    <div
      className={[
        styles.filmstrip,
        path === "independent" ? styles.filmstripDim : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-main-reel
      data-career-filmstrip
    >
      <div className={styles.filmAtmosphere} aria-hidden="true" />
      <div
        ref={scrollRef}
        className={styles.filmScroll}
        tabIndex={0}
        aria-label="Professional career filmstrip"
        data-film-scroll
        data-overflowing="false"
      >
        <div
          className={styles.filmTrack}
          role="tablist"
          aria-label="Companies"
          data-film-track
        >
          <div className={styles.routeLine} aria-hidden="true" data-route-line>
            <div
              ref={progressRef}
              className={styles.routeProgress}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            ref={signalRef}
            className={styles.routeSignal}
            aria-hidden="true"
          />
          {primary.map((entry) => (
            <CareerCompanyNode
              key={entry.id}
              entry={entry}
              selected={path === "main" && entry.id === selectedId}
              onSelect={onSelect}
              nodeRef={(el) => registerNode(entry.id, el)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
