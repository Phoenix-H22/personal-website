export type Achievement = {
  id: string;
  title: string;
  organization: string | null;
  date: string | null;
  summary: string;
  proof: string | null;
  logo: null;
  featured: boolean;
};

export const achievements: Achievement[] = [
  {
    id: "cnss",
    title: "ICSI | CNSS Certified Network Security Specialist",
    organization: "ICSI",
    date: null,
    summary: "Network security specialist certification.",
    proof: null,
    logo: null,
    featured: false,
  },
  {
    id: "csfpc",
    title: "Cyber Security Foundation Professional Certificate — CSFPC™",
    organization: null,
    date: null,
    summary: "Cyber security foundation professional certificate.",
    proof: null,
    logo: null,
    featured: false,
  },
  {
    id: "nanodegree-intro-programming",
    title: "Nano-degree Intro to programming",
    organization: null,
    date: null,
    summary: "Introductory programming nanodegree.",
    proof: null,
    logo: null,
    featured: false,
  },
  {
    id: "aws-academy-cloud-foundations",
    title: "AWS Academy Cloud Foundations",
    organization: "AWS Academy",
    date: null,
    summary: "Cloud foundations coursework.",
    proof: null,
    logo: null,
    featured: false,
  },
  {
    id: "graduation-project-a-plus",
    title: "Virtual Clinic / Dr. Robot — A+",
    organization: "University of Sadat City",
    date: "2025-08",
    summary:
      "Graduation project graded A+. Separate from the cumulative university result (A-grade with Honors).",
    proof: null,
    logo: null,
    featured: true,
  },
  {
    id: "university-cumulative-honors",
    title: "Cumulative A-grade with Honors",
    organization: "University of Sadat City",
    date: "2025-08",
    summary:
      "Overall bachelor’s program result. Not the graduation-project grade.",
    proof: null,
    logo: null,
    featured: true,
  },
];
