import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ChapterMarker } from "@/components/concept-v3-rebuild/chapters/chapter-marker";
import { EducationRoute } from "@/components/concept-v3-rebuild/origin/education-route";
import { CareerReel } from "@/components/concept-v3-rebuild/career/career-reel";
import { ExperienceStory } from "@/components/concept-v3-rebuild/career/experience-story";
import { CompanyLogoFrame } from "@/components/concept-v3-rebuild/shared/company-logo-frame";
import {
  getEducation,
  getCareerTrajectoryEras,
  getCareerTrajectoryPrimary,
  getCareerTrajectoryIndependent,
} from "@/lib/content";
import { MotionPreferenceProvider } from "@/lib/motion-preference-context";
import chapStyles from "@/styles/concept-v3-rebuild/chapters.module.scss";

export const metadata: Metadata = {
  title: "Design System — Chapters",
  robots: {
    index: false,
    follow: false,
  },
};

function PreviewBlock({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: "4rem" }}>
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 560,
          marginBottom: "0.35rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid rgb(139 171 204 / 14%)",
        }}
      >
        {title}
      </h2>
      {note ? (
        <p
          style={{
            color: "#a8b6c8",
            fontSize: "0.9rem",
            marginBottom: "1.25rem",
          }}
        >
          {note}
        </p>
      ) : (
        <div style={{ marginBottom: "1.25rem" }} />
      )}
      {children}
    </section>
  );
}

export default function ChaptersDesignSystemPage() {
  const education = getEducation();
  const eras = getCareerTrajectoryEras();
  const primary = getCareerTrajectoryPrimary();
  const independent = getCareerTrajectoryIndependent();
  const sample = primary.find((entry) => entry.id === "mohssilh") ?? primary[0];

  return (
    <MotionPreferenceProvider>
    <main
      id="main-content"
      style={{
        background: "#03060b",
        color: "#f3f7fb",
        minHeight: "100vh",
        fontFamily: "var(--font-geist), Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "3rem clamp(1rem, 4vw, 3rem)",
        }}
      >
        <p
          style={{
            color: "#31e6d0",
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          Design System / Chapter Components
        </p>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            marginBottom: "3rem",
          }}
        >
          Career Reel
        </h1>

        <PreviewBlock title="Chapter Marker">
          <ChapterMarker label="Career" />
        </PreviewBlock>

        <PreviewBlock title="Education Route">
          <div style={{ maxWidth: "36rem" }}>
            <EducationRoute entries={education} />
          </div>
        </PreviewBlock>

        <PreviewBlock title="Company Logo Frame">
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {primary.map((entry) => (
              <CompanyLogoFrame
                key={entry.id}
                logo={entry.logo}
                company={entry.company}
                companyShortName={entry.companyShortName}
                size="md"
              />
            ))}
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="CareerReel / Career Filmstrip"
          note="Art-directed filmstrip — company milestones, compact independent track, one editorial Experience Story."
        >
          <CareerReel
            eras={eras}
            primary={primary}
            independent={independent}
          />
        </PreviewBlock>

        <PreviewBlock title="ExperienceStory">
          {sample ? (
            <div style={{ maxWidth: "48rem" }}>
              <ExperienceStory
                entry={sample}
                path="main"
                eraLabel="ERP & operations"
              />
            </div>
          ) : null}
        </PreviewBlock>

        <PreviewBlock
          title="CareerReelTrack / CareerIndependentTrack / CareerCompanyNode / CareerEraGroup / MobileCareerReel"
          note="Composed inside CareerReel. Storyline / Trajectory / Timefield controls were removed."
        >
          <p className={chapStyles.subheading} style={{ maxWidth: "60ch" }}>
            Mobile uses the same CareerReel with a horizontally scrollable track.
          </p>
        </PreviewBlock>
      </div>
    </main>
    </MotionPreferenceProvider>
  );
}
