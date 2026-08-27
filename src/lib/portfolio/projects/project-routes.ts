import {
  CANONICAL_PROJECT_SLUGS,
  isCanonicalProjectSlug,
  type CanonicalProjectSlug,
} from "@/lib/portfolio/projects/canonical-projects";

export const PROJECTS_INDEX_PATH = "/projects";

export function projectPath(slug: string): `/projects/${string}` {
  return `/projects/${slug}`;
}

export function allProjectPaths(): readonly `/projects/${string}`[] {
  return CANONICAL_PROJECT_SLUGS.map((slug) => projectPath(slug));
}

export function projectSlugFromPathname(
  pathname: string,
): CanonicalProjectSlug | null {
  const match = /^\/projects\/([^/]+)\/?$/.exec(pathname);
  if (!match) return null;
  return isCanonicalProjectSlug(match[1]) ? match[1] : null;
}
