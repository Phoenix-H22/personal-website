"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { useState, useSyncExternalStore } from "react";

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

const nodes = [
  {
    id: "api",
    label: "API",
    detail: "Stable contracts turn product intent into dependable behavior.",
    x: 38,
    y: 88,
    secondary: false,
  },
  {
    id: "auth",
    label: "Auth",
    detail: "Authorization is explicit at every product boundary.",
    x: 208,
    y: 43,
    secondary: true,
  },
  {
    id: "queue",
    label: "Queue",
    detail: "Slow work leaves the request path and gains retry visibility.",
    x: 208,
    y: 135,
    secondary: false,
  },
  {
    id: "database",
    label: "Database",
    detail: "Data models preserve business rules instead of hiding them.",
    x: 378,
    y: 43,
    secondary: false,
  },
  {
    id: "webhooks",
    label: "Webhooks",
    detail: "Events are validated, idempotent, and safe to replay.",
    x: 378,
    y: 135,
    secondary: false,
  },
  {
    id: "payments",
    label: "Payments",
    detail: "Money flows reconcile across external and internal state.",
    x: 208,
    y: 227,
    secondary: true,
  },
  {
    id: "mobile",
    label: "Mobile",
    detail: "The backend serves a complete product, not an isolated endpoint.",
    x: 38,
    y: 272,
    secondary: false,
  },
  {
    id: "notifications",
    label: "Notifications",
    detail: "The right operational change reaches the right person.",
    x: 378,
    y: 227,
    secondary: true,
  },
  {
    id: "ai",
    label: "AI pipeline",
    detail: "Long-running extraction stays observable and failure-aware.",
    x: 378,
    y: 319,
    secondary: false,
  },
] as const;

const paths = [
  {
    d: "M128 111 C164 111 170 66 208 66",
    secondary: true,
  },
  {
    d: "M128 111 C168 111 170 158 208 158",
    secondary: false,
  },
  {
    d: "M298 66 C330 66 338 66 378 66",
    secondary: false,
  },
  {
    d: "M298 158 C330 158 338 158 378 158",
    secondary: false,
  },
  {
    d: "M253 181 L253 227",
    secondary: true,
  },
  {
    d: "M128 295 C176 295 180 250 208 250",
    secondary: true,
  },
  {
    d: "M298 250 L378 250",
    secondary: true,
  },
  {
    d: "M468 181 L468 319",
    secondary: false,
  },
] as const;

export function SystemMap() {
  const reduceMotion = usePrefersReducedMotion();
  const [activeNode, setActiveNode] = useState<(typeof nodes)[number]>(nodes[0]);
  const pointerX = useSpring(0, { damping: 28, stiffness: 180 });
  const pointerY = useSpring(0, { damping: 28, stiffness: 180 });
  const translateX = useTransform(pointerX, [-0.5, 0.5], [-4, 4]);
  const translateY = useTransform(pointerY, [-0.5, 0.5], [-3, 3]);
  const primaryPulsePaths = paths.filter((path) => !path.secondary).slice(0, 4);

  return (
    <div
      className="system-visual"
      onPointerMove={(event) => {
        if (reduceMotion) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
        pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <motion.div
        className="system-visual__frame"
        style={reduceMotion ? undefined : { x: translateX, y: translateY }}
      >
        <div className="system-visual__header">
          <span className="technical-label">Product system / live route</span>
          <span className="system-status">Operational</span>
        </div>

        <svg
          aria-label="Interactive map of backend product capabilities"
          className="system-map"
          role="img"
          viewBox="0 0 520 390"
        >
          <g aria-hidden="true">
            {paths.map((path) => (
              <path
                className={`system-map__path${path.secondary ? " system-map__path--secondary" : ""}`}
                d={path.d}
                key={path.d}
              />
            ))}
            {!reduceMotion &&
              primaryPulsePaths.map((path, index) => (
                <motion.path
                  animate={{ pathLength: [0, 1], pathOffset: [0, 1] }}
                  className="system-map__pulse"
                  d={path.d}
                  key={`pulse-${path.d}`}
                  transition={{
                    duration: 3.6,
                    delay: index * 0.55,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              ))}
          </g>

          {nodes.map((node) => (
            <g
              aria-label={`${node.label}: ${node.detail}`}
              className={`system-node${node.secondary ? " system-node--secondary" : ""}`}
              key={node.id}
              onBlur={() => setActiveNode(nodes[0])}
              onFocus={() => setActiveNode(node)}
              onMouseEnter={() => setActiveNode(node)}
              onMouseLeave={() => setActiveNode(nodes[0])}
              role="button"
              tabIndex={0}
              transform={`translate(${node.x} ${node.y})`}
            >
              <rect height="46" rx="5" width="90" />
              <circle cx="13" cy="15" r="3" />
              <text x="23" y="19">
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        <div aria-live="polite" className="system-visual__annotation">
          <span className="technical-label">{activeNode.label}</span>
          <p>{activeNode.detail}</p>
        </div>
      </motion.div>
    </div>
  );
}
