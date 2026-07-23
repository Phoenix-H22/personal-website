import type { Metadata } from "next";

import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { getPortfolioVariant } from "@/lib/portfolio/portfolio-variant";

const config = getPortfolioVariant("v2");

export const metadata: Metadata = {
  title: config.title,
  description:
    "Private preview of the next portfolio iteration. Not for public indexing.",
  alternates: {
    canonical: config.canonical,
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

/**
 * V2 is architectural isolation for future S2+ changes.
 * It currently renders the same approved baseline as `/`.
 */
export default function PortfolioV2Page() {
  return <PortfolioPage config={config} />;
}
