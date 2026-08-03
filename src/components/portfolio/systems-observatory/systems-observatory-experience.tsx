"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, type RefObject } from "react";

import {
  ObservatoryFooter,
  ObservatoryHeader,
  ObservatoryLensControls,
  ObservatoryPanel,
} from "@/components/portfolio/systems-observatory/systems-observatory-presentation";
import {
  INITIAL_OBSERVATORY_TAB_ID,
  type ObservatoryLensView,
  type ObservatoryProjectView,
} from "@/components/portfolio/systems-observatory/systems-observatory.config";
import {
  getProjectTransitionDirection,
  type ObservatoryDirection,
} from "@/components/portfolio/systems-observatory/systems-observatory-navigation";
import { useMotionPreference } from "@/lib/motion-preference-context";
import styles from "@/styles/portfolio/systems-observatory.module.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface SystemsObservatoryExperienceProps {
  lenses: ObservatoryLensView[];
}

interface ProjectTransitionOptions {
  activeLensId: string;
  activeProjectSlug: string;
  direction: number;
  reducedMotion: boolean;
}

function useEntranceMotion(
  rootRef: RefObject<HTMLElement | null>,
  reducedMotion: boolean,
) {
  useGSAP(
    () => {
      if (reducedMotion) return;
      const entranceTargets = gsap.utils.toArray<HTMLElement>(
        "[data-observatory-entrance]",
      );
      gsap.fromTo(
        entranceTargets,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.68,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 74%",
            once: true,
          },
        },
      );
    },
    { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );
}

function useProjectTransition(
  rootRef: RefObject<HTMLElement | null>,
  options: ProjectTransitionOptions,
) {
  const { activeLensId, activeProjectSlug, direction, reducedMotion } = options;
  const transitionReadyRef = useRef(false);

  useGSAP(
    () => {
      if (!transitionReadyRef.current) {
        transitionReadyRef.current = true;
        return;
      }
      const cover = rootRef.current?.querySelector<HTMLElement>(
        "[data-observatory-cover]",
      );
      const ghost = rootRef.current?.querySelector<HTMLElement>(
        "[data-observatory-ghost]",
      );
      const narrative = rootRef.current?.querySelector<HTMLElement>(
        "[data-observatory-narrative]",
      );
      const transitionTargets = [cover, ghost, narrative].filter(
        (target): target is HTMLElement => Boolean(target),
      );
      if (reducedMotion) {
        gsap.set(transitionTargets, { clearProps: "all" });
        return;
      }
      gsap.killTweensOf(transitionTargets);
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (cover) {
        timeline.fromTo(
          cover,
          { autoAlpha: 0.35, x: 10 * direction, scale: 0.97 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.48, clearProps: "all" },
          0,
        );
      }
      if (ghost) {
        timeline.fromTo(
          ghost,
          { autoAlpha: 0, x: -18 * direction },
          { autoAlpha: 1, x: 0, duration: 0.4, clearProps: "all" },
          0.04,
        );
      }
      if (narrative) {
        timeline.fromTo(
          narrative,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.44, clearProps: "all" },
          0.08,
        );
      }
    },
    {
      scope: rootRef,
      dependencies: [activeLensId, activeProjectSlug, direction, reducedMotion],
      revertOnUpdate: true,
    },
  );
}

export function SystemsObservatoryExperience({
  lenses,
}: SystemsObservatoryExperienceProps) {
  const initialLens =
    lenses.find(({ id }) => id === INITIAL_OBSERVATORY_TAB_ID) ?? lenses[0];
  const [activeLens, setActiveLens] = useState(initialLens);
  const [activeProject, setActiveProject] = useState(initialLens.projects[0]);
  const [transitionDirection, setTransitionDirection] = useState(1);
  const [gestureHintVisible, setGestureHintVisible] = useState(true);
  const rootRef = useRef<HTMLElement>(null);
  const { effective } = useMotionPreference();
  const reducedMotion = effective === "reduced";

  useEntranceMotion(rootRef, reducedMotion);
  useProjectTransition(
    rootRef,
    {
      activeLensId: activeLens.id,
      activeProjectSlug: activeProject.slug,
      direction: transitionDirection,
      reducedMotion,
    },
  );

  const activateLens = (lens: ObservatoryLensView) => {
    setTransitionDirection(1);
    setActiveLens(lens);
    setActiveProject(lens.projects[0]);
    dismissGestureHint();
  };

  const dismissGestureHint = () => {
    setGestureHintVisible(false);
  };

  const selectProject = (project: ObservatoryProjectView) => {
    if (project.slug === activeProject.slug) return;
    const currentIndex = activeLens.projects.findIndex(
      ({ slug }) => slug === activeProject.slug,
    );
    const nextIndex = activeLens.projects.findIndex(({ slug }) => slug === project.slug);
    setTransitionDirection(
      getProjectTransitionDirection(currentIndex, nextIndex, activeLens.projects.length),
    );
    setActiveProject(project);
    dismissGestureHint();
  };

  const navigateProject = (direction: ObservatoryDirection) => {
    const activeIndex = activeLens.projects.findIndex(
      ({ slug }) => slug === activeProject.slug,
    );
    const nextIndex =
      (activeIndex + direction + activeLens.projects.length) % activeLens.projects.length;
    selectProject(activeLens.projects[nextIndex]);
  };

  return (
    <section
      ref={rootRef}
      id="work"
      className={styles.section}
      aria-labelledby="systems-observatory-heading"
      data-systems-observatory
      data-reduced-motion={reducedMotion ? "true" : "false"}
    >
      <span id="selected-systems" className={styles.compatibilityAnchor} aria-hidden="true" />
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.shell}>
        <ObservatoryHeader />
        <ObservatoryLensControls
          lenses={lenses}
          activeLens={activeLens}
          reducedMotion={reducedMotion}
          onActivate={activateLens}
        />
        <ObservatoryPanel
          lenses={lenses}
          lens={activeLens}
          project={activeProject}
          reducedMotion={reducedMotion}
          gestureHintVisible={gestureHintVisible}
          onSelectProject={selectProject}
          onNavigateProject={navigateProject}
        />
        <ObservatoryFooter />
      </div>
    </section>
  );
}
