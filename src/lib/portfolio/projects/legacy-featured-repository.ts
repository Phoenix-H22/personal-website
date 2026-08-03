import { LocalProjectRepository } from "@/lib/portfolio/projects/local-repository";

let repository: LocalProjectRepository | null = null;

/** Temporary compatibility adapter for the unchanged pre-Phase-C V2 section. */
export function getLegacyFeaturedProjectRepository(): LocalProjectRepository {
  if (!repository) repository = new LocalProjectRepository();
  return repository;
}
