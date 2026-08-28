import type { Metadata } from "next";

import { homeSocialImagePath, socialJpeg } from "@/lib/metadata/social-image";

export const HOME_PATH = "/";
export const HOME_TITLE = "Abdalrhman M. Alkady | Software Engineer";
export const HOME_DESCRIPTION =
  "Backend-focused software engineer building reliable APIs, integrations, commerce platforms, connected hardware, and production web products.";
export const HOME_OG_DESCRIPTION =
  "Backend systems, product engineering, integrations, commerce, and connected hardware with verified production evidence.";
export const HOME_IMAGE_ALT = "Abdalrhman M. Alkady — Software Engineer";

const HOME_IMAGE = socialJpeg(homeSocialImagePath(), HOME_IMAGE_ALT);

export function getHomePageMetadata(): Metadata {
  return {
    title: {
      absolute: HOME_TITLE,
    },
    description: HOME_DESCRIPTION,
    alternates: {
      canonical: HOME_PATH,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      title: HOME_TITLE,
      description: HOME_OG_DESCRIPTION,
      url: HOME_PATH,
      images: [HOME_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: HOME_TITLE,
      description:
        "Backend systems, product engineering, integrations, commerce, and connected hardware.",
      images: [HOME_IMAGE],
    },
  };
}
