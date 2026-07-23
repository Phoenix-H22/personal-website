import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QA = path.resolve(__dirname, "../docs/portfolio-v3/qa");
const PAGE = "http://localhost:3000/concept-v3-rebuild?motionOverride=full";

const browser = await chromium.launch({ headless: true });
const report = {};

for (const vp of [
  { n: "1440x900", w: 1440, h: 900 },
  { n: "390x844", w: 390, h: 844 },
  { n: "768x1024", w: 768, h: 1024 },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    localStorage.setItem("portfolio-motion-preference-v3", "full");
  });
  await page.goto(PAGE, { waitUntil: "networkidle", timeout: 60000 });
  await page.locator("#experience").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const file = path.join(QA, `concept-v3-timefield-${vp.n}.png`);
  await page.screenshot({ path: file, fullPage: false });
  report[vp.n] = await page.evaluate(() => {
    const chapter = document.querySelector("#experience");
    const strip = document.querySelector("[data-mobile-navigator]");
    const chips = strip
      ? [...strip.querySelectorAll("button")].map((b) => b.textContent.trim())
      : [];
    return {
      heightSvh: chapter
        ? chapter.getBoundingClientRect().height / window.innerHeight
        : null,
      stripVisible: strip
        ? getComputedStyle(strip).display !== "none"
        : false,
      chips,
      overflow:
        document.documentElement.scrollWidth > window.innerWidth + 1,
      active: document
        .querySelector('[data-dossier="incoming"] [data-company]')
        ?.getAttribute("data-company"),
    };
  });
  await ctx.close();
}

console.log(JSON.stringify(report, null, 2));
await browser.close();
