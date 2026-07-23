import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QA = path.join(ROOT, "docs", "portfolio-v3", "qa");
const BASE = process.env.RESPONSIVE_BASE_URL ?? "http://localhost:3000";
const PAGE = `${BASE}/concept-v3-rebuild?motionOverride=full`;

const VIEWPORTS = [
  { name: "1251x611", w: 1251, h: 611 },
  { name: "1280x600", w: 1280, h: 600 },
  { name: "1280x650", w: 1280, h: 650 },
  { name: "1366x625", w: 1366, h: 625 },
  { name: "1366x700", w: 1366, h: 700 },
  { name: "1440x650", w: 1440, h: 650 },
  { name: "1536x700", w: 1536, h: 700 },
  { name: "1280x800", w: 1280, h: 800 },
  { name: "1366x768", w: 1366, h: 768 },
  { name: "1440x900", w: 1440, h: 900 },
  { name: "1536x864", w: 1536, h: 864 },
  { name: "1600x900", w: 1600, h: 900 },
  { name: "1920x1080", w: 1920, h: 1080 },
  { name: "1180x820", w: 1180, h: 820 },
  { name: "1024x768", w: 1024, h: 768 },
  { name: "1024x600", w: 1024, h: 600 },
  { name: "915x600", w: 915, h: 600 },
  { name: "820x1180", w: 820, h: 1180 },
  { name: "768x1024", w: 768, h: 1024 },
  { name: "430x932", w: 430, h: 932 },
  { name: "412x915", w: 412, h: 915 },
  { name: "390x844", w: 390, h: 844 },
  { name: "375x812", w: 375, h: 812 },
  { name: "360x800", w: 360, h: 800 },
  { name: "320x568", w: 320, h: 568 },
];

async function settle(page) {
  await page.goto(PAGE, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2800);
}

async function inspect(page) {
  return page.evaluate(() => {
    const mode = document.documentElement.dataset.layoutMode ?? null;
    const heroMode =
      document.querySelector("[data-layout-mode]")?.getAttribute("data-layout-mode") ??
      null;
    const hero = document.querySelector("#proof-stage");
    const composition = hero?.querySelector("[class*='composition']");
    const areas = composition
      ? getComputedStyle(composition).gridTemplateAreas
      : null;
    const film = document.querySelector("[data-film-scroll]");
    const overflowing = film?.dataset.overflowing ?? null;
    const slots = ["upwork", "commerce", "education", "products"].map((id) => {
      const el = document.querySelector(`[data-slot="${id}"]`);
      if (!el) return { id, missing: true };
      const r = el.getBoundingClientRect();
      return { id, top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) };
    });
    return {
      mode,
      heroMode,
      areas,
      overflowing,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      inner: `${window.innerWidth}x${window.innerHeight}`,
      slots,
    };
  });
}

async function shot(page, name, report) {
  const file = `concept-v3-responsive-${name}.png`;
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
    await settle(page);
    report.checks[vp.name] = await inspect(page);
    if (
      [
        "1251x611",
        "1280x600",
        "1366x625",
        "1366x768",
        "1440x900",
        "1024x600",
        "768x1024",
        "390x844",
      ].includes(vp.name)
    ) {
      await shot(page, `hero-${vp.name}`, report);
    }
    if (vp.name === "1251x611") {
      await page.screenshot({
        path: path.join(QA, "concept-v3-responsive-full-1251x611.png"),
        fullPage: true,
      });
      report.screenshots["concept-v3-responsive-full-1251x611.png"] = path.join(
        QA,
        "concept-v3-responsive-full-1251x611.png",
      );
    }
    await ctx.close();
  }

  // Career-focused shots
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await settle(page);
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await shot(page, "career-centered-desktop", report);
    report.checks.careerDesktop = await inspect(page);
    await page.evaluate(() =>
      document.querySelector('[data-company-node="phoenix-techs"]')?.click(),
    );
    await page.waitForTimeout(900);
    await shot(page, "career-independent-desktop", report);
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
    const page = await ctx.newPage();
    await settle(page);
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await shot(page, "career-overflow-laptop", report);
    report.checks.careerLaptop = await inspect(page);
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await ctx.newPage();
    await settle(page);
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await shot(page, "career-mobile", report);
    report.checks.careerMobile = await inspect(page);
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await settle(page);
    await page.evaluate(() => {
      document.body.style.zoom = "2";
    });
    await page.waitForTimeout(400);
    await shot(page, "zoom-200", report);
    await ctx.close();
  }

  async function recordClip(name, startVp, run) {
    const ctx = await browser.newContext({
      viewport: startVp,
      recordVideo: { dir: QA, size: startVp },
    });
    const page = await ctx.newPage();
    await settle(page);
    await run(page, ctx);
    const video = page.video();
    await ctx.close();
    if (video) {
      const tmp = await video.path();
      const dest = path.join(QA, `concept-v3-responsive-${name}.webm`);
      fs.renameSync(tmp, dest);
      report.recordings[name] = dest;
    }
  }

  await recordClip("hero-load-1251x611", { width: 1251, height: 611 }, async () => {
    await new Promise((r) => setTimeout(r, 3200));
  });

  await recordClip("resize-1440-to-1251", { width: 1440, height: 900 }, async (page) => {
    await page.waitForTimeout(1200);
    await page.setViewportSize({ width: 1251, height: 611 });
    await page.waitForTimeout(1800);
  });

  await recordClip("resize-1251-to-1024", { width: 1251, height: 611 }, async (page) => {
    await page.waitForTimeout(1000);
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(1800);
  });

  await recordClip("deck-short-landscape", { width: 1251, height: 611 }, async (page) => {
    await page.waitForTimeout(1500);
    const deck = page.locator("[data-product-deck]");
    if (await deck.count()) {
      await deck.focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(1200);
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(1200);
    }
  });

  await recordClip("filmstrip-fit", { width: 1440, height: 900 }, async (page) => {
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    for (const id of ["eraasoft", "tjar", "mohssilh"]) {
      await page.evaluate((companyId) => {
        document.querySelector(`[data-company-node="${companyId}"]`)?.click();
      }, id);
      await page.waitForTimeout(900);
    }
  });

  await recordClip("filmstrip-overflow", { width: 390, height: 844 }, async (page) => {
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    for (const id of ["eraasoft", "klliq", "mohssilh"]) {
      await page.evaluate((companyId) => {
        document.querySelector(`[data-company-node="${companyId}"]`)?.click();
      }, id);
      await page.waitForTimeout(1000);
    }
  });

  await recordClip("mobile-filmstrip", { width: 390, height: 844 }, async (page) => {
    await page.locator("#experience").scrollIntoViewIfNeeded();
    for (const id of ["intsolutions", "theqah", "mohssilh"]) {
      await page.evaluate((companyId) => {
        document.querySelector(`[data-company-node="${companyId}"]`)?.click();
      }, id);
      await page.waitForTimeout(1000);
    }
  });

  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
      recordVideo: { dir: QA, size: { width: 1440, height: 900 } },
    });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      localStorage.setItem("portfolio-motion-preference-v3", "reduced");
    });
    await page.goto(`${BASE}/concept-v3-rebuild`, {
      waitUntil: "networkidle",
      timeout: 90000,
    });
    await page.waitForTimeout(800);
    await page.setViewportSize({ width: 1251, height: 611 });
    await page.waitForTimeout(1200);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1200);
    const video = page.video();
    await ctx.close();
    if (video) {
      const tmp = await video.path();
      const dest = path.join(QA, "concept-v3-responsive-reduced-motion-switch.webm");
      fs.renameSync(tmp, dest);
      report.recordings["reduced-motion-switch"] = dest;
    }
  }

  const jsonPath = path.join(QA, "concept-v3-responsive-capture.json");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
