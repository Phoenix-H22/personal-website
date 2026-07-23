import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QA = path.join(ROOT, "docs", "portfolio-v3", "qa");
const FRAMES = path.join(QA, "frames-final");
const VIDEO_DIR = path.join(QA, "_video-tmp-final");
const DEV = "http://localhost:3000";

const viewports = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "430x932", width: 430, height: 932 },
  { name: "390x844", width: 390, height: 844 },
  { name: "360x800", width: 360, height: 800 },
];

async function main() {
  fs.mkdirSync(FRAMES, { recursive: true });
  fs.mkdirSync(VIDEO_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const report = {
    settled: {},
    overflow: {},
    motionOverride: null,
    reduced: null,
    mobileMenu: null,
    consoleErrors: [],
  };

  // Settled screenshots per breakpoint (reduced motion for stable settled)
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.on("console", (m) => {
      if (m.type() === "error") report.consoleErrors.push(`${vp.name}: ${m.text()}`);
    });
    await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const file = path.join(FRAMES, `settled-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    report.settled[vp.name] = file;
    report.overflow[vp.name] = await page.evaluate(() => ({
      overflowX:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    await context.close();
  }

  // Motion recording with override + slow
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce", // OS reduce, override should still animate
      recordVideo: { dir: VIDEO_DIR, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();
    const url = `${DEV}/concept-v3-rebuild?motionDebug=1&motionOverride=full&motionSlow=1`;
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForSelector("[data-motion-panel]");
    await page.waitForFunction(() => {
      const n = Number(
        document.querySelector('[data-debug="timelineProgress"]')?.textContent ||
          "0",
      );
      return n >= 0.98;
    }, { timeout: 45000 });
    report.motionOverride = await page.evaluate(() =>
      Object.fromEntries(
        [...document.querySelectorAll("[data-debug]")].map((n) => [
          n.getAttribute("data-debug"),
          n.textContent?.trim() ?? "",
        ]),
      ),
    );
    // Replay button
    await page.click("button:has-text('Replay intro')");
    await page.waitForFunction(() => {
      const state = document.querySelector('[data-debug="timelineState"]')
        ?.textContent;
      return state === "running" || state === "pending";
    }, { timeout: 10000 });
    await page.waitForFunction(() => {
      const n = Number(
        document.querySelector('[data-debug="timelineProgress"]')?.textContent ||
          "0",
      );
      return n >= 0.5;
    }, { timeout: 30000 });
    await page.close();
    await context.close();
    const videos = fs.readdirSync(VIDEO_DIR).filter((f) => f.endsWith(".webm"));
    const dest = path.join(QA, "concept-v3-final-motion.webm");
    if (videos.length) {
      fs.copyFileSync(path.join(VIDEO_DIR, videos[0]), dest);
      report.video = dest;
    }
    for (const f of videos) fs.unlinkSync(path.join(VIDEO_DIR, f));
  }

  // Reduced motion verification (no override)
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${DEV}/concept-v3-rebuild?motionDebug=1`, {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(800);
    report.reduced = await page.evaluate(() => ({
      score: document.querySelector("[data-score-value]")?.textContent,
      motion: document.querySelector("[data-motion]")?.getAttribute("data-motion"),
      effective: document.querySelector('[data-debug="effectiveReducedMotion"]')
        ?.textContent,
      system: document.querySelector('[data-debug="systemReducedMotion"]')
        ?.textContent,
      brand: document.querySelector("[data-rebuild-nav] .brandText, [data-rebuild-nav]")
        ?.textContent,
    }));
    await context.close();
  }

  // Mobile menu keyboard
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
    await page.locator('button[aria-label="Open menu"]').focus();
    await page.keyboard.press("Enter");
    await page.waitForSelector('[role="dialog"]');
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    report.mobileMenu = await page.evaluate(() => ({
      dialogOpen: !!document.querySelector('[role="dialog"]'),
      buttonLabel: document
        .querySelector(".navMenuButton, button[aria-controls]")
        ?.getAttribute("aria-label"),
    }));
    await context.close();
  }

  // Normal motion recording (no-preference)
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "no-preference",
      recordVideo: { dir: VIDEO_DIR, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();
    await page.goto(
      `${DEV}/concept-v3-rebuild?motionDebug=1&motionOverride=full`,
      { waitUntil: "networkidle" },
    );
    await page.waitForFunction(() => {
      const n = Number(
        document.querySelector('[data-debug="timelineProgress"]')?.textContent ||
          "0",
      );
      return n >= 0.99;
    }, { timeout: 20000 });
    await page.mouse.move(200, 200);
    await page.mouse.move(1100, 500);
    await page.waitForTimeout(600);
    await page.close();
    await context.close();
    const videos = fs.readdirSync(VIDEO_DIR).filter((f) => f.endsWith(".webm"));
    const dest = path.join(QA, "concept-v3-motion-nopreference.webm");
    if (videos.length) {
      fs.copyFileSync(path.join(VIDEO_DIR, videos[0]), dest);
      report.videoNoPreference = dest;
    }
    for (const f of videos) fs.unlinkSync(path.join(VIDEO_DIR, f));
    try {
      fs.rmdirSync(VIDEO_DIR);
    } catch {
      /* ignore */
    }
  }

  fs.writeFileSync(
    path.join(QA, "concept-v3-final-capture.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
