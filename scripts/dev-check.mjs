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
  if (["warning", "error"].includes(m.type())) issues.push(m.text());
});
await page.goto("http://localhost:5174", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
const pins = await page.locator(".pin-spacer").count();
await page.getByRole("button", { name: "Menu", exact: true }).click();
await page.keyboard.press("Escape");
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(500);
const mobilePins = await page.locator(".pin-spacer").count();
await page.setViewportSize({ width: 1440, height: 900 });
await page.waitForTimeout(500);
const restoredPins = await page.locator(".pin-spacer").count();
const results = { strictModePins: pins, mobilePins, restoredPins, issues };
await writeFile("qa/development.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
if (pins !== 1 || mobilePins !== 0 || restoredPins !== 1 || issues.length)
  process.exitCode = 1;
