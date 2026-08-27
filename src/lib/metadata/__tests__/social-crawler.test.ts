import { describe, expect, it } from "vitest";

import { renderSocialCardHtml } from "@/lib/metadata/social-card-html";
import { isSocialCrawler } from "@/lib/metadata/social-crawler";

describe("social crawler cards", () => {
  it("treats WhatsApp and Facebook scrapers as social crawlers", () => {
    expect(isSocialCrawler("WhatsApp/2.23.20.0")).toBe(true);
    expect(isSocialCrawler("facebookexternalhit/1.1")).toBe(true);
    expect(isSocialCrawler("Mozilla/5.0 Chrome/120.0")).toBe(false);
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

    expect(html.length).toBeLessThan(2000);
    expect(html.indexOf("og:title")).toBeLessThan(500);
    expect(html).toContain('property="og:image" content="https://alkady.dev/portfolio/projects/warqah-store/opengraph.jpg"');
    expect(html).not.toContain(".webp");
    expect(html).not.toContain("?");
  });
});
