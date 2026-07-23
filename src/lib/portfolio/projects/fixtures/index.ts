import { merchantOperationsFixture } from "@/lib/portfolio/projects/fixtures/merchant-operations";
import { nabdMessagingFixture } from "@/lib/portfolio/projects/fixtures/nabd-messaging";
import { smartVendingFixture } from "@/lib/portfolio/projects/fixtures/smart-vending";
import { virtualClinicFixture } from "@/lib/portfolio/projects/fixtures/virtual-clinic";
import type { ProjectCaseStudyDto } from "@/lib/portfolio/projects/schemas";

/** Approved S2A homepage featured set — order is homepageOrder. */
export const featuredProjectFixtures: ProjectCaseStudyDto[] = [
  merchantOperationsFixture,
  nabdMessagingFixture,
  smartVendingFixture,
  virtualClinicFixture,
];
