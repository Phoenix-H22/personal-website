"use client";

import { useRouter } from "next/navigation";

import { OrbitDossier } from "@/components/portfolio/projects-orbit/orbit-dossier";
import {
  getOrbitSystemBySlug,
  ORBIT_SYSTEMS,
} from "@/lib/portfolio/projects/orbit-systems";
import {
  PROJECTS_INDEX_PATH,
  projectPath,
} from "@/lib/portfolio/projects/project-routes";

export function OrbitDossierRoute({ slug }: { slug: string }) {
  const router = useRouter();
  const system = getOrbitSystemBySlug(slug);
  if (!system) return null;

  const nextSlug =
    ORBIT_SYSTEMS[(ORBIT_SYSTEMS.findIndex((item) => item.slug === slug) + 1) % ORBIT_SYSTEMS.length]
      .slug;

  return (
    <OrbitDossier
      system={system}
      onClose={() => router.push(PROJECTS_INDEX_PATH, { scroll: false })}
      onNext={() => router.replace(projectPath(nextSlug), { scroll: false })}
    />
  );
}
