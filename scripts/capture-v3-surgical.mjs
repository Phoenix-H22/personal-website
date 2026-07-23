import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const OUT = path.resolve("docs/portfolio-v3/qa/surgical");
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE ?? "http://localhost:3000";
const PAGE = `${BASE}/concept-v3-rebuild?motionOverride=full`;

async function settle(page) {
  await page.goto(PAGE, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(4200);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const report = { checks: {}, consoleErrors: [] };

  // ——— 1. Hero tablet grid ———
  for (const vp of [
    { name: "1024x1366", w: 1024, h: 1366 },
    { name: "1024x1365", w: 1024, h: 1365 },
    { name: "900x1200", w: 900, h: 1200 },
    { name: "834x1194", w: 834, h: 1194 },
    { name: "820x1180", w: 820, h: 1180 },
    { name: "768x1024", w: 768, h: 1024 },
    { name: "1024x768", w: 1024, h: 768 },
  ]) {
    const page = await browser.newPage({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 1,
    });
    page.on("console", (m) => {
      if (m.type() === "error")
        report.consoleErrors.push(`[${vp.name}] ${m.text()}`);
    });
    await settle(page);
    const check = await page.evaluate(() => {
      const slots = [...document.querySelectorAll("[data-slot]")].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          id: el.getAttribute("data-slot"),
          top: Math.round(r.top),
          left: Math.round(r.left),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      });
      const edu = slots.find((s) => s.id === "education");
      const prod = slots.find((s) => s.id === "products");
      const sideBySide =
        !!edu &&
        !!prod &&
        Math.abs(edu.top - prod.top) < 40 &&
        Math.abs(edu.left - prod.left) > 80;
      const areas = getComputedStyle(
        document.querySelector("#proof-stage [class*=composition]"),
      ).gridTemplateAreas;
      return {
        areas,
        sideBySide,
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
        edu,
        prod,
      };
    });
    report.checks[`hero-${vp.name}`] = check;
    if (vp.name === "1024x1366" || vp.name === "768x1024") {
      await page.screenshot({
        path: path.join(OUT, `hero-${vp.name}.png`),
        fullPage: false,
      });
    }
    await page.close();
  }

  // ——— 2. Education badge collision ———
  for (const vp of [
    { name: "1280x720", w: 1280, h: 720 },
    { name: "1366x768", w: 1366, h: 768 },
    { name: "1440x780", w: 1440, h: 780 },
    { name: "1440x900", w: 1440, h: 900 },
    { name: "1536x864", w: 1536, h: 864 },
    { name: "1600x900", w: 1600, h: 900 },
  ]) {
    const page = await browser.newPage({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 1,
    });
    await settle(page);
    const check = await page.evaluate(() => {
      const seal = document.querySelector("[data-edu-seal]");
      const highlight = document.querySelector(
        '[data-edu-highlight="true"]',
      );
      if (!seal || !highlight) {
        return { seal: !!seal, highlight: !!highlight, overlap: null };
      }
      const a = seal.getBoundingClientRect();
      const b = highlight.getBoundingClientRect();
      const overlap = !(
        a.right <= b.left + 1 ||
        a.left >= b.right - 1 ||
        a.bottom <= b.top + 1 ||
        a.top >= b.bottom - 1
      );
      const surface = document.querySelector(
        '[data-artifact="education"] [class*=panelShell]',
      );
      const s = surface?.getBoundingClientRect();
      const sealInside = s
        ? a.left >= s.left - 1 &&
          a.right <= s.right + 1 &&
          a.top >= s.top - 1 &&
          a.bottom <= s.bottom + 1
        : null;
      const sealCs = getComputedStyle(seal);
      return {
        overlap,
        sealInside,
        sealPosition: sealCs.position,
        seal: {
          t: Math.round(a.top),
          l: Math.round(a.left),
          w: Math.round(a.width),
          h: Math.round(a.height),
        },
        highlight: {
          t: Math.round(b.top),
          l: Math.round(b.left),
          w: Math.round(b.width),
          h: Math.round(b.height),
          text: highlight.textContent?.trim(),
        },
      };
    });
    report.checks[`badge-${vp.name}`] = check;
    if (vp.name === "1366x768" || vp.name === "1440x780") {
      const box = await page.evaluate(() => {
        const el = document.querySelector('[data-artifact="education"]');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: Math.max(0, r.x - 8),
          y: Math.max(0, r.y - 8),
          width: Math.min(window.innerWidth, r.width + 16),
          height: Math.min(window.innerHeight, r.height + 16),
        };
      });
      if (box) {
        await page.screenshot({
          path: path.join(OUT, `education-${vp.name}.png`),
          clip: box,
        });
      }
    }
    await page.close();
  }

  // ——— 3. Career logos ———
  for (const vp of [
    { name: "1440x900", w: 1440, h: 900 },
    { name: "1366x768", w: 1366, h: 768 },
    { name: "1024x1366", w: 1024, h: 1366 },
    { name: "768x1024", w: 768, h: 1024 },
    { name: "390x844", w: 390, h: 844 },
  ]) {
    const page = await browser.newPage({
      viewport: { width: vp.w, height: vp.h },
      isMobile: vp.w < 500,
      hasTouch: vp.w < 500,
      deviceScaleFactor: 1,
    });
    page.on("console", (m) => {
      if (m.type() === "error")
        report.consoleErrors.push(`[logos-${vp.name}] ${m.text()}`);
    });
    await settle(page);
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const logos = await page.evaluate(async () => {
      const ids = [
        "theqah",
        "kayanac-erp",
        "phoenix-techs",
        "upwork-freelance",
      ];
      const out = {};
      for (const id of ids) {
        const node = document.querySelector(`[data-company-node="${id}"]`);
        const img = node?.querySelector("img");
        const fallback = node?.querySelector("[class*=logoFallback]");
        if (img) {
          try {
            await img.decode();
          } catch {
            /* ignore */
          }
        }
        out[id] = {
          present: !!node,
          hasImg: !!img,
          hasFallback: !!fallback,
          src: img?.currentSrc || img?.getAttribute("src") || null,
          naturalW: img?.naturalWidth ?? 0,
          naturalH: img?.naturalHeight ?? 0,
          renderedW: img ? Math.round(img.getBoundingClientRect().width) : 0,
          renderedH: img ? Math.round(img.getBoundingClientRect().height) : 0,
          opacity: img ? getComputedStyle(img).opacity : null,
          loaded: !!(img && img.naturalWidth > 0 && img.naturalHeight > 0),
        };
      }
      return out;
    });
    report.checks[`logos-${vp.name}`] = logos;

    if (vp.name === "1440x900") {
      // Scroll film to show Theqah + Kayanac
      await page.evaluate(() => {
        const scroller = document.querySelector("[data-film-scroll]");
        const theqah = document.querySelector('[data-company-node="theqah"]');
        if (scroller && theqah) {
          scroller.scrollLeft =
            theqah.offsetLeft - scroller.clientWidth / 2 + theqah.offsetWidth / 2;
        }
      });
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(OUT, "filmstrip-theqah-kayanac.png"),
        fullPage: false,
      });
      const indieBox = await page.evaluate(() => {
        const el = document.querySelector("[data-independent-reel]");
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: Math.max(r.height, 48) };
      });
      if (indieBox && indieBox.width > 4) {
        await page.screenshot({
          path: path.join(OUT, "indie-phoenix-upwork.png"),
          clip: indieBox,
        });
      }
    }

    if (vp.name === "390x844") {
      await page.screenshot({
        path: path.join(OUT, "filmstrip-mobile-390x844.png"),
        fullPage: false,
      });
    }

    await page.close();
  }

  fs.writeFileSync(
    path.join(OUT, "surgical-diagnostics.json"),
    JSON.stringify(report, null, 2),
  );

  // Console summary
  for (const [k, v] of Object.entries(report.checks)) {
    if (k.startsWith("hero-")) {
      console.log(
        k,
        "sideBySide=",
        v.sideBySide,
        "overflowX=",
        v.overflowX,
        "areas=",
        String(v.areas).replace(/\s+/g, " ").slice(0, 80),
      );
    } else if (k.startsWith("badge-")) {
      console.log(
        k,
        "overlap=",
        v.overlap,
        "inside=",
        v.sealInside,
        "pos=",
        v.sealPosition,
      );
    } else if (k.startsWith("logos-")) {
      const rows = Object.entries(v)
        .map(
          ([id, info]) =>
            `${id}:${info.loaded ? "OK" : "FAIL"}(${info.naturalW}x${info.naturalH})`,
        )
        .join(" ");
      console.log(k, rows);
    }
  }
  console.log("consoleErrors", report.consoleErrors.length);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
