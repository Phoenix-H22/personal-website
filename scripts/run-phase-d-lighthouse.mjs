import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const LIGHTHOUSE_VERSION = "12.8.2";
const BASE_URL = process.env.LIGHTHOUSE_BASE_URL ?? "http://127.0.0.1:3010";
const OUTPUT_DIRECTORY = path.resolve(
  "docs/portfolio-v3/qa/phase-d/lighthouse/final",
);
const NPX_EXECUTABLE = process.platform === "win32" ? process.execPath : "npx";
const NPX_ARGUMENT_PREFIX = process.platform === "win32"
  ? [path.join(path.dirname(process.execPath), "node_modules/npm/bin/npx-cli.js")]
  : [];
const ROUTES = [
  { name: "root", path: "/" },
  { name: "v2", path: "/v2" },
  { name: "work", path: "/v2/work" },
  { name: "smart-lockers", path: "/v2/work/smart-lockers-platform" },
  { name: "warqah", path: "/v2/work/warqah-store" },
  { name: "autopay", path: "/v2/work/autopay-eg" },
];
const FORM_FACTORS = [
  { name: "mobile", flags: [] },
  { name: "desktop", flags: ["--preset=desktop"] },
];

function runLighthouse(route, formFactor, run) {
  const reportName = `${route.name}-${formFactor.name}-run-${run}.report.json`;
  const reportPath = path.join(OUTPUT_DIRECTORY, reportName);
  const execution = spawnSync(
    NPX_EXECUTABLE,
    [
      ...NPX_ARGUMENT_PREFIX,
      "--yes",
      `lighthouse@${LIGHTHOUSE_VERSION}`,
      `${BASE_URL}${route.path}`,
      "--quiet",
      "--chrome-flags=--headless --no-sandbox",
      "--only-categories=performance,accessibility,best-practices,seo",
      "--output=json",
      `--output-path=${reportPath}`,
      ...formFactor.flags,
    ],
    { stdio: "inherit" },
  );

  if (execution.status !== 0) {
    throw new Error(`Lighthouse failed for ${route.path} ${formFactor.name} run ${run}`);
  }
  return reportPath;
}

function summarizeReport(reportPath, route, formFactor, run) {
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const score = (category) => Math.round(report.categories[category].score * 100);
  return {
    route: route.path,
    formFactor: formFactor.name,
    run,
    performance: score("performance"),
    accessibility: score("accessibility"),
    bestPractices: score("best-practices"),
    seo: score("seo"),
    fcp: report.audits["first-contentful-paint"].numericValue,
    lcp: report.audits["largest-contentful-paint"].numericValue,
    tbt: report.audits["total-blocking-time"].numericValue,
    cls: report.audits["cumulative-layout-shift"].numericValue,
  };
}

fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
const summary = [];

for (const route of ROUTES) {
  for (const formFactor of FORM_FACTORS) {
    for (let run = 1; run <= 3; run += 1) {
      const reportPath = runLighthouse(route, formFactor, run);
      summary.push(summarizeReport(reportPath, route, formFactor, run));
    }
  }
}

fs.writeFileSync(
  path.join(OUTPUT_DIRECTORY, "summary.json"),
  `${JSON.stringify({ lighthouseVersion: LIGHTHOUSE_VERSION, baseUrl: BASE_URL, runs: summary }, null, 2)}\n`,
);
console.table(summary);
