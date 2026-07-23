import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QA = path.join(ROOT, "docs", "portfolio-v3", "qa");
const BASE = process.env.TIMEFIELD_BASE_URL ?? "http://localhost:3000";
const PAGE = `${BASE}/concept-v3-rebuild`;

const PRIMARY = [
  "eraasoft",
  "intsolutions",
  "klliq",
  "tjar",
  "theqah",
  "kayanac-erp",
  "mohssilh",
];

const ARCHIVE_IDS = [
  "maryzad",
  "obour-stem-it-supervisor",
  "obour-stem-cto",
  "iyna-obour",
  "tedx-youth-ismailia-stem",
  "mediomena",
  "roboticers",
  "ignite-talks",
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
  const url = reduced
    ? `${PAGE}?motionOverride=reduced`
    : `${PAGE}?motionOverride=full`;
  await page.addInitScript((mode) => {
    localStorage.setItem("portfolio-motion-preference-v3", mode);
  }, reduced ? "reduced" : "full");
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.locator("#experience").scrollIntoViewIfNeeded();
  await page.waitForSelector("[data-career-timefield]", { timeout: 15000 });
  await page.waitForTimeout(400);
}

async function selectCompany(page, id) {
  const node = page.locator(`[data-company-node="${id}"]`);
  if (await node.count()) {
    await node.first().click({ force: true });
  } else {
    const chip = page
      .locator("[data-mobile-navigator] button")
      .filter({ hasText: new RegExp(id.split("-")[0], "i") });
    if (await chip.count()) await chip.first().click({ force: true });
  }
  await page.waitForTimeout(1100);
}

async function selectIndependent(page, label) {
  const btn = page
    .locator("[data-independent-lane] button")
    .filter({ hasText: new RegExp(label, "i") });
  await btn.first().click({ force: true });
  await page.waitForTimeout(1100);
}

async function selectEra(page, needle) {
  const btn = page
    .locator('[role="tablist"][aria-label="Career eras"] button')
    .filter({ hasText: new RegExp(needle, "i") });
  await btn.first().click({ force: true });
  await page.waitForTimeout(1100);
}

async function collectChecks(page) {
  return page.evaluate((archiveIds) => {
    const root = document.querySelector("[data-career-timefield]");
    const chapter = document.querySelector("#experience");
    const text = chapter?.textContent ?? "";
    const archiveHits = archiveIds.filter((id) =>
      Boolean(document.querySelector(`[data-company="${id}"], [data-record="${id}"], [data-company-node="${id}"]`)),
    );
    const forbiddenNames = [
      "Maryzad",
      "Obour STEM",
      "IYNA",
      "TEDxYouth",
      "Mediomena",
      "Roboticers",
      "Ignite Talks",
    ].filter((name) => text.includes(name));

    const dossier = document.querySelector('[data-dossier="incoming"] [data-company]');
    return {
      hasTimefield: Boolean(root),
      activeCompany: dossier?.getAttribute("data-company") ?? null,
      lane: root?.getAttribute("data-lane") ?? null,
      nodeCount: document.querySelectorAll("[data-company-node]").length,
      indieCount: document.querySelectorAll("[data-independent-lane] button").length,
      horizontalOverflow:
        document.documentElement.scrollWidth > window.innerWidth + 1,
      chapterHeightSvh: chapter
        ? chapter.getBoundingClientRect().height / window.innerHeight
        : null,
      archiveHits,
      forbiddenNames,
      hasFoundationDisclosure: /Foundation|school and community/i.test(text),
      accordionPresent: Boolean(
        document.querySelector('[data-career-layout="mobile"] .accordionItem, [data-mobile-record-trigger]'),
      ),
    };
  }, ARCHIVE_IDS);
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

  // ——— Viewport stills (latest company default) ———
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        report.consoleErrors.push(`[${vp.name}] ${msg.text()}`);
      }
    });
    await gotoCareer(page);
    const file = `concept-v3-timefield-${vp.name}.png`;
    const out = path.join(QA, file);
    await page.screenshot({ path: out, fullPage: false });
    report.screenshots[file] = out;
    report.checks[vp.name] = await collectChecks(page);
    await context.close();
  }

  // ——— Interaction stills ———
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await gotoCareer(page);

    await selectCompany(page, "eraasoft");
    await page.screenshot({
      path: path.join(QA, "concept-v3-timefield-eraasoft.png"),
      fullPage: false,
    });
    report.screenshots["concept-v3-timefield-eraasoft.png"] = path.join(
      QA,
      "concept-v3-timefield-eraasoft.png",
    );

    await selectEra(page, "Owning");
    await page.screenshot({
      path: path.join(QA, "concept-v3-timefield-era3-jump.png"),
      fullPage: false,
    });
    report.screenshots["concept-v3-timefield-era3-jump.png"] = path.join(
      QA,
      "concept-v3-timefield-era3-jump.png",
    );

    await selectIndependent(page, "Phoenix");
    await page.screenshot({
      path: path.join(QA, "concept-v3-timefield-phoenix.png"),
      fullPage: false,
    });
    report.screenshots["concept-v3-timefield-phoenix.png"] = path.join(
      QA,
      "concept-v3-timefield-phoenix.png",
    );

    await selectIndependent(page, "Upwork");
    await page.screenshot({
      path: path.join(QA, "concept-v3-timefield-upwork.png"),
      fullPage: false,
    });
    report.screenshots["concept-v3-timefield-upwork.png"] = path.join(
      QA,
      "concept-v3-timefield-upwork.png",
    );

    await page.locator("button", { hasText: "Return to main path" }).click();
    await page.waitForTimeout(1100);
    await page.screenshot({
      path: path.join(QA, "concept-v3-timefield-return-main.png"),
      fullPage: false,
    });
    report.checks.interaction = await collectChecks(page);
    await context.close();
  }

  // ——— Mobile still ———
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    await gotoCareer(page);
    await selectCompany(page, "mohssilh");
    await page.screenshot({
      path: path.join(QA, "concept-v3-timefield-mobile-mohssilh.png"),
      fullPage: false,
    });
    report.checks.mobile = await collectChecks(page);
    await context.close();
  }

  // ——— Recordings ———
  async function recordClip(name, viewport, reduced, run) {
    const context = await browser.newContext({
      viewport,
      reducedMotion: reduced ? "reduce" : "no-preference",
      recordVideo: {
        dir: QA,
        size: viewport,
      },
    });
    const page = await context.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        report.consoleErrors.push(`[video:${name}] ${msg.text()}`);
      }
    });
    await gotoCareer(page, { reduced });
    await run(page);
    const video = page.video();
    await context.close();
    if (video) {
      const tmp = await video.path();
      const dest = path.join(QA, `concept-v3-timefield-${name}.webm`);
      fs.renameSync(tmp, dest);
      report.recordings[name] = dest;
    }
  }

  await recordClip(
    "forward-progression",
    { width: 1440, height: 900 },
    false,
    async (page) => {
      for (const id of PRIMARY) {
        await selectCompany(page, id);
      }
    },
  );

  await recordClip(
    "backward-progression",
    { width: 1440, height: 900 },
    false,
    async (page) => {
      await selectCompany(page, "mohssilh");
      await selectCompany(page, "kayanac-erp");
      await selectCompany(page, "theqah");
    },
  );

  await recordClip(
    "era-jump",
    { width: 1440, height: 900 },
    false,
    async (page) => {
      await selectEra(page, "Entering");
      await selectEra(page, "Owning");
    },
  );

  await recordClip(
    "independent-lane",
    { width: 1440, height: 900 },
    false,
    async (page) => {
      await selectCompany(page, "theqah");
      await selectIndependent(page, "Phoenix");
      await selectIndependent(page, "Upwork");
      await page.locator("button", { hasText: "Return to main path" }).click();
      await page.waitForTimeout(1100);
    },
  );

  await recordClip(
    "mobile-selection",
    { width: 390, height: 844 },
    false,
    async (page) => {
      for (const id of ["eraasoft", "klliq", "mohssilh"]) {
        await selectCompany(page, id);
      }
    },
  );

  await recordClip(
    "mobile-swipe",
    { width: 390, height: 844 },
    false,
    async (page) => {
      await selectCompany(page, "klliq");
      const box = await page.locator("[data-career-timefield]").boundingBox();
      if (box) {
        const y = box.y + box.height * 0.55;
        const x1 = box.x + box.width * 0.8;
        const x2 = box.x + box.width * 0.2;
        await page.mouse.move(x1, y);
        await page.mouse.down();
        await page.mouse.move(x2, y, { steps: 12 });
        await page.mouse.up();
        await page.waitForTimeout(1100);
        await page.mouse.move(x2, y);
        await page.mouse.down();
        await page.mouse.move(x1, y, { steps: 12 });
        await page.mouse.up();
        await page.waitForTimeout(1100);
      }
    },
  );

  await recordClip(
    "reduced-motion",
    { width: 1440, height: 900 },
    true,
    async (page) => {
      await selectCompany(page, "eraasoft");
      await selectCompany(page, "mohssilh");
      await selectCompany(page, "tjar");
    },
  );

  const jsonPath = path.join(QA, "concept-v3-timefield-capture.json");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
