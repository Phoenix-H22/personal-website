export const LIVING_TOOLCHAIN_PHRASES = [
  "Laravel + PHP",
  "Node.js + TypeScript",
  "Python + Automation",
  "Flutter + Dart",
  "React + Next.js",
  "Vue + Inertia",
  "Redis + Queues",
  "PostgreSQL + MySQL",
  "APIs + Webhooks",
  "Linux + Nginx",
  "MQTT + Edge Devices",
  "Shopify + WordPress",
  "Payments + Integrations",
  "OCR + Document Pipelines",
] as const;

export const LIVING_TOOLCHAIN_PAUSE_EVENT = "portfolio:pause-living-toolchain";

export const LIVING_TOOLCHAIN_PHASES = ["HOLD", "ERASE", "SWITCH", "TYPE"] as const;

export const LIVING_TOOLCHAIN_TIMING = {
  type: 45,
  erase: 28,
  hold: 1600,
  switch: 140,
  lensPause: 1900,
  initializationFallback: 120,
} as const;
