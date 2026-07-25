import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "docs", "portfolio-v3", "qa", "s2b");
const BASE = process.env.PORTFOLIO_BASE_URL ?? "http://localhost:3010";

async function settle(page, url, ms = 4200) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(ms);
}

async function shot(page, filePath, fullPage = false) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  await page.screenshot({ path: filePath, fullPage });
}

async function main() {
  const dirs = {
    current: path.join(OUT, "current-regression"),
    hero: path.join(OUT, "v2-hero"),
    systems: path.join(OUT, "v2-systems"),
    covers: path.join(OUT, "covers"),
    filters: path.join(OUT, "filters"),
    zoom: path.join(OUT, "zoom"),
  };
  for (const dir of Object.values(dirs)) fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const report = { base: BASE, consoleErrors: [], checks: {} };

  const currentVps = [
    { name: "1440x900", w: 1440, h: 900 },
    { name: "390x844", w: 390, h: 844 },
  ];
  for (const vp of currentVps) {
    const page = await browser.newPage({
      viewport: { width: vp.w, height: vp.h },
      isMobile: vp.w < 500,
      hasTouch: vp.w < 500,
    });
    page.on("console", (msg) => {
      if (msg.type() === "error")
        report.consoleErrors.push(`[current ${vp.name}] ${msg.text()}`);
    });
    await settle(page, `${BASE}/?motionOverride=full`);
    const check = await page.evaluate(() => ({
      variant: document
        .querySelector("[data-portfolio-variant]")
        ?.getAttribute("data-portfolio-variant"),
      education: !!document.querySelector('[data-slot="education"]'),
      products: !!document.querySelector('[data-slot="products"]'),
      selectedSystems: !!document.querySelector("#selected-systems"),
      productEngineer: /PRODUCT ENGINEER/i.test(
        document.querySelector("[data-hero-eyebrow]")?.textContent ?? "",
      ),
      softwareEngineer: /SOFTWARE ENGINEER/i.test(
        document.querySelector("[data-hero-eyebrow]")?.textContent ?? "",
      ),
      overflowX:
        document.documentElement.scrollWidth > window.innerWidth + 1,
    }));
    report.checks[`current-${vp.name}`] = check;
    await shot(page, path.join(dirs.current, `${vp.name}.png`));
    await page.close();
    console.log("current", vp.name, check);
  }

  const heroVps = [
    { name: "1920x1080", w: 1920, h: 1080 },
    { name: "1440x900", w: 1440, h: 900 },
    { name: "1366x768", w: 1366, h: 768 },
    { name: "1251x611", w: 1251, h: 611 },
    { name: "1024x1366", w: 1024, h: 1366 },
    { name: "768x1024", w: 768, h: 1024 },
    { name: "390x844", w: 390, h: 844 },
    { name: "320x568", w: 320, h: 568 },
  ];
  for (const vp of heroVps) {
    const page = await browser.newPage({
      viewport: { width: vp.w, height: vp.h },
      isMobile: vp.w < 500,
      hasTouch: vp.w < 500,
    });
    page.on("console", (msg) => {
      if (msg.type() === "error")
        report.consoleErrors.push(`[v2-hero ${vp.name}] ${msg.text()}`);
    });
    await settle(page, `${BASE}/v2?motionOverride=full`);
    const check = await page.evaluate(() => {
      const eyebrow =
        document.querySelector("[data-hero-eyebrow]")?.textContent ?? "";
      const summary =
        document.querySelector("[data-hero-summary]")?.textContent ?? "";
      const tech =
        document.querySelector("[data-hero-tech-line]")?.textContent ?? "";
      const credential = document.querySelector("[data-education-credential]");
      const identity = document.querySelector('[data-slot="identity"]');
      return {
        composition: document
          .querySelector("[data-hero-composition]")
          ?.getAttribute("data-hero-composition"),
        softwareEngineer: /SOFTWARE ENGINEER/i.test(eyebrow),
        productEngineer: /PRODUCT ENGINEER/i.test(eyebrow),
        backendFocus: /Backend-focused software engineer/i.test(summary),
        techLine: /PHP/.test(tech) && /Laravel/.test(tech) && /Next\.js/.test(tech),
        credentialInIdentity: !!(credential && identity?.contains(credential)),
        educationJourney: !!document.querySelector('[data-slot="education"]'),
        productDeck: !!document.querySelector('[data-slot="products"]'),
        overflowX:
          document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    });
    report.checks[`v2-hero-${vp.name}`] = check;
    await shot(page, path.join(dirs.hero, `${vp.name}.png`));
    await page.close();
    console.log("v2-hero", vp.name, check);
  }

  const systemsVps = [
    { name: "1920x1080", w: 1920, h: 1080 },
    { name: "1440x900", w: 1440, h: 900 },
    { name: "1366x768", w: 1366, h: 768 },
    { name: "1024x1366", w: 1024, h: 1366 },
    { name: "768x1024", w: 768, h: 1024 },
    { name: "390x844", w: 390, h: 844 },
    { name: "320x568", w: 320, h: 568 },
  ];
  for (const vp of systemsVps) {
    const page = await browser.newPage({
      viewport: { width: vp.w, height: vp.h },
      isMobile: vp.w < 500,
      hasTouch: vp.w < 500,
    });
    page.on("console", (msg) => {
      if (msg.type() === "error")
        report.consoleErrors.push(`[systems ${vp.name}] ${msg.text()}`);
    });
    await settle(page, `${BASE}/v2#selected-systems`, 3500);
    await page.evaluate(() => {
      document
        .querySelector("#selected-systems")
        ?.scrollIntoView({ block: "start" });
    });
    await page.waitForTimeout(600);
    const check = await page.evaluate(() => {
      const section = document.querySelector("#selected-systems");
      const text = section?.textContent ?? "";
      return {
        present: !!section,
        featuredHeading: /Featured Systems/.test(text),
        filters: !!document.querySelector('[aria-label*="Filter featured"]'),
        covers: document.querySelectorAll("[data-project-cover]").length,
        flagship: text.includes("Merchant Operations Platform"),
        nabd: text.includes("NABD"),
        vending: text.includes("Smart Vending"),
        clinic: text.includes("Virtual Clinic"),
        wasfaty: /wasfaty/i.test(text),
        theqah: /theqah/i.test(text),
        fakeHref: !!document.querySelector('#selected-systems a[href="#"]'),
        overflowX:
          document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    });
    report.checks[`systems-${vp.name}`] = check;
    await shot(page, path.join(dirs.systems, `${vp.name}.png`));
    if (vp.name === "1440x900") {
      const flagship = page.locator('[data-system-scene="flagship"]');
      await flagship.screenshot({
        path: path.join(dirs.covers, "flagship-close.png"),
      });
      await page
        .locator('[data-project-cover="messaging-router"]')
        .screenshot({ path: path.join(dirs.covers, "nabd-cover.png") });
      await page
        .locator('[data-project-cover="vending-device-flow"]')
        .screenshot({ path: path.join(dirs.covers, "smart-vending-cover.png") });
      await page
        .locator('[data-project-cover="virtual-clinic-loop"]')
        .screenshot({
          path: path.join(dirs.covers, "virtual-clinic-cover.png"),
        });
      await shot(
        page,
        path.join(dirs.filters, "all-systems-1440x900.png"),
      );
      await page.getByRole("button", { name: /Commerce/i }).click();
      await page.waitForTimeout(500);
      await shot(
        page,
        path.join(dirs.filters, "filtered-commerce-1440x900.png"),
      );
    }
    await page.close();
    console.log("systems", vp.name, check);
  }

  // 200% zoom approximation via smaller CSS viewport scale capture
  const zoomPage = await browser.newPage({
    viewport: { width: 720, height: 450 },
  });
  await settle(zoomPage, `${BASE}/v2?motionOverride=full`);
  await zoomPage.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  await zoomPage.waitForTimeout(800);
  await shot(zoomPage, path.join(dirs.zoom, "hero-200pct-approx.png"));
  await zoomPage.evaluate(() => {
    document
      .querySelector("#selected-systems")
      ?.scrollIntoView({ block: "start" });
  });
  await zoomPage.waitForTimeout(600);
  await shot(zoomPage, path.join(dirs.zoom, "systems-200pct-approx.png"));
  await zoomPage.close();

  const rm = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await rm.emulateMedia({ reducedMotion: "reduce" });
  await settle(rm, `${BASE}/v2`, 2500);
  await shot(rm, path.join(dirs.hero, "1440x900-reduced-motion.png"));
  await rm.evaluate(() => {
    document
      .querySelector("#selected-systems")
      ?.scrollIntoView({ block: "start" });
  });
  await rm.waitForTimeout(500);
  await shot(rm, path.join(dirs.systems, "1440x900-reduced-motion.png"));
  await rm.close();

  fs.writeFileSync(
    path.join(OUT, "s2b-diagnostics.json"),
    JSON.stringify(report, null, 2),
  );
  console.log("consoleErrors", report.consoleErrors.length);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
