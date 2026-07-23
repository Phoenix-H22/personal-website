/**
 * Production motion evidence (no HMR / no Strict double-invoke noise).
 * Debug panel is unavailable in production — frames are wall-clock timed.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QA = path.join(ROOT, "docs", "portfolio-v3", "qa");
const FRAMES = path.join(QA, "frames");
const VIDEO_DIR = path.join(QA, "_video-tmp");
const BASE = process.env.MOTION_BASE || "http://localhost:3002";

async function main() {
  fs.mkdirSync(FRAMES, { recursive: true });
  fs.mkdirSync(VIDEO_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(String(err)));

  const url = `${BASE}/`;

  // Hard refresh
  await page.goto(url, { waitUntil: "networkidle" });

  const shot = async (name) => {
    await page.screenshot({ path: path.join(FRAMES, name), fullPage: false });
  };

  await shot("concept-v3-motion-0ms.png");
  await page.waitForTimeout(400);
  await shot("concept-v3-motion-400ms.png");
  await page.waitForTimeout(500);
  await shot("concept-v3-motion-900ms.png");
  await page.waitForTimeout(700);
  await shot("concept-v3-motion-1600ms.png");
  await page.waitForTimeout(1200);
  await page.mouse.move(220, 240);
  await page.mouse.move(1180, 520);
  await page.waitForTimeout(500);
  await shot("concept-v3-motion-settled.png");

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      overflowX: doc.scrollWidth > doc.clientWidth + 1,
    };
  });

  const score = await page.evaluate(
    () => document.querySelector("[data-score-value]")?.textContent,
  );
  const motion = await page.evaluate(() =>
    document.querySelector("[data-motion]")?.getAttribute("data-motion"),
  );

  // Client navigation: home → rebuild
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  const afterNav = await page.evaluate(() => ({
    score: document.querySelector("[data-score-value]")?.textContent,
    motion: document.querySelector("[data-motion]")?.getAttribute("data-motion"),
    jss: document.querySelector("[data-score-label]")?.textContent,
    verified: document.querySelector("[data-upwork-verified]")?.textContent?.trim(),
  }));

  // Reduced motion
  const reducedPage = await context.newPage();
  await reducedPage.emulateMedia({ reducedMotion: "reduce" });
  await reducedPage.goto(url, { waitUntil: "networkidle" });
  await reducedPage.waitForTimeout(600);
  const reduced = await reducedPage.evaluate(() => ({
    score: document.querySelector("[data-score-value]")?.textContent,
    motion: document.querySelector("[data-motion]")?.getAttribute("data-motion"),
    reducedMq: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  }));
  await reducedPage.close();

  // Dev debug progress check (optional)
  let devDebug = null;
  try {
    const dev = await context.newPage();
    await dev.goto(
      "http://localhost:3000/?motionDebug=1&motionSlow=1",
      { waitUntil: "networkidle", timeout: 8000 },
    );
    await dev.waitForSelector("[data-motion-panel]", { timeout: 8000 });
    await dev.waitForFunction(() => {
      const n = Number(
        document.querySelector('[data-debug="timelineProgress"]')?.textContent ||
          "0",
      );
      return n >= 0.95;
    }, { timeout: 20000 });
    devDebug = await dev.evaluate(() =>
      Object.fromEntries(
        [...document.querySelectorAll("[data-debug]")].map((n) => [
          n.getAttribute("data-debug"),
          n.textContent?.trim() ?? "",
        ]),
      ),
    );
    await dev.close();
  } catch (err) {
    devDebug = { error: String(err) };
  }

  await page.close();
  await context.close();
  await browser.close();

  const videos = fs.readdirSync(VIDEO_DIR).filter((f) => f.endsWith(".webm"));
  if (!videos.length) throw new Error("No webm produced");
  const dest = path.join(QA, "concept-v3-motion.webm");
  fs.copyFileSync(path.join(VIDEO_DIR, videos[0]), dest);
  for (const f of videos) fs.unlinkSync(path.join(VIDEO_DIR, f));
  try {
    fs.rmdirSync(VIDEO_DIR);
  } catch {
    /* ignore */
  }

  const report = {
    video: dest,
    overflow,
    consoleErrors,
    hardRefresh: { score, motion },
    afterNav,
    reduced,
    devDebug,
  };
  fs.writeFileSync(
    path.join(QA, "concept-v3-motion-capture.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
