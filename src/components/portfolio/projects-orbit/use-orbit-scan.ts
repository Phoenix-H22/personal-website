"use client";

import { useEffect, useRef, useState } from "react";

import type { ScanTarget } from "@/lib/portfolio/projects/orbit-geometry";

interface OrbitScanInput {
  /** Visible nodes in sweep order. */
  order: ScanTarget[];
  /** Identity of the current filter set; a change restarts the sweep. */
  orderKey: string;
  /** True while the sweep should hold position (hover, open dossier, auto off). */
  paused: boolean;
  /** Milliseconds the beam takes to rotate to the next node. */
  seekMs: number;
  /** Milliseconds the beam dwells on a locked node. */
  dwellMs: number;
}

export interface OrbitScanState {
  /** Cumulative sweep rotation in degrees (monotonically increasing). */
  angle: number;
  /** Slug the beam has locked onto, or null while seeking/idle. */
  acquired: string | null;
  locked: boolean;
  /** Increments each time the beam locks — used to replay ping animations. */
  ping: number;
}

const PAUSED_RETRY_MS = 350;
const EMPTY_RETRY_MS = 600;
const START_DELAY_MS = 120;

/**
 * Autonomous sweep controller. The beam rotates forward to each visible node
 * in angular order, locks on (ping), dwells, then advances. It parks while
 * paused and resets when the filtered set changes. All state writes happen in
 * timer callbacks, so the effect body stays free of synchronous setState.
 */
export function useOrbitScan(input: OrbitScanInput): OrbitScanState {
  const [angle, setAngle] = useState(0);
  const [acquired, setAcquired] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [ping, setPing] = useState(0);

  const orderRef = useRef(input.order);
  const pausedRef = useRef(input.paused);
  const seekRef = useRef(input.seekMs);
  const dwellRef = useRef(input.dwellMs);
  const cumulativeAngle = useRef(0);
  const targetIndex = useRef(-1);

  useEffect(() => {
    orderRef.current = input.order;
  }, [input.order]);
  useEffect(() => {
    pausedRef.current = input.paused;
  }, [input.paused]);
  useEffect(() => {
    seekRef.current = input.seekMs;
  }, [input.seekMs]);
  useEffect(() => {
    dwellRef.current = input.dwellMs;
  }, [input.dwellMs]);

  // Restart the acquisition order whenever the filtered set changes. Any stale
  // `acquired` slug that is no longer visible is ignored by the consumer, so we
  // only need to rewind the sweep index here.
  useEffect(() => {
    targetIndex.current = -1;
  }, [input.orderKey]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      if (cancelled) return;
      if (pausedRef.current) {
        timer = setTimeout(step, PAUSED_RETRY_MS);
        return;
      }
      const order = orderRef.current;
      if (order.length === 0) {
        timer = setTimeout(step, EMPTY_RETRY_MS);
        return;
      }

      targetIndex.current = (targetIndex.current + 1) % order.length;
      const target = order[targetIndex.current];
      const delta =
        (((target.conic - (cumulativeAngle.current % 360)) % 360) + 360) % 360 || 360;
      cumulativeAngle.current += delta;

      setAngle(cumulativeAngle.current);
      setLocked(false);
      setAcquired(null);

      timer = setTimeout(() => {
        if (cancelled) return;
        setAcquired(target.slug);
        setLocked(true);
        setPing((value) => value + 1);
        timer = setTimeout(step, dwellRef.current);
      }, seekRef.current);
    };

    timer = setTimeout(step, START_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return { angle, acquired, locked, ping };
}
