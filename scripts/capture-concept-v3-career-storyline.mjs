import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QA = path.join(ROOT, "docs", "portfolio-v3", "qa");
const BASE = process.env.STORYLINE_BASE_URL ?? "http://localhost:3000";
const PAGE = `${BASE}/concept-v3-rebuild`;

const FORBIDDEN = [
  "Maryzad",
  "Obour STEM",
  "IYNA",
  "TEDxYouth",
  "Mediomena",
  "Roboticers",
  "Ignite Talks",
  "Marqity",
  "Additional client work",
];

const VIEWPORTS = [
  { name: "1920x1080", w: 1920, h: 1080 },
  { name: "1600x900", w: 1600, h: 900 },
  { name: "1536x864", w: 1536, h: 864 },
  { name: "1440x900", w: 1440, h: 900 },
  { name: "1366x768", w: 1366, h: 768 },
  { name: "1280x800", w: 1280, h: 800 },
  { name: "1024x768", w: 1024, h: 768 },
  { name: "768x1024", w: 768, h: 1024 },
  { name: "430x932", w: 430, h: 932 },
  { name: "390x844", w: 390, h: 844 },
  { name: "360x800", w: 360, h: 800 },
];

async function gotoCareer(page, { reduced = false } = {}) {
  await page.addInitScript((mode) => {
    localStorage.setItem("portfolio-motion-preference-v3", mode);
  }, reduced ? "reduced" : "full");
  const url = reduced
    ? PAGE
    : `${PAGE}?motionOverride=full`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  if (reduced) {
    await page.evaluate(() => {
      localStorage.setItem("portfolio-motion-preference-v3", "reduced");
      document.documentElement.dataset.effectiveMotion = "reduced";
      document.documentElement.dataset.motionPreference = "reduced";
    });
    await page.reload({ waitUntil: "networkidle" });
  }
  await page.locator("#experience").scrollIntoViewIfNeeded();
  await page.waitForSelector("[data-career-storyline]", { timeout: 20000 });
  await page.waitForTimeout(400);
}

async function clickText(page, text) {
  await page.locator(`button:has-text("${text}")`).first().click({ force: true });
  await page.waitForTimeout(900);
}

async function selectCompany(page, label) {
  const byData = {
    Eraasoft: "eraasoft",
    Intsolutions: "intsolutions",
    KLLIQ: "klliq",
    Tjar: "tjar",
    Theqah: "theqah",
    Kayanac: "kayanac-erp",
    Mohssilh: "mohssilh",
    Phoenix: "phoenix-techs",
    Upwork: "upwork-freelance",
  };
  const id = byData[label];
  if (id) {
    const el = page.locator(`[data-company-selector="${id}"]`);
    if (await el.count()) {
      await el.first().click({ force: true });
      await page.waitForTimeout(900);
      return;
    }
  }
  await clickText(page, label);
}

async function checks(page) {
  return page.evaluate((forbidden) => {
    const chapter = document.querySelector("#experience");
    const text = chapter?.textContent ?? "";
    const root = document.querySelector("[data-career-storyline]");
    return {
      hasStoryline: Boolean(root),
      trajectoryPresent: Boolean(document.querySelector("[data-career-trajectory]")),
      active: document
        .querySelector('[data-story="incoming"] [data-company]')
        ?.getAttribute("data-company"),
      mode: root?.getAttribute("data-mode"),
      companyNavCount: document.querySelectorAll("[data-company-selector]").length,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      heightSvh: chapter
        ? chapter.getBoundingClientRect().height / window.innerHeight
        : null,
      forbidden: forbidden.filter((name) => text.includes(name)),
    };
  }, FORBIDDEN);
}

async function shot(page, name, report) {
  const file = `concept-v3-storyline-${name}.png`;
  const out = path.join(QA, file);
  await page.screenshot({ path: out, fullPage: false });
  report.screenshots[file] = out;
}

async function main() {
  fs.mkdirSync(QA, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = {
    base: BASE,
    consoleErrors: [],
    screenshots: {},
    recordings: {},
    checks: {},
  };

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
    });
    const page = await ctx.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        report.consoleErrors.push(`[${vp.name}] ${msg.text()}`);
      }
    });
    await gotoCareer(page);
    await shot(page, vp.name, report);
    report.checks[vp.name] = await checks(page);
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await gotoCareer(page);
    await selectCompany(page, "Mohssilh");
    await shot(page, "desktop-owning-mohssilh", report);
    await clickText(page, "Entering");
    await selectCompany(page, "Eraasoft");
    await shot(page, "desktop-entering-eraasoft", report);
    await clickText(page, "Shipping");
    await selectCompany(page, "KLLIQ");
    await shot(page, "desktop-shipping-klliq", report);
    await clickText(page, "Independent work");
    await selectCompany(page, "Phoenix");
    await shot(page, "desktop-independent-phoenix", report);
    await selectCompany(page, "Upwork");
    await shot(page, "desktop-independent-upwork", report);
    report.checks.desktop = await checks(page);
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await ctx.newPage();
    await gotoCareer(page);
    await shot(page, "laptop-1366x768", report);
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
    const page = await ctx.newPage();
    await gotoCareer(page);
    await shot(page, "tablet", report);
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await ctx.newPage();
    await gotoCareer(page);
    await clickText(page, "Owning");
    await selectCompany(page, "Mohssilh");
    await shot(page, "mobile-owning-mohssilh", report);
    await clickText(page, "Shipping");
    await selectCompany(page, "Tjar");
    await shot(page, "mobile-shipping-tjar", report);
    await clickText(page, "Entering");
    await selectCompany(page, "Intsolutions");
    await shot(page, "mobile-entering-intsolutions", report);
    await clickText(page, "Independent work");
    await selectCompany(page, "Upwork");
    await shot(page, "mobile-independent-upwork", report);
    report.checks.mobile = await checks(page);
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await gotoCareer(page);
    await page.evaluate(() => {
      document.body.style.zoom = "2";
    });
    await page.waitForTimeout(300);
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await shot(page, "zoom-200", report);
    report.checks.zoom200 = await checks(page);
    await ctx.close();
  }

  async function recordClip(name, viewport, reduced, run) {
    const ctx = await browser.newContext({
      viewport,
      reducedMotion: reduced ? "reduce" : "no-preference",
      recordVideo: { dir: QA, size: viewport },
      isMobile: viewport.width < 500,
      hasTouch: viewport.width < 500,
    });
    const page = await ctx.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        report.consoleErrors.push(`[video:${name}] ${msg.text()}`);
      }
    });
    await gotoCareer(page, { reduced });
    await run(page);
    const video = page.video();
    await ctx.close();
    if (video) {
      const tmp = await video.path();
      const dest = path.join(QA, `concept-v3-storyline-${name}.webm`);
      fs.renameSync(tmp, dest);
      report.recordings[name] = dest;
    }
  }

  await recordClip("era-progression", { width: 1440, height: 900 }, false, async (page) => {
    await clickText(page, "Entering");
    await clickText(page, "Shipping");
    await clickText(page, "Owning");
  });

  await recordClip("owning-companies", { width: 1440, height: 900 }, false, async (page) => {
    await clickText(page, "Owning");
    await selectCompany(page, "Theqah");
    await selectCompany(page, "Kayanac");
    await selectCompany(page, "Mohssilh");
  });

  await recordClip("backward-jump", { width: 1440, height: 900 }, false, async (page) => {
    await selectCompany(page, "Mohssilh");
    await clickText(page, "Entering");
    await selectCompany(page, "Eraasoft");
  });

  await recordClip("independent-mode", { width: 1440, height: 900 }, false, async (page) => {
    await clickText(page, "Independent work");
    await selectCompany(page, "Phoenix");
    await selectCompany(page, "Upwork");
    await clickText(page, "Back to main career");
  });

  await recordClip("mobile-selection", { width: 390, height: 844 }, false, async (page) => {
    await clickText(page, "Entering");
    await selectCompany(page, "Eraasoft");
    await clickText(page, "Owning");
    await selectCompany(page, "Mohssilh");
  });

  await recordClip("reduced-motion", { width: 1440, height: 900 }, true, async (page) => {
    await clickText(page, "Entering");
    await selectCompany(page, "Intsolutions");
    await clickText(page, "Owning");
    await selectCompany(page, "Mohssilh");
  });

  const jsonPath = path.join(QA, "concept-v3-storyline-capture.json");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
