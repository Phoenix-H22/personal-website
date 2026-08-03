import { getPortfolioProjectRepository } from "@/lib/portfolio/projects/server-only";
import type { PublicProject } from "@/lib/portfolio/projects/types";

export type SystemsFilterId =
  | "all"
  | "platforms"
  | "commerce"
  | "saas"
  | "connected-devices"
  | "integrations"
  | "mobile"
  | "ai-data";

export const SYSTEMS_FILTER_LABELS: Record<SystemsFilterId, string> = {
  all: "All",
  platforms: "Platforms",
  commerce: "Commerce",
  saas: "SaaS",
  "connected-devices": "Connected Devices",
  integrations: "Integrations",
  mobile: "Mobile",
  "ai-data": "AI / Data",
};

export type SystemsFilterGroup = Exclude<SystemsFilterId, "all">;

export interface InventoryProject {
  id: string;
  slug: string;
  title: string;
  shortTagline: string;
  keyMetrics: string | null;
  role: string;
  status: string;
  primaryCategory: string;
  filterGroup: SystemsFilterGroup;
  technologies: string[];
  website: string | null;
  cover: PublicProject["cover"];
  coverCard: PublicProject["coverCard"];
  architectureDiagram: PublicProject["architectureDiagram"];
  gallery: PublicProject["gallery"];
}

export interface SystemsFilterOption {
  id: SystemsFilterId;
  label: string;
  count: number;
}

/** Categories that map straight onto a filter group. */
const FILTER_GROUP_BY_CATEGORY: Record<string, SystemsFilterGroup> = {
  commerce: "commerce",
  integrations: "integrations",
  "connected-devices": "connected-devices",
  "mobile-products": "mobile",
  "ai-data": "ai-data",
};

const EXHIBITION_PROJECT_LIMIT = 7;
const MAX_TECHNOLOGIES_PER_CARD = 6;

function toFilterGroup(project: PublicProject): SystemsFilterGroup {
  // `platforms-saas` covers both platform work and the one standalone SaaS
  // product, so it is the only category that needs the slug to disambiguate.
  if (project.primaryCategory === "platforms-saas") {
    return project.slug === "nabd" ? "saas" : "platforms";
  }
  return FILTER_GROUP_BY_CATEGORY[project.primaryCategory] ?? "platforms";
}

function toInventoryProject(project: PublicProject): InventoryProject {
  const metric = project.verifiedMetrics[0];
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    shortTagline: project.shortTagline,
    keyMetrics: metric ? `${metric.value} ${metric.label}` : null,
    role: project.role,
    status: project.status,
    primaryCategory: project.primaryCategory,
    filterGroup: toFilterGroup(project),
    technologies: project.technologies.slice(0, MAX_TECHNOLOGIES_PER_CARD),
    website: project.links.website,
    cover: project.cover,
    coverCard: project.coverCard,
    architectureDiagram: project.architectureDiagram,
    gallery: project.gallery,
  };
}

/**
 * Read model that projects canonical records into the flatter shape the
 * Systems Exhibition and Systems Index surfaces consume.
 *
 * Neither surface is mounted on a route today — `showSystemsExhibition`
 * currently renders SystemsObservatorySection instead. Canonical records
 * still come only from PortfolioProjectRepository; this adds no data.
 */
export class InventoryProjectRepository {
  getAllProjects(): InventoryProject[] {
    return getPortfolioProjectRepository()
      .getWorkIndexProjects()
      .map(toInventoryProject);
  }

  getExhibitionProjects(limit = EXHIBITION_PROJECT_LIMIT): InventoryProject[] {
    return getPortfolioProjectRepository()
      .getFeaturedProjects()
      .slice(0, limit)
      .map(toInventoryProject);
  }

  getFilterOptions(): SystemsFilterOption[] {
    const all = this.getAllProjects();
    const counts = new Map<SystemsFilterId, number>();
    counts.set("all", all.length);
    for (const project of all) {
      counts.set(project.filterGroup, (counts.get(project.filterGroup) ?? 0) + 1);
    }
    return (Object.keys(SYSTEMS_FILTER_LABELS) as SystemsFilterId[])
      .filter((id) => (counts.get(id) ?? 0) > 0)
      .map((id) => ({
        id,
        label: SYSTEMS_FILTER_LABELS[id],
        count: counts.get(id) ?? 0,
      }));
  }
}

let singleton: InventoryProjectRepository | null = null;

export function getInventoryProjectRepository(): InventoryProjectRepository {
  if (!singleton) singleton = new InventoryProjectRepository();
  return singleton;
}
