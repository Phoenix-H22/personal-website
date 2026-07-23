import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await context.addInitScript(() => {
  localStorage.setItem("portfolio-motion-preference-v3", "reduced");
});
const page = await context.newPage();
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
page.on("console", (m) => {
  if (m.type() === "error") console.log("ERR", m.text());
});
await page.goto("http://localhost:3000/concept-v3-rebuild", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1000);
console.log(
  await page.evaluate(() => ({
    pref: document.documentElement.dataset.motionPreference,
    effective: document.documentElement.dataset.effectiveMotion,
    deck: !!document.querySelector("[data-product-deck]"),
    next: !!document.querySelector('[aria-label="Show next project"]'),
    body: document.body.innerText.slice(0, 400),
  })),
);
await browser.close();
