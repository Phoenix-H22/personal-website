import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "no-preference",
});
const page = await context.newPage();
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE", m.type(), m.text());
});
page.on("pageerror", (e) => console.log("PAGEERROR", e));

await page.goto(
  "http://localhost:3000/?motionDebug=1&motionSlow=1",
  { waitUntil: "networkidle" },
);

const read = () =>
  page.evaluate(() => ({
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    motion: document
      .querySelector("[data-motion]")
      ?.getAttribute("data-motion"),
    progress: document.querySelector('[data-debug="timelineProgress"]')
      ?.textContent,
    score: document.querySelector("[data-score-value]")?.textContent,
    started: document.querySelector('[data-debug="timelineStarted"]')
      ?.textContent,
    slow: document.querySelector('[data-debug="motionSlow"]')?.textContent,
  }));

let elapsed = 0;
console.log("t0", await read());
for (const step of [500, 1000, 1500, 2000, 3000]) {
  await page.waitForTimeout(step);
  elapsed += step;
  console.log(`t${elapsed}`, await read());
}

await browser.close();
