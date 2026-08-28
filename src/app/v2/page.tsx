import { PortfolioV2Page as PortfolioV2Experience } from "@/components/portfolio/portfolio-v2-page";
import { getHomePageMetadata } from "@/lib/metadata/home";

export const metadata = getHomePageMetadata();

export default function PortfolioV2Page() {
  return <PortfolioV2Experience />;
}
