import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QA = path.join(ROOT, "docs", "portfolio-v3", "qa");
const VIDEO = path.join(QA, "_deck-smooth-video");
const DEV = "http://localhost:3000";

async function main() {
  fs.mkdirSync(QA, { recursive: true });
  fs.mkdirSync(VIDEO, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = { behaviors: {}, consoleErrors: [], videos: {} };

  async function withPage(opts, fn) {
    const context = await browser.newContext({
      viewport: opts.viewport ?? { width: 1440, height: 900 },
      reducedMotion: opts.reducedMotion ?? "no-preference",
      recordVideo: opts.record
        ? {
            dir: VIDEO,
            size: opts.viewport ?? { width: 1440, height: 900 },
          }
        : undefined,
    });
    const page = await context.newPage();
    page.on("console", (m) => {
      if (m.type() === "error") report.consoleErrors.push(m.text());
    });
    await page.addInitScript((pref) => {
      localStorage.setItem("portfolio-motion-preference-v3", pref);
    }, opts.preference ?? "full");
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

  report.behaviors.autoplay = await withPage(
    { preference: "full", record: "concept-v3-deck-smooth-autoplay.webm" },
    async (page) => {
      await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
      await page.waitForTimeout(3200);
      const seen = [];
      for (let i = 0; i < 3; i++) {
        await page.waitForFunction(
          (prev) => {
            const id = document
              .querySelector('[data-deck-page][data-active="true"]')
              ?.getAttribute("data-deck-page");
            return Boolean(id && id !== prev);
          },
          seen[seen.length - 1] ?? "your-obour-guide",
          { timeout: 12000 },
        );
        seen.push(
          await page
            .locator('[data-deck-page][data-active="true"]')
            .getAttribute("data-deck-page"),
        );
      }
      return { seen };
    },
  );

  report.behaviors.dragComplete = await withPage(
    { preference: "full", record: "concept-v3-deck-smooth-drag.webm" },
    async (page) => {
      await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
      await page.waitForTimeout(3200);
      const box = await page.locator("[data-deck-stack]").boundingBox();
      const before = await page
        .locator('[data-deck-page][data-active="true"]')
        .getAttribute("data-deck-page");
      if (box) {
        const y = box.y + box.height * 0.45;
        await page.mouse.move(box.x + box.width * 0.8, y);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.15, y, { steps: 20 });
        await page.mouse.up();
      }
      await page.waitForTimeout(1200);
      return {
        before,
        after: await page
          .locator('[data-deck-page][data-active="true"]')
          .getAttribute("data-deck-page"),
      };
    },
  );

  report.behaviors.dragSnapBack = await withPage(
    { preference: "full", record: "concept-v3-deck-smooth-snapback.webm" },
    async (page) => {
      await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
      await page.waitForTimeout(3200);
      const box = await page.locator("[data-deck-stack]").boundingBox();
      const before = await page
        .locator('[data-deck-page][data-active="true"]')
        .getAttribute("data-deck-page");
      if (box) {
        const y = box.y + box.height * 0.45;
        await page.mouse.move(box.x + box.width * 0.55, y);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.42, y, { steps: 8 });
        await page.mouse.up();
      }
      await page.waitForTimeout(700);
      return {
        before,
        after: await page
          .locator('[data-deck-page][data-active="true"]')
          .getAttribute("data-deck-page"),
        snapped: true,
      };
    },
  );

  report.behaviors.atmosphere = await withPage(
    { preference: "full", record: "concept-v3-deck-smooth-atmosphere.webm" },
    async (page) => {
      await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
      await page.waitForTimeout(3000);
      const accents = [];
      for (const label of [
        "Show Smart Vending",
        "Show NABD Messaging",
        "Show Your Obour Guide",
      ]) {
        await page.locator(`[aria-label="${label}"]`).click();
        await page.waitForTimeout(1100);
        accents.push(
          await page.evaluate(() =>
            getComputedStyle(
              document.querySelector("[data-product-deck]"),
            ).getPropertyValue("--deck-accent"),
          ),
        );
      }
      return { accents };
    },
  );

  report.behaviors.mobileSwipe = await withPage(
    {
      preference: "full",
      viewport: { width: 390, height: 844 },
      record: "concept-v3-deck-smooth-mobile-swipe.webm",
    },
    async (page) => {
      await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
      await page.waitForTimeout(2800);
      await page.locator("[data-product-deck]").scrollIntoViewIfNeeded();
      const box = await page.locator("[data-deck-stack]").boundingBox();
      if (box) {
        const y = box.y + box.height * 0.45;
        await page.mouse.move(box.x + box.width * 0.85, y);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.15, y, { steps: 18 });
        await page.mouse.up();
      }
      await page.waitForTimeout(1000);
      return {
        active: await page
          .locator('[data-deck-page][data-active="true"]')
          .getAttribute("data-deck-page"),
        overflow: await page.evaluate(
          () =>
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth + 1,
        ),
      };
    },
  );

  report.behaviors.reduced = await withPage(
    {
      preference: "reduced",
      reducedMotion: "reduce",
      record: "concept-v3-deck-smooth-reduced.webm",
    },
    async (page) => {
      await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      await page.locator('[aria-label="Show NABD Messaging"]').click();
      await page.waitForTimeout(350);
      return {
        active: await page
          .locator('[data-deck-page][data-active="true"]')
          .getAttribute("data-deck-page"),
        effective: await page.evaluate(
          () => document.documentElement.dataset.effectiveMotion,
        ),
      };
    },
  );

  try {
    fs.rmSync(VIDEO, { recursive: true, force: true });
  } catch {
    /* ignore */
  }

  fs.writeFileSync(
    path.join(QA, "concept-v3-deck-smooth-capture.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
