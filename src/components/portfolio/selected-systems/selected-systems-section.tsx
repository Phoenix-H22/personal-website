import { getProjectRepository } from "@/lib/portfolio/projects";
import { SelectedSystemsExperience } from "@/components/portfolio/selected-systems/selected-systems-experience";
import { toSelectedSystemCard } from "@/components/portfolio/selected-systems/selected-system-types";

const FLAGSHIP_ID = "merchant-operations-salla-automation";
const EXPECTED_ORDER = [
  "merchant-operations-salla-automation",
  "nabd-messaging-platform",
  "smart-vending-medication-dispensing",
  "virtual-clinic-dr-robot",
] as const;

/**
 * Server section — loads featured projects via repository only.
 */
export async function SelectedSystemsSection() {
  const repo = getProjectRepository();
  const featured = await repo.getFeaturedProjects();

  const ordered = EXPECTED_ORDER.map((id) =>
    featured.find((project) => project.id === id),
  ).filter(Boolean);

  if (ordered.length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.error("[SelectedSystems] No featured projects returned");
    }
    return null;
  }

  const flagship = ordered.find((project) => project?.id === FLAGSHIP_ID);
  if (!flagship) {
    if (process.env.NODE_ENV === "development") {
      console.error("[SelectedSystems] Flagship missing — not promoting another project");
    }
    return null;
  }

  const cards = ordered
    .filter((project): project is NonNullable<typeof project> => !!project)
    .map(toSelectedSystemCard);

  // Safety: never ship Wasfaty / Theqah association strings
  const serialized = JSON.stringify(cards);
  if (/wasfaty|theqah/i.test(serialized)) {
    if (process.env.NODE_ENV === "development") {
      console.error("[SelectedSystems] Blocked unsafe publication string");
    }
    return null;
  }

  return <SelectedSystemsExperience projects={cards} />;
}
