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
    id: "kayanac-erp-rejoin",
    company: "Kayanac ERP",
    companyShortName: "Kayanac",
    sourceAliases: [],
    role: "Software Engineer",
    kind: "employment",
    employmentType: "full-time",
    startDate: "2026-08",
    endDate: null,
    isCurrent: true,
    location: "Maadi, Egypt",
    workMode: null,
    mission:
      "Rejoined Kayanac ERP after an earlier 2025 contract, continuing work on its ERP platform and operational workflows.",
    summary:
      "Rejoined Kayanac ERP after an earlier 2025 contract, continuing work on its ERP platform and operational workflows.",
    highlights: [],
    outcomes: [],
    technologies: ["Laravel", "MySQL", "ERP"],
    companyUrl: null,
    linkedinSourceUrl: null,
    logo: companyLogo(portfolioAssets.companies.kayanac, "Kayanac ERP"),
    confidentiality: "client-confidential",
    publicationLevel: "primary",
    featured: true,
    era: "owning-production-systems",
    sortOrder: 1,
    sources: [
      {
        type: "owner",
        reference:
          "Owner-confirmed · Aug 2026 – Present · Software Engineer · Full-time · rejoin",
        confidence: "owner-confirmed",
      },
      {
        type: "canonical-content",
        reference:
          "docs/CANONICAL_CONTENT.md · Kayanac second period Aug 2026 – Present · Full-time",
        confidence: "owner-confirmed",
      },
    ],
    needsOwnerConfirmation: [],
  },
  {
    id: "theqah-rejoin",
    company: "Theqah.sa",
    companyShortName: "Theqah",
    sourceAliases: ["شركة موقع الثقة", "Theqah company"],
    role: "Software Engineer",
    kind: "employment",
    employmentType: "full-time",
    startDate: "2025-09",
    endDate: "2026-06",
    isCurrent: false,
    location: "Riyadh, Saudi Arabia",
    workMode: null,
    mission:
      "Returned to Theqah to deliver production systems across connected products and client projects.",
    summary:
      "Rejoined Theqah part-time, then transitioned to full-time as project scope expanded. Worked on multiple production projects under Theqah management and collaborated directly with the CEO on requirements, delivery, and release support.",
    highlights: [
      "Smart Lockers platform delivery",
      "Wasfaty medication dispensing workflows",
      "AI Photo Station",
      "Chocolate Vending Machines",
      "Requirement analysis, staged delivery, and stakeholder reviews",
    ],
    outcomes: [],
    technologies: [
      "Laravel",
      "APIs",
      "Integrations",
      "IoT workflows",
      "Payment systems",
    ],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: companyLogo(portfolioAssets.companies.theqah, "Theqah"),
    confidentiality: "client-confidential",
    publicationLevel: "primary",
    featured: true,
    era: "owning-production-systems",
    sortOrder: 5,
    sources: [
      {
        type: "owner",
        reference:
          "Owner-confirmed · Sep 2025 – Jun 2026 · Software Engineer · rejoin after break",
        confidence: "owner-confirmed",
      },
      {
        type: "canonical-content",
        reference:
          "docs/CANONICAL_CONTENT.md · Theqah second period Sep 2025 – Jun 2026",
        confidence: "owner-confirmed",
      },
    ],
    needsOwnerConfirmation: [],
  },
  {
    id: "mohssilh",
    company: "Mohssilh / محصلة",
    companyShortName: "Mohssilh",
    sourceAliases: ["Mohsillh"],
    role: "Backend Software Engineer",
    kind: "employment",
    employmentType: "full-time",
    startDate: "2025-03",
    endDate: "2026-04",
    isCurrent: false,
    location: "Saudi Arabia",
    workMode: null,
    mission:
      "Building backend integrations, reporting, and reconciliation systems for multi-merchant commerce operations.",
    summary:
      "Designed and maintained backend services for a multi-merchant reporting and reconciliation platform integrated with Salla APIs — including queues, webhooks, MySQL optimization, and production support.",
    highlights: [
      "Reliable synchronization with queues, Redis caching, and webhook handling",
      "Product-sales reporting workflow materially optimized",
      "Webhook failure rate reduced to nearly zero",
      "Zero downtime maintained across a three-month period",
    ],
    outcomes: [
      "200 registered merchants",
      "20K average monthly orders",
      "Approximately SAR 12M in order value across roughly 2–3 months",
      "Webhook failure rate reduced to nearly zero",
      "Zero downtime across a three-month period",
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
        type: "owner",
        reference:
          "Owner-confirmed · Mar 2025 – Apr 2026 · Backend Software Engineer",
        confidence: "owner-confirmed",
      },
      {
        type: "linkedin",
        reference: `${LINKEDIN} · March 2025 – April 2026 · Backend Engineer · spelling variant Mohsillh in body`,
        confidence: "multiple-sources",
      },
      {
        type: "canonical-content",
        reference: "docs/CANONICAL_CONTENT.md · Mohssilh Mar 2025 – Apr 2026",
        confidence: "owner-confirmed",
      },
    ],
    needsOwnerConfirmation: [],
  },
  {
    id: "kayanac-erp",
    company: "Kayanac ERP",
    companyShortName: "Kayanac",
    sourceAliases: [],
    role: "Software Engineer (Contract)",
    kind: "contract",
    employmentType: "contract",
    startDate: "2025-03",
    endDate: "2025-06",
    isCurrent: false,
    location: "Maadi, Egypt",
    workMode: "onsite",
    mission:
      "Fixed-term contract turning manual operational processes into structured ERP workflows.",
    summary:
      "Contract engagement building ERP modules across HR/employee management, attendance, biometric/fingerprint integration, payroll, CRM, transportation pricing, GPS workflows, and notifications.",
    highlights: [
      "Refactored legacy Laravel code into cleaner service-based modules",
      "HR, attendance, payroll, and CRM workflow delivery",
      "Biometric/fingerprint and GPS-related operational features",
      "Blade, Bootstrap, and jQuery UI surfaces where required",
    ],
    outcomes: [
      "ERP used by 2,000 active employees",
      "Achieved ~60% reduction in operational error rates",
    ],
    technologies: [
      "Laravel",
      "MySQL",
      "Blade",
      "Bootstrap",
      "jQuery",
      "ERP modules",
    ],
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
        type: "owner",
        reference:
          "Owner-confirmed · Mar 2025 – Jun 2025 · Software Engineer (Contract)",
        confidence: "owner-confirmed",
      },
      {
        type: "resume",
        reference: `${RESUME} · Mar 2025 – Jun 2025 · contract / fixed-term`,
        confidence: "owner-confirmed",
      },
    ],
    needsOwnerConfirmation: [],
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
      "Backend and product delivery for education and payment-related systems.",
    summary:
      "Built and maintained education and payment systems with reliability and checkout performance as primary concerns. Face-recognition payment work for a school canteen (Fushati) was completed but not adopted in production.",
    highlights: [
      "Education and payment system delivery",
      "Caching and load considerations for peak traffic",
      "Technical planning, testing, and release support with stakeholders",
    ],
    outcomes: [],
    technologies: ["Laravel", "Caching", "Payment systems", "APIs"],
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
        type: "owner",
        reference:
          "Owner-confirmed · Aug 2024 – Feb 2025 · Software Engineer · first period",
        confidence: "owner-confirmed",
      },
      {
        type: "resume",
        reference: `${RESUME} · Aug 2024 – Feb 2025 · Software Engineer`,
        confidence: "owner-confirmed",
      },
      {
        type: "canonical-content",
        reference:
          "docs/CANONICAL_CONTENT.md · Theqah first period Aug 2024 – Feb 2025",
        confidence: "owner-confirmed",
      },
    ],
    needsOwnerConfirmation: [],
  },
  {
    id: "tjar",
    company: "Tjar.sa",
    companyShortName: "Tjar",
    sourceAliases: [],
    role: "Software Engineer (Contract)",
    kind: "contract",
    employmentType: "contract",
    startDate: "2024-03",
    endDate: "2024-05",
    isCurrent: false,
    location: "Saudi Arabia",
    workMode: null,
    mission: "Building tenant-aware commerce infrastructure and merchant analytics.",
    summary:
      "Built and maintained a multi-tenant e-commerce SaaS platform with Laravel, Livewire, and Tailwind.",
    highlights: [
      "Tenant-aware commerce infrastructure",
      "Merchant analytics dashboards",
      "Laravel / Livewire / Tailwind delivery",
    ],
    outcomes: [],
    technologies: ["Laravel", "Livewire", "Tailwind CSS", "Multi-tenant architecture"],
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
    needsOwnerConfirmation: [],
  },
  {
    id: "klliq",
    company: "KLLIQ LLC",
    companyShortName: "KLLIQ",
    sourceAliases: [],
    role: "Software Engineer (Contract)",
    kind: "contract",
    employmentType: "contract",
    startDate: "2023-09",
    endDate: "2024-03",
    isCurrent: false,
    location: "Khamis Mushait, Saudi Arabia",
    workMode: null,
    mission: "Short contract developing and stabilizing APIs and product surfaces.",
    summary:
      "Contract engagement focused on API development and product stabilization across SaaS, CRM, and social application surfaces.",
    highlights: [
      "API development and bug resolution",
      "Legacy-code refactoring",
      "Iterative delivery with stakeholder feedback",
    ],
    outcomes: [],
    technologies: ["APIs", "SaaS", "CRM"],
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
    needsOwnerConfirmation: [],
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
    publicationLevel: "archive",
    featured: false,
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
    publicationLevel: "archive",
    featured: false,
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
    role: "Software Engineer",
    kind: "independent-company",
    employmentType: "other",
    startDate: "2021-08",
    endDate: null,
    isCurrent: true,
    location: "Banha, Al Qalyubiyah, Egypt",
    workMode: null,
    mission:
      "Self-employed software engineering through which selected products and client projects are delivered.",
    summary:
      "Independent Software Engineer track for selected products and project delivery. Kept as a parallel lane — not the primary employment story.",
    highlights: [
      "Selected SaaS and API delivery",
      "Payment and authentication integrations when needed",
      "Documentation and staged handoff for clients",
    ],
    outcomes: [],
    technologies: ["Laravel", "APIs", "MySQL", "Docker"],
    companyUrl: null,
    linkedinSourceUrl: "https://www.linkedin.com/in/alkady22/",
    logo: companyLogo(
      portfolioAssets.companies.phoenixTechs,
      "Phoenix Tech’s",
    ),
    confidentiality: "private",
    /**
     * Preserved in source/archive. Intentionally excluded from recruiter-facing
     * Career rendering (not in CAREER_TIMEFIELD_INDEPENDENT_IDS).
     * Do not delete this record — hide from public Career only.
     */
    publicationLevel: "archive",
    featured: false,
    era: "independent-track",
    sortOrder: 100,
    sources: [
      {
        type: "owner",
        reference:
          "Owner-confirmed · Aug 2021 – Present · Software Engineer · self-employed / own startup vehicle · preserved source; hidden from public Career",
        confidence: "owner-confirmed",
      },
      {
        type: "canonical-content",
        reference:
          "docs/CANONICAL_CONTENT.md · Phoenix Tech’s Aug 2021 – Present · preserved in source; excluded from public Career",
        confidence: "owner-confirmed",
      },
    ],
    needsOwnerConfirmation: [],
  },
  {
    id: "upwork-freelance",
    company: "Upwork",
    companyShortName: "Upwork",
    sourceAliases: ["upwork"],
    role: "Freelance Software Engineer",
    kind: "freelance",
    employmentType: "freelance",
    startDate: "2023-08",
    endDate: null,
    isCurrent: true,
    location: null,
    workMode: "remote",
    mission:
      "Independent client delivery across backends, integrations, and web products under a personal Upwork profile.",
    summary:
      "Freelance Software Engineer track for selected client systems and remote delivery. Separate from Phoenix Tech’s. Career emphasizes duration and progression — Hero keeps the Upwork Top Rated credential.",
    highlights: [
      "Top Rated freelance delivery track",
      "Selected client systems across Laravel and modern frontends",
      "Remote deployment and production support workflows",
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
        type: "owner",
        reference:
          "Owner-confirmed · Aug 2023 – Present · Freelance Software Engineer",
        confidence: "owner-confirmed",
      },
      {
        type: "linkedin",
        reference: `${LINKEDIN} · August 2023 – Present · Freelance Full Stack Developer`,
        confidence: "multiple-sources",
      },
      {
        type: "canonical-content",
        reference: "Hero / proof-engine Upwork Top Rated · 100% JSS credential",
        confidence: "owner-confirmed",
      },
    ],
    needsOwnerConfirmation: [],
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
    id: "shipping-products",
    title: "Shipping products across teams",
    period: "2023 – 2024",
    proposition: "Contract delivery across APIs and commerce systems.",
    description:
      "Short contract engagements focused on APIs, SaaS commerce, and tenant-aware product surfaces.",
    experienceIds: ["klliq", "tjar"],
    visualState: "building",
    sortOrder: 1,
  },
  {
    id: "owning-production-systems",
    title: "ERP & operations",
    period: "2024 – Present",
    proposition: "Integrations, reliability, and production delivery.",
    description:
      "Production backends and connected products across education/payment systems, ERP workflows, multi-merchant commerce, a return to Theqah, and a later return to Kayanac.",
    experienceIds: [
      "theqah",
      "kayanac-erp",
      "mohssilh",
      "theqah-rejoin",
      "kayanac-erp-rejoin",
    ],
    visualState: "owning",
    sortOrder: 2,
  },
  {
    id: "independent-track",
    title: "Freelance",
    period: "2023 – Present",
    proposition: "Freelance delivery running in parallel with employment.",
    description:
      "Upwork freelance Software Engineer track — parallel lane, not a chronological employment era. Phoenix Tech’s remains in source/archive data but is excluded from recruiter-facing Career rendering.",
    /** Source-complete IDs (includes archived Phoenix). Public Career uses CAREER_TIMEFIELD_INDEPENDENT_IDS. */
    experienceIds: ["phoenix-techs", "upwork-freelance"],
    visualState: "independent",
    sortOrder: 3,
  },
];

/** Ordered primary company path for the Career Timefield (homepage). */
export const CAREER_TIMEFIELD_PRIMARY_IDS = [
  "klliq",
  "tjar",
  "theqah",
  "kayanac-erp",
  "mohssilh",
  "theqah-rejoin",
  "kayanac-erp-rejoin",
] as const;

/**
 * Public Independent / Freelance lane for Career UI.
 * Phoenix Tech’s (`phoenix-techs`) is intentionally omitted here — preserved in
 * `experience` + archive — re-enable by adding the id back to this list.
 */
export const CAREER_TIMEFIELD_INDEPENDENT_IDS = ["upwork-freelance"] as const;

/** Optional supporting disclosure — not a main Timefield node. */
export const CAREER_TIMEFIELD_SUPPORTING_IDS = ["marqity"] as const;