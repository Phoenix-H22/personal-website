import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "docs", "portfolio-v3", "qa", "routes");
const BASE = process.env.PORTFOLIO_BASE_URL ?? "http://localhost:3000";

const ROUTES = [
  { id: "current", path: "/" },
  { id: "v2", path: "/v2" },
];

const VIEWPORTS = [
  { name: "1440x900", w: 1440, h: 900 },
  { name: "1366x768", w: 1366, h: 768 },
  { name: "1024x1366", w: 1024, h: 1366 },
  { name: "390x844", w: 390, h: 844 },
];

async function settle(page, routePath) {
  await page.goto(`${BASE}${routePath}?motionOverride=full`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(4200);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = { base: BASE, checks: {}, consoleErrors: [] };

  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      const key = `${route.id}-${vp.name}`;
      const page = await browser.newPage({
        viewport: { width: vp.w, height: vp.h },
        isMobile: vp.w < 500,
        hasTouch: vp.w < 500,
        deviceScaleFactor: 1,
      });
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          report.consoleErrors.push(`[${key}] ${msg.text()}`);
        }
      });
      await settle(page, route.path);
      const check = await page.evaluate(() => {
        const stage = document.querySelector("#proof-stage");
        const logos = ["theqah", "kayanac-erp", "phoenix-techs", "upwork-freelance"].map(
          (id) => {
            const img = document.querySelector(`[data-company-node="${id}"] img`);
            return {
              id,
              loaded: !!(img && img.naturalWidth > 0),
              naturalW: img?.naturalWidth ?? 0,
            };
          },
        );
        const seal = document.querySelector("[data-edu-seal]");
        const highlight = document.querySelector('[data-edu-highlight="true"]');
        let badgeOverlap = null;
        if (seal && highlight) {
          const a = seal.getBoundingClientRect();
          const b = highlight.getBoundingClientRect();
          badgeOverlap = !(
            a.right <= b.left + 1 ||
            a.left >= b.right - 1 ||
            a.bottom <= b.top + 1 ||
            a.top >= b.bottom - 1
          );
        }
        const deck = document.querySelector("[data-product-deck]");
        const active = deck?.querySelector("[data-active='true']");
        const ar = active?.getBoundingClientRect();
        return {
          variant: document.querySelector("[data-portfolio-variant]")?.getAttribute(
            "data-portfolio-variant",
          ),
          hasStage: !!stage,
          overflowX:
            document.documentElement.scrollWidth > window.innerWidth + 1,
          badgeOverlap,
          deckNonZero: !!(ar && ar.width > 4 && ar.height > 4),
          logos,
          versionSwitchPresent: !!document.querySelector(
            "[data-portfolio-version-switch]",
          ),
        };
      });
      report.checks[key] = check;
      await page.screenshot({
        path: path.join(OUT, `${key}.png`),
        fullPage: false,
      });
      await page.close();
      console.log(
        key,
        `variant=${check.variant}`,
        `overflowX=${check.overflowX}`,
        `badgeOverlap=${check.badgeOverlap}`,
        `deck=${check.deckNonZero}`,
        `switch=${check.versionSwitchPresent}`,
      );
    }
  }

  // Redirect check
  const page = await browser.newPage();
  const response = await page.goto(`${BASE}/concept-v3-rebuild`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  report.redirect = {
    finalUrl: page.url(),
    status: response?.status() ?? null,
  };
  console.log("redirect", report.redirect);
  await page.close();

  fs.writeFileSync(
    path.join(OUT, "route-consolidation.json"),
    JSON.stringify(report, null, 2),
  );
  console.log("consoleErrors", report.consoleErrors.length);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
