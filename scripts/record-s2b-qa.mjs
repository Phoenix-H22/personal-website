import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "docs", "portfolio-v3", "qa", "s2b", "recordings");
const BASE = process.env.PORTFOLIO_BASE_URL ?? "http://localhost:3010";

async function settle(page, url, ms = 800) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(ms);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  // Hero entrance
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();
    await settle(page, `${BASE}/v2?motionOverride=full`, 200);
    await page.waitForTimeout(5200);
    await context.close();
    const vids = fs.readdirSync(OUT).filter((f) => f.endsWith(".webm"));
    const latest = vids.sort(
      (a, b) =>
        fs.statSync(path.join(OUT, b)).mtimeMs -
        fs.statSync(path.join(OUT, a)).mtimeMs,
    )[0];
    if (latest)
      fs.renameSync(
        path.join(OUT, latest),
        path.join(OUT, "01-v2-hero-entrance-1440x900.webm"),
      );
    console.log("hero entrance done");
  }

  // Credential ambient (crop-ish by focusing identity)
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();
    await settle(page, `${BASE}/v2?motionOverride=full`, 4500);
    await page.waitForTimeout(6500);
    await context.close();
    const vids = fs
      .readdirSync(OUT)
      .filter((f) => f.endsWith(".webm") && !f.startsWith("01-"));
    const latest = vids.sort(
      (a, b) =>
        fs.statSync(path.join(OUT, b)).mtimeMs -
        fs.statSync(path.join(OUT, a)).mtimeMs,
    )[0];
    if (latest)
      fs.renameSync(
        path.join(OUT, latest),
        path.join(OUT, "02-education-credential-float.webm"),
      );
  }

  // Explore signal navigation
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();
    await settle(page, `${BASE}/v2?motionOverride=full`, 4500);
    await page.locator("[data-explore-selected-systems]").click();
    await page.waitForTimeout(2200);
    await context.close();
    renameLatest(OUT, "03-explore-signal-anchor.webm", [
      "01-",
      "02-",
      "03-",
    ]);
  }

  // Featured Systems entrance + filter
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();
    await settle(page, `${BASE}/v2?motionOverride=full`, 2000);
    await page.evaluate(() => {
      document
        .querySelector("#selected-systems")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    await page.waitForTimeout(2800);
    await page.getByRole("button", { name: /Messaging/i }).click();
    await page.waitForTimeout(1200);
    await page.getByRole("button", { name: /All Systems/i }).click();
    await page.waitForTimeout(1200);
    await context.close();
    renameLatest(OUT, "04-featured-systems-entrance-filter.webm", [
      "01-",
      "02-",
      "03-",
      "04-",
    ]);
  }

  // Cover motion hold
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();
    await settle(page, `${BASE}/v2#selected-systems`, 1500);
    await page.evaluate(() => {
      document
        .querySelector("#selected-systems")
        ?.scrollIntoView({ block: "start" });
    });
    await page.waitForTimeout(7000);
    await context.close();
    renameLatest(OUT, "05-cover-ambient-motion.webm", [
      "01-",
      "02-",
      "03-",
      "04-",
      "05-",
    ]);
  }

  // Mobile scroll through Featured Systems
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      recordVideo: { dir: OUT, size: { width: 390, height: 844 } },
    });
    const page = await context.newPage();
    await settle(page, `${BASE}/v2#selected-systems`, 2000);
    await page.evaluate(async () => {
      const section = document.querySelector("#selected-systems");
      section?.scrollIntoView({ block: "start" });
      const end = (section?.getBoundingClientRect().height ?? 2000) + window.scrollY;
      for (let y = window.scrollY; y < end; y += 90) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    await page.waitForTimeout(800);
    await context.close();
    renameLatest(OUT, "06-mobile-featured-scroll.webm", [
      "01-",
      "02-",
      "03-",
      "04-",
      "05-",
      "06-",
    ]);
  }

  // Reduced motion
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
      recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();
    await settle(page, `${BASE}/v2`, 1200);
    await page.evaluate(() => {
      document
        .querySelector("#selected-systems")
        ?.scrollIntoView({ block: "start" });
    });
    await page.waitForTimeout(1800);
    await context.close();
    renameLatest(OUT, "07-reduced-motion.webm", [
      "01-",
      "02-",
      "03-",
      "04-",
      "05-",
      "06-",
      "07-",
    ]);
  }

  // Current ↔ V2 switch (requires version switch enabled)
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();
    await settle(page, `${BASE}/?motionOverride=full`, 2500);
    const switcher = page.locator("[data-portfolio-version-switch] a, a[href='/v2']").first();
    if (await switcher.count()) {
      await switcher.click();
      await page.waitForTimeout(3000);
      const back = page.locator("a[href='/']").first();
      if (await back.count()) {
        await back.click();
        await page.waitForTimeout(2200);
      }
    } else {
      await page.goto(`${BASE}/v2`);
      await page.waitForTimeout(2500);
      await page.goto(`${BASE}/`);
      await page.waitForTimeout(2000);
    }
    await context.close();
    renameLatest(OUT, "08-current-v2-route-switch.webm", [
      "01-",
      "02-",
      "03-",
      "04-",
      "05-",
      "06-",
      "07-",
      "08-",
    ]);
  }

  await browser.close();
  console.log("recordings written to", OUT);
}

function renameLatest(dir, destName, reservedPrefixes) {
  const vids = fs
    .readdirSync(dir)
    .filter(
      (f) =>
        f.endsWith(".webm") &&
        !reservedPrefixes.some((p) => f.startsWith(p)),
    );
  const latest = vids.sort(
    (a, b) =>
      fs.statSync(path.join(dir, b)).mtimeMs -
      fs.statSync(path.join(dir, a)).mtimeMs,
  )[0];
  if (latest) {
    fs.renameSync(path.join(dir, latest), path.join(dir, destName));
    console.log("saved", destName);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
