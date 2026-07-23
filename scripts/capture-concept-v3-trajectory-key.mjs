import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const QA = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../docs/portfolio-v3/qa",
);
const PAGE = "http://localhost:3000/concept-v3-rebuild?motionOverride=full";

const browser = await chromium.launch({ headless: true });

async function prep(page) {
  await page.addInitScript(() => {
    localStorage.setItem("portfolio-motion-preference-v3", "full");
  });
  await page.goto(PAGE, { waitUntil: "networkidle", timeout: 90000 });
  await page.locator("#experience").scrollIntoViewIfNeeded();
  await page.waitForSelector("[data-career-trajectory]");
  await page.waitForTimeout(400);
}

async function clickNode(page, id) {
  const node = page.locator(`[data-company-node="${id}"]`);
  if ((await node.count()) && (await node.first().isVisible())) {
    await node.first().click({ force: true });
  } else {
    await page.locator(`button:has-text("${id === "kayanac-erp" ? "Kayanac" : id}")`).first().click({ force: true });
  }
  await page.waitForTimeout(900);
}

{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await prep(page);
  await page.screenshot({
    path: path.join(QA, "concept-v3-trajectory-desktop-mohssilh.png"),
  });
  await clickNode(page, "kayanac-erp");
  await page.screenshot({
    path: path.join(QA, "concept-v3-trajectory-desktop-kayanac-overlap.png"),
  });
  await ctx.close();
}

{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await prep(page);
  await page.locator('button:has-text("Owning")').first().click({ force: true });
  await page.waitForTimeout(500);
  await page.locator('button:has-text("Mohssilh")').first().click({ force: true });
  await page.waitForTimeout(700);
  await page.screenshot({
    path: path.join(QA, "concept-v3-trajectory-mobile-owning-mohssilh.png"),
  });
  await ctx.close();
}

console.log("key shots updated");
await browser.close();
