import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("qa", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--disable-gpu", "--disable-software-rasterizer"],
});
const results = [];
for (const width of [320, 390, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
  });
  const page = await context.newPage();
  const issues = [];
  page.on("pageerror", (e) => issues.push(e.message));
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type())) issues.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) issues.push(`${r.status()} ${r.url()}`);
  });
  await page.addInitScript(() => {
    window.heroQA = {};
    new MutationObserver(() => {
      const intro = document.querySelector("[data-intro]");
      if (intro && !window.heroQA.start)
        window.heroQA.start = performance.now();
      if (!intro && window.heroQA.start && !window.heroQA.end)
        window.heroQA.end = performance.now();
    }).observe(document, { childList: true, subtree: true });
  });
  await page.goto("http://localhost:4173", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `qa/hero-${width}-intro.png` });
  await page.waitForTimeout(2100);
  const state = await page.evaluate(() => ({
    timing: window.heroQA.end - window.heroQA.start,
    lines: Array.from(document.querySelectorAll("[data-hero-line]")).map(
      (el) => getComputedStyle(el).transform,
    ),
    photo:
      document.querySelector("[data-hero-portrait]").complete &&
      document.querySelector("[data-hero-portrait]").naturalWidth > 0,
    clip: getComputedStyle(document.querySelector("[data-hero-media]"))
      .clipPath,
    arrivals: Array.from(document.querySelectorAll("[data-hero-arrival]")).map(
      (el) => getComputedStyle(el).opacity,
    ),
    overflow: document.documentElement.scrollWidth > innerWidth,
  }));
  await page.screenshot({ path: `qa/hero-${width}-complete.png` });
  await page.evaluate(() => window.scrollTo(0, 350));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `qa/hero-${width}-scroll.png` });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const returned = await page.evaluate(() =>
    Array.from(document.querySelectorAll("[data-hero-drift]")).every(
      (el) =>
        Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m42) < 1,
    ),
  );
  const lineReady = await page.evaluate(() =>
    Array.from(document.querySelectorAll("[data-hero-line]")).every(
      (el) =>
        Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m42) < 1,
    ),
  );
  const result = { width, ...state, returned, lineReady, issues };
  results.push(result);
  console.log(JSON.stringify(result));
  await context.close();
}
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
await page.goto("http://localhost:4173", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(300);
const reduced = (await page.locator("[data-intro],canvas").count()) === 0;
results.push({ reduced });
await context.close();
await browser.close();
await writeFile("qa/hero-results.json", JSON.stringify(results, null, 2));
if (
  results.some(
    (r) =>
      r.issues?.length ||
      r.overflow ||
      r.timing > 2100 ||
      r.returned === false ||
      r.lineReady === false ||
      r.photo === false ||
      r.reduced === false,
  )
)
  process.exitCode = 1;
