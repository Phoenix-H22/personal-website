import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "docs", "portfolio-v3", "qa", "s2a", "current-before");
const BASE = process.env.PORTFOLIO_BASE_URL ?? "http://localhost:3000";

const VIEWPORTS = [
  { name: "1440x900", w: 1440, h: 900 },
  { name: "1366x768", w: 1366, h: 768 },
  { name: "1024x1366", w: 1024, h: 1366 },
  { name: "390x844", w: 390, h: 844 },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = { base: BASE, route: "/", checks: {}, consoleErrors: [] };

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.w, height: vp.h },
      isMobile: vp.w < 500,
      hasTouch: vp.w < 500,
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        report.consoleErrors.push(`[${vp.name}] ${msg.text()}`);
      }
    });
    await page.goto(`${BASE}/?motionOverride=full`, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    await page.waitForTimeout(4200);
    const check = await page.evaluate(() => ({
      variant: document
        .querySelector("[data-portfolio-variant]")
        ?.getAttribute("data-portfolio-variant"),
      hasEducation: !!document.querySelector('[data-slot="education"]'),
      hasProducts: !!document.querySelector('[data-slot="products"]'),
      hasSelectedSystems: !!document.querySelector("#selected-systems"),
      overflowX:
        document.documentElement.scrollWidth > window.innerWidth + 1,
    }));
    report.checks[vp.name] = check;
    await page.screenshot({
      path: path.join(OUT, `${vp.name}.png`),
      fullPage: false,
    });
    await page.close();
    console.log(vp.name, check);
  }

  fs.writeFileSync(
    path.join(OUT, "baseline.json"),
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
