import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  headless: true,
  args: ["--disable-gpu", "--disable-software-rasterizer"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const issues = [];
page.on("pageerror", (e) => issues.push(e.message));
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type())) issues.push(m.text());
});
page.on("response", (r) => {
  if (r.status() >= 400) issues.push(`${r.status()} ${r.url()}`);
});
await page.goto("http://localhost:4173/?motion=off", {
  waitUntil: "networkidle",
});
const results = [];
for (const [id, count] of [
  ["nature-home", 13],
  ["community-centre", 5],
  ["nature-home-2", 7],
]) {
  const details = page.locator(`#project-${id}`);
  await details.locator("summary").click();
  const buttons = details.locator("button[aria-pressed]");
  const found = await buttons.count();
  for (let i = 0; i < found; i++) {
    await buttons.nth(i).click();
    await details.locator("figure img").evaluate(async (image) => {
      await image.decode();
    });
    const loaded = await details
      .locator("figure img")
      .evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!loaded) issues.push(`${id} image ${i + 1} did not load`);
  }
  await details.locator('button[aria-label^="Next image"]').click();
  const counter = await details.locator("[aria-live]").innerText();
  const wrap = counter.startsWith("01");
  results.push({ id, found, expected: count, wrap });
  await page.screenshot({
    path: `qa/gallery-${id}-desktop.png`,
    fullPage: false,
  });
  await details.locator("summary").click();
}
await page.setViewportSize({ width: 320, height: 900 });
await page.locator("#project-nature-home summary").click();
await page.waitForTimeout(200);
const mobileOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth > innerWidth,
);
await page.screenshot({ path: "qa/gallery-mobile.png" });
console.log(JSON.stringify({ results, mobileOverflow, issues }, null, 2));
await writeFile(
  "qa/galleries.json",
  JSON.stringify({ results, mobileOverflow, issues }, null, 2),
);
await browser.close();
if (
  issues.length ||
  mobileOverflow ||
  results.some((r) => r.found !== r.expected || !r.wrap)
)
  process.exitCode = 1;
