import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QA = path.join(ROOT, "docs", "portfolio-v3", "qa");
const VIDEO = path.join(QA, "_deck-repair-video");
const DEV = "http://localhost:3000";

async function main() {
  fs.mkdirSync(QA, { recursive: true });
  fs.mkdirSync(VIDEO, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = {
    viewports: {},
    behaviors: {},
    consoleErrors: [],
    videos: {},
  };

  async function withPage(opts, fn) {
    const context = await browser.newContext({
      viewport: opts.viewport ?? { width: 1440, height: 900 },
      reducedMotion: opts.reducedMotion ?? "no-preference",
      recordVideo: opts.record
        ? { dir: VIDEO, size: opts.viewport ?? { width: 1440, height: 900 } }
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

  const viewports = [
    [1920, 1080],
    [1600, 900],
    [1440, 900],
    [1280, 800],
    [1024, 768],
    [768, 1024],
    [430, 932],
    [390, 844],
    [360, 800],
  ];

  for (const [w, h] of viewports) {
    report.viewports[`${w}x${h}`] = await withPage(
      { viewport: { width: w, height: h }, preference: "full" },
      async (page) => {
        await page.goto(`${DEV}/concept-v3-rebuild`, {
          waitUntil: "networkidle",
        });
        await page.waitForTimeout(2800);
        return page.evaluate(() => {
          const edu = document.querySelector('[data-slot="education"]');
          const products = document.querySelector('[data-slot="products"]');
          const er = edu?.getBoundingClientRect();
          const pr = products?.getBoundingClientRect();
          const overlap =
            er && pr
              ? !(
                  er.right <= pr.left ||
                  er.left >= pr.right ||
                  er.bottom <= pr.top ||
                  er.top >= pr.bottom
                )
              : false;
          const arrowsHidden = [...document.querySelectorAll(
            '[aria-label="Show previous project"], [aria-label="Show next project"]',
          )].every((el) => {
            const r = el.getBoundingClientRect();
            return r.width <= 1 && r.height <= 1;
          });
          return {
            overflow:
              document.documentElement.scrollWidth >
              document.documentElement.clientWidth + 1,
            overlap,
            seal: document.querySelector("[data-edu-seal]")?.textContent?.trim(),
            email: document
              .querySelector('[aria-label="Send email"]')
              ?.getAttribute("href"),
            socialLabels: [
              ...document.querySelectorAll("[data-hero-socials] a"),
            ].map((a) => a.textContent?.trim()),
            deckHeight: products?.getBoundingClientRect().height ?? 0,
            arrowsHidden,
          };
        });
      },
    );
  }

  // Autoplay full cycle
  report.behaviors.autoplay = await withPage(
    {
      preference: "full",
      record: "concept-v3-deck-autoplay-cycle.webm",
    },
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
          { timeout: 9000 },
        );
        const id = await page
          .locator('[data-deck-page][data-active="true"]')
          .getAttribute("data-deck-page");
        seen.push(id);
      }
      return { seen };
    },
  );

  // Manual mouse turn
  report.behaviors.manual = await withPage(
    {
      preference: "full",
      record: "concept-v3-deck-manual-turn.webm",
    },
    async (page) => {
      await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
      await page.waitForTimeout(3200);
      const box = await page.locator("[data-product-deck]").boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.4);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.4, {
          steps: 14,
        });
        await page.mouse.up();
      }
      await page.waitForTimeout(1100);
      return {
        active: await page
          .locator('[data-deck-page][data-active="true"]')
          .getAttribute("data-deck-page"),
      };
    },
  );

  // Hover pause / resume
  report.behaviors.hoverPause = await withPage(
    {
      preference: "full",
      record: "concept-v3-deck-hover-pause.webm",
    },
    async (page) => {
      await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
      await page.waitForTimeout(3200);
      const before = await page
        .locator('[data-deck-page][data-active="true"]')
        .getAttribute("data-deck-page");
      await page.locator("[data-product-deck]").hover();
      await page.waitForTimeout(5200);
      const during = await page
        .locator('[data-deck-page][data-active="true"]')
        .getAttribute("data-deck-page");
      await page.mouse.move(20, 20);
      await page.waitForTimeout(7000);
      const after = await page
        .locator('[data-deck-page][data-active="true"]')
        .getAttribute("data-deck-page");
      return { before, during, after, paused: before === during, resumed: after !== during };
    },
  );

  // Indicator select
  report.behaviors.indicator = await withPage(
    {
      preference: "full",
      record: "concept-v3-deck-indicator.webm",
    },
    async (page) => {
      await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
      await page.waitForTimeout(2800);
      await page.locator('[aria-label="Show NABD Messaging"]').click();
      await page.waitForTimeout(1000);
      return {
        active: await page
          .locator('[data-deck-page][data-active="true"]')
          .getAttribute("data-deck-page"),
      };
    },
  );

  // Mobile autoplay + swipe
  report.behaviors.mobileAutoplay = await withPage(
    {
      preference: "full",
      viewport: { width: 390, height: 844 },
      record: "concept-v3-deck-mobile-autoplay.webm",
    },
    async (page) => {
      await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
      await page.waitForTimeout(3200);
      const first = await page
        .locator('[data-deck-page][data-active="true"]')
        .getAttribute("data-deck-page");
      await page.waitForTimeout(5600);
      const second = await page
        .locator('[data-deck-page][data-active="true"]')
        .getAttribute("data-deck-page");
      return { first, second, changed: first !== second };
    },
  );

  report.behaviors.mobileSwipe = await withPage(
    {
      preference: "full",
      viewport: { width: 390, height: 844 },
      record: "concept-v3-deck-mobile-swipe.webm",
    },
    async (page) => {
      await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
      await page.waitForTimeout(2800);
      await page.locator("[data-product-deck]").scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const box = await page.locator("[data-deck-stack]").boundingBox();
      if (box) {
        const y = box.y + box.height * 0.45;
        await page.mouse.move(box.x + box.width * 0.85, y);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.15, y, { steps: 18 });
        await page.mouse.up();
      }
      await page.waitForTimeout(1100);
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

  // Reduced motion switch
  report.behaviors.reduced = await withPage(
    {
      preference: "reduced",
      reducedMotion: "reduce",
      record: "concept-v3-deck-reduced-switch.webm",
    },
    async (page) => {
      await page.goto(`${DEV}/concept-v3-rebuild`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      const first = await page
        .locator('[data-deck-page][data-active="true"]')
        .getAttribute("data-deck-page");
      await page.waitForTimeout(5000);
      const still = await page
        .locator('[data-deck-page][data-active="true"]')
        .getAttribute("data-deck-page");
      await page.locator('[aria-label="Show Smart Vending"]').click();
      await page.waitForTimeout(400);
      return {
        first,
        still,
        afterSelect: await page
          .locator('[data-deck-page][data-active="true"]')
          .getAttribute("data-deck-page"),
        noAutoplay: first === still,
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
    path.join(QA, "concept-v3-deck-repair-capture.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
