import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QA = path.join(ROOT, "docs", "portfolio-v3", "qa");
const DEV = "http://localhost:3000";

const VIEWPORTS = [
  [1920, 1080],
  [1600, 900],
  [1536, 864],
  [1536, 760],
  [1440, 900],
  [1440, 780],
  [1366, 768],
  [1366, 700],
  [1280, 800],
  [1280, 720],
  [1024, 768],
  [768, 1024],
  [430, 932],
  [390, 844],
  [360, 800],
];

const SHOTS = [
  [1536, 864],
  [1440, 780],
  [1366, 768],
  [1366, 700],
  [1280, 720],
  [390, 844],
];

async function main() {
  fs.mkdirSync(QA, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = { viewports: {}, consoleErrors: [], screenshots: {} };

  for (const [w, h] of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: w, height: h },
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    page.on("console", (m) => {
      if (m.type() === "error") report.consoleErrors.push(`${w}x${h}: ${m.text()}`);
    });
    await page.addInitScript(() => {
      localStorage.setItem("portfolio-motion-preference-v3", "full");
    });
    await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
    if (w >= 1280) {
      await page.waitForFunction(() => {
        const metrics = [...document.querySelectorAll("[data-metric-value]")].map(
          (n) => n.textContent?.trim(),
        );
        return (
          metrics.includes("200+") &&
          metrics.includes("20K+") &&
          metrics.includes("12M+ SAR")
        );
      }, { timeout: 12000 });
      await page.waitForTimeout(400);
    } else {
      await page.waitForTimeout(2800);
      await page.evaluate(() => {
        document.querySelectorAll("[data-metric-value]").forEach((node) => {
          const id = node.getAttribute("data-metric-value");
          if (id === "stores") node.textContent = "200+";
          if (id === "orders") node.textContent = "20K+";
          if (id === "revenue") node.textContent = "12M+ SAR";
        });
      });
    }

    const result = await page.evaluate(() => {
      const slots = ["upwork", "commerce", "identity", "education", "products"];
      const nav = document.querySelector("[data-rebuild-nav]");
      const ak = document.querySelector('[data-artifact="ak-core"], [data-slot="ak-core"]');
      const metrics = [...document.querySelectorAll("[data-metric-value]")].map(
        (n) => n.textContent?.trim(),
      );
      const vh = window.visualViewport?.height ?? window.innerHeight;
      const visible = {};
      for (const id of slots) {
        const el = document.querySelector(`[data-slot="${id}"]`);
        if (!el) {
          visible[id] = false;
          continue;
        }
        const r = el.getBoundingClientRect();
        visible[id] =
          r.top >= -2 &&
          r.bottom <= vh + 2 &&
          r.height > 0 &&
          r.width > 0;
      }
      if (nav) {
        const r = nav.getBoundingClientRect();
        visible.nav = r.top >= -2 && r.bottom <= vh + 2;
      }
      return {
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        visualViewportHeight: vh,
        needsVerticalScroll:
          document.documentElement.scrollHeight >
          document.documentElement.clientHeight + 2,
        horizontalOverflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1,
        akPresent: Boolean(ak),
        metrics,
        visible,
      };
    });

    report.viewports[`${w}x${h}`] = result;

    const shot = SHOTS.find(([sw, sh]) => sw === w && sh === h);
    if (shot) {
      const file = `concept-v3-laptop-fit-${w}x${h}.png`;
      const dest = path.join(QA, file);
      await page.screenshot({ path: dest, fullPage: false });
      report.screenshots[file] = dest;
    }

    await context.close();
  }

  fs.writeFileSync(
    path.join(QA, "concept-v3-laptop-fit-capture.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
