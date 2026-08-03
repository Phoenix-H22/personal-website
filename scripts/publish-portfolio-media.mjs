/**
 * Local-only media publisher.
 * Reads approved private sources → writes public WebP derivatives.
 * Never imports into client bundles.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const PRIVATE = path.join(ROOT, ".portfolio-private");
const PUBLIC = path.join(ROOT, "public", "portfolio", "projects");
const MANIFEST_OUT = path.join(
  ROOT,
  "src",
  "lib",
  "portfolio",
  "projects",
  "data",
  "public-media-manifest.json",
);
const MANIFEST_ONLY = process.argv.includes("--manifest-only");

/** @typedef {{ role: string, source: string, publicName: string, alt: string, caption?: string }} AssetSpec */
/** @typedef {{ slug: string, title: string, assets: AssetSpec[] }} ProjectMediaSpec */

/** @type {ProjectMediaSpec[]} */
const PROJECTS = [
  {
    slug: "smart-lockers-platform",
    title: "Smart Lockers Platform",
    assets: [
      {
        role: "cover",
        source: "smart-lockers/newdesign1.png",
        publicName: "cover.webp",
        alt: "Smart Lockers Platform product cover",
      },
      {
        role: "architecture",
        source: "smart-lockers/newdesign2.png",
        publicName: "architecture.webp",
        alt: "Smart Lockers architecture diagram",
      },
      {
        role: "machine-photo",
        source: "smart-lockers/lockersmachineimage.png",
        publicName: "screenshot-01.webp",
        alt: "Real smart-locker machine installation",
      },
      {
        role: "dashboard",
        source: "smart-lockers/dashboard_screenshot.png",
        publicName: "screenshot-02.webp",
        alt: "Smart Lockers operations dashboard",
      },
    ],
  },
  {
    slug: "warqah-store",
    title: "Warqah Store",
    assets: [
      {
        role: "cover",
        source: "warqah-store/media-batch/final/cover-final.png",
        publicName: "cover.webp",
        alt: "Warqah Store production commerce platform cover",
      },
      {
        role: "architecture",
        source: "warqah-store/arch.png",
        publicName: "architecture.webp",
        alt: "Warqah Store architecture overview",
      },
      {
        role: "product-screenshot",
        source: "warqah-store/notion-upload/02-warqah-store-storefront.webp",
        publicName: "screenshot-01.webp",
        alt: "Warqah storefront experience",
      },
      {
        role: "dashboard",
        source:
          "warqah-store/notion-upload/03-warqah-store-operations-dashboard.webp",
        publicName: "screenshot-02.webp",
        alt: "Warqah operations dashboard",
      },
      {
        role: "dashboard",
        source:
          "warqah-store/notion-upload/04-warqah-store-infrastructure-dashboard.webp",
        publicName: "screenshot-03.webp",
        alt: "Warqah infrastructure dashboard",
      },
    ],
  },
  {
    slug: "your-obour-guide",
    title: "Your Obour Guide",
    assets: [
      {
        role: "cover",
        source: "your-obour-guide/media-batch/final/cover-final.png",
        publicName: "cover.webp",
        alt: "Your Obour Guide case-study cover",
      },
      {
        role: "architecture",
        source: "your-obour-guide/arch.png",
        publicName: "architecture.webp",
        alt: "Your Obour Guide architecture overview",
      },
      {
        role: "mobile-screenshot",
        source: "your-obour-guide/notion-upload/02-your-obour-guide-mobile-home.webp",
        publicName: "screenshot-01.webp",
        alt: "Your Obour Guide mobile home",
      },
      {
        role: "dashboard",
        source:
          "your-obour-guide/notion-upload/04-your-obour-guide-admin-dashboard.webp",
        publicName: "screenshot-02.webp",
        alt: "Your Obour Guide admin dashboard",
      },
      {
        role: "product-screenshot",
        source:
          "your-obour-guide/notion-upload/05-your-obour-guide-landing-dark.webp",
        publicName: "screenshot-03.webp",
        alt: "Your Obour Guide public website",
      },
    ],
  },
  {
    slug: "autopay-eg",
    title: "Autopay EG",
    assets: [
      {
        role: "cover",
        source: "autopay-eg/media-batch/final/cover-final.png",
        publicName: "cover.webp",
        alt: "Autopay EG payment automation platform cover",
      },
      {
        role: "architecture",
        source: "autopay-eg/ARCH.png",
        publicName: "architecture.webp",
        alt: "Autopay EG architecture overview",
      },
      {
        role: "product-screenshot",
        source: "autopay-eg/notion-upload/02-autopay-eg-landing.webp",
        publicName: "screenshot-01.webp",
        alt: "Autopay EG landing experience",
      },
      {
        role: "dashboard",
        source: "autopay-eg/notion-upload/03-autopay-eg-admin-dashboard.webp",
        publicName: "screenshot-02.webp",
        alt: "Autopay EG administration dashboard",
      },
      {
        role: "integration-flow",
        source: "autopay-eg/notion-upload/04-autopay-eg-payment-flow-step1.webp",
        publicName: "screenshot-03.webp",
        alt: "Autopay EG payment workflow",
      },
    ],
  },
  {
    slug: "nabd",
    title: "NABD",
    assets: [
      {
        role: "cover",
        source: "nabd/latest_cover.png",
        publicName: "cover.webp",
        alt: "NABD messaging platform cover",
      },
      {
        role: "architecture",
        source: "nabd/arch.png",
        publicName: "architecture.webp",
        alt: "NABD architecture overview",
      },
    ],
  },
  {
    slug: "wasfaty-smart-vending",
    title: "Wasfaty Smart Vending",
    assets: [
      {
        role: "cover",
        source: "wasfaty-smart-vending/latest_cover.png",
        publicName: "cover.webp",
        alt: "Wasfaty Smart Vending platform cover",
      },
      {
        role: "architecture",
        source: "wasfaty-smart-vending/arch.png",
        publicName: "architecture.webp",
        alt: "Wasfaty Smart Vending architecture overview",
      },
    ],
  },
  {
    slug: "alzahaby-loyalty-app",
    title: "Alzahaby Loyalty App",
    assets: [
      {
        role: "cover",
        source: "alzahaby-loyalty-app/approved-cover/cover-final.png",
        publicName: "cover.webp",
        alt: "Alzahaby Loyalty App cover",
      },
      {
        role: "architecture",
        source: "alzahaby-loyalty-app/arch.png",
        publicName: "architecture.webp",
        alt: "Alzahaby Loyalty App architecture overview",
      },
    ],
  },
  {
    slug: "riders-shopify-wordpress",
    title: "Riders Shopify & WordPress Integrations",
    assets: [
      {
        role: "cover",
        source: "riders/cover/riders-cover-approved.png",
        publicName: "cover.webp",
        alt: "Riders Shopify and WooCommerce integrations cover",
      },
      {
        role: "product-screenshot",
        source: "riders/notion-upload/02-riders-shopify-listing.webp",
        publicName: "screenshot-01.webp",
        alt: "Riders Shipping Shopify App Store listing",
      },
      {
        role: "dashboard",
        source: "riders/notion-upload/03-riders-shopify-settings.webp",
        publicName: "screenshot-02.webp",
        alt: "Riders Shopify application settings",
      },
      {
        role: "product-screenshot",
        source: "riders/notion-upload/05-riders-wordpress-listing.webp",
        publicName: "screenshot-03.webp",
        alt: "Riders Delivery WooCommerce WordPress.org listing",
      },
    ],
  },
  {
    slug: "chocolate-smart-vending",
    title: "Chocolate Smart Vending",
    assets: [
      {
        role: "cover",
        source: "chocolate-smart-vending/cover.png",
        publicName: "cover.webp",
        alt: "Chocolate Smart Vending platform cover",
      },
      {
        role: "architecture",
        source: "chocolate-smart-vending/arch.png",
        publicName: "architecture.webp",
        alt: "Chocolate Smart Vending architecture overview",
      },
    ],
  },
  {
    slug: "sim-express",
    title: "SIM Express",
    assets: [
      {
        role: "cover",
        source: "sim-express/latest_cover.png",
        publicName: "cover.webp",
        alt: "SIM Express telecom kiosk platform cover",
      },
      {
        role: "architecture",
        source: "sim-express/arch.png",
        publicName: "architecture.webp",
        alt: "SIM Express architecture overview",
      },
    ],
  },
  {
    slug: "tawfir",
    title: "Tawfir",
    assets: [
      {
        role: "cover",
        source: "tawfir/latest_cover.png",
        publicName: "cover.webp",
        alt: "Tawfir surplus-food marketplace cover",
      },
      {
        role: "architecture",
        source: "tawfir/arch.png",
        publicName: "architecture.webp",
        alt: "Tawfir architecture overview",
      },
    ],
  },
  {
    slug: "pdf-extractor",
    title: "PDF Extractor",
    assets: [
      {
        role: "cover",
        source: "pdf-extractor/latest_cover.png",
        publicName: "cover.webp",
        alt: "PDF Extractor document platform cover",
      },
      {
        role: "architecture",
        source: "pdf-extractor/arch.png",
        publicName: "architecture.webp",
        alt: "PDF Extractor architecture overview",
      },
    ],
  },
  {
    slug: "pinoyaid",
    title: "PinoyAid",
    assets: [
      {
        role: "cover",
        source: "pinoyaid/latest_cover.png",
        publicName: "cover.webp",
        alt: "PinoyAid crowdfunding platform cover",
      },
      {
        role: "architecture",
        source: "pinoyaid/arch.png",
        publicName: "architecture.webp",
        alt: "PinoyAid architecture overview",
      },
    ],
  },
];

async function publishAsset(projectDir, asset, order) {
  const src = path.join(PRIVATE, asset.source);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing source: ${asset.source}`);
  }
  fs.mkdirSync(projectDir, { recursive: true });
  const dest = path.join(projectDir, asset.publicName);
  const image = sharp(src).rotate();
  const meta = await image.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (!width || !height) throw new Error(`No dimensions: ${asset.source}`);

  const maxEdge = asset.role === "cover" ? 1920 : 1600;
  const pipeline = sharp(src).rotate();
  if (Math.max(width, height) > maxEdge) {
    pipeline.resize({
      width: width >= height ? maxEdge : undefined,
      height: height > width ? maxEdge : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  await pipeline
    .webp({ quality: asset.role === "architecture" ? 90 : 82, effort: 5 })
    .toFile(dest);

  const outMeta = await sharp(dest).metadata();
  return { width: outMeta.width ?? width, height: outMeta.height ?? height, order };
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

async function buildManifestFromPublishedFiles() {
  const projects = [];

  for (const project of PROJECTS) {
    const projectDir = path.join(PUBLIC, project.slug);
    const specs = [
      {
        role: "cover-card",
        publicName: "cover-card.webp",
        alt: `${project.title} card cover`,
        caption: null,
        order: 0,
      },
      ...project.assets.map((asset, index) => ({
        ...asset,
        caption: asset.caption ?? null,
        order: index + 1,
      })),
    ];
    const expectedNames = new Set(specs.map((asset) => asset.publicName));

    if (!fs.existsSync(projectDir)) {
      throw new Error(`Missing public project directory: ${project.slug}`);
    }

    const actualNames = fs
      .readdirSync(projectDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .sort();
    const unexpected = actualNames.filter((name) => !expectedNames.has(name));
    const missing = [...expectedNames].filter((name) => !actualNames.includes(name));
    if (unexpected.length || missing.length) {
      throw new Error(
        `Public media mismatch for ${project.slug}: missing=${missing.join(",") || "none"}; unexpected=${unexpected.join(",") || "none"}`,
      );
    }

    const assets = [];
    for (const asset of specs) {
      const file = path.join(projectDir, asset.publicName);
      const metadata = await sharp(file).metadata();
      if (metadata.format !== "webp" || !metadata.width || !metadata.height) {
        throw new Error(`Invalid public WebP: ${project.slug}/${asset.publicName}`);
      }
      assets.push({
        role: asset.role,
        src: `/portfolio/projects/${project.slug}/${asset.publicName}`,
        width: metadata.width,
        height: metadata.height,
        aspectRatio: Number((metadata.width / metadata.height).toFixed(4)),
        alt: asset.alt,
        caption: asset.caption,
        order: asset.order,
        sha256: sha256(file),
      });
    }

    projects.push({ slug: project.slug, assets });
  }

  return {
    schemaVersion: 1,
    projects,
  };
}

function replaceJsonAtomically(target, value) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const candidate = `${target}.candidate-${process.pid}`;
  try {
    fs.writeFileSync(candidate, `${JSON.stringify(value, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx",
    });
    fs.renameSync(candidate, target);
  } finally {
    if (fs.existsSync(candidate)) fs.rmSync(candidate);
  }
}

async function main() {
  if (MANIFEST_ONLY) {
    const manifest = await buildManifestFromPublishedFiles();
    replaceJsonAtomically(MANIFEST_OUT, manifest);
    console.log(`validated ${manifest.projects.length} public project media packs`);
    return;
  }

  /** Clean only project dirs we own for this publish; keep structure predictable. */
  for (const project of PROJECTS) {
    const dir = path.join(PUBLIC, project.slug);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }

  // Remove legacy messy riders/autopay folders if present under old names
  for (const legacy of [
    "riders",
    "autopay-eg",
    "warqah-store",
    "your-obour-guide",
  ]) {
    // only remove if not in our new slug set as-is — autopay/warqah/obour keep same slugs
    if (PROJECTS.some((p) => p.slug === legacy)) continue;
    const legacyDir = path.join(PUBLIC, legacy);
    if (fs.existsSync(legacyDir)) {
      fs.rmSync(legacyDir, { recursive: true, force: true });
    }
  }

  for (const project of PROJECTS) {
    const dir = path.join(PUBLIC, project.slug);
    let order = 0;
    for (const asset of project.assets) {
      order += 1;
      await publishAsset(dir, asset, order);
      console.log("ok", project.slug, asset.publicName);
    }

    // card derivative for cover
    const coverSrc = path.join(dir, "cover.webp");
    const coverCard = path.join(dir, "cover-card.webp");
    await sharp(coverSrc)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(coverCard);
    const cardMeta = await sharp(coverCard).metadata();
    if (!cardMeta.width || !cardMeta.height) {
      throw new Error(`No dimensions: ${project.slug}/cover-card.webp`);
    }
  }

  const manifest = await buildManifestFromPublishedFiles();
  replaceJsonAtomically(MANIFEST_OUT, manifest);
  console.log("manifest ready");
  console.log("projects", manifest.projects.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
