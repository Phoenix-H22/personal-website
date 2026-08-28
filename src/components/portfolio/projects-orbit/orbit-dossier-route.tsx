"use client";

import { usePathname, useRouter } from "next/navigation";

import { OrbitDossier } from "@/components/portfolio/projects-orbit/orbit-dossier";
import {
  getOrbitSystemBySlug,
  ORBIT_SYSTEMS,
} from "@/lib/portfolio/projects/orbit-systems";
import {
  PROJECTS_INDEX_PATH,
  projectPath,
  projectSlugFromPathname,
} from "@/lib/portfolio/projects/project-routes";

interface OrbitDossierRouteProps {
  slug: string;
  /** Intercepted overlays must pop history; a listing Link leaves the slot open. */
  dismissWithBack?: boolean;
}

export function OrbitDossierRoute({ slug, dismissWithBack = false }: OrbitDossierRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const system = getOrbitSystemBySlug(slug);
  if (!system) return null;
  if (projectSlugFromPathname(pathname) !== slug) return null;

  const nextSlug =
    ORBIT_SYSTEMS[(ORBIT_SYSTEMS.findIndex((item) => item.slug === slug) + 1) % ORBIT_SYSTEMS.length]
      .slug;

  return (
    <OrbitDossier
      system={system}
      onClose={() => {
        if (dismissWithBack) router.back();
        else router.push(PROJECTS_INDEX_PATH, { scroll: false });
      }}
      onNext={() => router.replace(projectPath(nextSlug), { scroll: false })}
    />
  );
}
