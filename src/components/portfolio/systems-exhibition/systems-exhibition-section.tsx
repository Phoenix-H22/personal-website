import { getInventoryProjectRepository } from "@/lib/portfolio/projects/inventory";
import { SystemsExhibitionExperience } from "@/components/portfolio/systems-exhibition/systems-exhibition-experience";

/**
 * Server section — Systems Exhibition, driven by typed config rather than
 * pathname. Not mounted on a route today: `showSystemsExhibition` currently
 * renders SystemsObservatorySection instead.
 */
export function SystemsExhibitionSection() {
  const projects = getInventoryProjectRepository().getExhibitionProjects();

  if (projects.length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.error("[SystemsExhibition] No exhibition projects returned");
    }
    return null;
  }

  const payload = JSON.stringify(projects);
  if (
    /portfolio-private|D:\\\\|C:\\\\|X-Amz-Signature|cover-approved-original/i.test(
      payload,
    )
  ) {
    if (process.env.NODE_ENV === "development") {
      console.error("[SystemsExhibition] Blocked private path leakage");
    }
    return null;
  }

  return <SystemsExhibitionExperience projects={projects} />;
}
