import { describe, expect, it } from "vitest";

import { CANONICAL_PROJECT_SLUGS } from "@/lib/portfolio/projects/canonical-projects";
import snapshot from "@/lib/portfolio/projects/data/public-projects.snapshot.json";

import { renderSocialCardHtml } from "@/lib/metadata/social-card-html";
import { isSocialCrawler } from "@/lib/metadata/social-crawler";
import { getSocialPreviewHtml } from "@/lib/metadata/social-preview";

const SITE = new URL("https://alkady.dev");

describe("social crawler cards", () => {
  it("treats link unfurlers as social crawlers and leaves search engines on the real page", () => {
    expect(isSocialCrawler("WhatsApp/2.23.20.0")).toBe(true);
    expect(isSocialCrawler("facebookexternalhit/1.1")).toBe(true);
    expect(isSocialCrawler("Twitterbot/1.0")).toBe(true);
    expect(isSocialCrawler("LinkedInBot/1.0")).toBe(true);
    expect(isSocialCrawler("Mozilla/5.0 Chrome/120.0")).toBe(false);
    expect(isSocialCrawler("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(false);
  });

  it("emits a tiny HTML document with JPEG Open Graph tags first", () => {
    const html = renderSocialCardHtml({
      title: "Warqah Store — Engineering Case Study",
      description: "A production commerce platform.",
      url: "https://alkady.dev/projects/warqah-store",
      image: "https://alkady.dev/portfolio/projects/warqah-store/opengraph.jpg",
      imageAlt: "Warqah Store — Production commerce operations platform",
      type: "article",
    });

    expect(html.length).toBeLessThan(2500);
    expect(html.indexOf("og:title")).toBeLessThan(500);
    expect(html).toContain(
      'property="og:image" content="https://alkady.dev/portfolio/projects/warqah-store/opengraph.jpg"',
    );
    expect(html).not.toContain(".webp");
  });

  it("gives /projects and every project slug a unique title, description, and JPEG", () => {
    const listing = getSocialPreviewHtml("/projects", SITE);
    expect(listing).toContain("Projects | Production Systems Map");
    expect(listing).toContain("/portfolio/projects/opengraph.jpg");
    expect(listing).not.toContain(".webp");

    const images = new Set<string>();
    const titles = new Set<string>();

    for (const slug of CANONICAL_PROJECT_SLUGS) {
      const project = snapshot.projects.find((item) => item.slug === slug);
      expect(project, slug).toBeTruthy();
      const html = getSocialPreviewHtml(`/projects/${slug}`, SITE);
      expect(html, slug).toBeTruthy();
      expect(html).toContain(`og:url" content="https://alkady.dev/projects/${slug}"`);
      expect(html).toContain(`/portfolio/projects/${slug}/opengraph.jpg`);
      expect(html).toContain(project!.title.replaceAll("&", "&amp;"));
      expect(html).not.toContain(".webp");
      images.add(`/portfolio/projects/${slug}/opengraph.jpg`);
      titles.add(project!.title);
    }

    expect(images.size).toBe(CANONICAL_PROJECT_SLUGS.length);
    expect(titles.size).toBe(CANONICAL_PROJECT_SLUGS.length);
    expect(getSocialPreviewHtml("/projects/not-a-project", SITE)).toBeNull();
  });

  it("serves every preview from a precomputed catalog under 2.5KB", () => {
    const listing = getSocialPreviewHtml("/projects", SITE);
    expect(listing?.length).toBeLessThan(2500);

    for (const slug of CANONICAL_PROJECT_SLUGS) {
      const html = getSocialPreviewHtml(`/projects/${slug}`, SITE);
      expect(html?.length, slug).toBeLessThan(2500);
    }

    expect(getSocialPreviewHtml("/projects/", SITE)).toBe(
      getSocialPreviewHtml("/projects", SITE),
    );
  });
});
