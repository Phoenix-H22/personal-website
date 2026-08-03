import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";
import { describe, expect, it } from "vitest";

import manifest from "@/lib/portfolio/projects/data/public-media-manifest.json";
import { PublicMediaRepository } from "@/lib/portfolio/projects/media-repository";
import { publicMediaManifestSchema } from "@/lib/portfolio/projects/media-schema";

const root = process.cwd();
const publicRoot = path.join(root, "public", "portfolio", "projects");
const unsafePublicPath =
  /(?:\.portfolio-private|notion|source-pack|candidate|rejected|original|backup|private|token|credential|secret|x-amz-|signature=)/i;

function listFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  });
}

describe("public media manifest", () => {
  it("parses and enforces canonical media contracts", () => {
    const parsed = publicMediaManifestSchema.parse(manifest);
    expect(parsed.projects).toHaveLength(13);
    expect(() => new PublicMediaRepository(parsed)).not.toThrow();

    const assets = parsed.projects.flatMap(({ assets }) => assets);
    expect(assets).toHaveLength(52);
    expect(assets.filter(({ role }) => role === "cover")).toHaveLength(13);
    expect(assets.filter(({ role }) => role === "cover-card")).toHaveLength(13);
    expect(assets.filter(({ role }) => role === "architecture")).toHaveLength(12);
    expect(
      assets.filter(({ role }) =>
        [
          "dashboard",
          "product-screenshot",
          "mobile-screenshot",
          "machine-photo",
          "product-photo",
          "integration-flow",
        ].includes(role),
      ),
    ).toHaveLength(14);
  });

  it("keeps Riders architecture optional", () => {
    const riders = manifest.projects.find(
      ({ slug }) => slug === "riders-shopify-wordpress",
    );
    expect(riders?.assets.some(({ role }) => role === "architecture")).toBe(false);
  });

  it("matches every published file, dimension, and hash", async () => {
    const manifestFiles = new Set<string>();
    for (const project of manifest.projects) {
      const orders = project.assets.map(({ order }) => order);
      expect(new Set(orders).size).toBe(orders.length);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));

      for (const asset of project.assets) {
        expect(asset.alt.trim()).not.toBe("");
        expect(asset.src).toMatch(
          new RegExp(`^/portfolio/projects/${project.slug}/[a-z0-9-]+\\.webp$`),
        );
        const fullPath = path.join(root, "public", asset.src.replace(/^\//, ""));
        manifestFiles.add(path.normalize(fullPath));
        expect(fs.existsSync(fullPath)).toBe(true);
        const metadata = await sharp(fullPath).metadata();
        expect(metadata.format).toBe("webp");
        expect(metadata.width).toBe(asset.width);
        expect(metadata.height).toBe(asset.height);
        expect(Number(((metadata.width ?? 1) / (metadata.height ?? 1)).toFixed(4))).toBe(
          asset.aspectRatio,
        );
        const hash = crypto
          .createHash("sha256")
          .update(fs.readFileSync(fullPath))
          .digest("hex");
        expect(hash).toBe(asset.sha256);
      }
    }

    const diskFiles = new Set(listFiles(publicRoot).map(path.normalize));
    expect(diskFiles).toEqual(manifestFiles);
    for (const file of diskFiles) {
      const publicPath = path.relative(publicRoot, file).replaceAll("\\", "/");
      expect(publicPath).not.toMatch(unsafePublicPath);
    }
  });

  it("contains public paths only", () => {
    const serialized = JSON.stringify(manifest);
    expect(serialized).not.toMatch(/[a-z]:[\\/](?![\\/])/i);
    expect(serialized).not.toMatch(/\.portfolio-private/i);
    expect(serialized).not.toMatch(/(?:notion\.so|notion\.com|x-amz-)/i);
    expect(serialized).not.toMatch(unsafePublicPath);
  });
});
