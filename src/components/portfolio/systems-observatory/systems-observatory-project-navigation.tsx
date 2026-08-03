"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import {
  alignObservatoryRailNode,
  formatObservatoryPosition,
  getNavigationTargetIndex,
} from "@/components/portfolio/systems-observatory/systems-observatory-navigation";
import type {
  ObservatoryLensView,
  ObservatoryProjectView,
} from "@/components/portfolio/systems-observatory/systems-observatory.config";
import styles from "@/styles/portfolio/systems-observatory.module.scss";

interface SystemNavigatorProps {
  lens: ObservatoryLensView;
  activeProject: ObservatoryProjectView;
  reducedMotion: boolean;
  onSelectProject: (project: ObservatoryProjectView) => void;
}

function sequenceNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function DesktopProjectRail({
  lens,
  activeProject,
  reducedMotion,
  onSelectProject,
}: SystemNavigatorProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = lens.projects.findIndex(({ slug }) => slug === activeProject.slug);

  useEffect(() => {
    const viewport = viewportRef.current;
    const activeNode = projectRefs.current[activeIndex];
    if (!viewport || !activeNode) return;
    const frame = requestAnimationFrame(() => {
      alignObservatoryRailNode(
        viewport,
        activeNode,
        "center",
        reducedMotion ? "auto" : "smooth",
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [activeIndex, lens.id, reducedMotion]);

  const moveProjectFocus = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const nextIndex = getNavigationTargetIndex(event.key, index, lens.projects.length);
    if (nextIndex === null) return;
    event.preventDefault();
    onSelectProject(lens.projects[nextIndex]);
    projectRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={styles.desktopNavigator} data-desktop-project-navigator>
      <div className={styles.desktopRailShell}>
        <div
          ref={viewportRef}
          className={styles.navigatorViewport}
          data-system-navigator-viewport
          tabIndex={0}
        >
          <div className={styles.navigatorTrack}>
            <span className={styles.navigatorConnector} aria-hidden="true" />
            {lens.projects.map((project, index) => {
              const active = project.slug === activeProject.slug;
              return (
                <button
                  key={project.slug}
                  ref={(node) => {
                    projectRefs.current[index] = node;
                  }}
                  type="button"
                  className={styles.navigatorNode}
                  aria-pressed={active}
                  aria-label={`Show project ${sequenceNumber(index)}: ${project.title}`}
                  data-observatory-project={project.slug}
                  data-active={active ? "true" : "false"}
                  onClick={() => onSelectProject(project)}
                  onKeyDown={(event) => moveProjectFocus(event, index)}
                >
                  <span className={styles.nodeIndex}>{sequenceNumber(index)}</span>
                  <span className={styles.nodeCopy}>
                    <span className={styles.nodeTitle}>{project.title}</span>
                    <span className={styles.nodeType}>{project.systemType}</span>
                  </span>
                  <span className={styles.nodeAction} aria-hidden="true">
                    OPEN SYSTEM
                  </span>
                  <span className={styles.nodeProgress} aria-hidden="true">
                    <span />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileSystemIndex({
  lens,
  activeProject,
  indexId,
  hidden,
  onSelectProject,
  onClose,
}: Omit<SystemNavigatorProps, "reducedMotion"> & {
  indexId: string;
  hidden: boolean;
  onClose: () => void;
}) {
  const projectRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectFromIndex = (project: ObservatoryProjectView) => {
    onSelectProject(project);
    onClose();
  };

  const moveIndexFocus = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const nextIndex = getNavigationTargetIndex(event.key, index, lens.projects.length);
    if (nextIndex === null) return;
    event.preventDefault();
    onSelectProject(lens.projects[nextIndex]);
    projectRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      id={indexId}
      className={styles.mobileSystemIndex}
      data-mobile-system-index
      hidden={hidden}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      {lens.projects.map((project, index) => {
        const active = project.slug === activeProject.slug;
        return (
          <button
            key={project.slug}
            ref={(node) => {
              projectRefs.current[index] = node;
            }}
            type="button"
            className={styles.mobileIndexItem}
            aria-current={active ? "true" : undefined}
            aria-label={`Select project ${sequenceNumber(index)}: ${project.title}`}
            data-mobile-project={project.slug}
            data-active={active ? "true" : "false"}
            onClick={() => selectFromIndex(project)}
            onKeyDown={(event) => moveIndexFocus(event, index)}
          >
            <span className={styles.mobileIndexNumber}>{sequenceNumber(index)}</span>
            <span className={styles.mobileIndexCopy}>
              <strong>{project.title}</strong>
              <span>{project.systemType}</span>
            </span>
            <span className={styles.mobileIndexState} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

function ProjectCommandBar({
  lens,
  activeProject,
  onSelectProject,
}: Omit<SystemNavigatorProps, "reducedMotion">) {
  const [indexOpen, setIndexOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const activeIndex = lens.projects.findIndex(({ slug }) => slug === activeProject.slug);
  const previousIndex = (activeIndex - 1 + lens.projects.length) % lens.projects.length;
  const nextIndex = (activeIndex + 1) % lens.projects.length;
  const indexId = `systems-project-index-${lens.id}`;

  const closeIndex = () => {
    setIndexOpen(false);
    requestAnimationFrame(() => toggleRef.current?.focus());
  };

  return (
    <div className={styles.mobileCommandNavigator} data-project-command-bar>
      <div className={styles.projectCommandBar}>
        <button
          type="button"
          className={styles.commandStep}
          aria-label={`Show previous project: ${lens.projects[previousIndex].title}`}
          onClick={() => onSelectProject(lens.projects[previousIndex])}
        >
          <span aria-hidden="true">&#8592;</span>
          <span>Previous</span>
        </button>
        <div className={styles.commandCurrent} aria-live="polite" data-command-current>
          <span>{formatObservatoryPosition(activeIndex, lens.projects.length)}</span>
          <strong>{activeProject.title}</strong>
        </div>
        <button
          type="button"
          className={styles.commandStep}
          aria-label={`Show next project: ${lens.projects[nextIndex].title}`}
          onClick={() => onSelectProject(lens.projects[nextIndex])}
        >
          <span aria-hidden="true">&#8594;</span>
          <span>Next</span>
        </button>
      </div>
      <button
        ref={toggleRef}
        type="button"
        className={styles.indexToggle}
        aria-expanded={indexOpen}
        aria-controls={indexId}
        onClick={() => setIndexOpen((open) => !open)}
      >
        {indexOpen ? "CLOSE SYSTEM INDEX" : "VIEW SYSTEM INDEX"}
        <span aria-hidden="true">{indexOpen ? "−" : "+"}</span>
      </button>
      <MobileSystemIndex
        lens={lens}
        activeProject={activeProject}
        indexId={indexId}
        hidden={!indexOpen}
        onSelectProject={onSelectProject}
        onClose={closeIndex}
      />
    </div>
  );
}

export function SystemNavigator(props: SystemNavigatorProps) {
  const { lens, activeProject, onSelectProject } = props;
  const activeIndex = lens.projects.findIndex(({ slug }) => slug === activeProject.slug);
  const previousIndex = (activeIndex - 1 + lens.projects.length) % lens.projects.length;
  const nextIndex = (activeIndex + 1) % lens.projects.length;

  return (
    <nav
      className={styles.navigator}
      aria-label={`${lens.label} project navigation`}
      data-system-navigator
      data-project-count={lens.projects.length}
      data-observatory-entrance
    >
      <div className={styles.navigatorHeader}>
        <span className={styles.navigatorPosition} aria-live="polite">
          {formatObservatoryPosition(activeIndex, lens.projects.length)}
        </span>
        <div className={styles.navigatorActions}>
          <button
            type="button"
            className={styles.navigatorStep}
            aria-label={`Show previous project: ${lens.projects[previousIndex].title}`}
            onClick={() => onSelectProject(lens.projects[previousIndex])}
          >
            <span aria-hidden="true">&#8592;</span> PREVIOUS
          </button>
          <button
            type="button"
            className={styles.navigatorStep}
            aria-label={`Show next project: ${lens.projects[nextIndex].title}`}
            onClick={() => onSelectProject(lens.projects[nextIndex])}
          >
            NEXT <span aria-hidden="true">&#8594;</span>
          </button>
        </div>
      </div>
      <DesktopProjectRail {...props} />
      <ProjectCommandBar
        key={lens.id}
        lens={lens}
        activeProject={activeProject}
        onSelectProject={onSelectProject}
      />
    </nav>
  );
}
