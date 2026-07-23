import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QA = path.join(ROOT, "docs", "portfolio-v3", "qa");
const DEV = process.env.S1A_BASE_URL ?? "http://localhost:3003";
const PAGE = `${DEV}/concept-v3-rebuild`;

const shots = [
  { name: "origin-desktop", w: 1440, h: 900, target: "#education" },
  { name: "origin-tablet", w: 768, h: 1024, target: "#education" },
  { name: "origin-mobile", w: 390, h: 844, target: "#education" },
  {
    name: "career-desktop-foundations",
    w: 1440,
    h: 900,
    target: "#experience",
    eras: "engineering-foundations",
  },
  {
    name: "career-desktop-shipping",
    w: 1440,
    h: 900,
    target: "#experience",
    eras: "shipping-products",
  },
  {
    name: "career-desktop-owning",
    w: 1440,
    h: 900,
    target: "#experience",
    eras: "owning-production-systems",
  },
  {
    name: "career-desktop-independent",
    w: 1440,
    h: 900,
    target: "#experience",
    eras: "owning-production-systems",
    scrollIndependent: true,
  },
  { name: "career-tablet", w: 768, h: 1024, target: "#experience" },
  {
    name: "career-mobile-closed",
    w: 390,
    h: 844,
    target: "#experience",
    mobileExpand: null,
  },
  {
    name: "career-mobile-expanded",
    w: 390,
    h: 844,
    target: "#experience",
    mobileExpand: "mohssilh",
  },
  {
    name: "career-intsolutions-fallback",
    w: 1440,
    h: 900,
    target: "#experience",
    eras: "engineering-foundations",
    selectRecord: "intsolutions",
  },
];

async function main() {
  fs.mkdirSync(QA, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = { consoleErrors: [], screenshots: {}, checks: {} };

  for (const shot of shots) {
    const context = await browser.newContext({
      viewport: { width: shot.w, height: shot.h },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") report.consoleErrors.push(msg.text());
    });

    await page.addInitScript(() => {
      localStorage.setItem("portfolio-motion-preference-v3", "reduced");
    });

    await page.goto(PAGE, { waitUntil: "networkidle", timeout: 60000 });
    await page.evaluate(() => {
      document.documentElement.dataset.effectiveMotion = "reduced";
    });
    await page.waitForTimeout(500);

    await page.locator(shot.target).scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    if (shot.eras && shot.w >= 1024) {
      const labels = {
        "engineering-foundations": "foundations",
        "shipping-products": "Shipping",
        "owning-production-systems": "Owning",
      };
      const needle = labels[shot.eras] ?? shot.eras;
      const btn = page
        .locator("#experience nav[aria-label='Career eras'] button")
        .filter({ hasText: new RegExp(needle, "i") });
      if (await btn.count()) await btn.first().click({ force: true });
      await page.waitForTimeout(250);
    }

    if (shot.selectRecord && shot.w >= 1024) {
      const recordBtn = page.locator(
        `#experience [data-record="${shot.selectRecord}"] button`,
      );
      if (await recordBtn.count()) await recordBtn.first().click({ force: true });
      await page.waitForTimeout(200);
    }

    if (shot.w < 500) {
      if (shot.mobileExpand === null) {
        const open = page.locator(
          '#experience [data-career-layout="mobile"] button[data-mobile-record-trigger][aria-expanded="true"]',
        );
        if (await open.count()) await open.first().click({ force: true });
      } else if (shot.mobileExpand) {
        const trigger = page.locator(
          `#experience [data-career-layout="mobile"] button[data-mobile-record-trigger="${shot.mobileExpand}"]`,
        );
        if (await trigger.count()) {
          const expanded = await trigger.getAttribute("aria-expanded");
          if (expanded !== "true") await trigger.click({ force: true });
        }
      }
      await page.waitForTimeout(200);
    }

    if (shot.scrollIndependent) {
      const indie = page.locator("#experience [aria-label='Independent track']");
      if (await indie.count()) await indie.first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
    }

    const file = `concept-v3-s1a-${shot.name}.png`;
    const out = path.join(QA, file);
    await page.screenshot({ path: out, fullPage: false });
    report.screenshots[file] = out;

    report.checks[shot.name] = await page.evaluate(() => ({
      hasEducation: Boolean(document.querySelector("#education")),
      hasExperience: Boolean(document.querySelector("#experience")),
      horizontalOverflow:
        document.documentElement.scrollWidth > window.innerWidth + 1,
      intsolutionsPresent: Boolean(
        document.querySelector('[data-record="intsolutions"]'),
      ),
    }));

    await context.close();
  }

  const jsonPath = path.join(QA, "concept-v3-s1a-static-capture.json");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
