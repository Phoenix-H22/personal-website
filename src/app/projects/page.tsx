import type { Metadata } from "next";

import { ProjectsOrbit } from "@/components/portfolio/projects-orbit/projects-orbit";
import { JsonLd } from "@/components/seo/json-ld";
import { CASE_STUDY_SLUGS } from "@/lib/portfolio/case-studies";
import { ORBIT_SYSTEMS } from "@/lib/portfolio/projects/orbit-systems";
import { getSiteUrl } from "@/lib/metadata/site";

const description =
  "A sonar systems map of 13 production systems built, owned, integrated, deployed, or operated by Abdalrhman M. Alkady.";

export const metadata: Metadata = {
  title: "Projects Orbit | Backend Systems and Product Engineering",
  description,
  alternates: { canonical: "/projects" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "Projects Orbit — Abdalrhman M. Alkady",
    description,
    url: "/projects",
    images: [{ url: "/opengraph-image", alt: "Abdalrhman M. Alkady Projects Orbit" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects Orbit — Abdalrhman M. Alkady",
    description,
    images: ["/opengraph-image"],
  },
};

export default function ProjectsReelPage() {
  const siteUrl = getSiteUrl();
  const caseStudySlugs = new Set<string>(CASE_STUDY_SLUGS);

  return (
    <>
      <ProjectsOrbit />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Projects Orbit",
          description,
          url: new URL("/projects", siteUrl).toString(),
          author: { "@type": "Person", name: "Abdalrhman M. Alkady" },
          hasPart: ORBIT_SYSTEMS.map((system) => ({
            "@type": "CreativeWork",
            name: system.name,
            url: caseStudySlugs.has(system.slug)
              ? new URL(`/projects/${system.slug}`, siteUrl).toString()
              : new URL(`/projects#${system.slug}`, siteUrl).toString(),
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Portfolio V2",
              item: new URL("/v2", siteUrl).toString(),
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Projects Orbit",
              item: new URL("/projects", siteUrl).toString(),
            },
          ],
        }}
      />
    </>
  );
}
