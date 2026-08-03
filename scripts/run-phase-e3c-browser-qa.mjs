import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

import { chromium } from "playwright";

const BASE_URL = "http://127.0.0.1:3010/v2";
const DEBUG_URL = `${BASE_URL}?motion-debug=1`;
const OUTPUT_DIR = path.resolve("docs/portfolio-v3/qa/phase-d");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "phase-e3c-browser-results.json");
const SOAK_DURATION = 60_000;
const SAMPLE_INTERVAL = 100;

const browserTargets = [
  {
    name: "Google Chrome",
    slug: "chrome",
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    port: 9431,
  },
  {
    name: "Microsoft Edge",
    slug: "edge",
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    port: 9432,
  },
  {
    name: "Brave",
    slug: "brave",
    executablePath: "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
    port: 9433,
  },
];

function assertCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForDebugPort(port) {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {
      // Browser process has not opened its debugging socket yet.
    }
    await wait(200);
  }
  throw new Error(`Browser debugging port ${port} did not open`);
}

async function launchBrowser(target) {
  assertCondition(fs.existsSync(target.executablePath), `${target.name} is not installed`);
  const userDataDir = fs.mkdtempSync(
    path.join(os.tmpdir(), `portfolio-phase-e3c-${target.slug}-`),
  );
  const process = spawn(
    target.executablePath,
    [
      `--user-data-dir=${userDataDir}`,
      `--remote-debugging-port=${target.port}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-sync",
      "about:blank",
    ],
    { detached: false, stdio: "ignore" },
  );
  await waitForDebugPort(target.port);
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${target.port}`);
  const context = browser.contexts()[0];
  const page =
    context.pages().find((candidate) => candidate.url().includes("/v2")) ??
    (await context.newPage());
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.bringToFront();
  return { browser, page, process, userDataDir };
}

async function closeBrowser(session) {
  try {
    const cdp = await session.browser.newBrowserCDPSession();
    await cdp.send("Browser.close");
  } catch {
    session.process.kill();
  }
  await wait(500);
  fs.rmSync(session.userDataDir, { force: true, recursive: true });
}

async function readToolchain(page) {
  return page.evaluate(() => {
    const root = document.querySelector("[data-living-toolchain]");
    const diagnostics = window.__portfolioLivingToolchainDebug?.() ?? null;
    return {
      diagnostics,
      initialization: root?.getAttribute("data-initialization") ?? null,
      paused: root?.getAttribute("data-paused") ?? null,
      phase: root?.getAttribute("data-phase") ?? null,
      phraseIndex: Number(root?.getAttribute("data-phrase-index") ?? -1),
      text: root?.children[1]?.textContent ?? "",
      visibility: document.visibilityState,
    };
  });
}

async function openDebugPage(page) {
  await page.goto(DEBUG_URL, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__portfolioLivingToolchainDebug !== undefined);
  const nativeMotion = await page.evaluate(() => ({
    noPreference: matchMedia("(prefers-reduced-motion: no-preference)").matches,
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
  }));
  assertCondition(!nativeMotion.reduced, "Native browser preference requests reduced motion");
  return nativeMotion;
}

async function waitForFrameChange(page, baseline, timeout = 5_000) {
  await page.waitForFunction(
    ({ phase, phraseIndex, text }) => {
      const root = document.querySelector("[data-living-toolchain]");
      return (
        root?.getAttribute("data-phase") !== phase ||
        Number(root?.getAttribute("data-phrase-index")) !== phraseIndex ||
        root?.children[1]?.textContent !== text
      );
    },
    baseline,
    { timeout },
  );
  return readToolchain(page);
}

async function collectCompletedPhrases(page, count, timeout = 15_000) {
  const completed = [];
  let previousToken = null;
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline && completed.length < count) {
    const state = await readToolchain(page);
    const token = `${state.phraseIndex}:${state.text}`;
    if (state.phase === "HOLD" && token !== previousToken) {
      completed.push(state.text);
      previousToken = token;
    }
    await wait(50);
  }
  assertCondition(completed.length >= count, `Observed only ${completed.length}/${count} phrases`);
  return completed;
}

async function testVisibleBlurSurvival(page) {
  await openDebugPage(page);
  await collectCompletedPhrases(page, 2);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  const afterBlur = await collectCompletedPhrases(page, 3, 18_000);
  const state = await readToolchain(page);
  assertCondition(state.visibility === "visible", "Blur simulation hid the document");
  assertCondition(state.diagnostics?.timerActive, "Scheduler stopped after visible blur");
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await waitForFrameChange(page, state);
  return { afterBlur, state };
}

async function testHiddenResume(page) {
  await openDebugPage(page);
  const before = await readToolchain(page);
  await page.evaluate(() => {
    window.__phaseE3cVisibility = "hidden";
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => window.__phaseE3cVisibility,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await wait(2_200);
  const hidden = await readToolchain(page);
  assertCondition(
    hidden.phase === before.phase &&
      hidden.phraseIndex === before.phraseIndex &&
      hidden.text === before.text,
    "Hidden document advanced",
  );
  assertCondition(!hidden.diagnostics?.timerActive, "Hidden document retained scheduler timer");
  await page.evaluate(() => {
    window.__phaseE3cVisibility = "visible";
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const resumed = await waitForFrameChange(page, hidden);
  await page.evaluate(() => {
    delete document.visibilityState;
    delete window.__phaseE3cVisibility;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  assertCondition(
    resumed.diagnostics?.activeSchedulerInstances === 1,
    "Visibility resume duplicated scheduler",
  );
  return { before, hidden, resumed };
}

async function testLongDelayRecovery(page) {
  await openDebugPage(page);
  const before = await readToolchain(page);
  await page.evaluate(() => {
    const deadline = performance.now() + 10_000;
    while (performance.now() < deadline) {
      // Deliberately block event loop to reproduce a late scheduler callback.
    }
  });
  const samples = [];
  const sampleDeadline = Date.now() + 1_500;
  while (Date.now() < sampleDeadline) {
    samples.push(await readToolchain(page));
    await wait(50);
  }
  const after = samples.at(-1);
  assertCondition(
    samples.some((sample) =>
      sample.phase !== before.phase ||
      sample.phraseIndex !== before.phraseIndex ||
      sample.text !== before.text,
    ),
    "Scheduler did not recover from 10-second delay",
  );
  assertCondition(
    new Set(samples.map((sample) => sample.phraseIndex)).size <= 2,
    "Late callback burst through multiple phrases",
  );
  assertCondition(after?.initialization !== "fallback", "Delay triggered permanent fallback");
  assertCondition(after?.diagnostics?.timerActive, "Delay recovery left no active timer");
  return { after, before, sampledFrames: samples.length };
}

async function testLensStress(page) {
  await openDebugPage(page);
  await page.evaluate(() => {
    const controls = [...document.querySelectorAll("[data-lens-context]")];
    for (let index = 0; index < 20; index += 1) controls[index % controls.length].click();
  });
  await page.waitForFunction(
    () => window.__portfolioLivingToolchainDebug?.().lensPauseActive === true,
  );
  const paused = await readToolchain(page);
  assertCondition(!paused.diagnostics?.timerActive, "Lens pause retained scheduler timer");
  assertCondition(
    paused.diagnostics?.lensResumeTimerActive,
    "Lens pause has no bounded resume timer",
  );
  await page.waitForFunction(
    () => window.__portfolioLivingToolchainDebug?.().lensPauseActive === false,
    undefined,
    { timeout: 5_000 },
  );
  const completedAfterPause = await collectCompletedPhrases(page, 3, 18_000);
  const resumed = await readToolchain(page);
  assertCondition(resumed.diagnostics?.timerActive, "Lens deadline expired without resume");
  assertCondition(
    resumed.diagnostics?.activeSchedulerInstances === 1,
    "Lens stress duplicated scheduler",
  );
  return { completedAfterPause, paused, resumed };
}

async function testNavigationRemount(page) {
  await openDebugPage(page);
  const before = await readToolchain(page);
  for (let cycle = 0; cycle < 2; cycle += 1) {
    await page.goto(`${BASE_URL}/work`, { waitUntil: "networkidle" });
    await page.goBack({ waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__portfolioLivingToolchainDebug !== undefined);
  }
  const remounted = await readToolchain(page);
  const counts = await page.evaluate(() => ({
    carets: document.querySelectorAll("[data-living-toolchain] i").length,
    controllers: document.querySelectorAll("[data-living-toolchain]").length,
  }));
  assertCondition(counts.controllers === 1 && counts.carets === 1, "Remount duplicated controller");
  assertCondition(
    remounted.diagnostics?.activeSchedulerInstances === 1,
    "Remount left multiple active schedulers",
  );
  await waitForFrameChange(page, remounted);
  return { before, counts, remounted };
}

async function runFocusedLifecycleTests(page) {
  return {
    visibleBlurSurvival: await testVisibleBlurSurvival(page),
    hiddenResume: await testHiddenResume(page),
    longDelayRecovery: await testLongDelayRecovery(page),
    lensStress: await testLensStress(page),
    navigationRemount: await testNavigationRemount(page),
  };
}

async function captureProof(page, target, label) {
  if (!["edge", "brave"].includes(target.slug)) return;
  await page.screenshot({
    path: path.join(OUTPUT_DIR, `phase-e3c-${target.slug}-${label}.png`),
  });
}

async function runSoak(page, target) {
  const consoleErrors = [];
  const failedRequests = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    failedRequests.push({
      error: request.failure()?.errorText ?? "unknown",
      method: request.method(),
      url: request.url(),
    });
  });
  const nativeMotion = await openDebugPage(page);
  const completedPhrases = new Set();
  const phases = new Set();
  const captures = new Set();
  let blurDispatched = false;
  let lensStressFinished = false;
  let lastSignature = null;
  let signatureChangedAt = performance.now();
  let longestUnexpectedVisibleStall = 0;
  let maximumActiveSchedulers = 0;
  let lensEvidence = null;
  const startedAt = performance.now();

  while (performance.now() - startedAt < SOAK_DURATION) {
    const elapsed = performance.now() - startedAt;
    if (!blurDispatched && elapsed >= 10_000) {
      await page.evaluate(() => window.dispatchEvent(new Event("blur")));
      blurDispatched = true;
    }
    if (elapsed >= 12_000 && elapsed < 12_000 + SAMPLE_INTERVAL) {
      await page.evaluate(() => window.dispatchEvent(new Event("focus")));
    }
    if (!lensStressFinished && elapsed >= 20_000) {
      await page.evaluate(() => {
        const controls = [...document.querySelectorAll("[data-lens-context]")];
        for (let index = 0; index < 20; index += 1) {
          controls[index % controls.length].click();
        }
      });
      await wait(250);
      lensEvidence = await page.evaluate(() => {
        const route = document.querySelector("[data-lens-route=nabd]");
        return {
          active: document
            .querySelector("[data-adaptive-stack-lens]")
            ?.getAttribute("data-active-mode"),
          routeOffset: route ? getComputedStyle(route).strokeDashoffset : null,
          title: document.querySelector("[data-adaptive-system-core] h2")?.textContent,
        };
      });
      await captureProof(page, target, "lens-route-core");
      lensStressFinished = true;
    }

    const state = await readToolchain(page);
    phases.add(state.phase);
    if (state.phase === "HOLD") completedPhrases.add(state.text);
    maximumActiveSchedulers = Math.max(
      maximumActiveSchedulers,
      state.diagnostics?.activeSchedulerInstances ?? 0,
    );
    const signature = `${state.phase}:${state.phraseIndex}:${state.text}`;
    const intentionallyPaused =
      state.visibility === "hidden" || state.diagnostics?.lensPauseActive;
    if (intentionallyPaused || signature !== lastSignature) {
      lastSignature = signature;
      signatureChangedAt = performance.now();
    } else {
      longestUnexpectedVisibleStall = Math.max(
        longestUnexpectedVisibleStall,
        performance.now() - signatureChangedAt,
      );
    }

    if (!captures.has("laravel") && state.phase === "HOLD" && state.text === "Laravel + PHP") {
      captures.add("laravel");
      await captureProof(page, target, "laravel");
    }
    if (!captures.has("erase") && state.phase === "ERASE" && state.text.length > 2) {
      captures.add("erase");
      await captureProof(page, target, "erase");
    }
    if (!captures.has("node") && state.phase === "HOLD" && state.text === "Node.js + TypeScript") {
      captures.add("node");
      await captureProof(page, target, "node");
    }
    if (!captures.has("python") && state.phase === "HOLD" && state.text === "Python + Automation") {
      captures.add("python");
      await captureProof(page, target, "python");
    }
    if (!captures.has("after-blur") && blurDispatched && state.phase === "HOLD") {
      captures.add("after-blur");
      await captureProof(page, target, "after-visible-blur");
    }
    if (
      !captures.has("after-lens") &&
      lensStressFinished &&
      !state.diagnostics?.lensPauseActive &&
      state.phase === "HOLD"
    ) {
      captures.add("after-lens");
      await captureProof(page, target, "after-lens-stress");
    }
    if (!captures.has("later") && elapsed >= 30_000 && state.phase === "HOLD") {
      captures.add("later");
      await captureProof(page, target, "after-30-seconds");
    }
    await wait(SAMPLE_INTERVAL);
  }

  const finalState = await readToolchain(page);
  const domCounts = await page.evaluate(() => ({
    carets: document.querySelectorAll("[data-living-toolchain] i").length,
    controllers: document.querySelectorAll("[data-living-toolchain]").length,
  }));
  assertCondition(completedPhrases.size >= 5, `${target.name} completed fewer than five phrases`);
  assertCondition(
    ["HOLD", "ERASE", "SWITCH", "TYPE"].every((phase) => phases.has(phase)),
    `${target.name} missed a scheduler phase`,
  );
  assertCondition(
    longestUnexpectedVisibleStall <= 6_000,
    `${target.name} stalled for ${longestUnexpectedVisibleStall}ms`,
  );
  assertCondition(consoleErrors.length === 0, `${target.name} emitted console errors`);
  assertCondition(
    failedRequests.length === 0,
    `${target.name} failed requests: ${JSON.stringify(failedRequests)}`,
  );
  assertCondition(maximumActiveSchedulers === 1, `${target.name} duplicated scheduler`);
  assertCondition(domCounts.controllers === 1 && domCounts.carets === 1, `${target.name} duplicated DOM`);
  assertCondition(!finalState.diagnostics?.lensPauseActive, `${target.name} retained lens pause`);
  assertCondition(finalState.diagnostics?.timerActive, `${target.name} ended without timer`);
  return {
    browser: target.name,
    captures: [...captures],
    completedPhraseCount: completedPhrases.size,
    completedPhrases: [...completedPhrases],
    consoleErrors,
    domCounts,
    failedRequests,
    finalState,
    lensEvidence,
    longestUnexpectedVisibleStall,
    maximumActiveSchedulers,
    nativeMotion,
    observedPhases: [...phases],
  };
}

assertCondition(fs.existsSync(OUTPUT_DIR), `Output directory is missing: ${OUTPUT_DIR}`);
const report = { focused: null, generatedAt: new Date().toISOString(), soaks: [] };

for (const target of browserTargets) {
  const session = await launchBrowser(target);
  try {
    if (target.slug === "chrome") {
      report.focused = await runFocusedLifecycleTests(session.page);
    }
    report.soaks.push(await runSoak(session.page, target));
  } finally {
    await closeBrowser(session);
  }
}

fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
