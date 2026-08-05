"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";

import type {
  InventoryProject,
  SystemsFilterId,
  SystemsFilterOption,
} from "@/lib/portfolio/projects/inventory";
import { SYSTEMS_FILTER_LABELS } from "@/lib/portfolio/projects/inventory";
import { useMotionPreference } from "@/lib/motion-preference-context";
import styles from "@/styles/portfolio/systems-index.module.scss";

interface SystemsIndexExperienceProps {
  projects: InventoryProject[];
  filters: SystemsFilterOption[];
}

/**
 * Filterable systems index. Not mounted on a route today — `/projects` ships
 * its own listing; this stays as the filtered-index surface it was built for.
 */
export function SystemsIndexExperience({
  projects,
  filters,
}: SystemsIndexExperienceProps) {
  const headingId = useId();
  const liveId = useId();
  const liveRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { effective } = useMotionPreference();

  const initial = (searchParams.get("filter") as SystemsFilterId | null) ?? "all";
  const [filter, setFilter] = useState<SystemsFilterId>(
    filters.some((item) => item.id === initial) ? initial : "all",
  );

  const visible = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((project) => project.filterGroup === filter);
  }, [filter, projects]);

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `${visible.length} system${
        visible.length === 1 ? "" : "s"
      } · ${SYSTEMS_FILTER_LABELS[filter]}`;
    }
  }, [filter, visible.length]);

  useEffect(() => {
    const root = listRef.current;
    if (!root || effective === "reduced") return;
    gsap.fromTo(
      root.querySelectorAll("[data-index-item]"),
      { autoAlpha: 0.4, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.03, ease: "power2.out" },
    );
  }, [effective, filter]);

  const applyFilter = (next: SystemsFilterId) => {
    setFilter(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "all") params.delete("filter");
    else params.set("filter", next);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Systems Index</p>
        <h1 id={headingId} className={styles.title}>
          Work across production systems
        </h1>
        <p className={styles.lede}>
          These are production platforms, client systems, commerce
          integrations, connected devices, and owner-built products — engineered
          for real operational constraints, not visual concept work.
        </p>
      </header>

      <div
        className={styles.filters}
        role="group"
        aria-label="Filter systems by type"
      >
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={[
              styles.filter,
              filter === item.id ? styles.filterActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-pressed={filter === item.id}
            onClick={() => applyFilter(item.id)}
          >
            <span>{item.label}</span>
            <span className={styles.filterCount}>{item.count}</span>
          </button>
        ))}
      </div>

      <p ref={liveRef} id={liveId} className={styles.srOnly} aria-live="polite" />

      <div
        ref={listRef}
        className={styles.list}
        aria-labelledby={headingId}
        aria-describedby={liveId}
      >
        {visible.map((project, index) => {
          const large = index % 3 === 0;
          return (
            <article
              key={project.id}
              className={[styles.entry, large ? styles.entryLarge : ""].join(
                " ",
              )}
              data-index-item
              data-filter-group={project.filterGroup}
            >
              <div className={styles.entryMedia}>
                <Image
                  src={(project.coverCard ?? project.cover).src}
                  alt={(project.coverCard ?? project.cover).alt}
                  width={(project.coverCard ?? project.cover).width}
                  height={(project.coverCard ?? project.cover).height}
                  sizes={
                    large
                      ? "(max-width: 900px) 100vw, 62vw"
                      : "(max-width: 900px) 100vw, 38vw"
                  }
                  className={styles.coverImage}
                  loading={index < 2 ? "eager" : "lazy"}
                  priority={index === 0}
                />
              </div>
              <div className={styles.entryCopy}>
                <p className={styles.index}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className={styles.meta}>
                  <span>{project.primaryCategory}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.status}</span>
                </p>
                <h2 className={styles.projectTitle}>{project.title}</h2>
                <p className={styles.tagline}>{project.shortTagline}</p>
                <p className={styles.role}>{project.role}</p>
                {project.keyMetrics ? (
                  <p className={styles.impact}>{project.keyMetrics}</p>
                ) : null}
                <p className={styles.tech}>{project.technologies.join(" · ")}</p>
                <div className={styles.links}>
                  {project.website ? (
                    <a
                      className={styles.external}
                      href={project.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live site
                    </a>
                  ) : null}
                  <span className={styles.reserved}>
                    Detail route reserved · /projects/{project.slug}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className={styles.back}>
        <Link href="/v2">Back to portfolio V2</Link>
      </p>
    </div>
  );
}
