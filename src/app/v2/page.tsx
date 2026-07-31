import type { Metadata } from "next";

import { PortfolioV2Page as PortfolioV2Experience } from "@/components/portfolio/portfolio-v2-page";
import { getPortfolioVariant } from "@/lib/portfolio/portfolio-variant";

const config = getPortfolioVariant("v2");

export const metadata: Metadata = {
  title: config.title,
  description:
    "Backend-focused software engineer building reliable APIs, integrations, commerce platforms, connected hardware, and production web products.",
  alternates: {
    canonical: config.canonical,
  },
  robots: {
    index: config.indexable,
    follow: config.indexable,
  },
  openGraph: {
    type: "website",
    title: config.title,
    description:
      "Backend systems, product engineering, integrations, commerce, and connected hardware with verified production evidence.",
    url: config.canonical,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: config.title,
    description:
      "Backend systems, product engineering, integrations, commerce, and connected hardware.",
    images: ["/opengraph-image"],
  },
};

export default function PortfolioV2Page() {
  return <PortfolioV2Experience />;
}
