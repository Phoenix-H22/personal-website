import { z } from "zod";

const evidenceStatusSchema = z.enum([
  "verified",
  "owner-confirmed",
  "source-supported",
  "unverified",
  "not-applicable",
]);

const publicationStatusSchema = z.enum([
  "draft",
  "review",
  "published",
  "hidden",
]);

const visibilitySchema = z.enum(["public", "unlisted", "private"]);

const confidentialitySchema = z.enum([
  "public",
  "public-limited",
  "private",
  "internal-only",
]);

const projectStatusSchema = z.enum([
  "live",
  "in-development",
  "completed",
  "maintained",
  "archived",
]);

export const projectMetricDtoSchema = z.object({
  id: z.string().min(1),
  value: z.string().min(1),
  label: z.string().min(1),
  context: z.string().optional(),
  evidenceStatus: evidenceStatusSchema,
  public: z.boolean(),
});

export const projectMediaDtoSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["image", "video", "diagram", "logo"]),
  role: z.enum(["cover", "gallery", "diagram", "logo", "og"]).optional(),
  src: z.string().min(1),
  width: z.number().positive(),
  height: z.number().positive(),
  alt: z.string().min(1),
  caption: z.string().optional(),
  credit: z.string().optional(),
  blurDataURL: z.string().optional(),
  focalPoint: z
    .object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    })
    .optional(),
  sortOrder: z.number().int().optional(),
});

export const projectLinkDtoSchema = z.object({
  type: z.enum([
    "live",
    "repository",
    "demo",
    "store",
    "article",
    "documentation",
  ]),
  label: z.string().min(1),
  url: z.string().url(),
  public: z.boolean(),
});

export const projectVisualThemeDtoSchema = z.object({
  id: z.string().min(1),
  primary: z.enum(["cyan", "blue", "violet", "green", "amber"]),
  secondary: z.enum(["cyan", "blue", "violet", "green", "amber"]).optional(),
  motif: z.enum([
    "order-lifecycle",
    "message-routing",
    "scan-pay-release",
    "city-map",
    "clinic-flow",
    "document-pipeline",
    "neutral",
  ]),
});

export const projectSeoDtoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  canonicalPath: z.string().min(1),
  openGraphTitle: z.string().optional(),
  openGraphDescription: z.string().optional(),
  openGraphImageId: z.string().optional(),
  robots: z.object({
    index: z.boolean(),
    follow: z.boolean(),
  }),
  structuredDataType: z.enum([
    "CreativeWork",
    "SoftwareApplication",
    "WebApplication",
    "MobileApplication",
  ]),
  publishedAt: z.string().optional(),
  modifiedAt: z.string().min(1),
});

const blockBase = {
  id: z.string().min(1),
  order: z.number().int().nonnegative(),
  publicationStatus: publicationStatusSchema,
  heading: z.string().optional(),
  anchor: z.string().optional(),
};

export const projectCaseStudyBlockDtoSchema = z.discriminatedUnion("type", [
  z.object({
    ...blockBase,
    type: z.enum([
      "overview",
      "context",
      "problem",
      "ownership",
      "constraints",
      "workflow",
      "implementation",
      "integration",
      "reliability",
      "security",
      "performance",
      "difficult-edge-case",
      "outcome",
      "lesson",
      "retrospective",
      "next-step",
    ]),
    body: z.string().min(1),
  }),
  z.object({
    ...blockBase,
    type: z.literal("architecture"),
    summary: z.string().min(1),
    nodes: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        detail: z.string(),
        kind: z.string(),
      }),
    ),
    connections: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
      }),
    ),
    textAlternative: z.string().min(1),
  }),
  z.object({
    ...blockBase,
    type: z.literal("engineering-decision"),
    context: z.string().min(1),
    decision: z.string().min(1),
    alternativesRejected: z.array(z.string()).optional(),
    tradeOff: z.string().min(1),
    outcome: z.string().min(1),
  }),
  z.object({
    ...blockBase,
    type: z.literal("metrics"),
    metricIds: z.array(z.string()),
  }),
  z.object({
    ...blockBase,
    type: z.enum(["image", "video"]),
    mediaId: z.string().min(1),
  }),
  z.object({
    ...blockBase,
    type: z.literal("gallery"),
    mediaIds: z.array(z.string()),
  }),
  z.object({
    ...blockBase,
    type: z.literal("system-diagram"),
    diagramId: z.string().min(1),
    textAlternative: z.string().min(1),
  }),
  z.object({
    ...blockBase,
    type: z.literal("quote"),
    quote: z.string().min(1),
    attribution: z.string().optional(),
  }),
]);

export const projectCaseStudyDtoSchema = z
  .object({
    id: z.string().min(1),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    shortTitle: z.string().min(1),
    subtitle: z.string().min(1),
    summary: z
      .string()
      .min(1)
      .refine((value) => !value.includes("PENDING_"), {
        message: "Published summaries cannot contain PENDING_ placeholders",
      }),
    status: projectStatusSchema,
    publicationStatus: publicationStatusSchema,
    visibility: visibilitySchema,
    confidentiality: confidentialitySchema,
    period: z.object({
      start: z.string().nullable(),
      end: z.string().nullable(),
      label: z.string().optional(),
    }),
    company: z
      .object({
        id: z.string(),
        name: z.string(),
        publishName: z.boolean(),
      })
      .optional(),
    domains: z.array(z.string()),
    roles: z.array(z.string()),
    platforms: z.array(z.string()),
    technologies: z.array(z.string()),
    ownershipSummary: z.string().min(1),
    strongestProof: projectMetricDtoSchema.optional(),
    featured: z.boolean(),
    homepageOrder: z.number().int().positive().nullable(),
    workOrder: z.number().int().nonnegative(),
    cover: projectMediaDtoSchema.nullable(),
    visualTheme: projectVisualThemeDtoSchema,
    caseStudyAvailable: z.boolean(),
    problem: z.string().min(1),
    ownership: z.string().min(1),
    constraints: z.array(z.string()),
    metrics: z.array(projectMetricDtoSchema),
    links: z.array(projectLinkDtoSchema),
    gallery: z.array(projectMediaDtoSchema),
    blocks: z.array(projectCaseStudyBlockDtoSchema),
    seo: projectSeoDtoSchema,
    publishedAt: z.string().optional(),
    updatedAt: z.string().min(1),
    relatedSlugs: z.array(z.string()),
  })
  .superRefine((project, ctx) => {
    if (
      project.publicationStatus === "published" &&
      project.visibility === "public" &&
      project.confidentiality === "internal-only"
    ) {
      ctx.addIssue({
        code: "custom",
        message: "internal-only projects cannot be published publicly",
        path: ["confidentiality"],
      });
    }

    for (const metric of project.metrics) {
      if (
        metric.public &&
        (metric.evidenceStatus === "unverified" ||
          metric.evidenceStatus === "not-applicable")
      ) {
        ctx.addIssue({
          code: "custom",
          message: `Public metric ${metric.id} requires stronger evidence`,
          path: ["metrics"],
        });
      }
    }
  });

export type ProjectCaseStudyDto = z.infer<typeof projectCaseStudyDtoSchema>;
