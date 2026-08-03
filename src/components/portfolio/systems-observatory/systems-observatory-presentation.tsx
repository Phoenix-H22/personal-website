"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import {
  AnnotationControl,
  MicroSystemNode,
  useObservatoryAnnotations,
} from "@/components/portfolio/systems-observatory/systems-observatory-annotations";
import {
  alignObservatoryRailNode,
  formatObservatoryPosition,
  getObservatoryRailAlignment,
  getNavigationTargetIndex,
  type ObservatoryDirection,
} from "@/components/portfolio/systems-observatory/systems-observatory-navigation";
import { getEvidenceDisplayMode } from "@/components/portfolio/systems-observatory/systems-observatory-evidence";
import {
  getOwnershipScope,
  getTechnologyInsight,
} from "@/components/portfolio/systems-observatory/systems-observatory-insights";
import { SystemNavigator } from "@/components/portfolio/systems-observatory/systems-observatory-project-navigation";
import {
  getObservatoryPanelId,
  getObservatoryTabId,
  type ObservatoryLensView,
  type ObservatoryProjectView,
} from "@/components/portfolio/systems-observatory/systems-observatory.config";
import type {
  PublicOwnershipType,
  PublicProjectStatus,
} from "@/lib/portfolio/projects/types";
import { useObservatoryMediaInteraction } from "@/components/portfolio/systems-observatory/use-observatory-media-interaction";
import styles from "@/styles/portfolio/systems-observatory.module.scss";

interface ObservatoryLensControlsProps {
  lenses: ObservatoryLensView[];
  activeLens: ObservatoryLensView;
  reducedMotion: boolean;
  onActivate: (lens: ObservatoryLensView) => void;
}

interface ObservatoryPanelProps {
  lenses: ObservatoryLensView[];
  lens: ObservatoryLensView;
  project: ObservatoryProjectView;
  reducedMotion: boolean;
  gestureHintVisible: boolean;
  onSelectProject: (project: ObservatoryProjectView) => void;
  onNavigateProject: (direction: ObservatoryDirection) => void;
}

const OWNERSHIP_LABELS: Record<PublicOwnershipType, string> = {
  "founder-built": "Founder-built / end to end",
  "built-entirely": "Built entirely",
  "backend-devops-owner": "Backend + DevOps ownership",
  "technical-owner": "Technical ownership",
  "lead-developer": "Lead development",
  "major-contributor": "Major contribution",
};

const STATUS_LABELS: Record<PublicProjectStatus, string> = {
  live: "Live in production",
  "active-development": "Active development",
  completed: "Completed delivery",
  "completed-before-launch": "Completed before launch",
  archived: "Archived",
};

function sequenceNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function ObservatoryHeader() {
  return (
    <header className={styles.header} data-observatory-entrance>
      <p className={styles.eyebrow}>SELECTED SYSTEMS / 07 PRODUCTION BUILDS</p>
      <div className={styles.headingGrid}>
        <h2 id="systems-observatory-heading" className={styles.heading}>
          <span>I don&apos;t just build products.</span>
          <span>I own the systems behind them.</span>
        </h2>
        <p className={styles.introduction}>
          From founder-built products to high-pressure production platforms and
          connected machines, these systems show how I think, build, ship, and operate
          beyond the feature level.
        </p>
      </div>
    </header>
  );
}

export function ObservatoryLensControls({
  lenses,
  activeLens,
  reducedMotion,
  onActivate,
}: ObservatoryLensControlsProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [previewLensId, setPreviewLensId] = useState<string | null>(null);
  const activeIndex = lenses.findIndex(({ id }) => id === activeLens.id);
  const describedLens =
    lenses.find(({ id }) => id === previewLensId) ?? activeLens;

  useEffect(() => {
    const deck = deckRef.current;
    const activeTab = tabRefs.current[activeIndex];
    if (!deck || !activeTab) return;
    const frame = requestAnimationFrame(() => {
      alignObservatoryRailNode(
        deck,
        activeTab,
        getObservatoryRailAlignment(activeIndex, lenses.length),
        reducedMotion ? "auto" : "smooth",
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [activeIndex, lenses.length, reducedMotion]);

  const moveTabFocus = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const nextIndex = getNavigationTargetIndex(event.key, index, lenses.length);
    if (nextIndex === null) return;
    event.preventDefault();
    onActivate(lenses[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={styles.lensRegion} data-observatory-entrance>
      <div className={styles.lensDeckHeading} aria-hidden="true">
        <span>{formatObservatoryPosition(activeIndex, lenses.length)}</span>
      </div>
      <div
        ref={deckRef}
        className={styles.tabs}
        role="tablist"
        aria-label="Systems Observatory story lenses"
        data-lens-deck
      >
        {lenses.map((lens, index) => {
          const active = lens.id === activeLens.id;
          return (
            <button
              key={lens.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={getObservatoryTabId(lens.id)}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={active}
              aria-controls={getObservatoryPanelId(lens.id)}
              tabIndex={active ? 0 : -1}
              data-lens-tab
              data-active={active ? "true" : "false"}
              onClick={() => onActivate(lens)}
              onKeyDown={(event) => moveTabFocus(event, index)}
              onMouseEnter={() => setPreviewLensId(lens.id)}
              onMouseLeave={() => setPreviewLensId(null)}
              onFocus={() => setPreviewLensId(lens.id)}
              onBlur={() => setPreviewLensId(null)}
            >
              <span className={styles.tabIndex}>{lens.index}</span>
              <span className={styles.tabCopy}>
                <span className={styles.tabLabel}>{lens.label}</span>
                <span className={styles.tabSignal}>{lens.signalLine}</span>
              </span>
              <span className={styles.tabCount}>{lens.projects.length}</span>
              <span className={styles.tabRail} aria-hidden="true">
                <span />
              </span>
            </button>
          );
        })}
      </div>

      <p
        className={styles.lensDescription}
        data-lens-description={describedLens.id}
        data-previewing={previewLensId ? "true" : "false"}
      >
        {describedLens.description}
      </p>
    </div>
  );
}

function ProjectMedia({
  project,
  reducedMotion,
  gestureHintVisible,
  onNavigateProject,
}: {
  project: ObservatoryProjectView;
  reducedMotion: boolean;
  gestureHintVisible: boolean;
  onNavigateProject: (direction: ObservatoryDirection) => void;
}) {
  const { surfaceRef, ...mediaInteractionHandlers } = useObservatoryMediaInteraction({
    projectSlug: project.slug,
    reducedMotion,
    onNavigate: onNavigateProject,
  });

  return (
    <div className={styles.mediaColumn} data-observatory-cover>
      <div
        ref={surfaceRef}
        className={styles.mediaInteractionSurface}
        data-observatory-swipe-surface
        {...mediaInteractionHandlers}
      >
        <div className={styles.frameDepth} aria-hidden="true" />
        <div className={styles.mediaFrame}>
          <div className={styles.registrationMarks} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <Image
            key={project.cover.src}
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            sizes="(max-width: 1080px) calc(100vw - 2rem), min(63vw, 960px)"
            className={styles.cover}
            draggable={false}
          />
        </div>
        <span className={styles.dragDirectionPrevious} aria-hidden="true">PREVIOUS</span>
        <span className={styles.dragDirectionNext} aria-hidden="true">NEXT</span>
        {gestureHintVisible && !reducedMotion ? (
          <span className={styles.gestureHint} aria-hidden="true">
            <span className={styles.dragHint}>DRAG TO EXPLORE</span>
            <span className={styles.swipeHint}>SWIPE TO EXPLORE</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}

type ObservatoryAnnotationController = ReturnType<typeof useObservatoryAnnotations>;

function EvidenceMoment({
  project,
  annotationController,
}: {
  project: ObservatoryProjectView;
  annotationController: ObservatoryAnnotationController;
}) {
  const metric = project.strongestMetric;
  if (!metric) return null;
  const displayMode = getEvidenceDisplayMode(metric.value);
  const contextId = `observatory-proof-context-${project.slug}`;

  return (
    <aside
      className={styles.evidenceMoment}
      data-observatory-evidence
      data-evidence-mode={displayMode}
    >
      <strong className={styles.evidenceValue}>{metric.value}</strong>
      <span className={styles.evidenceLabel}>{metric.label}</span>
      {metric.context ? (
        <span className={styles.evidenceContext}>
          <AnnotationControl
            id={contextId}
            eyebrow="PROOF CONTEXT"
            title={metric.label}
            content={metric.context}
            variant="detail"
            controller={annotationController}
          >
            <MicroSystemNode category="infrastructure" />
            <span>PROOF CONTEXT</span>
          </AnnotationControl>
        </span>
      ) : null}
    </aside>
  );
}

function ProjectEvidence({
  project,
  annotationController,
}: {
  project: ObservatoryProjectView;
  annotationController: ObservatoryAnnotationController;
}) {
  return (
    <div className={styles.ownershipRegion}>
      <dl className={styles.evidenceDetails}>
        <div>
          <dt>Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>Strongest responsibility</dt>
          <dd>{project.strongestCapability}</dd>
        </div>
      </dl>
      <AnnotationControl
        id={`observatory-ownership-scope-${project.slug}`}
        eyebrow="WHAT I OWNED"
        title={project.title}
        content={getOwnershipScope(project)}
        variant="detail"
        controller={annotationController}
      >
        <MicroSystemNode category="backend" />
        <span>WHAT I OWNED</span>
      </AnnotationControl>
    </div>
  );
}

function ProjectNarrative({
  project,
  annotationController,
}: {
  project: ObservatoryProjectView;
  annotationController: ObservatoryAnnotationController;
}) {
  return (
    <article className={styles.narrative} data-observatory-narrative>
      <h3 className={styles.projectTitle}>{project.title}</h3>
      <p className={styles.storyAngle} data-observatory-story>
        {project.storyAngle}
      </p>
      {project.statement ? (
        <blockquote className={styles.statement}>{project.statement}</blockquote>
      ) : null}

      <EvidenceMoment
        project={project}
        annotationController={annotationController}
      />
      <ProjectEvidence
        project={project}
        annotationController={annotationController}
      />

      <p className={styles.tagline}>{project.shortTagline}</p>
      <div className={styles.narrativeFooter}>
        <div
          className={styles.technologyLine}
          aria-label="Primary technologies"
          data-observatory-technology-line
        >
          {project.technologies.slice(0, 3).map((technology, index) => {
            const insight = getTechnologyInsight(project.slug, technology);
            if (!insight) {
              return (
                <span key={technology} className={styles.technologyLabel}>
                  <MicroSystemNode />
                  <span>{technology}</span>
                </span>
              );
            }
            return (
              <AnnotationControl
                key={technology}
                id={`observatory-tech-${project.slug}-${index}`}
                eyebrow={insight.label ?? "TECH NOTE"}
                title={technology}
                content={insight.sentence}
                variant="technology"
                controller={annotationController}
              >
                <MicroSystemNode category={insight.category} />
                <span>{technology}</span>
              </AnnotationControl>
            );
          })}
        </div>

        {project.website ? (
          <a
            className={styles.externalLink}
            href={project.website}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit live product: ${project.title} (opens in a new tab)`}
          >
            Visit live product <span aria-hidden="true">&#8599;</span>
          </a>
        ) : null}
      </div>

      <div className={styles.statusLine}>
        <span>{STATUS_LABELS[project.status]}</span>
        <span aria-hidden="true" className={styles.statusDivider} />
        <span>{OWNERSHIP_LABELS[project.ownershipType]}</span>
      </div>
    </article>
  );
}

function ActiveProjectStage({
  lens,
  project,
  reducedMotion,
  gestureHintVisible,
  onNavigateProject,
  annotationController,
}: {
  lens: ObservatoryLensView;
  project: ObservatoryProjectView;
  reducedMotion: boolean;
  gestureHintVisible: boolean;
  onNavigateProject: (direction: ObservatoryDirection) => void;
  annotationController: ObservatoryAnnotationController;
}) {
  const projectIndex = lens.projects.findIndex(({ slug }) => slug === project.slug);

  return (
    <div
      className={styles.stage}
      data-accent={project.accent}
      data-active-project-stage
      data-project={project.slug}
      data-observatory-entrance
    >
      <div className={styles.ambientLight} aria-hidden="true" />
      <span className={styles.ghostIndex} aria-hidden="true" data-observatory-ghost>
        {sequenceNumber(projectIndex)}
      </span>
      <div className={styles.stageHeader}>
        <p className={styles.projectMeta}>
          <span>{sequenceNumber(projectIndex)}</span>
          <span>{project.systemType}</span>
        </p>
      </div>
      <div className={styles.stageComposition}>
        <ProjectMedia
          project={project}
          reducedMotion={reducedMotion}
          gestureHintVisible={gestureHintVisible}
          onNavigateProject={onNavigateProject}
        />
        <ProjectNarrative
          key={`${lens.id}:${project.slug}`}
          project={project}
          annotationController={annotationController}
        />
      </div>
    </div>
  );
}

export function ObservatoryPanel({
  lenses,
  lens,
  project,
  reducedMotion,
  gestureHintVisible,
  onSelectProject,
  onNavigateProject,
}: ObservatoryPanelProps) {
  const annotationController = useObservatoryAnnotations({
    scopeKey: `${lens.id}:${project.slug}`,
    reducedMotion,
  });

  const selectProject = (nextProject: ObservatoryProjectView) => {
    annotationController.close();
    onSelectProject(nextProject);
  };

  const navigateProject = (direction: ObservatoryDirection) => {
    annotationController.close();
    onNavigateProject(direction);
  };

  return (
    <>
      {lenses
        .filter(({ id }) => id !== lens.id)
        .map((inactiveLens) => (
          <div
            key={inactiveLens.id}
            id={getObservatoryPanelId(inactiveLens.id)}
            role="tabpanel"
            aria-labelledby={getObservatoryTabId(inactiveLens.id)}
            hidden
          />
        ))}
      <div
        id={getObservatoryPanelId(lens.id)}
        role="tabpanel"
        aria-labelledby={getObservatoryTabId(lens.id)}
        className={styles.panelRegion}
        data-accent={project.accent}
        tabIndex={0}
      >
        <SystemNavigator
          lens={lens}
          activeProject={project}
          reducedMotion={reducedMotion}
          onSelectProject={selectProject}
        />
        <ActiveProjectStage
          lens={lens}
          project={project}
          reducedMotion={reducedMotion}
          gestureHintVisible={gestureHintVisible}
          onNavigateProject={navigateProject}
          annotationController={annotationController}
        />
      </div>
    </>
  );
}

export function ObservatoryFooter() {
  return (
    <footer className={styles.footer} data-observatory-entrance>
      <span className={styles.footerSignal} aria-hidden="true" />
      <span>13 SYSTEMS CATALOGED</span>
    </footer>
  );
}
