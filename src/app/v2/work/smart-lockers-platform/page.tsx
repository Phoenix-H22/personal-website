import { CaseStudyPage, getCaseStudyMetadata } from "@/components/portfolio/case-study/case-study-page";

export function generateMetadata() {
  return getCaseStudyMetadata("smart-lockers-platform");
}

export default function SmartLockersCaseStudyPage() {
  return <CaseStudyPage slug="smart-lockers-platform" />;
}
