import { CaseStudyPage, getCaseStudyMetadata } from "@/components/portfolio/case-study/case-study-page";

export function generateMetadata() {
  return getCaseStudyMetadata("warqah-store");
}

export default function WarqahStoreCaseStudyPage() {
  return <CaseStudyPage slug="warqah-store" />;
}
