import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QA = path.join(ROOT, "docs", "portfolio-v3", "qa");
const VIDEO = path.join(QA, "_deck-video");
const DEV = "http://localhost:3000";

async function main() {
  fs.mkdirSync(QA, { recursive: true });
  fs.mkdirSync(VIDEO, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = { cases: {}, consoleErrors: [], videos: {} };

  async function withPage(opts, fn) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: opts.reducedMotion,
      recordVideo: opts.record
        ? { dir: VIDEO, size: { width: 1440, height: 900 } }
        : undefined,
    });
    const page = await context.newPage();
    page.on("console", (m) => {
      if (m.type() === "error") report.consoleErrors.push(m.text());
    });
    await page.addInitScript((pref) => {
      const key = "portfolio-motion-preference-v3";
      if (pref === null || pref === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, pref);
      }
    }, opts.preference);
    const result = await fn(page);
    await page.close();
    await context.close();
    if (opts.record) {
      const files = fs.readdirSync(VIDEO).filter((f) => f.endsWith(".webm"));
      if (files.length) {
        const dest = path.join(QA, opts.record);
        fs.copyFileSync(path.join(VIDEO, files[0]), dest);
        report.videos[opts.record] = dest;
        for (const f of files) fs.unlinkSync(path.join(VIDEO, f));
      }
    }
    return result;
  }

  // Case A: no stored preference + OS reduced
  report.cases.A = await withPage(
    { preference: null, reducedMotion: "reduce" },
    async (page) => {
      await page.goto(`${DEV}/`, { waitUntil: "networkidle" });
      await page.waitForTimeout(700);
      return page.evaluate(() => ({
        pref: document.documentElement.dataset.motionPreference,
        effective: document.documentElement.dataset.effectiveMotion,
        score: document.querySelector("[data-score-value]")?.textContent,
        motion: document.querySelector("[data-motion]")?.getAttribute("data-motion"),
      }));
    },
  );

  // Case B: full + OS reduced — hero animation
  report.cases.B = await withPage(
    {
      preference: "full",
      reducedMotion: "reduce",
      record: "concept-v3-deck-full-hero.webm",
    },
    async (page) => {
      await page.goto(
        `${DEV}/?motionDebug=1`,
        { waitUntil: "networkidle" },
      );
      await page.waitForFunction(() => {
        const n = Number(
          document.querySelector('[data-debug="timelineProgress"]')?.textContent ||
            "0",
        );
        return n >= 0.95 || document.documentElement.dataset.effectiveMotion !== "full";
      }, { timeout: 20000 });
      await page.waitForTimeout(400);
      return page.evaluate(() => ({
        pref: document.documentElement.dataset.motionPreference,
        effective: document.documentElement.dataset.effectiveMotion,
        progress: document.querySelector('[data-debug="timelineProgress"]')
          ?.textContent,
        score: document.querySelector("[data-score-value]")?.textContent,
      }));
    },
  );

  // Case C: no stored preference + OS full
  report.cases.C = await withPage(
    { preference: null, reducedMotion: "no-preference" },
    async (page) => {
      await page.goto(`${DEV}/?motionDebug=1`, {
        waitUntil: "networkidle",
      });
      await page.waitForFunction(() => {
        const n = Number(
          document.querySelector('[data-debug="timelineProgress"]')?.textContent ||
            "0",
        );
        return n >= 0.9;
      }, { timeout: 15000 });
      return page.evaluate(() => ({
        pref: document.documentElement.dataset.motionPreference,
        effective: document.documentElement.dataset.effectiveMotion,
        progress: document.querySelector('[data-debug="timelineProgress"]')
          ?.textContent,
      }));
    },
  );

  // Case D: reduced preference
  report.cases.D = await withPage(
    { preference: "reduced", reducedMotion: "no-preference" },
    async (page) => {
      await page.goto(`${DEV}/`, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      return page.evaluate(() => ({
        pref: document.documentElement.dataset.motionPreference,
        effective: document.documentElement.dataset.effectiveMotion,
        score: document.querySelector("[data-score-value]")?.textContent,
      }));
    },
  );

  // Deck next/prev
  report.cases.deck = await withPage(
    {
      preference: "full",
      reducedMotion: "no-preference",
      record: "concept-v3-deck-next-prev.webm",
    },
    async (page) => {
      await page.goto(`${DEV}/`, { waitUntil: "networkidle" });
      await page.waitForTimeout(2800);
      await page.locator('[aria-label="Show next project"]').click();
      await page.waitForTimeout(1100);
      await page.locator('[aria-label="Show previous project"]').click();
      await page.waitForTimeout(1100);
      // keyboard
      await page.locator("[data-product-deck]").focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(900);
      return page.evaluate(() => ({
        active: document
          .querySelector('[data-deck-page][data-active="true"]')
          ?.getAttribute("data-deck-page"),
        overflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1,
      }));
    },
  );

  // Mobile swipe
  report.cases.mobile = await withPage(
    {
      preference: "full",
      reducedMotion: "no-preference",
      record: "concept-v3-deck-mobile-swipe.webm",
    },
    async (page) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${DEV}/`, { waitUntil: "networkidle" });
      await page.waitForTimeout(2500);
      const box = await page.locator("[data-product-deck]").boundingBox();
      if (box) {
        const startX = box.x + box.width * 0.82;
        const endX = box.x + box.width * 0.18;
        const y = box.y + box.height * 0.45;
        await page.locator("[data-product-deck]").dispatchEvent("pointerdown", {
          clientX: startX,
          clientY: y,
          pointerType: "touch",
          button: 0,
          bubbles: true,
        });
        await page.locator("[data-product-deck]").dispatchEvent("pointerup", {
          clientX: endX,
          clientY: y,
          pointerType: "touch",
          button: 0,
          bubbles: true,
        });
      }
      await page.waitForTimeout(1000);
      return page.evaluate(() => ({
        active: document
          .querySelector('[data-deck-page][data-active="true"]')
          ?.getAttribute("data-deck-page"),
        overflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1,
      }));
    },
  );

  // Reduced deck switch
  report.cases.reducedDeck = await withPage(
    {
      preference: "reduced",
      reducedMotion: "reduce",
      record: "concept-v3-deck-reduced-switch.webm",
    },
    async (page) => {
      await page.goto(`${DEV}/`, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      await page.locator('[aria-label="Show next project"]').click();
      await page.waitForTimeout(300);
      await page.locator('[aria-label="Show next project"]').click();
      await page.waitForTimeout(300);
      return page.evaluate(() => ({
        active: document
          .querySelector('[data-deck-page][data-active="true"]')
          ?.getAttribute("data-deck-page"),
        effective: document.documentElement.dataset.effectiveMotion,
      }));
    },
  );

  try {
    fs.rmdirSync(VIDEO);
  } catch {
    /* ignore */
  }

  fs.writeFileSync(
    path.join(QA, "concept-v3-deck-capture.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
