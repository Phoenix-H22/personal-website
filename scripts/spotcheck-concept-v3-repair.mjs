import { chromium } from "playwright";

const cases = [
  { name: "1440x900", w: 1440, h: 900 },
  { name: "1280x720", w: 1280, h: 720 },
  { name: "1251x611", w: 1251, h: 611 },
  { name: "2413x1043", w: 2413, h: 1043 },
];

const browser = await chromium.launch({ headless: true });
const out = {};

for (const vp of cases) {
  const page = await browser.newPage({
    viewport: { width: vp.w, height: vp.h },
  });
  await page.goto(
    "http://localhost:3000/concept-v3-rebuild?motionOverride=full",
    { waitUntil: "networkidle" },
  );
  await page.waitForTimeout(4200);
  out[vp.name] = await page.evaluate(() => {
    const slot = (id) => document.querySelector(`[data-slot="${id}"]`);
    const products = slot("products");
    const activePage = products?.querySelector('[data-active="true"]');
    const title = activePage?.querySelector("[class*=pageTitle]");
    const visual = activePage?.querySelector("[class*=pageVisual]");
    const desc = activePage?.querySelector("[class*=pageDescription]");
    const face = activePage?.querySelector("[class*=pageFace]");
    const stack = products?.querySelector("[class*=stack]");
    const edu = slot("education");
    const eduInst = [...(edu?.querySelectorAll("[class*=milestoneInstitution]") || [])].map(
      (el) => ({
        text: el.textContent,
        h: Math.round(el.getBoundingClientRect().height),
        clipped: el.scrollHeight > el.clientHeight + 1,
      }),
    );
    const commerceLabels = [
      ...(slot("commerce")?.querySelectorAll("[class*=metricLabel]") || []),
    ].map((el) => ({
      text: el.textContent,
      clipped: el.scrollHeight > el.clientHeight + 1,
      h: Math.round(el.getBoundingClientRect().height),
    }));
    const film = document.querySelector("[data-film-scroll]");
    const track = document.querySelector("[data-film-track]");
    const nodes = [...(track?.querySelectorAll("[data-company-node]") || [])];
    let filmBalance = null;
    if (film && nodes.length) {
      const fr = film.getBoundingClientRect();
      const first = nodes[0].getBoundingClientRect();
      const last = nodes[nodes.length - 1].getBoundingClientRect();
      const leftGap = first.left - fr.left;
      const rightGap = fr.right - last.right;
      filmBalance = {
        leftGap: Math.round(leftGap),
        rightGap: Math.round(rightGap),
        delta: Math.round(leftGap - rightGap),
        overflowing: film.dataset.overflowing,
        nodeCount: nodes.length,
      };
    }
    return {
      mode: document.documentElement.dataset.layoutMode,
      stackH: stack ? Math.round(stack.getBoundingClientRect().height) : null,
      title: title?.textContent?.trim() || null,
      titleVisible: Boolean(
        title &&
          getComputedStyle(title).visibility !== "hidden" &&
          Number(getComputedStyle(title).opacity) > 0 &&
          title.getBoundingClientRect().height > 8,
      ),
      visualH: visual ? Math.round(visual.getBoundingClientRect().height) : null,
      descVisible: Boolean(desc && desc.getBoundingClientRect().height > 4),
      pageFaceH: face ? Math.round(face.getBoundingClientRect().height) : null,
      eduInst,
      commerceLabels,
      filmBalance,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });
  await page.close();
}

console.log(JSON.stringify(out, null, 2));
await browser.close();
