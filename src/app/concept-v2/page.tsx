import type { Metadata } from "next";
import { Syne } from "next/font/google";

import { ConceptCapabilities } from "@/components/concept-v2/concept-capabilities";
import { ConceptCareerChapters } from "@/components/concept-v2/concept-career";
import { ConceptContact } from "@/components/concept-v2/concept-contact";
import { ConceptEducation } from "@/components/concept-v2/concept-education";
import { ConceptHero } from "@/components/concept-v2/concept-hero";
import { ConceptNav } from "@/components/concept-v2/concept-nav";
import { ConceptSelectedProjects } from "@/components/concept-v2/concept-projects";
import { ConceptProof } from "@/components/concept-v2/concept-proof";
import {
  getCareerEras,
  getEducation,
  getExperience,
  getProfile,
  getProjects,
} from "@/lib/content";
import "@/styles/concept-v2.css";

const syne = Syne({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Concept V2 — Engineering, Earned.",
  robots: {
    index: false,
    follow: false,
  },
};

const FEATURED_SLUGS = [
  "merchant-operations-salla-automation",
  "your-obour-guide",
  "nabd-messaging-platform",
  "smart-vending-medication-dispensing",
  "virtual-clinic-dr-robot",
  "ai-pdf-extraction",
] as const;

export default function ConceptV2Page() {
  const profile = getProfile();
  const education = getEducation();
  const eras = getCareerEras();
  const experience = getExperience();
  const projects = FEATURED_SLUGS.map((slug) =>
    getProjects().find((project) => project.slug === slug),
  ).filter((project): project is NonNullable<typeof project> => Boolean(project));

  return (
    <div className={`concept-v2 ${syne.variable}`}>
      <ConceptNav />
      <main id="main-content">
        <ConceptHero profile={profile} />
        <ConceptProof />
        <ConceptEducation education={education} />
        <ConceptCareerChapters eras={eras} experience={experience} />
        <ConceptSelectedProjects projects={projects} />
        <ConceptCapabilities />
        <ConceptContact profile={profile} />
      </main>
    </div>
  );
}
