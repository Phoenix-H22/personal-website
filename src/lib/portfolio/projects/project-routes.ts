import {
  CANONICAL_PROJECT_SLUGS,
  isCanonicalProjectSlug,
  type CanonicalProjectSlug,
} from "@/lib/portfolio/projects/canonical-projects";

export const PROJECTS_INDEX_PATH = "/projects";

export type ProjectsLocationPath =
  | typeof PROJECTS_INDEX_PATH
  | `/projects/${string}`;

export function projectPath(slug: string): `/projects/${string}` {
  return `/projects/${slug}`;
}

function projectsHistoryState(): object {
  const current = window.history.state;
  // Next skips ACTION_RESTORE when `__NA` is set. Restore was falling through
  // to a document load when the URL changed between listing and a slug.
  if (current && typeof current === "object") {
    return { ...current, __NA: true };
  }
  return { __NA: true };
}

/**
 * Update the projects URL without asking Next to fetch a new RSC tree.
 * `router.push('/projects/[slug]')` was falling through to a document load.
 */
export function syncProjectsLocation(
  path: ProjectsLocationPath,
  mode: "push" | "replace" = "push",
): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname === path) return;
  const data = projectsHistoryState();
  if (mode === "replace") {
    window.history.replaceState(data, "", path);
    return;
  }
  window.history.pushState(data, "", path);
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
