import { z } from "zod";

import { CANONICAL_PROJECT_SLUGS } from "@/lib/portfolio/projects/canonical-projects";

export const publicMediaRoleSchema = z.enum([
  "cover",
  "cover-card",
  "architecture",
  "dashboard",
  "product-screenshot",
  "mobile-screenshot",
  "machine-photo",
  "product-photo",
  "integration-flow",
]);

export const publicMediaAssetSchema = z.object({
  role: publicMediaRoleSchema,
  src: z.string().regex(/^\/portfolio\/projects\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  aspectRatio: z.number().positive(),
  alt: z.string().trim().min(1),
  caption: z.string().trim().min(1).nullable(),
  order: z.number().int().nonnegative(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
}).strict();

export const publicMediaProjectSchema = z.object({
  slug: z.enum(CANONICAL_PROJECT_SLUGS),
  assets: z.array(publicMediaAssetSchema).min(2),
}).strict();

export const publicMediaManifestSchema = z.object({
  schemaVersion: z.literal(1),
  projects: z.array(publicMediaProjectSchema).length(13),
}).strict();

export type PublicMediaRole = z.infer<typeof publicMediaRoleSchema>;
export type PublicMediaAsset = z.infer<typeof publicMediaAssetSchema>;
export type PublicMediaManifest = z.infer<typeof publicMediaManifestSchema>;
