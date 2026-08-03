import {
  CANONICAL_PROJECT_SLUGS,
  type CanonicalProjectSlug,
} from "@/lib/portfolio/projects/canonical-projects";
import {
  publicMediaManifestSchema,
  type PublicMediaAsset,
  type PublicMediaManifest,
} from "@/lib/portfolio/projects/media-schema";

export interface PublicProjectMedia {
  cover: PublicMediaAsset;
  coverCard: PublicMediaAsset;
  architectureDiagram: PublicMediaAsset | null;
  gallery: PublicMediaAsset[];
}

export class PublicMediaRepository {
  private readonly bySlug: Map<CanonicalProjectSlug, PublicProjectMedia>;

  constructor(rawManifest: unknown) {
    const manifest: PublicMediaManifest = publicMediaManifestSchema.parse(rawManifest);
    const seen = new Set<string>();
    this.bySlug = new Map();

    for (const project of manifest.projects) {
      if (seen.has(project.slug)) {
        throw new Error(`Duplicate public media project: ${project.slug}`);
      }
      seen.add(project.slug);

      const sourcePrefix = `/portfolio/projects/${project.slug}/`;
      const order = new Set<number>();
      for (const asset of project.assets) {
        if (!asset.src.startsWith(sourcePrefix)) {
          throw new Error(`Media path does not belong to ${project.slug}`);
        }
        if (order.has(asset.order)) {
          throw new Error(`Duplicate media order for ${project.slug}`);
        }
        order.add(asset.order);
      }

      const one = (role: PublicMediaAsset["role"], required: boolean) => {
        const assets = project.assets.filter((asset) => asset.role === role);
        if (assets.length > 1 || (required && assets.length !== 1)) {
          throw new Error(`Invalid ${role} count for ${project.slug}`);
        }
        return assets[0] ?? null;
      };

      const cover = one("cover", true);
      const coverCard = one("cover-card", true);
      const architectureDiagram = one("architecture", false);
      if (!cover || !coverCard) {
        throw new Error(`Required cover media missing for ${project.slug}`);
      }
      if (project.slug === "riders-shopify-wordpress" && architectureDiagram) {
        throw new Error("Riders must not receive a placeholder architecture diagram");
      }

      this.bySlug.set(project.slug, {
        cover,
        coverCard,
        architectureDiagram,
        gallery: project.assets
          .filter((asset) => !["cover", "cover-card", "architecture"].includes(asset.role))
          .sort((a, b) => a.order - b.order),
      });
    }

    const missing = CANONICAL_PROJECT_SLUGS.filter((slug) => !seen.has(slug));
    if (seen.size !== CANONICAL_PROJECT_SLUGS.length || missing.length) {
      throw new Error(`Public media manifest does not match canonical projects`);
    }
  }

  getProjectMedia(slug: CanonicalProjectSlug): PublicProjectMedia {
    const media = this.bySlug.get(slug);
    if (!media) throw new Error(`Missing public media for ${slug}`);
    return media;
  }
}
