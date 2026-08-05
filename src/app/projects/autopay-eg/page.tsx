import { CaseStudyPage, getCaseStudyMetadata } from "@/components/portfolio/case-study/case-study-page";

export function generateMetadata() {
  return getCaseStudyMetadata("autopay-eg");
}

export default function AutopayEgCaseStudyPage() {
  return <CaseStudyPage slug="autopay-eg" />;
}
