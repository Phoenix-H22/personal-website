import type { ProjectCaseStudyDto } from "@/lib/portfolio/projects/schemas";

export const virtualClinicFixture: ProjectCaseStudyDto = {
  id: "virtual-clinic-dr-robot",
  slug: "virtual-clinic-dr-robot",
  title: "Virtual Clinic / Dr. Robot",
  shortTitle: "Virtual Clinic",
  subtitle: "Graduation capstone · AI clinic system",
  summary:
    "AI-powered virtual clinic combining web, mobile, backend, and hardware components.",
  status: "completed",
  publicationStatus: "published",
  visibility: "public",
  confidentiality: "public-limited",
  period: { start: null, end: "2025-08", label: "Through Aug 2025" },
  domains: ["ai", "healthcare", "mobile", "hardware"],
  roles: ["product", "full-stack"],
  platforms: ["web", "mobile", "device"],
  technologies: ["Laravel", "Flutter", "Vue.js", "Python", "Raspberry Pi"],
  ownershipSummary:
    "Product and system ownership across web, mobile, backend, and hardware interaction screens",
  strongestProof: {
    id: "capstone-grade",
    value: "A+",
    label: "graduation capstone grade",
    context: "Distinct from cumulative A-grade with Honors",
    evidenceStatus: "source-supported",
    public: true,
  },
  featured: true,
  homepageOrder: 4,
  workOrder: 4,
  cover: null,
  visualTheme: {
    id: "virtual-clinic",
    primary: "violet",
    secondary: "cyan",
    motif: "clinic-flow",
  },
  caseStudyAvailable: false,
  problem:
    "A graduation project needed a coherent clinic experience spanning web, mobile, backend, and Raspberry Pi interaction without treating the system as a medical authority.",
  ownership:
    "Product and system ownership across web, mobile, backend, and hardware interaction screens",
  constraints: [
    "Graduation / academic project context",
    "Privacy-safe presentation required",
    "Not a clinical diagnosis or treatment product",
  ],
  metrics: [
    {
      id: "capstone-grade",
      value: "A+",
      label: "graduation capstone grade",
      context: "Distinct from cumulative A-grade with Honors",
      evidenceStatus: "source-supported",
      public: true,
    },
  ],
  links: [],
  gallery: [],
  blocks: [
    {
      id: "overview",
      type: "overview",
      order: 1,
      publicationStatus: "published",
      heading: "Overview",
      body: "An academic AI-assisted virtual clinic system combining web, mobile, backend, and hardware components for a guided clinic experience.",
    },
    {
      id: "outcome",
      type: "outcome",
      order: 2,
      publicationStatus: "published",
      heading: "Outcome",
      body: "Graded A+ as a graduation capstone — separate from the cumulative A-grade with Honors credential.",
    },
  ],
  seo: {
    title: "Virtual Clinic / Dr. Robot — Abdalrhman Alkady",
    description:
      "Graduation capstone: AI-assisted virtual clinic across web, mobile, backend, and hardware.",
    canonicalPath: "/work/virtual-clinic-dr-robot",
    robots: { index: true, follow: true },
    structuredDataType: "SoftwareApplication",
    modifiedAt: "2026-07-23",
  },
  updatedAt: "2026-07-23",
  relatedSlugs: ["smart-vending-medication-dispensing"],
};
