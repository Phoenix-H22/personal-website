import type { Metadata } from "next";

import { isCaseStudySlug } from "@/lib/portfolio/case-studies";
import { getSiteUrl } from "@/lib/metadata/site";
import { ORBIT_SYSTEMS } from "@/lib/portfolio/projects/orbit-systems";
import { resolveDossier } from "@/lib/portfolio/projects/orbit-dossiers";
import {
  PROJECTS_INDEX_PATH,
  projectPath,
} from "@/lib/portfolio/projects/project-routes";
import type { ProjectDetailDto } from "@/lib/portfolio/projects/types";
import { RECRUITER_PROFILE } from "@/lib/portfolio/recruiter-profile";

export const PROJECTS_INDEX_TITLE = "Projects | Production Systems Map";

export const PROJECTS_INDEX_DESCRIPTION =
  "Thirteen production systems built by Software Engineer Abdalrhman M. Alkady — commerce, payments, messaging, connected hardware, and SaaS, mapped as a systems orbit.";

const INDEXABLE_ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

const SITE_OG_IMAGE = {
  url: "/opengraph-image?v=20260805",
  width: 1200,
  height: 630,
  alt: "Abdalrhman M. Alkady — Software Engineer",
};

function firstParagraph(value: string): string {
  return value.split("\n").map((part) => part.trim()).find(Boolean) ?? "";
}

export function projectSeoDescription(project: ProjectDetailDto): string {
  return firstParagraph(project.publicSummary) || project.shortTagline;
}

export function projectDocumentTitle(project: ProjectDetailDto): string {
  if (isCaseStudySlug(project.slug)) {
    return `${project.title} Case Study | ${project.systemType}`;
  }
  return `${project.title} | ${project.systemType}`;
}

function projectOgTitle(project: ProjectDetailDto): string {
  if (isCaseStudySlug(project.slug)) {
    return `${project.title} — Engineering Case Study`;
  }
  return `${project.title} — ${project.systemType}`;
}

function projectKeywords(project: ProjectDetailDto): string[] {
  return [
    project.title,
    project.systemType,
    project.role,
    "Abdalrhman Alkady",
    "software engineer",
    ...project.technologies,
  ];
}

function personNode(siteUrl: URL) {
  return {
    "@type": "Person",
    "@id": new URL("/#person", siteUrl).toString(),
    name: RECRUITER_PROFILE.name,
    url: new URL("/", siteUrl).toString(),
    jobTitle: "Software Engineer",
    sameAs: [
      RECRUITER_PROFILE.linkedin,
      RECRUITER_PROFILE.github,
      RECRUITER_PROFILE.upwork,
    ],
  };
}

export function getProjectsIndexMetadata(): Metadata {
  return {
    title: PROJECTS_INDEX_TITLE,
    description: PROJECTS_INDEX_DESCRIPTION,
    keywords: [
      "software engineer portfolio",
      "production systems",
      "Laravel",
      "commerce platforms",
      "payment systems",
      "connected hardware",
      "Abdalrhman Alkady",
    ],
    authors: [{ name: RECRUITER_PROFILE.name, url: "/" }],
    alternates: { canonical: PROJECTS_INDEX_PATH },
    robots: INDEXABLE_ROBOTS,
    openGraph: {
      type: "website",
      locale: "en_US",
      title: `${PROJECTS_INDEX_TITLE} — ${RECRUITER_PROFILE.name}`,
      description: PROJECTS_INDEX_DESCRIPTION,
      url: PROJECTS_INDEX_PATH,
      siteName: RECRUITER_PROFILE.name,
      images: [SITE_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${PROJECTS_INDEX_TITLE} — ${RECRUITER_PROFILE.name}`,
      description: PROJECTS_INDEX_DESCRIPTION,
      images: [SITE_OG_IMAGE],
    },
  };
}

export function buildProjectPageMetadata(project: ProjectDetailDto): Metadata {
  const description = projectSeoDescription(project);
  const title = projectDocumentTitle(project);
  const ogTitle = projectOgTitle(project);
  const canonical = projectPath(project.slug);
  const image = {
    url: project.cover.src,
    width: project.cover.width,
    height: project.cover.height,
    alt: project.cover.alt,
  };

  return {
    title,
    description,
    keywords: projectKeywords(project),
    authors: [{ name: RECRUITER_PROFILE.name, url: "/" }],
    creator: RECRUITER_PROFILE.name,
    alternates: { canonical },
    robots: INDEXABLE_ROBOTS,
    openGraph: {
      type: "article",
      locale: "en_US",
      title: ogTitle,
      description,
      url: canonical,
      siteName: RECRUITER_PROFILE.name,
      images: [image],
      authors: [RECRUITER_PROFILE.name],
      modifiedTime: project.lastReviewed,
      section: "Projects",
      tags: project.technologies,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  };
}

export function getProjectsIndexJsonLd(siteUrl: URL = getSiteUrl()) {
  const collectionUrl = new URL(PROJECTS_INDEX_PATH, siteUrl).toString();
  const person = personNode(siteUrl);

  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "CollectionPage",
        "@id": collectionUrl,
        name: "Projects Orbit",
        description: PROJECTS_INDEX_DESCRIPTION,
        url: collectionUrl,
        inLanguage: "en-US",
        isPartOf: { "@type": "WebSite", name: RECRUITER_PROFILE.name, url: siteUrl.toString() },
        author: { "@id": person["@id"] },
        mainEntity: { "@id": `${collectionUrl}#systems` },
      },
      {
        "@type": "ItemList",
        "@id": `${collectionUrl}#systems`,
        name: "Production systems",
        numberOfItems: ORBIT_SYSTEMS.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: ORBIT_SYSTEMS.map((system, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: system.name,
          url: new URL(projectPath(system.slug), siteUrl).toString(),
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: new URL("/", siteUrl).toString(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: collectionUrl,
          },
        ],
      },
    ],
  };
}

export function getProjectJsonLd(
  project: ProjectDetailDto,
  siteUrl: URL = getSiteUrl(),
) {
  const url = new URL(projectPath(project.slug), siteUrl).toString();
  const person = personNode(siteUrl);
  const system = ORBIT_SYSTEMS.find((item) => item.slug === project.slug);
  const dossier = system ? resolveDossier(system) : null;
  const description = projectSeoDescription(project);

  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "CreativeWork",
        "@id": url,
        name: project.title,
        headline: dossier?.tagline ?? project.shortTagline,
        description,
        url,
        image: new URL(project.cover.src, siteUrl).toString(),
        inLanguage: "en-US",
        dateModified: project.lastReviewed,
        keywords: project.technologies.join(", "),
        about: project.systemType,
        author: { "@id": person["@id"] },
        creator: { "@id": person["@id"] },
        isPartOf: {
          "@type": "CollectionPage",
          name: "Projects Orbit",
          url: new URL(PROJECTS_INDEX_PATH, siteUrl).toString(),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: new URL("/", siteUrl).toString(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: new URL(PROJECTS_INDEX_PATH, siteUrl).toString(),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: url,
          },
        ],
      },
    ],
  };
}
