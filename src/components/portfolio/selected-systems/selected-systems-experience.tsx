"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ProjectStage } from "@/components/portfolio/selected-systems/project-stage";
import {
  FEATURED_CATEGORY_LABELS,
  type FeaturedSystemCardProps,
} from "@/components/portfolio/selected-systems/selected-system-types";
import { useFeaturedCoverAmbient } from "@/components/portfolio/selected-systems/use-cover-ambient";
import type { ProjectHomepageCategory } from "@/lib/portfolio/projects/types";
import { useMotionPreference } from "@/lib/motion-preference-context";
import styles from "@/styles/portfolio/selected-systems.module.scss";

gsap.registerPlugin(ScrollTrigger);

type FilterId = "all" | ProjectHomepageCategory;

interface FeaturedSystemsExperienceProps {
  projects: FeaturedSystemCardProps[];
}

const FILTER_ORDER: FilterId[] = [
  "all",
  "commerce",
  "messaging",
  "iot",
  "ai-healthcare",
];

function layoutFor(
  project: FeaturedSystemCardProps,
  filtered: boolean,
): "flagship" | "nabd" | "vending" | "clinic" | "solo" {
  if (filtered) return "solo";
  if (project.isFlagship) return "flagship";
  if (project.coverType === "messaging-router") return "nabd";
  if (project.coverType === "vending-device-flow") return "vending";
  if (project.coverType === "virtual-clinic-loop") return "clinic";
  return "solo";
}

export function FeaturedSystemsExperience({
  projects,
}: FeaturedSystemsExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const enteredRef = useRef(false);
  const filterBootRef = useRef(true);
  const { effective } = useMotionPreference();
  const [filter, setFilter] = useState<FilterId>("all");
  const headingId = useId();
  const liveId = useId();

  const counts = useMemo(() => {
    const map: Record<FilterId, number> = {
      all: projects.length,
      commerce: 0,
      messaging: 0,
      iot: 0,
      "ai-healthcare": 0,
    };
    for (const project of projects) {
      map[project.homepageCategory] += 1;
    }
    return map;
  }, [projects]);

  const visible = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((project) => project.homepageCategory === filter);
  }, [filter, projects]);

  const flagship = visible.find((p) => p.isFlagship);
  const nabd = visible.find((p) => p.coverType === "messaging-router");
  const vending = visible.find((p) => p.coverType === "vending-device-flow");
  const clinic = visible.find((p) => p.coverType === "virtual-clinic-loop");
  const filteredSolo =
    filter !== "all" ? visible : ([] as FeaturedSystemCardProps[]);

  useFeaturedCoverAmbient(rootRef, `${filter}:${visible.map((p) => p.id).join(",")}`);

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `${visible.length} project${
        visible.length === 1 ? "" : "s"
      } shown · ${FEATURED_CATEGORY_LABELS[filter]}`;
    }
  }, [filter, visible.length]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || effective === "reduced" || enteredRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-system-scene]"),
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            once: true,
            onEnter: () => {
              enteredRef.current = true;
            },
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [effective]);

  useEffect(() => {
    if (filterBootRef.current) {
      filterBootRef.current = false;
      return;
    }
    const root = rootRef.current;
    if (!root || effective === "reduced") return;
    const scenes = root.querySelectorAll("[data-system-scene]");
    if (!scenes.length) return;
    gsap.fromTo(
      scenes,
      { autoAlpha: 0.35, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out", stagger: 0.04 },
    );
  }, [effective, filter]);

  return (
    <section
      ref={rootRef}
      id="selected-systems"
      className={styles.section}
      aria-labelledby={headingId}
      data-selected-systems
      data-featured-systems
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>Selected Systems</p>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Featured Systems
          </h2>
          <p className={styles.count} aria-hidden="true">
            {projects.length} projects
          </p>
        </div>
        <p className={styles.lede}>
          Production systems across commerce, messaging, IoT, and AI.
        </p>
      </header>

      <div
        className={styles.filters}
        role="group"
        aria-label="Filter featured systems by category"
      >
        {FILTER_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            className={[
              styles.filter,
              filter === id ? styles.filterActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
          >
            <span>{FEATURED_CATEGORY_LABELS[id]}</span>
            <span className={styles.filterCount}>{counts[id]}</span>
          </button>
        ))}
      </div>

      <p
        ref={liveRef}
        id={liveId}
        className={styles.srOnly}
        aria-live="polite"
      />

      <div className={styles.stage} aria-describedby={liveId}>
        {filter === "all" ? (
          <>
            {flagship ? (
              <ProjectStage project={flagship} layout="flagship" />
            ) : null}
            {(nabd || vending) && (
              <div className={styles.supportRow}>
                {nabd ? <ProjectStage project={nabd} layout="nabd" /> : null}
                {vending ? (
                  <ProjectStage project={vending} layout="vending" />
                ) : null}
              </div>
            )}
            {clinic ? <ProjectStage project={clinic} layout="clinic" /> : null}
          </>
        ) : (
          filteredSolo.map((project) => (
            <ProjectStage
              key={project.id}
              project={project}
              layout={layoutFor(project, true)}
            />
          ))
        )}
      </div>
    </section>
  );
}

/** @deprecated Prefer FeaturedSystemsExperience — kept as alias during S2B. */
export const SelectedSystemsExperience = FeaturedSystemsExperience;
