import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QA = path.join(ROOT, "docs", "portfolio-v3", "qa", "recovery");
const SHOT_DIR = process.env.SHOT_DIR ?? "after";
const OUT = path.join(QA, SHOT_DIR);
const COMPARE = process.env.COMPARE === "1";
const BASE = process.env.REPAIR_BASE_URL ?? "http://localhost:3000";
const PAGE = `${BASE}/?motionOverride=full`;

const FULL = [
  { name: "1251x611", w: 1251, h: 611 },
  { name: "1280x600", w: 1280, h: 600 },
  { name: "1280x650", w: 1280, h: 650 },
  { name: "1280x720", w: 1280, h: 720 },
  { name: "1366x625", w: 1366, h: 625 },
  { name: "1366x700", w: 1366, h: 700 },
  { name: "1366x768", w: 1366, h: 768 },
  { name: "1440x780", w: 1440, h: 780 },
  { name: "1440x900", w: 1440, h: 900 },
  { name: "1536x864", w: 1536, h: 864 },
  { name: "1600x900", w: 1600, h: 900 },
  { name: "1920x1080", w: 1920, h: 1080 },
  { name: "2413x1043", w: 2413, h: 1043 },
  { name: "2560x1080", w: 2560, h: 1080 },
  { name: "2560x1440", w: 2560, h: 1440 },
  { name: "1024x768", w: 1024, h: 768 },
  { name: "1024x600", w: 1024, h: 600 },
  { name: "768x1024", w: 768, h: 1024 },
  { name: "430x932", w: 430, h: 932 },
  { name: "390x844", w: 390, h: 844 },
  { name: "360x800", w: 360, h: 800 },
  { name: "320x568", w: 320, h: 568 },
];

const COMPARE_VPS = [
  { name: "1251x611", w: 1251, h: 611 },
  { name: "1366x768", w: 1366, h: 768 },
  { name: "1440x900", w: 1440, h: 900 },
  { name: "2413x1043", w: 2413, h: 1043 },
  { name: "390x844", w: 390, h: 844 },
];

const VIEWPORTS = COMPARE ? COMPARE_VPS : FULL;

function diagnostics() {
  const TOL = 2;
  const composition = document.querySelector("#proof-stage [class*=composition]");
  const stage = document.querySelector("#proof-stage");
  const artifacts = [...document.querySelectorAll("[data-artifact]")].filter((el) =>
    ["upwork", "commerce", "education"].includes(el.getAttribute("data-artifact")),
  );

  function surfaceOf(el) {
    return el.querySelector("[class*=panelShell]") ?? el;
  }

  function maxDescendantBottom(surface) {
    let maxBottom = -Infinity;
    let escapes = 0;
    const sRect = surface.getBoundingClientRect();
    surface.querySelectorAll("*").forEach((node) => {
      const cs = getComputedStyle(node);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0)
        return;
      const r = node.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.bottom > maxBottom) maxBottom = r.bottom;
      if (
        r.right > sRect.right + TOL ||
        r.left < sRect.left - TOL ||
        r.bottom > sRect.bottom + TOL ||
        r.top < sRect.top - TOL
      ) {
        escapes += 1;
      }
    });
    return { maxBottom, escapes, sRect };
  }

  const cards = artifacts.map((el) => {
    const surface = surfaceOf(el);
    const { maxBottom, escapes, sRect } = maxDescendantBottom(surface);
    const outer = el.getBoundingClientRect();
    return {
      artifact: el.getAttribute("data-artifact"),
      clientH: Math.round(surface.clientHeight),
      scrollH: Math.round(surface.scrollHeight),
      clientW: Math.round(surface.clientWidth),
      scrollW: Math.round(surface.scrollWidth),
      overflowClipped:
        surface.scrollHeight > surface.clientHeight + TOL ||
        surface.scrollWidth > surface.clientWidth + TOL,
      unusedLowerPx: Number.isFinite(maxBottom)
        ? Math.round(sRect.bottom - maxBottom)
        : null,
      unusedLowerPct: Number.isFinite(maxBottom)
        ? Math.round(((sRect.bottom - maxBottom) / Math.max(sRect.height, 1)) * 100)
        : null,
      descendantEscapes: escapes,
      surfaceH: Math.round(sRect.height),
      outerH: Math.round(outer.height),
      outerTransform: getComputedStyle(el).transform,
      clipPath: getComputedStyle(surface).clipPath,
    };
  });

  // Product deck
  const deck = document.querySelector("[data-product-deck]");
  let deckInfo = null;
  if (deck) {
    const active =
      deck.querySelector("[data-active='true']") ??
      deck.querySelector("[data-deck-page]");
    const r = active?.getBoundingClientRect();
    deckInfo = {
      present: true,
      activePage: active?.getAttribute("data-deck-page") ?? null,
      activeW: r ? Math.round(r.width) : 0,
      activeH: r ? Math.round(r.height) : 0,
      nonZero: !!r && r.width > 4 && r.height > 4,
    };
  }

  // Filmstrip
  const film = document.querySelector("[data-film-scroll]");
  const track = document.querySelector("[data-film-track]");

  // proof same-row detection (thin 4-up strip check)
  const proof = [...document.querySelectorAll("[data-slot]")]
    .filter((el) => el.getAttribute("data-slot") !== "identity")
    .map((el) => {
      const r = el.getBoundingClientRect();
      return { id: el.getAttribute("data-slot"), top: Math.round(r.top), h: Math.round(r.height) };
    });
  const tops = proof.map((p) => p.top);
  const fourUpStrip =
    proof.length >= 4 &&
    Math.max(...tops) - Math.min(...tops) < 24 &&
    Math.max(...proof.map((p) => p.h)) < 210;

  return {
    mode: document.documentElement.dataset.layoutMode,
    areas: composition ? getComputedStyle(composition).gridTemplateAreas : null,
    stageW: stage ? Math.round(stage.getBoundingClientRect().width) : null,
    compW: composition ? Math.round(composition.getBoundingClientRect().width) : null,
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    fourUpStrip,
    cards,
    deck: deckInfo,
    film: {
      overflowing: film?.dataset.overflowing ?? null,
      justify: track ? getComputedStyle(track).justifyContent : null,
      trackW: track ? Math.round(track.getBoundingClientRect().width) : null,
      scrollW: film ? film.clientWidth : null,
    },
  };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = { base: BASE, dir: SHOT_DIR, consoleErrors: [], checks: {} };

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      isMobile: vp.w < 500,
      hasTouch: vp.w < 500,
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error")
        report.consoleErrors.push(`[${vp.name}] ${msg.text()}`);
    });
    await page.goto(PAGE, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(4200);
    report.checks[vp.name] = await page.evaluate(diagnostics);
    await page.screenshot({ path: path.join(OUT, `${vp.name}.png`), fullPage: false });

    // Filmstrip evidence on a desktop + mobile case
    if (vp.name === "1440x900" || vp.name === "390x844") {
      try {
        await page.locator("#experience").scrollIntoViewIfNeeded();
        await page.waitForTimeout(900);
        await page.screenshot({
          path: path.join(OUT, `filmstrip-${vp.name}.png`),
          fullPage: false,
        });
      } catch {}
    }
    await ctx.close();
  }

  fs.writeFileSync(path.join(OUT, "diagnostics.json"), JSON.stringify(report, null, 2));
  // Console summary
  for (const [name, c] of Object.entries(report.checks)) {
    const worst = (c.cards ?? []).reduce(
      (m, k) => Math.max(m, k.unusedLowerPct ?? 0),
      0,
    );
    const esc = (c.cards ?? []).reduce((m, k) => m + (k.descendantEscapes ?? 0), 0);
    console.log(
      `${name.padEnd(10)} mode=${(c.mode ?? "?").padEnd(16)} stageW=${String(c.stageW).padEnd(5)} overflowX=${c.overflowX} 4up=${c.fourUpStrip} deckNonZero=${c.deck?.nonZero} worstDeadBottom%=${worst} escapes=${esc}`,
    );
  }
  console.log("consoleErrors:", report.consoleErrors.length);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
