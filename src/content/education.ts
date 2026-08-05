import { portfolioAssets } from "@/content/portfolio-assets";

export type ContentAsset = {
  src: string;
  alt: string;
} | null;

export type EducationEntry = {
  id: string;
  institution: string;
  institutionShortName: string;
  logo: ContentAsset;
  /** Credential line under the school name. Null when the card should omit it. */
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string;
  location: string;
  summary: string;
  highlights: string[];
  /** Overall university / program result — not the graduation-project grade. */
  grade: string | null;
  link: string | null;
  featured: boolean;
  sortOrder: number;
};

export const education: EducationEntry[] = [
  {
    id: "obour-stem-school",
    institution: "Obour STEM School",
    institutionShortName: "Obour STEM",
    logo: {
      src: portfolioAssets.education.obourStem,
      alt: "Obour STEM School",
    },
    degree: null,
    fieldOfStudy: null,
    startDate: "2018-09",
    endDate: "2021-06",
    location: "Obour, Egypt",
    summary:
      "Built an early foundation in scientific problem-solving, engineering competitions, teamwork, and practical software development.",
    highlights: [
      "Scientific problem-solving and engineering competitions",
      "Teamwork and practical software development",
    ],
    grade: null,
    link: null,
    featured: true,
    sortOrder: 1,
  },
  {
    id: "university-of-sadat-city",
    institution: "University of Sadat City",
    institutionShortName: "USC",
    logo: {
      src: portfolioAssets.education.universityOfSadatCity,
      alt: "University of Sadat City — Faculty of Computers and Artificial Intelligence",
    },
    degree: "Bachelor’s degree in Computer & Artificial Intelligence",
    fieldOfStudy: "Faculty of Computers and Artificial Intelligence",
    startDate: "2021-09",
    endDate: "2025-08",
    location: "Sadat City, Egypt",
    summary:
      "Developed a strong computer-science and artificial-intelligence foundation while building production-oriented software, culminating in the Virtual Clinic / Dr. Robot graduation project.",
    highlights: [
      "Cumulative A-grade with Honors",
      "Graduation project: Virtual Clinic / Dr. Robot — A+",
    ],
    grade: "Cumulative A-grade with Honors",
    link: null,
    featured: true,
    sortOrder: 2,
  },
];

/** Compact public wording for dense UI (hero, cards). */
export const EDUCATION_COMPACT_UNIVERSITY_RESULT =
  "A-grade with Honors · Capstone graded A+";
