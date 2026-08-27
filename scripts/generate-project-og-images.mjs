/**
 * Builds WhatsApp/Facebook-safe 1200×630 JPEG cards from public project covers.
 * ImageResponse/WebP previews fail on WhatsApp; these static JPEGs are the share surface.
 */
import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC_PROJECTS = path.join(ROOT, "public", "portfolio", "projects");
const SNAPSHOT = path.join(
  ROOT,
  "src",
  "lib",
  "portfolio",
  "projects",
  "data",
  "public-projects.snapshot.json",
);

const WIDTH = 1200;
const HEIGHT = 630;

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function overlaySvg(title, subtitle) {
  return Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#03060b" stop-opacity="0.08"/>
      <stop offset="45%" stop-color="#03060b" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#03060b" stop-opacity="0.88"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#fade)"/>
  <text x="56" y="64" fill="#31e6d0" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="3">PROJECT</text>
  <text x="56" y="508" fill="#f2f6fa" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700">${escapeXml(title)}</text>
  <text x="56" y="556" fill="#cbd9de" font-family="Arial, Helvetica, sans-serif" font-size="24">${escapeXml(subtitle)}</text>
</svg>`);
}

function indexSvg() {
  return Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#03060b"/>
  <circle cx="980" cy="80" r="260" fill="#31e6d0" fill-opacity="0.12"/>
  <circle cx="80" cy="560" r="180" fill="#31e6d0" fill-opacity="0.06"/>
  <text x="72" y="96" fill="#31e6d0" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="4">PROJECTS ORBIT</text>
  <text x="72" y="300" fill="#f2f6fa" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700">13 production systems</text>
  <text x="72" y="360" fill="#cbd9de" font-family="Arial, Helvetica, sans-serif" font-size="28">Commerce, payments, messaging, connected hardware, and SaaS.</text>
  <text x="72" y="548" fill="#8fa4ae" font-family="Arial, Helvetica, sans-serif" font-size="22">EGP 21M+ sales  ·  Abdalrhman M. Alkady</text>
</svg>`);
}

async function writeJpeg(filePath, image) {
  await sharp(image)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(filePath);
}

async function main() {
  const snapshot = JSON.parse(await fs.readFile(SNAPSHOT, "utf8"));
  const outIndex = path.join(PUBLIC_PROJECTS, "opengraph.jpg");
  await writeJpeg(outIndex, indexSvg());
  console.log("wrote", path.relative(ROOT, outIndex));

  for (const project of snapshot.projects) {
    const coverPath = path.join(PUBLIC_PROJECTS, project.slug, "cover.webp");
    const outPath = path.join(PUBLIC_PROJECTS, project.slug, "opengraph.jpg");
    const cover = sharp(coverPath).resize(WIDTH, HEIGHT, {
      fit: "cover",
      position: "centre",
    });
    const composed = await cover
      .composite([{ input: overlaySvg(project.title, project.systemType), top: 0, left: 0 }])
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    await fs.writeFile(outPath, composed);
    console.log("wrote", path.relative(ROOT, outPath));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
