import { FEATURED_PROJECT_SLUGS } from "@/lib/portfolio/projects/canonical-projects";
import type { CanonicalProjectSlug } from "@/lib/portfolio/projects/canonical-projects";
import type { FeaturedProjectDto } from "@/lib/portfolio/projects/types";

export type ObservatoryTabId = "signature" | "mine" | "operate";
export type ObservatoryAccent = "cyan" | "blue" | "violet" | "amber" | "green";

interface ObservatoryProjectFrame {
  slug: CanonicalProjectSlug;
  storyAngle: string;
  statement?: string;
  accent: ObservatoryAccent;
}

export interface ObservatoryTabConfig {
  id: ObservatoryTabId;
  index: "01" | "02" | "03";
  label: string;
  signalLine: string;
  countLabel: string;
  description: string;
  projects: readonly ObservatoryProjectFrame[];
}

export interface ObservatoryProjectView extends FeaturedProjectDto {
  storyAngle: string;
  statement: string | null;
  accent: ObservatoryAccent;
}

export interface ObservatoryLensView extends Omit<ObservatoryTabConfig, "projects"> {
  projects: ObservatoryProjectView[];
}

export const SYSTEMS_OBSERVATORY_TABS = [
  {
    id: "signature",
    index: "01",
    label: "THE SIGNATURE SYSTEMS",
    signalLine: "7 FLAGSHIP BUILDS",
    countLabel: "7 FLAGSHIP BUILDS",
    description: "The systems that best represent how I think, build, and deliver.",
    projects: [
      {
        slug: "smart-lockers-platform",
        storyAngle: "Reusable platform architecture connecting business systems to real machines.",
        statement:
          "I was asked to build one integration. I designed the platform every future integration could use.",
        accent: "cyan",
      },
      {
        slug: "warqah-store",
        storyAngle: "Revenue-critical commerce reliability across orders, stock, payments, and fulfillment.",
        statement:
          "When orders, inventory, payments, and shipping all move at once, reliability becomes the product.",
        accent: "amber",
      },
      {
        slug: "your-obour-guide",
        storyAngle: "Founder ownership across product, brand, backend, mobile, web, and release.",
        statement:
          "I did not inherit the product. I created the product, the brand, the platform, and the release path.",
        accent: "violet",
      },
      {
        slug: "autopay-eg",
        storyAngle: "Payment-confirmation infrastructure turned into a founder-built merchant SaaS.",
        statement:
          "The buyer pays outside the system. The platform makes confirmation reliable inside it.",
        accent: "blue",
      },
      {
        slug: "nabd",
        storyAngle: "A messaging API evolved into a multi-service, multi-channel production platform.",
        accent: "green",
      },
      {
        slug: "wasfaty-smart-vending",
        storyAngle: "Healthcare orchestration kept cleanly separate from physical machine execution.",
        accent: "cyan",
      },
      {
        slug: "alzahaby-loyalty-app",
        storyAngle: "Cross-platform loyalty built around server-validated QR and points workflows.",
        accent: "blue",
      },
    ],
  },
  {
    id: "mine",
    index: "02",
    label: "MINE, END TO END",
    signalLine: "FOUNDER-BUILT / ZERO TO PRODUCTION",
    countLabel: "3 FOUNDER-BUILT PRODUCTS",
    description: "Products I conceived, designed, built, launched, and operated from zero.",
    projects: [
      {
        slug: "your-obour-guide",
        storyAngle: "Concept, identity, architecture, data, mobile, web, infrastructure, and release ownership.",
        statement:
          "From local problem to product ecosystem, every major product and engineering decision was mine.",
        accent: "violet",
      },
      {
        slug: "autopay-eg",
        storyAngle: "A real merchant problem shaped into product strategy, software, integrations, and operations.",
        statement:
          "I identified the problem, designed the business, built every product layer, and operated the result.",
        accent: "blue",
      },
      {
        slug: "nabd",
        storyAngle: "Founder-led evolution from reusable API to multi-channel commerce messaging SaaS.",
        statement:
          "I conceived the platform, built its service boundaries, and evolved it through production use.",
        accent: "green",
      },
    ],
  },
  {
    id: "operate",
    index: "03",
    label: "BUILT TO OPERATE",
    signalLine: "PRODUCTION / SCALE / DEVICES / INTEGRATIONS",
    countLabel: "6 PRODUCTION SYSTEMS",
    description:
      "Production systems engineered for real businesses, real devices, real money, and real failure states.",
    projects: [
      {
        slug: "smart-lockers-platform",
        storyAngle: "Queued command lifecycles, MQTT delivery, device recovery, and webhook reconciliation.",
        accent: "cyan",
      },
      {
        slug: "warqah-store",
        storyAngle: "Redis-backed operations protecting inventory, payments, shipping, and commercial scale.",
        accent: "amber",
      },
      {
        slug: "autopay-eg",
        storyAngle: "Concurrency-safe matching, idempotent events, queues, and reliable merchant notification.",
        accent: "blue",
      },
      {
        slug: "nabd",
        storyAngle: "Tenant-scoped orchestration across channel services, workers, retries, and callbacks.",
        accent: "green",
      },
      {
        slug: "wasfaty-smart-vending",
        storyAngle: "Prescription validation reconciled with stock, machine callbacks, and physical dispensing.",
        accent: "cyan",
      },
      {
        slug: "alzahaby-loyalty-app",
        storyAngle: "Race-safe QR validation, transactional points, rewards, and production mobile operations.",
        accent: "violet",
      },
    ],
  },
] as const satisfies readonly ObservatoryTabConfig[];

export const INITIAL_OBSERVATORY_TAB_ID: ObservatoryTabId = "signature";

export function getObservatoryTabId(tabId: ObservatoryTabId): string {
  return `systems-observatory-tab-${tabId}`;
}

export function getObservatoryPanelId(tabId: ObservatoryTabId): string {
  return `systems-observatory-panel-${tabId}`;
}

export function buildSystemsObservatoryLenses(
  featuredProjects: FeaturedProjectDto[],
): ObservatoryLensView[] {
  const receivedOrder = featuredProjects.map(({ slug }) => slug);
  if (receivedOrder.join("|") !== FEATURED_PROJECT_SLUGS.join("|")) {
    throw new Error("Systems Observatory requires the exact featured project order");
  }

  const bySlug = new Map(featuredProjects.map((project) => [project.slug, project]));
  return SYSTEMS_OBSERVATORY_TABS.map((tab) => {
    const projects = tab.projects.map((frame) => {
      const project = bySlug.get(frame.slug);
      if (!project) throw new Error(`Missing featured project: ${frame.slug}`);
      if (tab.id === "mine" && project.ownershipType !== "founder-built") {
        throw new Error(`Mine, End to End requires founder-built ownership: ${frame.slug}`);
      }
      return {
        ...project,
        storyAngle: frame.storyAngle,
        statement: "statement" in frame ? frame.statement : null,
        accent: frame.accent,
      };
    });
    return { ...tab, projects };
  });
}
