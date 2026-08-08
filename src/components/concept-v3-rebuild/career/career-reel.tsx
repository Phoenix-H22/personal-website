"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import type { CareerEra, ExperienceEntry } from "@/content/experience";
import { useMotionPreference } from "@/lib/motion-preference-context";
import { CareerIndependentTrack } from "./career-independent-track";
import { CareerReelTrack } from "./career-reel-track";
import { ExperienceStory } from "./experience-story";
import styles from "@/styles/concept-v3-rebuild/career-reel.module.scss";

gsap.registerPlugin(useGSAP);

type Path = "main" | "independent";

interface CareerReelProps {
  eras: CareerEra[];
  primary: ExperienceEntry[];
  independent: ExperienceEntry[];
}

const DEFAULT_ID = "kayanac-erp-rejoin";

function indexOf(list: ExperienceEntry[], id: string) {
  return list.findIndex((entry) => entry.id === id);
}

export function CareerReel({ eras, primary, independent }: CareerReelProps) {
  const { effective } = useMotionPreference();
  const reduced = effective === "reduced";
  const labelId = useId();

  const [activeId, setActiveId] = useState(DEFAULT_ID);
  const [displayId, setDisplayId] = useState(DEFAULT_ID);
  const [path, setPath] = useState<Path>("main");
  const [displayPath, setDisplayPath] = useState<Path>("main");

  const transitioning = useRef(false);
  const pending = useRef<{ id: string; path: Path } | null>(null);
  const selectRef = useRef<(id: string) => void>(() => undefined);

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<HTMLDivElement>(null);
  const outgoingRef = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());

  const catalog = useMemo(() => {
    const map = new Map<string, ExperienceEntry>();
    for (const entry of [...primary, ...independent]) map.set(entry.id, entry);
    return map;
  }, [independent, primary]);

  const displayEntry = catalog.get(displayId) ?? catalog.get(DEFAULT_ID)!;
  const [bufferEntry, setBufferEntry] = useState(displayEntry);
  const [bufferPath, setBufferPath] = useState<Path>(displayPath);

  const mainEras = useMemo(
    () => eras.filter((era) => era.id !== "independent-track"),
    [eras],
  );

  const eraLabel =
    displayPath === "independent"
      ? "Freelance"
      : displayEntry.isCurrent
        ? "Current role"
        : mainEras.find((era) => era.id === displayEntry.era)?.title;

  const registerNode = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  }, []);

  const centerNode = useCallback(
    (id: string) => {
      const node = nodeRefs.current.get(id);
      const scroller = scrollRef.current;
      if (!node || !scroller) return;
      if (scroller.dataset.overflowing === "false") {
        scroller.scrollLeft = 0;
        return;
      }

      const align = () => {
        const nodeRect = node.getBoundingClientRect();
        const scrollerRect = scroller.getBoundingClientRect();
        const delta =
          nodeRect.left +
          nodeRect.width / 2 -
          (scrollerRect.left + scrollerRect.width / 2);
        if (Math.abs(delta) < 1) return;
        const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
        const target = Math.min(Math.max(0, scroller.scrollLeft + delta), max);
        scroller.scrollTo({
          left: target,
          behavior: reduced ? "auto" : "smooth",
        });
      };

      align();
      requestAnimationFrame(align);
    },
    [reduced],
  );

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const measure = () => {
      const track = scroller.querySelector<HTMLElement>("[data-film-track]");
      if (!track) return;
      const nodes = [
        ...track.querySelectorAll<HTMLElement>("[data-company-node]"),
      ];
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;

      const contentWidth =
        last.offsetLeft + last.offsetWidth - first.offsetLeft;
      // Compare against the fit-mode content box (not snap-padding mode),
      // so mode flips stay stable and don't lock into left-heavy scroll padding.
      const fitPad = 48;
      const available = Math.max(0, scroller.clientWidth - fitPad);
      const overflowing = contentWidth > available + 2;
      const wasOverflowing = scroller.dataset.overflowing === "true";
      scroller.dataset.overflowing = overflowing ? "true" : "false";
      if (!overflowing) scroller.scrollLeft = 0;
      if (wasOverflowing !== overflowing) {
        // Padding mode changed — one follow-up measure after layout settles.
        requestAnimationFrame(() => {
          const route = track.querySelector<HTMLElement>("[data-route-line]");
          if (!route || !first || !last) return;
          const trackRect = track.getBoundingClientRect();
          const firstRect = first.getBoundingClientRect();
          const lastRect = last.getBoundingClientRect();
          const left =
            firstRect.left + firstRect.width / 2 - trackRect.left;
          const right =
            lastRect.left + lastRect.width / 2 - trackRect.left;
          route.style.left = `${left}px`;
          route.style.width = `${Math.max(0, right - left)}px`;
          route.style.right = "auto";
        });
        return;
      }

      const route = track.querySelector<HTMLElement>("[data-route-line]");
      if (route) {
        const trackRect = track.getBoundingClientRect();
        const firstRect = first.getBoundingClientRect();
        const lastRect = last.getBoundingClientRect();
        const left =
          firstRect.left + firstRect.width / 2 - trackRect.left;
        const right =
          lastRect.left + lastRect.width / 2 - trackRect.left;
        route.style.left = `${left}px`;
        route.style.width = `${Math.max(0, right - left)}px`;
        route.style.right = "auto";
      }
    };

    measure();
    const ro = new ResizeObserver(() => {
      measure();
    });
    ro.observe(scroller);
    const track = scroller.querySelector("[data-film-track]");
    if (track) ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [primary]);

  const runTransition = useCallback(
    (nextId: string, nextPath: Path) => {
      if (nextId === displayId && nextPath === displayPath) {
        if (nextPath === "main") centerNode(nextId);
        return;
      }
      if (transitioning.current) {
        pending.current = { id: nextId, path: nextPath };
        return;
      }

      const nextEntry = catalog.get(nextId);
      if (!nextEntry) return;

      const fromIndex =
        displayPath === "main" ? indexOf(primary, displayId) : -1;
      const toIndex = nextPath === "main" ? indexOf(primary, nextId) : -1;
      const forward =
        nextPath === "independent"
          ? true
          : displayPath === "independent"
            ? false
            : toIndex >= fromIndex;

      const prevId = displayId;
      const prevPath = displayPath;

      setActiveId(nextId);
      setPath(nextPath);
      setBufferEntry(catalog.get(displayId) ?? displayEntry);
      setBufferPath(displayPath);
      if (nextPath === "main") centerNode(nextId);

      if (reduced || !outgoingRef.current || !incomingRef.current) {
        setDisplayId(nextId);
        setDisplayPath(nextPath);
        setBufferEntry(nextEntry);
        setBufferPath(nextPath);
        return;
      }

      transitioning.current = true;
      gsap.killTweensOf(
        [
          outgoingRef.current,
          incomingRef.current,
          signalRef.current,
        ].filter(Boolean),
      );

      setDisplayId(nextId);
      setDisplayPath(nextPath);

      requestAnimationFrame(() => {
        const out = outgoingRef.current;
        const inn = incomingRef.current;
        const signal = signalRef.current;
        if (!out || !inn) {
          transitioning.current = false;
          return;
        }

        const isIndieHop =
          nextPath !== prevPath || nextPath === "independent";
        const xOut = isIndieHop ? 0 : forward ? -18 : 18;
        const yOut = isIndieHop ? (nextPath === "independent" ? -8 : 8) : forward ? -4 : 4;
        const xIn = isIndieHop ? 0 : forward ? 20 : -20;
        const yIn = isIndieHop ? (nextPath === "independent" ? 10 : -8) : 6;

        gsap.set(inn, { autoAlpha: 0, x: xIn, y: yIn });
        gsap.set(out, { autoAlpha: 1, x: 0, y: 0 });

        if (signal && nextPath === "main" && prevPath === "main") {
          const fromNode = nodeRefs.current.get(prevId);
          const toNode = nodeRefs.current.get(nextId);
          const track = fromNode?.parentElement;
          if (fromNode && toNode && track) {
            const trackRect = track.getBoundingClientRect();
            const fromRect = fromNode.getBoundingClientRect();
            const toRect = toNode.getBoundingClientRect();
            const fromX = fromRect.left + fromRect.width / 2 - trackRect.left;
            const toX = toRect.left + toRect.width / 2 - trackRect.left;
            gsap.set(signal, { x: fromX, autoAlpha: 0.9 });
            signal.dataset.toX = String(toX);
          }
        }

        const duration = Math.abs(toIndex - fromIndex) > 2 ? 0.48 : 0.62;

        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            gsap.set(inn, { clearProps: "transform,opacity" });
            gsap.set(out, { autoAlpha: 0, x: 0, y: 0 });
            if (signal) gsap.set(signal, { autoAlpha: 0 });
            transitioning.current = false;
            setBufferEntry(nextEntry);
            setBufferPath(nextPath);
            const queued = pending.current;
            pending.current = null;
            if (queued && (queued.id !== nextId || queued.path !== nextPath)) {
              requestAnimationFrame(() => selectRef.current(queued.id));
            }
          },
        });

        if (signal?.dataset.toX) {
          tl.to(
            signal,
            {
              x: Number(signal.dataset.toX),
              duration: duration * 0.65,
              ease: "power2.out",
            },
            0,
          ).to(signal, { autoAlpha: 0, duration: 0.16 }, duration * 0.5);
          delete signal.dataset.toX;
        }

        tl.to(
          out,
          {
            autoAlpha: 0,
            x: xOut,
            y: yOut,
            duration: duration * 0.5,
            ease: "power3.in",
          },
          0,
        ).to(
          inn,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: duration * 0.6,
            ease: "power3.out",
          },
          0.12,
        );

        const identity = inn.querySelector("[data-experience-story] h3");
        const ownership = inn.querySelector("[data-story-ownership]");
        const work = inn.querySelector("[data-story-work]");
        const proof = inn.querySelector("[data-story-proof]");
        const stagger = [identity, ownership, work, proof].filter(Boolean);
        if (stagger.length) {
          gsap.set(stagger, { autoAlpha: 0, y: 5 });
          tl.to(
            stagger,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.22,
              stagger: 0.045,
              ease: "power2.out",
            },
            0.16,
          );
        }
      });
    },
    [
      catalog,
      centerNode,
      displayEntry,
      displayId,
      displayPath,
      primary,
      reduced,
    ],
  );

  const selectCompany = useCallback(
    (id: string) => {
      const nextPath: Path = independent.some((entry) => entry.id === id)
        ? "independent"
        : "main";
      runTransition(id, nextPath);
    },
    [independent, runTransition],
  );

  useEffect(() => {
    selectRef.current = selectCompany;
  }, [selectCompany]);

  useEffect(() => {
    if (path === "main") centerNode(activeId);
  }, [activeId, centerNode, path]);

  const step = useCallback(
    (delta: number) => {
      if (path === "independent") {
        const index = indexOf(independent, activeId);
        const next = Math.min(
          Math.max(index + delta, 0),
          independent.length - 1,
        );
        if (independent[next]) selectCompany(independent[next].id);
        return;
      }
      const index = indexOf(primary, activeId);
      const next = Math.min(Math.max(index + delta, 0), primary.length - 1);
      if (primary[next]) selectCompany(primary[next].id);
    },
    [activeId, independent, path, primary, selectCompany],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const chapter = document.getElementById("experience");
      if (
        !chapter?.contains(document.activeElement) &&
        document.activeElement !== document.body
      ) {
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        selectCompany(primary[0]?.id ?? DEFAULT_ID);
      } else if (event.key === "End") {
        event.preventDefault();
        selectCompany(primary[primary.length - 1]?.id ?? DEFAULT_ID);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [primary, selectCompany, step]);

  useGSAP(
    () => {
      if (outgoingRef.current) gsap.set(outgoingRef.current, { autoAlpha: 0 });
      if (incomingRef.current) gsap.set(incomingRef.current, { autoAlpha: 1 });
      if (signalRef.current) gsap.set(signalRef.current, { autoAlpha: 0 });
      requestAnimationFrame(() => {
        centerNode(DEFAULT_ID);
        requestAnimationFrame(() => centerNode(DEFAULT_ID));
      });
    },
    { scope: rootRef },
  );

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) gsap.globalTimeline.pause();
      else gsap.globalTimeline.resume();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div
      ref={rootRef}
      className={styles.reel}
      data-career-reel
      data-career-filmstrip
      data-path={path}
      data-reduced={reduced ? "true" : "false"}
    >
      <p className={styles.direction} aria-hidden="true">
        Earlier → Present
      </p>

      <CareerReelTrack
        primary={primary}
        selectedId={activeId}
        path={path}
        onSelect={selectCompany}
        scrollRef={scrollRef}
        progressRef={progressRef}
        signalRef={signalRef}
        registerNode={registerNode}
      />

      <CareerIndependentTrack
        entries={independent}
        selectedId={activeId}
        path={path}
        onSelect={selectCompany}
      />

      {displayPath !== "independent" ? (
        <p className={styles.eraContext}>{eraLabel}</p>
      ) : null}

      <div
        className={[
          styles.anchor,
          path === "independent" ? styles.anchorIndependent : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        <span className={styles.anchorLine} />
      </div>

      <div
        className={styles.storyStage}
        id="career-story-panel"
        role="tabpanel"
        aria-live="polite"
        aria-labelledby={labelId}
      >
        <span id={labelId} className={styles.srOnly}>
          {displayEntry.companyShortName ?? displayEntry.company}
        </span>
        <div className={styles.storyStack}>
          <div
            ref={outgoingRef}
            className={styles.storyLayer}
            data-story="outgoing"
            aria-hidden="true"
          >
            <ExperienceStory
              entry={bufferEntry}
              path={bufferPath}
              eraLabel={
                bufferPath === "independent"
                  ? "Freelance"
                  : bufferEntry.isCurrent
                    ? "Current role"
                    : mainEras.find((era) => era.id === bufferEntry.era)?.title
              }
            />
          </div>
          <div
            ref={incomingRef}
            className={styles.storyLayer}
            data-story="incoming"
          >
            <ExperienceStory
              entry={displayEntry}
              path={displayPath}
              eraLabel={eraLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const MobileCareerReel = CareerReel;
