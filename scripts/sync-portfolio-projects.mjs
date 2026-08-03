/**
 * Deterministic read-only portfolio snapshot generator.
 *
 * Input is a short-lived, allowlisted export prepared through the connected
 * read-only Notion MCP. Stable editorial fields live in tracked JSON. The
 * generated snapshot is read only for difference reporting, never generation.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";
import { z } from "zod";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "lib", "portfolio", "projects", "data");
const SNAPSHOT_PATH = path.join(DATA_DIR, "public-projects.snapshot.json");
const EDITORIAL_PATH = path.join(DATA_DIR, "public-projects.editorial.json");
const MEDIA_PATH = path.join(DATA_DIR, "public-media-manifest.json");
const PUBLIC_MEDIA_ROOT = path.join(ROOT, "public", "portfolio", "projects");
const TEMP_EXPORT_ROOT = path.join(ROOT, ".portfolio-sync");

const CANONICAL = [
  ["Smart Lockers Platform", "smart-lockers-platform"],
  ["Riders Shopify & WordPress Integrations", "riders-shopify-wordpress"],
  ["Alzahaby Loyalty App", "alzahaby-loyalty-app"],
  ["Autopay EG", "autopay-eg"],
  ["Warqah Store", "warqah-store"],
  ["Your Obour Guide", "your-obour-guide"],
  ["Chocolate Smart Vending", "chocolate-smart-vending"],
  ["NABD", "nabd"],
  ["PDF Extractor", "pdf-extractor"],
  ["PinoyAid", "pinoyaid"],
  ["SIM Express", "sim-express"],
  ["Tawfir", "tawfir"],
  ["Wasfaty Smart Vending", "wasfaty-smart-vending"],
];

const TITLE_TO_SLUG = new Map(CANONICAL);
const CANONICAL_TITLES = CANONICAL.map(([title]) => title);
const CANONICAL_SLUGS = CANONICAL.map(([, slug]) => slug);
const FEATURED_SLUGS = [
  "smart-lockers-platform",
  "warqah-store",
  "your-obour-guide",
  "autopay-eg",
  "nabd",
  "wasfaty-smart-vending",
  "alzahaby-loyalty-app",
];
const LISTING_SLUGS = [
  ...FEATURED_SLUGS,
  "riders-shopify-wordpress",
  "sim-express",
  "tawfir",
  "pdf-extractor",
  "pinoyaid",
  "chocolate-smart-vending",
];

const FORBIDDEN_PUBLIC_PATTERNS = [
  /\b[a-z]:[\\/](?![\\/])/i,
  /\.portfolio-private/i,
  /(?:notion\.so|notion\.com)/i,
  /prod-files-secure\.s3/i,
  /[?&](?:x-amz-[^=]*|signature|credential|expires|security-token)=/i,
  /local\s+dir/i,
  /missing\s+details/i,
  /needs\s+my\s+answer/i,
  /internal\s+project\s+inventory/i,
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
  /\b[0-9a-f]{32}\b/i,
  /https?:\/\/(?:www\.)?github\.com\//i,
  /source-pack/i,
  /\b(?:candidate|rejected)[-_ ]media\b/i,
  /notion[_ -]?(?:token|api[_ -]?key)/i,
  /(?:api|client|access)[_ -]?(?:secret|token)/i,
  /authorization\s*:/i,
  /bearer\s+[a-z0-9]/i,
];

const FORBIDDEN_ROLE_LABELS = new Set([
  "built entirely by me",
  "founder built",
  "technical owner",
]);

const APPROVED_OWNERSHIP_ROLE_MATCHES = new Map([
  ["warqah-store", "Backend & DevOps Owner"],
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

const normalizedCategorySchema = z.enum([
  "platforms-saas",
  "commerce",
  "mobile-products",
  "fintech-payments",
  "connected-devices",
  "integrations",
  "ai-data",
  "healthcare",
]);

const metricSchema = z
  .object({
    value: z.string().trim().min(1),
    label: z.string().trim().min(1),
    context: z.string().trim().min(1).nullable(),
    evidence: z.enum(["verified", "owner-confirmed", "source-supported"]),
  })
  .strict();

const linksSchema = z
  .object({
    website: z.string().url().nullable(),
    publicGitHub: z.string().url().nullable(),
    appStore: z.string().url().nullable(),
    googlePlay: z.string().url().nullable(),
  })
  .strict();

const mcpProjectSchema = z
  .object({
    title: z.enum(CANONICAL_TITLES),
    shortTagline: z.string().trim().min(1),
    publicSummary: z.string().trim().min(1),
    publicSummarySource: z.enum([
      "executive-summary",
      "hero-supporting-line",
      "one-line-overview",
    ]),
    role: z.string().trim().min(1),
    ownership: z.enum([
      "Built Entirely by Me",
      "Technical Owner",
      "Backend & DevOps Owner",
      "Lead Developer",
      "Major Contributor",
    ]),
    status: z.enum([
      "Live in Production",
      "Active Development",
      "Completed",
      "Archived / Demo",
    ]),
    approvedStatus: z.literal("completed-before-launch").nullable(),
    primaryCategory: z.enum([
      "High-Scale Commerce",
      "IoT & Smart Machines",
      "SaaS & Platforms",
      "Mobile & Consumer Products",
      "E-commerce & Logistics Integrations",
      "AI & Automation",
      "Fintech & Payments",
    ]),
    capabilities: z.array(capabilitySchema).min(1),
    links: linksSchema,
    lastReviewed: z.string().date(),
    confidentiality: z.enum(["Public", "Limited Technical Details"]),
    needsImages: z.literal(false),
    needsMyAnswer: z.literal(false),
  })
  .strict()
  .superRefine((project, context) => {
    const isSimExpress = project.title === "SIM Express";
    if (isSimExpress !== (project.approvedStatus === "completed-before-launch")) {
      context.addIssue({
        code: "custom",
        path: ["approvedStatus"],
        message: "Only SIM Express requires its approved pre-launch status",
      });
    }
  });

const mcpExportSchema = z
  .object({
    schemaVersion: z.literal(1),
    source: z.literal("notion-mcp-read-only"),
    exportedAt: z.string().datetime({ offset: true }),
    projects: z.array(mcpProjectSchema).length(13),
  })
  .strict();

const editorialProjectSchema = z
  .object({
    slug: z.enum(CANONICAL_SLUGS),
    secondaryCategory: normalizedCategorySchema.nullable(),
    systemType: z.string().trim().min(1),
    strongestCapability: z.string().trim().min(1),
    technologies: z.array(z.string().trim().min(1)).min(1).max(10),
    verifiedMetrics: z.array(metricSchema).max(4),
    featured: z.boolean(),
    featuredOrder: z.number().int().positive().nullable(),
    listingOrder: z.number().int().positive(),
    caseStudyAvailability: z.enum(["hidden", "planned", "published"]),
    ownershipTypeOverride: z.literal("founder-built").nullable(),
    roleOverride: z.literal("Backend, Integration & DevOps Owner").optional(),
  })
  .strict()
  .superRefine((project, context) => {
    if (project.roleOverride && project.slug !== "wasfaty-smart-vending") {
      context.addIssue({
        code: "custom",
        path: ["roleOverride"],
        message: "Role override is approved only for Wasfaty Smart Vending",
      });
    }
  });

const editorialSchema = z
  .object({
    schemaVersion: z.literal(1),
    projects: z.array(editorialProjectSchema).length(13),
  })
  .strict();

const snapshotProjectSchema = z
  .object({
    id: z.string().min(1),
    slug: z.enum(CANONICAL_SLUGS),
    title: z.enum(CANONICAL_TITLES),
    shortTagline: z.string().trim().min(1),
    publicSummary: z.string().trim().min(1),
    role: z.string().trim().min(1),
    ownershipType: z.enum([
      "founder-built",
      "built-entirely",
      "backend-devops-owner",
      "technical-owner",
      "lead-developer",
      "major-contributor",
    ]),
    status: z.enum([
      "live",
      "active-development",
      "completed",
      "completed-before-launch",
      "archived",
    ]),
    primaryCategory: normalizedCategorySchema,
    secondaryCategory: normalizedCategorySchema.nullable(),
    systemType: z.string().trim().min(1),
    strongestCapability: z.string().trim().min(1),
    technologies: z.array(z.string().trim().min(1)).min(1).max(10),
    capabilities: z.array(capabilitySchema).min(1),
    verifiedMetrics: z.array(metricSchema).max(4),
    links: linksSchema,
    featured: z.boolean(),
    featuredOrder: z.number().int().positive().nullable(),
    listingOrder: z.number().int().positive(),
    lastReviewed: z.string().date(),
    confidentiality: z.enum(["public", "public-limited"]),
    caseStudyAvailability: z.enum(["hidden", "planned", "published"]),
    caseStudy: z.null(),
  })
  .strict();

const snapshotSchema = z
  .object({
    schemaVersion: z.literal(1),
    projects: z.array(snapshotProjectSchema).length(13),
  })
  .strict();

const mediaAssetSchema = z
  .object({
    role: z.enum([
      "cover",
      "cover-card",
      "architecture",
      "dashboard",
      "product-screenshot",
      "mobile-screenshot",
      "machine-photo",
      "product-photo",
      "integration-flow",
    ]),
    src: z.string().regex(/^\/portfolio\/projects\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    aspectRatio: z.number().positive(),
    alt: z.string().trim().min(1),
    caption: z.string().trim().min(1).nullable(),
    order: z.number().int().nonnegative(),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();

const mediaManifestSchema = z
  .object({
    schemaVersion: z.literal(1),
    projects: z
      .array(
        z
          .object({
            slug: z.enum(CANONICAL_SLUGS),
            assets: z.array(mediaAssetSchema).min(2),
          })
          .strict(),
      )
      .length(13),
  })
  .strict();

const DIFFERENCE_FIELDS = [
  "shortTagline",
  "publicSummary",
  "role",
  "ownershipType",
  "status",
  "primaryCategory",
  "secondaryCategory",
  "systemType",
  "strongestCapability",
  "technologies",
  "capabilities",
  "verifiedMetrics",
  "links",
  "featured",
  "featuredOrder",
  "listingOrder",
  "lastReviewed",
  "confidentiality",
  "caseStudyAvailability",
];

function fail(message) {
  throw new Error(message);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function safetyScan(label, value) {
  const serialized = JSON.stringify(value);
  for (const pattern of FORBIDDEN_PUBLIC_PATTERNS) {
    if (pattern.test(serialized)) {
      fail(`${label} failed public safety validation: ${pattern.source}`);
    }
  }
}

function assertExactSelection(values, expected, label) {
  const seen = new Set(values);
  if (seen.size !== values.length) fail(`${label} contains duplicates`);
  const missing = expected.filter((value) => !seen.has(value));
  const unknown = values.filter((value) => !expected.includes(value));
  if (missing.length || unknown.length) {
    fail(
      `${label} mismatch: missing=${missing.join(",") || "none"}; unknown=${unknown.join(",") || "none"}`,
    );
  }
}

function getInputPath() {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== "--input") {
    fail("Usage: npm run portfolio:sync -- --input .portfolio-sync/notion-export.json");
  }
  const inputPath = path.resolve(process.cwd(), args[1]);
  if (path.dirname(inputPath) !== TEMP_EXPORT_ROOT || path.extname(inputPath) !== ".json") {
    fail("MCP export must be a JSON file directly inside ignored .portfolio-sync/");
  }
  if (!fs.existsSync(inputPath)) fail(`MCP export not found: ${inputPath}`);
  return inputPath;
}

function validateFreshness(exportedAt) {
  const ageMilliseconds = Date.now() - Date.parse(exportedAt);
  const maximumAge = 24 * 60 * 60 * 1000;
  if (ageMilliseconds < -5 * 60 * 1000) fail("MCP export timestamp is in the future");
  if (ageMilliseconds > maximumAge) fail("MCP export is stale; create a new read-only export");
}

function validateMcpExport(rawExport) {
  const mcpExport = mcpExportSchema.parse(rawExport);
  validateFreshness(mcpExport.exportedAt);
  assertExactSelection(
    mcpExport.projects.map(({ title }) => title),
    CANONICAL_TITLES,
    "MCP canonical title selection",
  );
  safetyScan("MCP export", mcpExport);
  return mcpExport;
}

function validateEditorial(rawEditorial) {
  const editorial = editorialSchema.parse(rawEditorial);
  assertExactSelection(
    editorial.projects.map(({ slug }) => slug),
    CANONICAL_SLUGS,
    "Editorial project selection",
  );

  const featured = editorial.projects
    .filter(({ featured }) => featured)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
    .map(({ slug }) => slug);
  const listed = [...editorial.projects]
    .sort((a, b) => a.listingOrder - b.listingOrder)
    .map(({ slug }) => slug);
  if (featured.join("|") !== FEATURED_SLUGS.join("|")) fail("Invalid editorial featured order");
  if (listed.join("|") !== LISTING_SLUGS.join("|")) fail("Invalid editorial listing order");
  for (const project of editorial.projects) {
    if (project.featured !== (project.featuredOrder !== null)) {
      fail(`Editorial featured fields disagree for ${project.slug}`);
    }
  }
  safetyScan("Editorial input", editorial);
  return editorial;
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  });
}

async function validateMediaAsset(projectSlug, asset) {
  const expectedPrefix = `/portfolio/projects/${projectSlug}/`;
  if (!asset.src.startsWith(expectedPrefix)) fail(`Cross-project media path for ${projectSlug}`);
  const file = path.join(ROOT, "public", asset.src.replace(/^\//, ""));
  if (!fs.existsSync(file)) fail(`Missing public media: ${asset.src}`);
  if (sha256(file) !== asset.sha256) fail(`Hash mismatch: ${asset.src}`);

  const metadata = await sharp(file).metadata();
  if (metadata.format !== "webp") fail(`Public media is not WebP: ${asset.src}`);
  if (metadata.width !== asset.width || metadata.height !== asset.height) {
    fail(`Dimension mismatch: ${asset.src}`);
  }
  const aspectRatio = Number((asset.width / asset.height).toFixed(4));
  if (aspectRatio !== asset.aspectRatio) fail(`Aspect-ratio mismatch: ${asset.src}`);
  return path.normalize(file);
}

async function validateMedia(rawMedia) {
  const media = mediaManifestSchema.parse(rawMedia);
  assertExactSelection(
    media.projects.map(({ slug }) => slug),
    CANONICAL_SLUGS,
    "Media project selection",
  );
  safetyScan("Public media manifest", media);

  const manifestFiles = new Set();
  const roleCounts = new Map();
  let totalAssets = 0;
  let galleryAssets = 0;
  for (const project of media.projects) {
    const orders = project.assets.map(({ order }) => order);
    if (new Set(orders).size !== orders.length) fail(`Duplicate media order for ${project.slug}`);
    if (orders.some((order, index) => order !== index)) {
      fail(`Media order must be contiguous for ${project.slug}`);
    }

    const projectRoleCounts = new Map();
    for (const asset of project.assets) {
      projectRoleCounts.set(asset.role, (projectRoleCounts.get(asset.role) ?? 0) + 1);
      roleCounts.set(asset.role, (roleCounts.get(asset.role) ?? 0) + 1);
      if (!["cover", "cover-card", "architecture"].includes(asset.role)) galleryAssets += 1;
      manifestFiles.add(await validateMediaAsset(project.slug, asset));
      totalAssets += 1;
    }

    if (projectRoleCounts.get("cover") !== 1 || projectRoleCounts.get("cover-card") !== 1) {
      fail(`Invalid required cover media for ${project.slug}`);
    }
    const architectureCount = projectRoleCounts.get("architecture") ?? 0;
    const expectedArchitectureCount = project.slug === "riders-shopify-wordpress" ? 0 : 1;
    if (architectureCount !== expectedArchitectureCount) {
      fail(`Invalid architecture media for ${project.slug}`);
    }
  }

  if (
    totalAssets !== 52 ||
    roleCounts.get("cover") !== 13 ||
    roleCounts.get("cover-card") !== 13 ||
    roleCounts.get("architecture") !== 12 ||
    galleryAssets !== 14
  ) {
    fail("Public media counts do not match the approved 52-file inventory");
  }

  const diskFiles = new Set(listFiles(PUBLIC_MEDIA_ROOT).map(path.normalize));
  if (
    diskFiles.size !== manifestFiles.size ||
    [...diskFiles].some((file) => !manifestFiles.has(file))
  ) {
    fail("Public media tree contains extra or missing files");
  }
  return media;
}

function normalizeOwnership(ownership, override) {
  if (override) {
    if (ownership !== "Built Entirely by Me") {
      fail("Founder ownership override requires Built Entirely by Me source data");
    }
    return override;
  }
  const normalized = {
    "Built Entirely by Me": "built-entirely",
    "Backend & DevOps Owner": "backend-devops-owner",
    "Technical Owner": "technical-owner",
    "Lead Developer": "lead-developer",
    "Major Contributor": "major-contributor",
  }[ownership];
  if (!normalized) fail(`Unsupported ownership type: ${ownership}`);
  return normalized;
}

function normalizeStatus(project) {
  if (project.approvedStatus) return project.approvedStatus;
  const normalized = {
    "Live in Production": "live",
    "Active Development": "active-development",
    Completed: "completed",
    "Archived / Demo": "archived",
  }[project.status];
  if (!normalized) fail(`Unsupported status: ${project.status}`);
  return normalized;
}

function normalizePrimaryCategory(category) {
  const normalized = {
    "High-Scale Commerce": "commerce",
    "IoT & Smart Machines": "connected-devices",
    "SaaS & Platforms": "platforms-saas",
    "Mobile & Consumer Products": "mobile-products",
    "E-commerce & Logistics Integrations": "integrations",
    "AI & Automation": "ai-data",
    "Fintech & Payments": "fintech-payments",
  }[category];
  if (!normalized) fail(`Unsupported primary category: ${category}`);
  return normalized;
}

function normalizeConfidentiality(confidentiality) {
  return confidentiality === "Public" ? "public" : "public-limited";
}

function normalizedRoleLabel(role) {
  return role.toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

function validateProfessionalRole(project, rawOwnership) {
  if (FORBIDDEN_ROLE_LABELS.has(normalizedRoleLabel(project.role))) {
    fail(`Ownership label cannot be used as role for ${project.slug}`);
  }
  if (
    project.role === rawOwnership &&
    APPROVED_OWNERSHIP_ROLE_MATCHES.get(project.slug) !== project.role
  ) {
    fail(`Role must not duplicate raw ownership for ${project.slug}`);
  }
}

function buildCandidate(mcpExport, editorial) {
  const mcpByTitle = new Map(mcpExport.projects.map((project) => [project.title, project]));
  const editorialBySlug = new Map(editorial.projects.map((project) => [project.slug, project]));

  const projects = CANONICAL.map(([title, slug]) => {
    const source = mcpByTitle.get(title);
    const profile = editorialBySlug.get(slug);
    if (!source || !profile) fail(`Missing generation input for ${title}`);
    const project = {
      id: slug,
      slug,
      title,
      shortTagline: source.shortTagline,
      publicSummary: source.publicSummary,
      role: profile.roleOverride ?? source.role,
      ownershipType: normalizeOwnership(source.ownership, profile.ownershipTypeOverride),
      status: normalizeStatus(source),
      primaryCategory: normalizePrimaryCategory(source.primaryCategory),
      secondaryCategory: profile.secondaryCategory,
      systemType: profile.systemType,
      strongestCapability: profile.strongestCapability,
      technologies: profile.technologies,
      capabilities: source.capabilities,
      verifiedMetrics: profile.verifiedMetrics,
      links: source.links,
      featured: profile.featured,
      featuredOrder: profile.featuredOrder,
      listingOrder: profile.listingOrder,
      lastReviewed: source.lastReviewed,
      confidentiality: normalizeConfidentiality(source.confidentiality),
      caseStudyAvailability: profile.caseStudyAvailability,
      caseStudy: null,
    };
    validateProfessionalRole(project, source.ownership);
    return project;
  });

  projects.sort((a, b) => a.listingOrder - b.listingOrder);
  return validateCandidate({ schemaVersion: 1, projects });
}

function validateCandidate(rawCandidate) {
  const candidate = snapshotSchema.parse(rawCandidate);
  assertExactSelection(
    candidate.projects.map(({ title }) => title),
    CANONICAL_TITLES,
    "Candidate title selection",
  );
  assertExactSelection(
    candidate.projects.map(({ slug }) => slug),
    CANONICAL_SLUGS,
    "Candidate slug selection",
  );

  for (const project of candidate.projects) {
    if (TITLE_TO_SLUG.get(project.title) !== project.slug || project.id !== project.slug) {
      fail(`Canonical title, slug, and id mismatch for ${project.title}`);
    }
    if (project.featured !== (project.featuredOrder !== null)) {
      fail(`Featured fields disagree for ${project.slug}`);
    }
    if (FORBIDDEN_ROLE_LABELS.has(normalizedRoleLabel(project.role))) {
      fail(`Ownership label cannot be used as role for ${project.slug}`);
    }
  }
  const featured = candidate.projects
    .filter(({ featured }) => featured)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
    .map(({ slug }) => slug);
  const listed = [...candidate.projects]
    .sort((a, b) => a.listingOrder - b.listingOrder)
    .map(({ slug }) => slug);
  if (featured.join("|") !== FEATURED_SLUGS.join("|")) fail("Invalid candidate featured order");
  if (listed.join("|") !== LISTING_SLUGS.join("|")) fail("Invalid candidate listing order");
  safetyScan("Candidate snapshot", candidate);
  return candidate;
}

function reportDifferences(previous, candidate) {
  if (!previous) {
    console.log("snapshot field differences: initial generation of 13 projects");
    return [];
  }
  const previousBySlug = new Map(previous.projects.map((project) => [project.slug, project]));
  const differences = [];
  for (const project of candidate.projects) {
    const oldProject = previousBySlug.get(project.slug);
    if (!oldProject) fail(`Previous snapshot is missing ${project.slug}`);
    for (const field of DIFFERENCE_FIELDS) {
      if (JSON.stringify(oldProject[field]) !== JSON.stringify(project[field])) {
        differences.push({
          path: `${project.slug}.${field}`,
          before: oldProject[field],
          after: project[field],
        });
      }
    }
  }

  console.log(`snapshot field differences: ${differences.length}`);
  for (const difference of differences) {
    console.log(
      `${difference.path}: ${JSON.stringify(difference.before)} -> ${JSON.stringify(difference.after)}`,
    );
  }
  return differences;
}

function replaceAtomically(target, value) {
  const candidatePath = `${target}.candidate-${process.pid}`;
  try {
    fs.writeFileSync(candidatePath, `${JSON.stringify(value, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx",
    });
    validateCandidate(readJson(candidatePath));
    fs.renameSync(candidatePath, target);
  } finally {
    if (fs.existsSync(candidatePath)) fs.rmSync(candidatePath);
  }
}

function deleteConsumedExport(inputPath) {
  fs.rmSync(inputPath);
  if (fs.readdirSync(TEMP_EXPORT_ROOT).length === 0) fs.rmdirSync(TEMP_EXPORT_ROOT);
}

async function main() {
  const inputPath = getInputPath();
  const mcpExport = validateMcpExport(readJson(inputPath));
  const editorial = validateEditorial(readJson(EDITORIAL_PATH));
  await validateMedia(readJson(MEDIA_PATH));

  const candidate = buildCandidate(mcpExport, editorial);
  const previous = fs.existsSync(SNAPSHOT_PATH)
    ? validateCandidate(readJson(SNAPSHOT_PATH))
    : null;
  reportDifferences(previous, candidate);
  replaceAtomically(SNAPSHOT_PATH, candidate);
  deleteConsumedExport(inputPath);
  console.log("portfolio snapshot synchronized: 13 canonical projects");
  console.log("temporary MCP export deleted");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Portfolio sync failed");
  process.exitCode = 1;
});
