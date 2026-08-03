import type { ProjectCaseStudyDto } from "@/lib/portfolio/projects/schemas";

export const nabdMessagingFixture: ProjectCaseStudyDto = {
  id: "nabd-messaging-platform",
  slug: "nabd-messaging-platform",
  title: "NABD Messaging Platform",
  shortTitle: "NABD",
  subtitle: "Multi-tenant messaging · commerce automation",
  summary:
    "Multi-tenant messaging automation for e-commerce merchants across WhatsApp, Telegram, email, and webhook-triggered campaigns.",
  status: "maintained",
  publicationStatus: "published",
  visibility: "public",
  confidentiality: "public-limited",
  period: { start: null, end: null },
  domains: ["messaging", "commerce-automation"],
  roles: ["platform", "backend"],
  platforms: ["web", "api", "messaging"],
  technologies: [
    "Laravel",
    "Node.js",
    "Redis",
    "MySQL",
    "Salla APIs",
    "Zid APIs",
  ],
  ownershipSummary:
    "Multi-tenant messaging automation, WhatsApp device sessions, queues, and webhook-driven delivery",
  featured: true,
  homepageOrder: 2,
  workOrder: 2,
  cover: {
    id: "nabd-logo",
    type: "logo",
    role: "logo",
    src: "/images/nabd-logo-new.png",
    width: 1024,
    height: 1024,
    alt: "NABD Messaging Platform logo",
    sortOrder: 0,
  },
  visualTheme: {
    id: "nabd-messaging",
    primary: "blue",
    secondary: "cyan",
    motif: "message-routing",
    coverType: "messaging-router",
    homepageCategory: "messaging",
  },
  caseStudyAvailable: false,
  problem:
    "Merchants needed reliable multi-channel delivery across WhatsApp, Telegram, email, and webhook-triggered campaigns without fragile session or queue handling.",
  ownership:
    "Multi-tenant messaging automation, WhatsApp device sessions, queues, and webhook-driven delivery",
  constraints: [
    "Multi-tenant isolation",
    "Channel-specific delivery boundaries",
    "Private product internals",
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
      body: "A multi-tenant messaging automation platform supporting WhatsApp, Telegram, email, campaigns, and webhook-triggered communication.",
    },
  ],
  seo: {
    title: "NABD Messaging Platform — Abdalrhman M. Alkady",
    description:
      "Multi-tenant messaging automation across WhatsApp, Telegram, email, and webhook-triggered campaigns.",
    canonicalPath: "/work/nabd-messaging-platform",
    robots: { index: true, follow: true },
    structuredDataType: "SoftwareApplication",
    modifiedAt: "2026-07-23",
  },
  updatedAt: "2026-07-23",
  relatedSlugs: [
    "merchant-operations-salla-automation",
    "smart-vending-medication-dispensing",
  ],
};
