import "server-only";

import mediaManifest from "@/lib/portfolio/projects/data/public-media-manifest.json";
import projectSnapshot from "@/lib/portfolio/projects/data/public-projects.snapshot.json";
import { PortfolioProjectRepository } from "@/lib/portfolio/projects/repository";

const repository = new PortfolioProjectRepository(projectSnapshot, mediaManifest);

export function getPortfolioProjectRepository(): PortfolioProjectRepository {
  return repository;
}
