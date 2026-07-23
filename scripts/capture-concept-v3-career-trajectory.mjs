import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QA = path.join(ROOT, "docs", "portfolio-v3", "qa");
const BASE = process.env.TRAJECTORY_BASE_URL ?? "http://localhost:3000";
const PAGE = `${BASE}/`;

const ARCHIVE_NAMES = [
  "Maryzad",
  "Obour STEM",
  "IYNA",
  "TEDxYouth",
  "Mediomena",
  "Roboticers",
  "Ignite Talks",
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
  const url = `${PAGE}?motionOverride=${reduced ? "full" : "full"}`;
  await page.addInitScript((mode) => {
    localStorage.setItem("portfolio-motion-preference-v3", mode);
  }, reduced ? "reduced" : "full");
  await page.goto(
    reduced ? `${PAGE}` : url,
    { waitUntil: "networkidle", timeout: 90000 },
  );
  if (reduced) {
    await page.evaluate(() => {
      localStorage.setItem("portfolio-motion-preference-v3", "reduced");
      document.documentElement.dataset.effectiveMotion = "reduced";
      document.documentElement.dataset.motionPreference = "reduced";
    });
    await page.reload({ waitUntil: "networkidle" });
  }
  await page.locator("#experience").scrollIntoViewIfNeeded();
  await page.waitForSelector("[data-career-trajectory]", { timeout: 20000 });
  await page.waitForTimeout(450);
}

async function selectCompany(page, id) {
  const desktop = page.locator(`[data-company-node="${id}"]`);
  if ((await desktop.count()) && (await desktop.first().isVisible())) {
    await desktop.first().click({ force: true });
  } else {
    const btn = page.locator(`button:has-text("${labelFor(id)}")`).first();
    await btn.click({ force: true });
  }
  await page.waitForTimeout(1000);
}

function labelFor(id) {
  const map = {
    eraasoft: "Eraasoft",
    intsolutions: "Intsolutions",
    klliq: "KLLIQ",
    tjar: "Tjar",
    theqah: "Theqah",
    "kayanac-erp": "Kayanac",
    mohssilh: "Mohssilh",
    "phoenix-techs": "Phoenix",
    "upwork-freelance": "Upwork",
  };
  return map[id] ?? id;
}

async function selectPath(page, which) {
  const label = which === "main" ? "Main career" : "Independent work";
  await page.locator(`button:has-text("${label}")`).first().click({ force: true });
  await page.waitForTimeout(900);
}

async function selectEra(page, needle) {
  const band = page.locator(`[data-era-band]`).filter({ hasText: new RegExp(needle, "i") });
  if ((await band.count()) && (await band.first().isVisible())) {
    await band.first().click({ force: true });
  } else {
    await page.locator(`button:has-text("${needle}")`).first().click({ force: true });
  }
  await page.waitForTimeout(1000);
}

async function checks(page) {
  return page.evaluate((forbidden) => {
    const chapter = document.querySelector("#experience");
    const text = chapter?.textContent ?? "";
    const root = document.querySelector("[data-career-trajectory]");
    return {
      hasMap: Boolean(root),
      active: document
        .querySelector('[data-dossier="incoming"] [data-company]')
        ?.getAttribute("data-company"),
      path: root?.getAttribute("data-path"),
      nodeCount: document.querySelectorAll("[data-company-node]").length,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      heightSvh: chapter
        ? chapter.getBoundingClientRect().height / window.innerHeight
        : null,
      forbidden: forbidden.filter((name) => text.includes(name)),
      timefieldPresent: Boolean(document.querySelector("[data-career-timefield]")),
    };
  }, ARCHIVE_NAMES);
}

async function shot(page, name, report) {
  const file = `concept-v3-trajectory-${name}.png`;
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
    await selectCompany(page, "mohssilh");
    await shot(page, "desktop-mohssilh", report);
    await selectCompany(page, "eraasoft");
    await shot(page, "desktop-eraasoft", report);
    await selectCompany(page, "klliq");
    await shot(page, "desktop-klliq", report);
    await selectCompany(page, "kayanac-erp");
    await shot(page, "desktop-kayanac-overlap", report);
    await selectPath(page, "independent");
    await selectCompany(page, "phoenix-techs");
    await shot(page, "desktop-phoenix", report);
    await selectCompany(page, "upwork-freelance");
    await shot(page, "desktop-upwork", report);
    report.checks.desktopInteractions = await checks(page);
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
      hasTouch: true,
      isMobile: true,
    });
    const page = await ctx.newPage();
    await gotoCareer(page);
    await selectEra(page, "Owning");
    await selectCompany(page, "mohssilh");
    await shot(page, "mobile-owning-mohssilh", report);
    await selectEra(page, "Shipping");
    await selectCompany(page, "klliq");
    await shot(page, "mobile-shipping-klliq", report);
    await selectPath(page, "independent");
    await shot(page, "mobile-independent", report);
    report.checks.mobile = await checks(page);
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await gotoCareer(page, { reduced: true });
    await selectCompany(page, "eraasoft");
    await shot(page, "reduced-motion", report);
    report.checks.reduced = await checks(page);
    await ctx.close();
  }

  async function recordClip(name, viewport, reduced, run) {
    const ctx = await browser.newContext({
      viewport,
      reducedMotion: reduced ? "reduce" : "no-preference",
      recordVideo: { dir: QA, size: viewport },
      hasTouch: viewport.width < 500,
      isMobile: viewport.width < 500,
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
      const dest = path.join(QA, `concept-v3-trajectory-${name}.webm`);
      fs.renameSync(tmp, dest);
      report.recordings[name] = dest;
    }
  }

  await recordClip("forward-early", { width: 1440, height: 900 }, false, async (page) => {
    for (const id of ["eraasoft", "intsolutions", "klliq"]) {
      await selectCompany(page, id);
    }
  });

  await recordClip("forward-late", { width: 1440, height: 900 }, false, async (page) => {
    for (const id of ["tjar", "theqah", "kayanac-erp", "mohssilh"]) {
      await selectCompany(page, id);
    }
  });

  await recordClip("backward-jump", { width: 1440, height: 900 }, false, async (page) => {
    await selectCompany(page, "mohssilh");
    await selectCompany(page, "eraasoft");
  });

  await recordClip("independent-lane", { width: 1440, height: 900 }, false, async (page) => {
    await selectCompany(page, "theqah");
    await selectPath(page, "independent");
    await selectCompany(page, "phoenix-techs");
    await selectCompany(page, "upwork-freelance");
    await selectPath(page, "main");
  });

  await recordClip("era-band", { width: 1440, height: 900 }, false, async (page) => {
    await selectEra(page, "Entering");
    await selectEra(page, "Owning");
  });

  await recordClip("mobile-selection", { width: 390, height: 844 }, false, async (page) => {
    await selectEra(page, "Entering");
    await selectCompany(page, "eraasoft");
    await selectEra(page, "Owning");
    await selectCompany(page, "mohssilh");
  });

  await recordClip("mobile-swipe", { width: 390, height: 844 }, false, async (page) => {
    await selectCompany(page, "klliq");
    const box = await page.locator("[data-career-trajectory]").boundingBox();
    if (box) {
      const y = box.y + box.height * 0.6;
      await page.mouse.move(box.x + box.width * 0.8, y);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.2, y, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(1000);
      await page.mouse.move(box.x + box.width * 0.2, y);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.8, y, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(1000);
    }
  });

  await recordClip("reduced-motion", { width: 1440, height: 900 }, true, async (page) => {
    await selectCompany(page, "eraasoft");
    await selectCompany(page, "mohssilh");
    await selectCompany(page, "tjar");
  });

  const jsonPath = path.join(QA, "concept-v3-trajectory-capture.json");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
