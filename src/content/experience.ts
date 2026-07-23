import type { ContentAsset } from "@/content/education";
import { portfolioAssets } from "@/content/portfolio-assets";

export type ExperienceKind =
  | "employment"
  | "contract"
  | "freelance"
  | "internship"
  | "independent-company"
  | "technical-leadership"
  | "community"
  | "teaching"
  | "support";

export type ExperiencePublicationLevel =
  | "primary"
  | "supporting"
  | "archive"
  | "unpublished";

export type EmploymentType =
  | "full-time"
  | "contract"
  | "freelance"
  | "internship"
  | "other";

export type Confidentiality = "public" | "client-confidential" | "private";

export type ExperienceSource = {
  type: "owner" | "resume" | "linkedin" | "canonical-content";
  reference: string;
  confidence:
    | "owner-confirmed"
    | "multiple-sources"
    | "single-source"
    | "conflicting";
};

export type ExperienceEntry = {
  id: string;
  company: string;
  companyShortName: string | null;
  /** Source-only aliases (e.g. LinkedIn spelling variants). Never use as public display. */
  sourceAliases: string[];
  role: string;
  kind: ExperienceKind;
  employmentType: EmploymentType | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  location: string | null;
  workMode: "remote" | "onsite" | "hybrid" | null;
  mission: string;
  summary: string;
  highlights: string[];
  outcomes: string[];
  technologies: string[];
  companyUrl: string | null;
  linkedinSourceUrl: string | null;
  logo: ContentAsset;
  confidentiality: Confidentiality;
  publicationLevel: ExperiencePublicationLevel;
  featured: boolean;
  era: string;
  sortOrder: number;
  sources: ExperienceSource[];
  needsOwnerConfirmation: string[];
};

export type CareerEra = {
  id: string;
  title: string;
  period: string;
  proposition: string;
  description: string;
  experienceIds: string[];
  visualState: "foundation" | "building" | "owning" | "independent";
  sortOrder: number;
};

const RESUME = "docs/source/Abdalrhman_M_Alkady_Resume_2026-07-13.pdf";
const LINKEDIN = "docs/source/Abdalrhman_Alkady_LinkedIn_Export.pdf";

function companyLogo(
  path: string | null | undefined,
  alt: string,
): ContentAsset {
  if (!path) return null;
  return { src: path, alt };
}

/**
 * Complete experience inventory for Stage S1.
 * Publication levels control what future Career UI may render.
 * Do not invent metrics — LinkedIn-only figures stay out of outcomes until confirmed.
 */
export const experience: ExperienceEntry[] = [
  // ——— Primary professional ———
  {
    id: "mohssilh",
    company: "Mohssilh / محصلة",
    companyShortName: "Mohssilh",
    sourceAliases: ["Mohsillh"],
    role: "Software Engineer, Backend & Integrations",
    kind: "employment",
    employmentType: "full-time",
    startDate: "2025-03",
    endDate: null,
    isCurrent: true,
    location: "Saudi Arabia",
    workMode: null,
    mission:
      "Building backend integrations, reporting, and reconciliation systems for multi-merchant commerce operations.",
    summary:
      "Designed and maintained backend services for a multi-merchant reporting and reconciliation platform integrated with Salla APIs.",
    highlights: [
      "Reliable synchronization with queues, Redis caching, and webhook handling",
      "Optimized MySQL queries across operational workflows",
    ],
    outcomes: [
      "Supports 200+ merchants",
      "Handles 20K+ monthly orders",
      "Handles order activity worth 12M+ SAR",
      "API performance improved by 70–80%",
      "Synchronization errors reduced by 15%",
    ],
    technologies: [
      "Laravel",
      "Salla APIs",
      "Queues",
      "Redis",
      "Webhooks",
      "MySQL",
      "Reporting",
      "Reconciliation",
    ],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: companyLogo(portfolioAssets.companies.mohssilh, "Mohssilh"),
    confidentiality: "client-confidential",
    publicationLevel: "primary",
    featured: true,
    era: "owning-production-systems",
    sortOrder: 10,
    sources: [
      {
        type: "resume",
        reference: `${RESUME} · Mar 2025 – Present · Software Engineer, Backend & Integrations`,
        confidence: "owner-confirmed",
      },
      {
        type: "linkedin",
        reference: `${LINKEDIN} · January 2025 – Present · Backend Engineer · spelling variant Mohsillh in body`,
        confidence: "conflicting",
      },
      {
        type: "canonical-content",
        reference: "docs/CANONICAL_CONTENT.md · Mohssilh Mar 2025 – Present",
        confidence: "multiple-sources",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: LinkedIn start January 2025 vs résumé/canonical March 2025 — canonical March retained until confirmed",
      "NEEDS_OWNER_CONFIRMATION: LinkedIn title Backend Engineer vs résumé Software Engineer, Backend & Integrations — résumé title retained",
      "NEEDS_OWNER_CONFIRMATION: LinkedIn location Riyadh vs résumé Saudi Arabia",
      "NEEDS_OWNER_CONFIRMATION: LinkedIn-only metrics (95%+ webhook improvement, 99%+ query optimization) not published until approved",
    ],
  },
  {
    id: "kayanac-erp",
    company: "Kayanac ERP",
    companyShortName: "Kayanac",
    sourceAliases: [],
    role: "Software Engineer, Full Stack / Contract",
    kind: "contract",
    employmentType: "contract",
    startDate: "2025-03",
    endDate: "2025-06",
    isCurrent: false,
    location: "Maadi, Egypt",
    workMode: "onsite",
    mission: "Turning complex manual operational processes into structured ERP workflows.",
    summary:
      "Built ERP modules across payroll, settlements, CRM, construction, transportation, and finance workflows.",
    highlights: [
      "Refactored legacy Laravel code into cleaner service-based modules",
      "Fixed N+1 query problems",
      "Improved maintainability of business-critical features",
    ],
    outcomes: [],
    technologies: ["Laravel", "ERP modules", "MySQL"],
    companyUrl: null,
    linkedinSourceUrl: null,
    logo: companyLogo(portfolioAssets.companies.kayanac, "Kayanac ERP"),
    confidentiality: "client-confidential",
    publicationLevel: "primary",
    featured: true,
    era: "owning-production-systems",
    sortOrder: 20,
    sources: [
      {
        type: "resume",
        reference: `${RESUME} · Mar 2025 – Jun 2025 · present on résumé; absent from LinkedIn export`,
        confidence: "owner-confirmed",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: Not present on LinkedIn export — confirm public publication of Kayanac ERP entry",
      "NEEDS_OWNER_CONFIRMATION: No quantified outcomes on résumé — add verified results if available",
    ],
  },
  {
    id: "theqah",
    company: "Theqah.sa",
    companyShortName: "Theqah",
    sourceAliases: ["شركة موقع الثقة", "Theqah company"],
    role: "Software Engineer",
    kind: "employment",
    employmentType: "full-time",
    startDate: "2024-08",
    endDate: "2025-02",
    isCurrent: false,
    location: "Riyadh, Saudi Arabia",
    workMode: null,
    mission:
      "Leading backend development and performance work for high-volume education and payment systems.",
    summary:
      "Led backend development for Fushati education and payment systems with reliability and checkout performance as primary concerns.",
    highlights: [
      "AI-powered face-recognition payment system",
      "Smart caching and load balancing for peak traffic",
    ],
    outcomes: [
      "Integrated 200+ schools",
      "Processed 5,000+ daily transactions",
      "Maintained 99.9% uptime",
      "Reduced checkout time by 60%",
      "Reduced server load by 35%",
    ],
    technologies: ["Laravel", "Caching", "Load balancing", "Payment systems"],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: companyLogo(portfolioAssets.companies.theqah, "Theqah"),
    confidentiality: "client-confidential",
    publicationLevel: "primary",
    featured: true,
    era: "owning-production-systems",
    sortOrder: 30,
    sources: [
      {
        type: "resume",
        reference: `${RESUME} · Aug 2024 – Feb 2025 · Software Engineer`,
        confidence: "owner-confirmed",
      },
      {
        type: "linkedin",
        reference: `${LINKEDIN} · August 2024 – Present · Full Stack Developer | SaaS, AI & Payment Systems`,
        confidence: "conflicting",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: LinkedIn end date Present vs résumé February 2025 — résumé end retained; do not publish Present until confirmed",
      "NEEDS_OWNER_CONFIRMATION: LinkedIn title Full Stack Developer vs résumé Software Engineer — résumé title retained",
      "NEEDS_OWNER_CONFIRMATION: LinkedIn summary cites 40% system-efficiency improvement — not on résumé; not published in outcomes",
    ],
  },
  {
    id: "tjar",
    company: "Tjar.sa",
    companyShortName: "Tjar",
    sourceAliases: [],
    role: "Software Engineer, Contract",
    kind: "contract",
    employmentType: "contract",
    startDate: "2024-03",
    endDate: "2024-05",
    isCurrent: false,
    location: "Saudi Arabia",
    workMode: null,
    mission: "Building tenant-aware commerce infrastructure and merchant analytics.",
    summary:
      "Built and maintained a multi-tenant e-commerce SaaS platform with Laravel and Livewire.",
    highlights: [
      "Tenant-aware commerce infrastructure",
      "Real-time analytics dashboards for merchants",
    ],
    outcomes: [
      "Supported 1,000+ stores",
      "Maintained 99.9% uptime",
      "Developed real-time analytics for 100+ merchants",
    ],
    technologies: ["Laravel", "Livewire", "Multi-tenant architecture"],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: companyLogo(portfolioAssets.companies.tjar, "Tjar.sa"),
    confidentiality: "client-confidential",
    publicationLevel: "primary",
    featured: true,
    era: "shipping-products",
    sortOrder: 40,
    sources: [
      {
        type: "resume",
        reference: `${RESUME} · Mar 2024 – May 2024`,
        confidence: "owner-confirmed",
      },
      {
        type: "linkedin",
        reference: `${LINKEDIN} · March 2024 – May 2024 · Full Stack Developer`,
        confidence: "multiple-sources",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: LinkedIn title Full Stack Developer vs résumé Software Engineer, Contract — résumé framing retained",
    ],
  },
  {
    id: "klliq",
    company: "KLLIQ LLC",
    companyShortName: "KLLIQ",
    sourceAliases: [],
    role: "Software Engineer, Contract",
    kind: "contract",
    employmentType: "contract",
    startDate: "2023-09",
    endDate: "2024-03",
    isCurrent: false,
    location: "Khamis Mushait, Saudi Arabia",
    workMode: null,
    mission: "Developing and stabilizing APIs and products for AI-enabled SaaS systems.",
    summary:
      "Led API development and product stabilization for AI SaaS, CRM, and social application surfaces.",
    highlights: [
      "API development for AI SaaS",
      "CRM and social-app bug resolution",
      "Legacy-code refactoring",
    ],
    outcomes: [
      "Served 10,000+ users",
      "Improved system efficiency by 35%",
      "Reduced critical error rates by 50%",
      "Increased stability and engagement by 30%",
    ],
    technologies: ["APIs", "AI SaaS", "CRM"],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: companyLogo(portfolioAssets.companies.klliq, "KLLIQ LLC"),
    confidentiality: "client-confidential",
    publicationLevel: "primary",
    featured: true,
    era: "shipping-products",
    sortOrder: 50,
    sources: [
      {
        type: "resume",
        reference: `${RESUME} · Sep 2023 – Mar 2024 · Khamis Mushait`,
        confidence: "owner-confirmed",
      },
      {
        type: "linkedin",
        reference: `${LINKEDIN} · September 2023 – March 2024 · Full Stack Developer · 'Asir, Saudi Arabia`,
        confidence: "multiple-sources",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: LinkedIn location 'Asir vs résumé Khamis Mushait — related geography; confirm public location string",
    ],
  },
  {
    id: "marqity",
    company: "Marqity Agency",
    companyShortName: "Marqity",
    sourceAliases: [],
    role: "Full Stack Developer",
    kind: "employment",
    employmentType: "full-time",
    startDate: "2024-02",
    endDate: "2024-12",
    isCurrent: false,
    location: "Cairo, Egypt",
    workMode: null,
    mission:
      "Delivering Laravel, API, and e-commerce solutions for agency clients.",
    summary:
      "Developed custom e-commerce platforms and web applications using Laravel, Vue.js, and Tailwind CSS; designed REST APIs and payment integrations.",
    highlights: [
      "Custom e-commerce and SaaS client delivery",
      "Payment gateway integration (Stripe, PayPal)",
      "API design and performance improvements",
    ],
    outcomes: [],
    technologies: ["Laravel", "Vue.js", "Tailwind CSS", "Stripe", "PayPal"],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: companyLogo(portfolioAssets.companies.marqity, "Marqity Agency"),
    confidentiality: "private",
    publicationLevel: "supporting",
    featured: false,
    era: "shipping-products",
    sortOrder: 60,
    sources: [
      {
        type: "linkedin",
        reference: `${LINKEDIN} · February 2024 – December 2024 · Full Stack Developer`,
        confidence: "single-source",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: LinkedIn-only entry — not on latest résumé; confirm Career vs archive placement",
      "NEEDS_OWNER_CONFIRMATION: LinkedIn-only load-time / engagement claims not published as outcomes",
      "NEEDS_OWNER_CONFIRMATION: Overlaps Tjar (Mar–May 2024) chronologically — clarify concurrent work framing",
    ],
  },
  {
    id: "maryzad",
    company: "Maryzad",
    companyShortName: "Maryzad",
    sourceAliases: ["ماريزاد"],
    role: "Technical Support Specialist",
    kind: "support",
    employmentType: "full-time",
    startDate: "2023-07",
    endDate: "2023-10",
    isCurrent: false,
    location: "Zamalek, Cairo, Egypt",
    workMode: "onsite",
    mission:
      "Maintaining servers, email systems, and websites for reliable day-to-day operations.",
    summary:
      "Managed and maintained company servers, email systems, and websites through troubleshooting and proactive maintenance.",
    highlights: [
      "Server and website operations support",
      "Email system maintenance",
    ],
    outcomes: [],
    technologies: [],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: companyLogo(portfolioAssets.companies.maryzad, "Maryzad"),
    confidentiality: "private",
    publicationLevel: "archive",
    featured: false,
    era: "shipping-products",
    sortOrder: 70,
    sources: [
      {
        type: "linkedin",
        reference: `${LINKEDIN} · July 2023 – October 2023 · Technical Support Specialist`,
        confidence: "single-source",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: Support role — recommended archive, not full Career card",
      "NEEDS_OWNER_CONFIRMATION: Not on latest résumé",
    ],
  },
  {
    id: "intsolutions",
    company: "Intsolutions",
    companyShortName: "Intsolutions",
    sourceAliases: [],
    role: "Full Stack Developer",
    kind: "employment",
    employmentType: "full-time",
    startDate: "2023-04",
    endDate: "2023-09",
    isCurrent: false,
    location: "Giza, Egypt",
    workMode: null,
    mission:
      "Improving logistics infrastructure and engineering collaboration practices.",
    summary:
      "Revamped logistics infrastructure and standardized code-review practices while shipping full-stack delivery.",
    highlights: [
      "Logistics infrastructure improvements",
      "Code-review practice standardization",
    ],
    outcomes: [],
    technologies: [],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: companyLogo(portfolioAssets.companies.intsolutions, "Intsolutions"),
    confidentiality: "private",
    publicationLevel: "primary",
    featured: true,
    era: "entering-production",
    sortOrder: 80,
    sources: [
      {
        type: "linkedin",
        reference: `${LINKEDIN} · April 2023 – September 2023 · Full Stack Developer`,
        confidence: "single-source",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: LinkedIn-only — not on latest résumé; confirm before public Career prominence",
      "NEEDS_OWNER_CONFIRMATION: LinkedIn 40% processing-time / 30% code-quality claims not published until verified",
      "NEEDS_OWNER_CONFIRMATION: Logo missing — typographic fallback required in future UI",
    ],
  },
  {
    id: "eraasoft",
    company: "Eraasoft",
    companyShortName: "Eraasoft",
    sourceAliases: ["EraaSoft"],
    role: "Full Stack Developer Intern",
    kind: "internship",
    employmentType: "internship",
    startDate: "2023-02",
    endDate: "2023-04",
    isCurrent: false,
    location: "Dokki, Giza, Egypt",
    workMode: "onsite",
    mission:
      "Building foundational production habits under senior engineers on Laravel applications.",
    summary:
      "Internship focused on PHP/Laravel/MySQL application work, code reviews, testing, and team delivery processes.",
    highlights: [
      "Laravel and MySQL application maintenance",
      "Code review, testing, and debugging with senior engineers",
    ],
    outcomes: [],
    technologies: ["PHP", "Laravel", "MySQL"],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: companyLogo(portfolioAssets.companies.eraasoft, "Eraasoft"),
    confidentiality: "public",
    publicationLevel: "primary",
    featured: true,
    era: "entering-production",
    sortOrder: 90,
    sources: [
      {
        type: "linkedin",
        reference: `${LINKEDIN} · February 2023 – April 2023 · Full Stack Developer (internship narrative)`,
        confidence: "single-source",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: LinkedIn-only — not on latest résumé; confirm internship public wording",
      "NEEDS_OWNER_CONFIRMATION: LinkedIn title shows Full Stack Developer while body describes internship — intern framing used",
    ],
  },

  // ——— Independent track ———
  {
    id: "phoenix-techs",
    company: "Phoenix Tech’s",
    companyShortName: "Phoenix Tech’s",
    sourceAliases: ["Phoenix Tech's", "Phoenix Techs"],
    role: "Full Stack Developer | SaaS, AI, Cloud & API Engineering",
    kind: "independent-company",
    employmentType: "other",
    startDate: "2020-09",
    endDate: null,
    isCurrent: true,
    location: "Banha, Al Qalyubiyah, Egypt",
    workMode: null,
    mission:
      "Independent product and engineering studio work across SaaS, AI, APIs, and cloud delivery.",
    summary:
      "Long-running independent engineering track building SaaS platforms, APIs, payment integrations, and cloud-backed products — not modeled as a conventional employer of record.",
    highlights: [
      "SaaS and AI-powered application delivery",
      "REST APIs and cloud infrastructure integration",
      "Payment gateway and authentication systems",
    ],
    outcomes: [],
    technologies: ["Laravel", "APIs", "AWS", "Firebase", "DigitalOcean"],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: companyLogo(
      portfolioAssets.companies.phoenixTechs,
      "Phoenix Tech’s",
    ),
    confidentiality: "private",
    publicationLevel: "supporting",
    featured: false,
    era: "independent-track",
    sortOrder: 100,
    sources: [
      {
        type: "linkedin",
        reference: `${LINKEDIN} · September 2020 – Present`,
        confidence: "single-source",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: Treat as independent studio / parallel track (recommended) vs conventional employer",
      "NEEDS_OWNER_CONFIRMATION: LinkedIn-only efficiency metrics (40%, 35%) not published until verified against canonical claims",
      "NEEDS_OWNER_CONFIRMATION: Public company URL / portfolio domain publication policy",
    ],
  },
  {
    id: "upwork-freelance",
    company: "Upwork",
    companyShortName: "Upwork",
    sourceAliases: ["upwork"],
    role: "Freelance Full Stack Developer",
    kind: "freelance",
    employmentType: "freelance",
    startDate: "2023-08",
    endDate: null,
    isCurrent: true,
    location: null,
    workMode: "remote",
    mission:
      "Independent client delivery across product backends, integrations, and AI-enabled systems.",
    summary:
      "Verified freelance track for selected client systems and global remote delivery. Career chapter should emphasize duration and progression — not repeat the Hero Upwork JSS credential artifact.",
    highlights: [
      "Top Rated freelance delivery track",
      "Selected client systems across Laravel and modern frontends",
      "Remote CI/CD and deployment workflows",
    ],
    outcomes: [],
    technologies: ["Laravel", "Vue.js", "React.js", "Docker", "CI/CD"],
    companyUrl: "https://www.upwork.com/freelancers/alkady22h/",
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: companyLogo(portfolioAssets.credentials.upwork, "Upwork"),
    confidentiality: "public",
    publicationLevel: "supporting",
    featured: false,
    era: "independent-track",
    sortOrder: 110,
    sources: [
      {
        type: "linkedin",
        reference: `${LINKEDIN} · August 2023 – Present · Freelance Full Stack Developer`,
        confidence: "single-source",
      },
      {
        type: "canonical-content",
        reference: "Hero / proof-engine Upwork Top Rated · 100% JSS credential",
        confidence: "owner-confirmed",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: LinkedIn-only 10+ projects / five-star average — confirm before Career copy (Hero keeps Top Rated · 100% JSS)",
      "NEEDS_OWNER_CONFIRMATION: Start date August 2023 is LinkedIn-only",
    ],
  },

  // ——— Early technical leadership & community (archive / foundation) ———
  {
    id: "obour-stem-it-supervisor",
    company: "Obour STEM School",
    companyShortName: "Obour STEM",
    sourceAliases: [],
    role: "Information Technology Supervisor",
    kind: "technical-leadership",
    employmentType: "other",
    startDate: "2018-09",
    endDate: "2021-09",
    isCurrent: false,
    location: "Cairo, Egypt",
    workMode: "onsite",
    mission:
      "Supporting school technology infrastructure and student readiness for STEM systems.",
    summary:
      "Supported school infrastructure and network readiness; helped Grade 10 summer-camp students prepare for school systems and laptops.",
    highlights: [],
    outcomes: [],
    technologies: [],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: companyLogo(
      portfolioAssets.education.obourStem,
      "Obour STEM School",
    ),
    confidentiality: "public",
    publicationLevel: "archive",
    featured: false,
    era: "engineering-foundations",
    sortOrder: 200,
    sources: [
      {
        type: "linkedin",
        reference: `${LINKEDIN} · September 2018 – September 2021`,
        confidence: "single-source",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: Compress into Foundation chapter summary rather than a full Career card",
    ],
  },
  {
    id: "obour-stem-cto",
    company: "Obour STEM School",
    companyShortName: "Obour STEM",
    sourceAliases: [],
    role: "Chief Technology Officer",
    kind: "technical-leadership",
    employmentType: "other",
    startDate: "2018-09",
    endDate: "2021-08",
    isCurrent: false,
    location: "Cairo, Egypt",
    workMode: "onsite",
    mission:
      "Student technology leadership during the STEM-school years.",
    summary:
      "Early technical leadership role at Obour STEM School overlapping the IT Supervisor period.",
    highlights: [],
    outcomes: [],
    technologies: [],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: companyLogo(
      portfolioAssets.education.obourStem,
      "Obour STEM School",
    ),
    confidentiality: "public",
    publicationLevel: "archive",
    featured: false,
    era: "engineering-foundations",
    sortOrder: 210,
    sources: [
      {
        type: "linkedin",
        reference: `${LINKEDIN} · September 2018 – August 2021`,
        confidence: "single-source",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: Overlaps IT Supervisor dates — confirm how both roles should be narrated publicly",
      "NEEDS_OWNER_CONFIRMATION: Title CTO may read senior for a school context — confirm public wording",
    ],
  },
  {
    id: "iyna-obour",
    company: "IYNA Obour Chapter",
    companyShortName: "IYNA Obour",
    sourceAliases: [],
    role: "Head of Information Technology",
    kind: "community",
    employmentType: null,
    startDate: "2020-07",
    endDate: "2021-05",
    isCurrent: false,
    location: "El Obour, Al Qalyubiyah, Egypt",
    workMode: null,
    mission: "Community technology leadership for the Obour IYNA chapter.",
    summary: "Head of Information Technology for IYNA Obour Chapter.",
    highlights: [],
    outcomes: [],
    technologies: [],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: null,
    confidentiality: "public",
    publicationLevel: "archive",
    featured: false,
    era: "engineering-foundations",
    sortOrder: 220,
    sources: [
      {
        type: "linkedin",
        reference: `${LINKEDIN} · July 2020 – May 2021`,
        confidence: "single-source",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: Archive / Foundation disclosure only — no logo",
    ],
  },
  {
    id: "tedx-youth-ismailia-stem",
    company: "TEDxYouth@Ismailia STEM",
    companyShortName: "TEDxYouth Ismailia STEM",
    sourceAliases: ["TedxYouth@Ismailia STEM"],
    role: "Member of Technical Staff",
    kind: "community",
    employmentType: null,
    startDate: "2020-06",
    endDate: "2021-05",
    isCurrent: false,
    location: "Ismailia, Egypt",
    workMode: null,
    mission: "Technical staff support for a youth STEM TEDx program.",
    summary: "Member of Technical Staff for TEDxYouth@Ismailia STEM.",
    highlights: [],
    outcomes: [],
    technologies: [],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: null,
    confidentiality: "public",
    publicationLevel: "archive",
    featured: false,
    era: "engineering-foundations",
    sortOrder: 230,
    sources: [
      {
        type: "linkedin",
        reference: `${LINKEDIN} · June 2020 – May 2021`,
        confidence: "single-source",
      },
    ],
    needsOwnerConfirmation: [],
  },
  {
    id: "mediomena",
    company: "Mediomena",
    companyShortName: "Mediomena",
    sourceAliases: [],
    role: "Head Web Development Committee",
    kind: "community",
    employmentType: null,
    startDate: "2020-04",
    endDate: "2021-05",
    isCurrent: false,
    location: "Cairo, Egypt",
    workMode: null,
    mission: "Leading web-development committee work in a community organization.",
    summary: "Head of the Web Development Committee at Mediomena.",
    highlights: [],
    outcomes: [],
    technologies: [],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: null,
    confidentiality: "public",
    publicationLevel: "archive",
    featured: false,
    era: "engineering-foundations",
    sortOrder: 240,
    sources: [
      {
        type: "linkedin",
        reference: `${LINKEDIN} · April 2020 – May 2021`,
        confidence: "single-source",
      },
    ],
    needsOwnerConfirmation: [],
  },
  {
    id: "roboticers",
    company: "Roboticers",
    companyShortName: "Roboticers",
    sourceAliases: [],
    role: "Instructor",
    kind: "teaching",
    employmentType: null,
    startDate: "2020-02",
    endDate: "2021-05",
    isCurrent: false,
    location: "Cairo, Egypt",
    workMode: null,
    mission: "Teaching and mentoring through robotics instruction.",
    summary: "Instructor at Roboticers during the STEM-school years.",
    highlights: [],
    outcomes: [],
    technologies: [],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: null,
    confidentiality: "public",
    publicationLevel: "archive",
    featured: false,
    era: "engineering-foundations",
    sortOrder: 250,
    sources: [
      {
        type: "linkedin",
        reference: `${LINKEDIN} · February 2020 – May 2021`,
        confidence: "single-source",
      },
    ],
    needsOwnerConfirmation: [],
  },
  {
    id: "ignite-talks",
    company: "Ignite Talks",
    companyShortName: "Ignite Talks",
    sourceAliases: [],
    role: "Graphic Designer",
    kind: "community",
    employmentType: null,
    startDate: "2020-03",
    endDate: "2021-05",
    isCurrent: false,
    location: null,
    workMode: null,
    mission: "Visual support for community talks programming.",
    summary:
      "Graphic design support for Ignite Talks. Keep de-emphasized in the engineering narrative.",
    highlights: [],
    outcomes: [],
    technologies: [],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: null,
    confidentiality: "public",
    publicationLevel: "archive",
    featured: false,
    era: "engineering-foundations",
    sortOrder: 260,
    sources: [
      {
        type: "linkedin",
        reference: `${LINKEDIN} · March 2020 – May 2021`,
        confidence: "single-source",
      },
    ],
    needsOwnerConfirmation: [
      "NEEDS_OWNER_CONFIRMATION: Do not let Graphic Designer dominate Career UI — archive / disclosure only",
    ],
  },
];

/**
 * Homepage Career Timefield eras (professional path from ~2023).
 * School/community archive entries stay in `experience` but are not listed here.
 * Independent track is a parallel lane, not a chronological era.
 */
export const careerEras: CareerEra[] = [
  {
    id: "entering-production",
    title: "Entering production engineering",
    period: "2023",
    proposition: "Guided delivery and the first professional production systems.",
    description:
      "Internship and early full-stack delivery — backend foundations, code quality, logistics systems, and the move from learning into professional production work.",
    experienceIds: ["eraasoft", "intsolutions"],
    visualState: "foundation",
    sortOrder: 1,
  },
  {
    id: "shipping-products",
    title: "Shipping products across teams",
    period: "2023 – 2024",
    proposition: "APIs, SaaS commerce, and broader product responsibility.",
    description:
      "Contract delivery across AI SaaS and multi-tenant commerce where APIs, collaboration, and tenant-aware systems mattered.",
    experienceIds: ["klliq", "tjar"],
    visualState: "building",
    sortOrder: 2,
  },
  {
    id: "owning-production-systems",
    title: "Owning production systems",
    period: "2024 – Present",
    proposition: "Integrations, reliability, and operational ownership.",
    description:
      "Business-critical backends across education payments, ERP workflows, and multi-merchant commerce operations.",
    experienceIds: ["theqah", "kayanac-erp", "mohssilh"],
    visualState: "owning",
    sortOrder: 3,
  },
  {
    id: "independent-track",
    title: "Independent engineering track",
    period: "2020 – Present",
    proposition: "Studio and freelance delivery running in parallel.",
    description:
      "Phoenix Tech’s independent product/engineering track and Upwork freelance progression — parallel lane, not a fourth chronological era.",
    experienceIds: ["phoenix-techs", "upwork-freelance"],
    visualState: "independent",
    sortOrder: 4,
  },
];

/** Ordered primary company path for the Career Timefield (homepage). */
export const CAREER_TIMEFIELD_PRIMARY_IDS = [
  "eraasoft",
  "intsolutions",
  "klliq",
  "tjar",
  "theqah",
  "kayanac-erp",
  "mohssilh",
] as const;

export const CAREER_TIMEFIELD_INDEPENDENT_IDS = [
  "phoenix-techs",
  "upwork-freelance",
] as const;

/** Optional supporting disclosure — not a main Timefield node. */
export const CAREER_TIMEFIELD_SUPPORTING_IDS = ["marqity"] as const;