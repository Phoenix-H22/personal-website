const base = process.env.PORTFOLIO_BASE_URL ?? "http://localhost:3010";

async function main() {
  const robotsTxt = await (await fetch(`${base}/robots.txt`)).text();
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const redirect = await fetch(`${base}/concept-v3-rebuild`, {
    redirect: "manual",
  });
  const v2html = await (await fetch(`${base}/v2`)).text();
  const homeHtml = await (await fetch(`${base}/`)).text();
  const pick = (html, re) => (html.match(re) || [])[1] ?? null;

  console.log(
    JSON.stringify(
      {
        robotsTxt: robotsTxt.trim(),
        sitemapIncludesRoot: sitemap.includes("<loc>") && /\/<\/loc>/.test(sitemap) || sitemap.includes("localhost:3010</loc>") || /https?:\/\/[^<]+\/<\/loc>/.test(sitemap),
        sitemapHasV2: sitemap.includes("/v2"),
        redirectStatus: redirect.status,
        redirectLocation: redirect.headers.get("location"),
        homeRobots: pick(homeHtml, /name="robots" content="([^"]+)"/),
        homeCanonical: pick(homeHtml, /rel="canonical" href="([^"]+)"/),
        v2Robots: pick(v2html, /name="robots" content="([^"]+)"/),
        v2Canonical: pick(v2html, /rel="canonical" href="([^"]+)"/),
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
