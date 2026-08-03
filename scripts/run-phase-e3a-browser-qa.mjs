import fs from "node:fs";
import path from "node:path";

import { chromium, firefox, webkit } from "playwright";

const BASE_URL = "http://127.0.0.1:3010/v2";
const PAUSE_EVENT = "portfolio:pause-living-toolchain";
const OUTPUT_PATH = path.resolve(
  "docs/portfolio-v3/qa/phase-d/phase-e3a-browser-results.json",
);

const browserTargets = [
  {
    name: "Google Chrome",
    slug: "chrome",
    type: chromium,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  },
  {
    name: "Microsoft Edge",
    slug: "edge",
    type: chromium,
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  },
  {
    name: "Brave",
    slug: "brave",
    type: chromium,
    executablePath: "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
  },
  { name: "Playwright Chromium", slug: "chromium", type: chromium },
  { name: "Firefox", slug: "firefox", type: firefox },
  { name: "WebKit", slug: "webkit", type: webkit },
];

function readToolchain(page) {
  return page.locator("[data-living-toolchain]").evaluate((element) => ({
    text: element.querySelector('[aria-hidden="true"]')?.textContent ?? "",
    phase: element.getAttribute("data-phase"),
    phraseIndex: Number(element.getAttribute("data-phrase-index")),
    paused: element.getAttribute("data-paused"),
    initialization: element.getAttribute("data-initialization"),
  }));
}

async function recordThreePhrases(page) {
  const phases = new Set();
  const completedPhrases = new Set();
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    const state = await readToolchain(page);
    phases.add(state.phase);
    if (state.phase === "HOLD") completedPhrases.add(state.text);
    if (state.phraseIndex === 2 && state.phase === "HOLD") {
      return { phases: [...phases], completedPhrases: [...completedPhrases], state };
    }
    await page.waitForTimeout(35);
  }
  throw new Error("Toolchain did not reach third phrase");
}

async function testReducedMotion(browser) {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  const before = await readToolchain(page);
  await page.waitForTimeout(2200);
  const after = await readToolchain(page);
  await page.locator('[data-lens-context="nabd"]').click();
  const route = await page.locator('[data-lens-route="nabd"]').evaluate((element) => ({
    offset: getComputedStyle(element).strokeDashoffset,
    duration: getComputedStyle(element).transitionDuration,
  }));
  await context.close();
  return { before, after, route };
}

async function testJavaScriptFallback(browser) {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  const fallback = await page.evaluate(() => ({
    identity: document.body.innerText.includes("SOFTWARE ENGINEER"),
    phrase: document.querySelector('[data-living-toolchain] [aria-hidden="true"]')
      ?.textContent,
    lensTitle: document.querySelector("[data-adaptive-system-core] h2")?.textContent,
    contexts: document.querySelectorAll("[data-lens-context]").length,
    overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
  }));
  await context.close();
  return fallback;
}

async function testBrowser(target) {
  if (target.executablePath && !fs.existsSync(target.executablePath)) {
    return { name: target.name, available: false, reason: "Executable not found" };
  }
  const browser = await target.type.launch({
    headless: true,
    executablePath: target.executablePath,
    args: target.type === chromium ? ["--no-sandbox"] : [],
  });
  const context = await browser.newContext({ reducedMotion: "no-preference" });
  const page = await context.newPage();
  const consoleProblems = [];
  const failedRequests = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleProblems.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("requestfailed", (request) => {
    failedRequests.push(`${request.method()} ${request.url()}`);
  });

  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  const initial = await readToolchain(page);
  const progression = await recordThreePhrases(page);
  await page.evaluate(
    (eventName) => window.dispatchEvent(new Event(eventName)),
    PAUSE_EVENT,
  );
  await page.waitForFunction(
    () => document.querySelector("[data-living-toolchain]")?.getAttribute("data-paused") === "true",
  );
  await page.screenshot({
    path: path.resolve(`phase-e3a-browser-${target.slug}.png`),
    fullPage: false,
  });
  await page.waitForTimeout(2050);
  const afterLensPause = await readToolchain(page);

  const backgroundPage = await context.newPage();
  await backgroundPage.goto("about:blank");
  await backgroundPage.bringToFront();
  await page.waitForTimeout(200);
  const backgroundStart = await readToolchain(page);
  await page.waitForTimeout(1100);
  const backgroundEnd = await readToolchain(page);
  await page.bringToFront();
  await page.waitForTimeout(1900);
  const foreground = await readToolchain(page);
  await backgroundPage.close();

  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  const blurStart = await readToolchain(page);
  await page.waitForTimeout(900);
  const blurEnd = await readToolchain(page);
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await page.waitForTimeout(1900);
  const focusReturn = await readToolchain(page);

  await page.reload({ waitUntil: "networkidle" });
  const hardReloadInitial = await readToolchain(page);
  await page.waitForTimeout(2300);
  const hardReloadAdvanced = await readToolchain(page);

  await page.locator('[data-adaptive-engineer-hero] a[href="#work"]').click();
  await page.goBack();
  const backState = await readToolchain(page);
  await page.goForward();
  await page.waitForTimeout(1900);
  const forwardState = await readToolchain(page);

  for (const slug of [
    "warqah-store",
    "smart-lockers-platform",
    "your-obour-guide",
    "nabd",
    "warqah-store",
  ]) {
    await page.locator(`[data-lens-context="${slug}"]`).click();
  }
  const rapidLens = await page.evaluate(() => ({
    active: document.querySelector("[data-adaptive-stack-lens]")?.getAttribute("data-active-mode"),
    title: document.querySelector("[data-adaptive-system-core] h2")?.textContent,
  }));

  const reducedMotion = await testReducedMotion(browser);
  const javaScriptFallback = target.slug === "brave"
    ? await testJavaScriptFallback(browser)
    : null;
  const result = {
    name: target.name,
    available: true,
    version: await browser.version(),
    initial,
    progression,
    afterLensPause,
    background: { start: backgroundStart, end: backgroundEnd, foreground },
    focus: { blurStart, blurEnd, focusReturn },
    hardReload: { initial: hardReloadInitial, advanced: hardReloadAdvanced },
    history: { back: backState, forward: forwardState },
    rapidLens,
    reducedMotion,
    javaScriptFallback,
    consoleProblems,
    failedRequests,
  };
  await context.close();
  await browser.close();
  return result;
}

const results = [];
for (const target of browserTargets) {
  try {
    results.push(await testBrowser(target));
  } catch (error) {
    results.push({
      name: target.name,
      available: true,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

fs.writeFileSync(
  OUTPUT_PATH,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`,
);
console.log(JSON.stringify(results, null, 2));
