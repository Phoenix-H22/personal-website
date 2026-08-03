import type { ProjectCaseStudyDto } from "@/lib/portfolio/projects/schemas";

export const smartVendingFixture: ProjectCaseStudyDto = {
  id: "smart-vending-medication-dispensing",
  slug: "smart-vending-medication-dispensing",
  title: "Smart Vending Infrastructure",
  shortTitle: "Smart Vending",
  subtitle: "IoT dispensing · payments · device control",
  summary:
    "API-driven dispensing platform connecting dashboards, QR flows, payments, machine controllers, and real-world release actions.",
  status: "completed",
  publicationStatus: "published",
  visibility: "public",
  confidentiality: "public-limited",
  period: { start: null, end: null },
  domains: ["iot", "payments"],
  roles: ["backend", "integrations"],
  platforms: ["api", "device", "web"],
  technologies: ["Laravel", "Python", "React.js", "MQTT", "Redis", "PostgreSQL"],
  ownershipSummary:
    "API workflows from request through payment, MQTT control, and physical dispensing",
  featured: true,
  homepageOrder: 3,
  workOrder: 3,
  cover: null,
  visualTheme: {
    id: "smart-vending",
    primary: "green",
    secondary: "cyan",
    motif: "scan-pay-release",
    coverType: "vending-device-flow",
    homepageCategory: "iot",
  },
  caseStudyAvailable: false,
  problem:
    "Payment confirmation and API trust boundaries had to map safely onto physical machine release without brittle device coupling.",
  ownership:
    "API workflows from request through payment, MQTT control, and physical dispensing",
  constraints: [
    "Physical release depends on verified payment and API state",
    "Device controllers sit behind an MQTT control boundary",
    "Client-confidential implementation details",
  ],
  metrics: [],
  links: [],
  gallery: [],
  blocks: [
    {
      id: "overview",
      type: "overview",
      order: 1,
      publicationStatus: "published",
      heading: "Overview",
      body: "An API-driven dispensing platform connecting dashboards, QR flows, payments, machine controllers, and real-world release actions.",
    },
    {
      id: "workflow",
      type: "workflow",
      order: 2,
      publicationStatus: "published",
      heading: "Scan → pay → release",
      body: "QR request flows lead into API validation and payment state, then MQTT-backed device commands trigger dispense confirmation.",
    },
  ],
  seo: {
    title: "Smart Vending Infrastructure — Abdalrhman M. Alkady",
    description:
      "API-driven dispensing infrastructure connecting QR flows, payments, MQTT control, and physical release.",
    canonicalPath: "/work/smart-vending-medication-dispensing",
    robots: { index: true, follow: true },
    structuredDataType: "SoftwareApplication",
    modifiedAt: "2026-07-23",
  },
  updatedAt: "2026-07-23",
  relatedSlugs: ["nabd-messaging-platform", "virtual-clinic-dr-robot"],
};
