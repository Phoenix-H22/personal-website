import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QA = path.join(ROOT, "docs", "portfolio-v3", "qa");
const BASE = process.env.REPAIR_BASE_URL ?? "http://localhost:3000";
const PAGE = `${BASE}/?motionOverride=full`;

const VIEWPORTS = [
  { name: "2413x1043", w: 2413, h: 1043 },
  { name: "1920x1080", w: 1920, h: 1080 },
  { name: "1600x900", w: 1600, h: 900 },
  { name: "1536x864", w: 1536, h: 864 },
  { name: "1440x900", w: 1440, h: 900 },
  { name: "1440x780", w: 1440, h: 780 },
  { name: "1366x768", w: 1366, h: 768 },
  { name: "1280x720", w: 1280, h: 720 },
  { name: "1251x611", w: 1251, h: 611 },
  { name: "1024x768", w: 1024, h: 768 },
  { name: "768x1024", w: 768, h: 1024 },
  { name: "430x932", w: 430, h: 932 },
  { name: "390x844", w: 390, h: 844 },
  { name: "360x800", w: 360, h: 800 },
];

async function main() {
  fs.mkdirSync(QA, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = { base: BASE, consoleErrors: [], screenshots: {}, checks: {} };

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      isMobile: vp.w < 500,
      hasTouch: vp.w < 500,
    });
    const page = await ctx.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        report.consoleErrors.push(`[${vp.name}] ${msg.text()}`);
      }
    });
    await page.goto(PAGE, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(4200);
    const check = await page.evaluate(() => {
      const motion = document.querySelector("[class*=motionRoot]");
      const composition = document.querySelector("#proof-stage [class*=composition]");
      const film = document.querySelector("[data-film-scroll]");
      const track = document.querySelector("[data-film-track]");
      const slots = [...document.querySelectorAll("[data-slot]")].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          id: el.getAttribute("data-slot"),
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          h: Math.round(r.height),
          w: Math.round(r.width),
        };
      });
      const proof = slots.filter((s) => s.id && s.id !== "identity");
      const sameRow =
        proof.length >= 4 &&
        Math.max(...proof.map((s) => s.top)) - Math.min(...proof.map((s) => s.top)) < 24;
      return {
        mode: document.documentElement.dataset.layoutMode,
        motionMode: motion?.getAttribute("data-layout-mode"),
        areas: composition ? getComputedStyle(composition).gridTemplateAreas : null,
        compW: composition ? Math.round(composition.getBoundingClientRect().width) : null,
        stageW: Math.round(document.querySelector("#proof-stage")?.getBoundingClientRect().width ?? 0),
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
        filmOverflowing: film?.dataset.overflowing ?? null,
        filmJustify: track ? getComputedStyle(track).justifyContent : null,
        filmTrackW: track ? Math.round(track.getBoundingClientRect().width) : null,
        filmScrollW: film ? film.clientWidth : null,
        proofSameRow: sameRow,
        slots,
        metrics: [...document.querySelectorAll("[data-metric-value]")].map((m) => m.textContent),
      };
    });
    report.checks[vp.name] = check;
    const file = `concept-v3-repair-${vp.name}.png`;
    const out = path.join(QA, file);
    await page.screenshot({ path: out, fullPage: false });
    report.screenshots[file] = out;

    if (["2413x1043", "1440x900", "1251x611", "390x844"].includes(vp.name)) {
      await page.locator("#experience").scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      const cfile = `concept-v3-repair-career-${vp.name}.png`;
      await page.screenshot({ path: path.join(QA, cfile), fullPage: false });
      report.screenshots[cfile] = path.join(QA, cfile);
    }
    await ctx.close();
  }

  fs.writeFileSync(
    path.join(QA, "concept-v3-repair-capture.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
