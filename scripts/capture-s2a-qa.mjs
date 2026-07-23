import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "docs", "portfolio-v3", "qa", "s2a");
const BASE = process.env.PORTFOLIO_BASE_URL ?? "http://localhost:3010";

const CURRENT_VPS = [
  { name: "1440x900", w: 1440, h: 900 },
  { name: "1366x768", w: 1366, h: 768 },
  { name: "1024x1366", w: 1024, h: 1366 },
  { name: "390x844", w: 390, h: 844 },
];

const V2_HERO_VPS = [
  { name: "2413x1043", w: 2413, h: 1043 },
  { name: "1920x1080", w: 1920, h: 1080 },
  { name: "1440x900", w: 1440, h: 900 },
  { name: "1366x768", w: 1366, h: 768 },
  { name: "1251x611", w: 1251, h: 611 },
  { name: "1024x1366", w: 1024, h: 1366 },
  { name: "768x1024", w: 768, h: 1024 },
  { name: "390x844", w: 390, h: 844 },
  { name: "320x568", w: 320, h: 568 },
];

async function settle(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(4200);
}

async function main() {
  const dirs = {
    currentAfter: path.join(OUT, "current-after"),
    hero: path.join(OUT, "v2-hero"),
    systems: path.join(OUT, "v2-systems"),
  };
  for (const dir of Object.values(dirs)) fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const report = { base: BASE, consoleErrors: [], checks: {} };

  for (const vp of CURRENT_VPS) {
    const page = await browser.newPage({
      viewport: { width: vp.w, height: vp.h },
      isMobile: vp.w < 500,
      hasTouch: vp.w < 500,
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") report.consoleErrors.push(`[current ${vp.name}] ${msg.text()}`);
    });
    await settle(page, `${BASE}/?motionOverride=full`);
    const check = await page.evaluate(() => ({
      variant: document.querySelector("[data-portfolio-variant]")?.getAttribute("data-portfolio-variant"),
      education: !!document.querySelector('[data-slot="education"]'),
      products: !!document.querySelector('[data-slot="products"]'),
      selectedSystems: !!document.querySelector("#selected-systems"),
      credential: !!document.querySelector("[data-education-credential]"),
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    }));
    report.checks[`current-${vp.name}`] = check;
    await page.screenshot({ path: path.join(dirs.currentAfter, `${vp.name}.png`), fullPage: false });
    await page.close();
    console.log("current", vp.name, check);
  }

  for (const vp of V2_HERO_VPS) {
    const page = await browser.newPage({
      viewport: { width: vp.w, height: vp.h },
      isMobile: vp.w < 500,
      hasTouch: vp.w < 500,
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") report.consoleErrors.push(`[v2-hero ${vp.name}] ${msg.text()}`);
    });
    await settle(page, `${BASE}/v2?motionOverride=full`);
    const check = await page.evaluate(() => ({
      composition: document.querySelector("[data-hero-composition]")?.getAttribute("data-hero-composition"),
      education: !!document.querySelector('[data-slot="education"]'),
      products: !!document.querySelector('[data-slot="products"]'),
      credential: !!document.querySelector("[data-education-credential]"),
      explore: !!document.querySelector("[data-explore-selected-systems]"),
      selectedSystems: !!document.querySelector("#selected-systems"),
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    }));
    report.checks[`v2-hero-${vp.name}`] = check;
    await page.screenshot({ path: path.join(dirs.hero, `${vp.name}.png`), fullPage: false });
    await page.close();
    console.log("v2-hero", vp.name, check);
  }

  // Selected Systems chapter captures
  const systemsVps = [
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
      if (msg.type() === "error") report.consoleErrors.push(`[systems ${vp.name}] ${msg.text()}`);
    });
    await settle(page, `${BASE}/v2#selected-systems`);
    await page.waitForTimeout(800);
    const check = await page.evaluate(() => {
      const section = document.querySelector("#selected-systems");
      section?.scrollIntoView({ block: "start" });
      const text = section?.textContent ?? "";
      return {
        present: !!section,
        flagship: text.includes("Merchant Operations Platform"),
        nabd: text.includes("NABD"),
        vending: text.includes("Smart Vending"),
        clinic: text.includes("Virtual Clinic"),
        wasfaty: /wasfaty/i.test(text),
        theqah: /theqah/i.test(text),
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    });
    report.checks[`systems-${vp.name}`] = check;
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(dirs.systems, `${vp.name}.png`),
      fullPage: false,
    });
    await page.close();
    console.log("systems", vp.name, check);
  }

  // reduced motion hero
  const rm = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await rm.emulateMedia({ reducedMotion: "reduce" });
  await settle(rm, `${BASE}/v2`);
  await rm.screenshot({ path: path.join(dirs.hero, "1440x900-reduced-motion.png") });
  await rm.close();

  fs.writeFileSync(path.join(OUT, "s2a-diagnostics.json"), JSON.stringify(report, null, 2));
  console.log("consoleErrors", report.consoleErrors.length);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
