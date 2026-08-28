import { ProjectsOrbit } from "@/components/portfolio/projects-orbit/projects-orbit";

/**
 * Keep the systems map in this layout so listing ↔ dossier URL changes never
 * remount it. Child pages only swap JSON-LD; the overlay reads the pathname.
 */
export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ProjectsOrbit />
      {children}
    </>
  );
}
