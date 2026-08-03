import { getLegacyFeaturedProjectRepository } from "@/lib/portfolio/projects/legacy-featured-repository";
import { FeaturedSystemsExperience } from "@/components/portfolio/selected-systems/selected-systems-experience";
import { toFeaturedSystemCard } from "@/components/portfolio/selected-systems/selected-system-types";

const FLAGSHIP_ID = "merchant-operations-salla-automation";
const EXPECTED_ORDER = [
  "merchant-operations-salla-automation",
  "nabd-messaging-platform",
  "smart-vending-medication-dispensing",
  "virtual-clinic-dr-robot",
] as const;

/**
 * Server section — Featured Systems via ProjectRepository only.
 */
export async function SelectedSystemsSection() {
  const repo = getLegacyFeaturedProjectRepository();
  const featured = await repo.getFeaturedProjects();

  const ordered = EXPECTED_ORDER.map((id) =>
    featured.find((project) => project.id === id),
  ).filter(Boolean);

  if (ordered.length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.error("[FeaturedSystems] No featured projects returned");
    }
    return null;
  }

  const flagship = ordered.find((project) => project?.id === FLAGSHIP_ID);
  if (!flagship) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[FeaturedSystems] Flagship missing — not promoting another project",
      );
    }
    return null;
  }

  const cards = ordered
    .filter((project): project is NonNullable<typeof project> => !!project)
    .map(toFeaturedSystemCard);

  const serialized = JSON.stringify(cards);
  if (/wasfaty|theqah/i.test(serialized)) {
    if (process.env.NODE_ENV === "development") {
      console.error("[FeaturedSystems] Blocked unsafe publication string");
    }
    return null;
  }

  return <FeaturedSystemsExperience projects={cards} />;
}
