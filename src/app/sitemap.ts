import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/metadata/site";
import { CASE_STUDY_SLUGS } from "@/lib/portfolio/case-studies";
import { CANONICAL_PROJECT_SLUGS } from "@/lib/portfolio/projects/canonical-projects";
import {
  PROJECTS_INDEX_PATH,
  projectPath,
} from "@/lib/portfolio/projects/project-routes";

const CASE_STUDY_SET = new Set<string>(CASE_STUDY_SLUGS);

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const routes = [
    { path: "/", priority: 1 },
    { path: "/v2", priority: 1 },
    { path: PROJECTS_INDEX_PATH, priority: 0.9 },
    ...CANONICAL_PROJECT_SLUGS.map((slug) => ({
      path: projectPath(slug),
      priority: CASE_STUDY_SET.has(slug) ? 0.8 : 0.7,
    })),
  ] as const;

  return routes.map(({ path, priority }) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: "monthly" as const,
    priority,
  }));
}
