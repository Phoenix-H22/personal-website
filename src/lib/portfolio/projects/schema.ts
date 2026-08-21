import { z } from "zod";

import {
  CANONICAL_PROJECTS,
  CANONICAL_PROJECT_SLUGS,
  CANONICAL_PROJECT_TITLES,
  FEATURED_PROJECT_SLUGS,
  LISTING_PROJECT_SLUGS,
} from "@/lib/portfolio/projects/canonical-projects";
import {
  isForbiddenPublicRole,
  PUBLIC_PROJECT_ROLE_BY_SLUG,
} from "@/lib/portfolio/projects/public-roles";

const canonicalSlugByTitle = new Map(
  CANONICAL_PROJECTS.map(({ title, slug }) => [title, slug]),
);

const ownershipTypeSchema = z.enum([
  "founder-built",
  "built-entirely",
  "backend-devops-owner",
  "technical-owner",
  "lead-developer",
  "major-contributor",
]);

const publicStatusSchema = z.enum([
  "live",
  "active-development",
  "completed",
  "completed-before-launch",
  "archived",
]);

const categorySchema = z.enum([
  "platforms-saas",
  "commerce",
  "mobile-products",
  "fintech-payments",
  "connected-devices",
  "integrations",
  "ai-data",
  "healthcare",
]);

const capabilitySchema = z.enum([
  "Backend Architecture",
  "DevOps",
  "High Scale",
  "Multi-Tenancy",
  "MQTT",
  "Raspberry Pi",
  "Payments",
  "External APIs",
  "Mobile Apps",
  "Shopify",
  "WordPress",
  "AI / OCR",
  "Queues / Horizon",
  "Security",
  "Real-Time Updates",
]);

const nullablePublicUrlSchema = z.string().url().nullable();

const verifiedMetricSchema = z.object({
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
  context: z.string().trim().min(1).nullable(),
  evidence: z.enum(["verified", "owner-confirmed", "source-supported"]),
}).strict();

const caseStudySchema = z.object({
  heroStatement: z.string().trim().min(1),
  problem: z.string().trim().min(1),
  ownership: z.string().trim().min(1),
  sections: z.array(
    z.object({
      id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      heading: z.string().trim().min(1),
      body: z.string().trim().min(1),
    }).strict(),
  ),
}).strict();

export const publicProjectContentSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    slug: z.enum(CANONICAL_PROJECT_SLUGS),
    title: z.enum(CANONICAL_PROJECT_TITLES),
    shortTagline: z.string().trim().min(1),
    publicSummary: z.string().trim().min(1),
    role: z.string().trim().min(1),
    ownershipType: ownershipTypeSchema,
    status: publicStatusSchema,
    primaryCategory: categorySchema,
    secondaryCategory: categorySchema.nullable(),
    systemType: z.string().trim().min(1),
    strongestCapability: z.string().trim().min(1),
    technologies: z.array(z.string().trim().min(1)).min(1).max(10),
    capabilities: z.array(capabilitySchema).min(1),
    verifiedMetrics: z.array(verifiedMetricSchema).max(4),
    links: z.object({
      website: nullablePublicUrlSchema,
      publicGitHub: nullablePublicUrlSchema,
      appStore: nullablePublicUrlSchema,
      googlePlay: nullablePublicUrlSchema,
    }).strict(),
    featured: z.boolean(),
    featuredOrder: z.number().int().positive().nullable(),
    listingOrder: z.number().int().positive(),
    lastReviewed: z.string().date(),
    confidentiality: z.enum(["public", "public-limited"]),
    caseStudyAvailability: z.enum(["hidden", "planned", "published"]),
    caseStudy: caseStudySchema.nullable(),
  }).strict()
  .superRefine((project, ctx) => {
    if (project.id !== project.slug) {
      ctx.addIssue({ code: "custom", path: ["id"], message: "id must equal slug" });
    }
    if (project.featured !== (project.featuredOrder !== null)) {
      ctx.addIssue({
        code: "custom",
        path: ["featuredOrder"],
        message: "featured and featuredOrder must agree",
      });
    }
    if (isForbiddenPublicRole(project.role)) {
      ctx.addIssue({
        code: "custom",
        path: ["role"],
        message: "role must not use Founder, Architect, Owner, Lead, Senior, Principal, or CTO",
      });
    }
    if (project.role !== PUBLIC_PROJECT_ROLE_BY_SLUG[project.slug]) {
      ctx.addIssue({
        code: "custom",
        path: ["role"],
        message: `role must match the approved public role for ${project.slug}`,
      });
    }
    if (
      project.caseStudyAvailability === "published" &&
      project.caseStudy === null
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["caseStudy"],
        message: "published case studies require public case-study data",
      });
    }
    if (
      project.caseStudyAvailability !== "published" &&
      project.caseStudy !== null
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["caseStudy"],
        message: "unpublished case studies must not expose case-study data",
      });
    }
  });

export const publicProjectsSnapshotSchema = z
  .object({
    schemaVersion: z.literal(1),
    projects: z.array(publicProjectContentSchema).length(13),
  }).strict()
  .superRefine((snapshot, ctx) => {
    const slugs = snapshot.projects.map(({ slug }) => slug);
    const titles = snapshot.projects.map(({ title }) => title);
    const listingOrder = snapshot.projects.map(({ listingOrder }) => listingOrder);
    const featured = snapshot.projects
      .filter(({ featured }) => featured)
      .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
      .map(({ slug }) => slug);
    const listed = [...snapshot.projects]
      .sort((a, b) => a.listingOrder - b.listingOrder)
      .map(({ slug }) => slug);

    const checkExactSet = (
      actual: readonly string[],
      expected: readonly string[],
      path: string,
    ) => {
      if (new Set(actual).size !== actual.length) {
        ctx.addIssue({ code: "custom", path: ["projects"], message: `Duplicate ${path}` });
      }
      if (
        actual.length !== expected.length ||
        expected.some((value) => !actual.includes(value))
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["projects"],
          message: `Snapshot must contain exact canonical ${path}`,
        });
      }
    };

    checkExactSet(slugs, CANONICAL_PROJECT_SLUGS, "slugs");
    checkExactSet(titles, CANONICAL_PROJECT_TITLES, "titles");
    for (const [index, project] of snapshot.projects.entries()) {
      if (canonicalSlugByTitle.get(project.title) !== project.slug) {
        ctx.addIssue({
          code: "custom",
          path: ["projects", index, "slug"],
          message: "Canonical title and slug must match",
        });
      }
    }
    if (new Set(listingOrder).size !== 13) {
      ctx.addIssue({ code: "custom", path: ["projects"], message: "Listing order must be unique" });
    }
    if (featured.join("|") !== FEATURED_PROJECT_SLUGS.join("|")) {
      ctx.addIssue({ code: "custom", path: ["projects"], message: "Featured order is invalid" });
    }
    if (listed.join("|") !== LISTING_PROJECT_SLUGS.join("|")) {
      ctx.addIssue({ code: "custom", path: ["projects"], message: "Listing order is invalid" });
    }
  });

export type PublicProjectContentInput = z.input<typeof publicProjectContentSchema>;
