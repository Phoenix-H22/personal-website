import type { CanonicalProjectSlug } from "@/lib/portfolio/projects/canonical-projects";
import type {
  FeaturedProjectDto,
  PublicOwnershipType,
} from "@/lib/portfolio/projects/types";

export type TechnologyInsightCategory =
  | "backend"
  | "database"
  | "messaging"
  | "device"
  | "interface"
  | "infrastructure";

export interface TechnologyInsight {
  sentence: string;
  label?: string;
  category?: TechnologyInsightCategory;
}

export const SYSTEMS_OBSERVATORY_TECHNOLOGY_INSIGHTS: Partial<
  Record<CanonicalProjectSlug, Readonly<Record<string, TechnologyInsight>>>
> = {
  "smart-lockers-platform": {
    "Laravel 11": {
      sentence:
        "The orchestration layer where tenant rules, command lifecycles, API contracts, and device state meet.",
      category: "backend",
    },
    "PHP 8.2": {
      sentence:
        "The runtime beneath the reusable API boundary and queued command-processing workflow.",
      category: "backend",
    },
    Python: {
      sentence:
        "Machine-side integration supports the boundary between cloud workflows and locker hardware.",
      category: "device",
    },
  },
  "warqah-store": {
    "Laravel 12": {
      sentence:
        "Keeps orders, stock, payment, and fulfillment state consistent while commercial activity moves.",
      category: "backend",
    },
    "Laravel Sanctum": {
      sentence:
        "Protects authenticated application access around production commerce operations.",
      category: "infrastructure",
    },
    Redis: {
      sentence:
        "Backs queue-processing flows that keep high-activity sales operations moving reliably.",
      category: "database",
    },
  },
  "your-obour-guide": {
    "Laravel 10": {
      sentence:
        "Connects the city-data pipeline, administration platform, media workflow, and public product surfaces.",
      category: "backend",
    },
    Flutter: {
      sentence:
        "Carries the city-discovery experience into the mobile product and its store-release path.",
      category: "interface",
    },
    "Next.js": {
      sentence:
        "Presents the public web surface of the same founder-built place-discovery ecosystem.",
      category: "interface",
    },
  },
  "autopay-eg": {
    "Laravel 11": {
      sentence:
        "Coordinates transfer detection, invoice matching, confirmation, webhooks, and merchant notification.",
      category: "backend",
    },
    "Vue 3": {
      sentence:
        "Makes merchant payment state and confirmation activity legible inside the product interface.",
      category: "interface",
    },
    "Inertia.js": {
      sentence:
        "Joins the merchant interface to the payment-automation application without splitting product state.",
      category: "interface",
    },
  },
  nabd: {
    "Laravel 10": {
      sentence:
        "Owns tenant-scoped business orchestration across channels, workers, retries, and callbacks.",
      category: "backend",
    },
    "Node.js": {
      sentence:
        "Runs independent channel execution services behind the messaging platform boundary.",
      category: "messaging",
    },
    "Express.js": {
      sentence:
        "Exposes the focused service boundary used by external messaging execution workflows.",
      category: "messaging",
    },
  },
  "wasfaty-smart-vending": {
    "Laravel 9": {
      sentence:
        "Coordinates prescription validation, eligibility, stock, dispensing authorization, and callbacks.",
      category: "backend",
    },
    "PHP 8": {
      sentence:
        "Runs the healthcare orchestration layer that stays separate from machine execution.",
      category: "backend",
    },
    Filament: {
      sentence:
        "Supports the operational administration surface around prescription-to-dispensing workflows.",
      category: "interface",
    },
  },
  "alzahaby-loyalty-app": {
    "Laravel 13": {
      sentence:
        "Validates QR interactions, protects points-ledger changes, and coordinates reward redemption.",
      category: "backend",
    },
    "PHP 8.3": {
      sentence:
        "Runs the server-side validation boundary behind loyalty and rewards activity.",
      category: "backend",
    },
    Flutter: {
      sentence:
        "Delivers the customer loyalty experience across the verified iOS and Android releases.",
      category: "interface",
    },
  },
};

const OWNERSHIP_SCOPE_LABELS: Record<PublicOwnershipType, string> = {
  "founder-built": "Independent product",
  "built-entirely": "Built the system",
  "backend-devops-owner": "Backend & DevOps",
  "technical-owner": "Backend work",
  "lead-developer": "Primary developer",
  "major-contributor": "Contributor",
};

export function getTechnologyInsight(
  projectSlug: string,
  technology: string,
): TechnologyInsight | null {
  const projectInsights = SYSTEMS_OBSERVATORY_TECHNOLOGY_INSIGHTS[
    projectSlug as CanonicalProjectSlug
  ];
  return projectInsights?.[technology] ?? null;
}

export function getOwnershipScope(
  project: Pick<
    FeaturedProjectDto,
    "role" | "ownershipType" | "strongestCapability"
  >,
): string {
  return `Ownership scope: ${OWNERSHIP_SCOPE_LABELS[project.ownershipType]}. Role: ${project.role}. Strongest responsibility: ${project.strongestCapability}.`;
}
