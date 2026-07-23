import type { Metadata } from "next";

import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { getPortfolioVariant } from "@/lib/portfolio/portfolio-variant";

const config = getPortfolioVariant("current");

export const metadata: Metadata = {
  title: {
    absolute: config.title,
  },
  alternates: {
    canonical: config.canonical,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return <PortfolioPage config={config} />;
}
