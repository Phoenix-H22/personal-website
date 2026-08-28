"use client";

import { usePathname } from "next/navigation";

import { projectSlugFromPathname } from "@/lib/portfolio/projects/project-routes";

/**
 * Intercepted dossiers stay in the @modal slot after a client navigation back
 * to /projects. Hide that slot whenever the URL is not a project slug.
 */
export default function ProjectsModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (!projectSlugFromPathname(pathname)) return null;
  return children;
}
