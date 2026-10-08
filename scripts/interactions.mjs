import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  headless: true,
  args: ["--disable-gpu", "--disable-software-rasterizer"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
const issues = [];
const checks = {};
page.on("pageerror", (e) => issues.push(e.message));
page.on("console", (m) => {
  if (["warning", "error"].includes(m.type())) issues.push(m.text());
});
await page.goto("http://localhost:4173", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2100);
checks.introRemoved = (await page.locator("[data-intro]").count()) === 0;
await page.reload({ waitUntil: "domcontentloaded" });
checks.introSessionOnly = (await page.locator("[data-intro]").count()) === 0;
await page.waitForTimeout(1400);
await page
  .locator("header")
  .getByRole("link", { name: "Ecosystem", exact: true })
  .click();
await page.waitForTimeout(1800);
checks.anchor = await page.evaluate(
  () =>
    Math.abs(
      document.querySelector("#ecosystem").getBoundingClientRect().top - 86,
    ) < 8,
);
for (let i = 0; i < 25; i++)
  await page.locator(`[data-brand-index="${i % 7}"]`).hover({ force: true });
await page.locator('[data-brand-index="0"]').focus();
await page.keyboard.press("End");
checks.rovingEnd = await page
  .locator('[data-brand-index="6"]')
  .evaluate((el) => document.activeElement === el);
await page.keyboard.press("Home");
checks.rovingHome = await page
  .locator('[data-brand-index="0"]')
  .evaluate((el) => document.activeElement === el);
await page
  .locator("header")
  .getByRole("button", { name: "Menu", exact: true })
  .click();
await page.waitForTimeout(650);
await page
  .getByRole("dialog")
  .getByRole("button", { name: "Close navigation" })
  .focus();
await page.keyboard.press("Shift+Tab");
checks.focusTrap = await page
  .getByRole("dialog")
  .evaluate((el) => el.contains(document.activeElement));
await page.keyboard.press("Escape");
await page
  .locator("header")
  .getByRole("link", { name: "Crystal Kizor home" })
  .focus();
const invisible = [];
for (let i = 0; i < 55; i++) {
  await page.keyboard.press("Tab");
  await page.waitForTimeout(90);
  const result = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    let p = el;
    while (p && p !== document.body) {
      const s = getComputedStyle(p);
      if (
        s.display === "none" ||
        s.visibility === "hidden" ||
        Number(s.opacity) === 0
      )
        return el.textContent;
      p = p.parentElement;
    }
    return null;
  });
  if (result) invisible.push(result);
}
checks.noInvisibleTabTargets = invisible.length === 0;
if (invisible.length)
  issues.push(...invisible.map((v) => `Invisible focus: ${v}`));
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(600);
checks.resizeOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth <= innerWidth,
);
await page.goto("http://localhost:4173/?motion=off", {
  waitUntil: "domcontentloaded",
});
await page.waitForTimeout(300);
checks.motionOff = (await page.locator("[data-intro],canvas").count()) === 0;
await page.locator('[data-brand-index="1"]').scrollIntoViewIfNeeded();
await page.locator('[data-brand-index="1"]').click();
checks.mobileAccordion =
  (await page
    .locator('[data-brand-index="1"]')
    .getAttribute("aria-expanded")) === "true";
await page.locator('[data-brand-index="2"]').click();
checks.singleOpen =
  (await page
    .locator('[data-brand-index="1"]')
    .getAttribute("aria-expanded")) === "false";
await page.evaluate(() => sessionStorage.removeItem("ck-intro"));
await page.goto("http://localhost:4173", { waitUntil: "domcontentloaded" });
await page.locator("[data-intro]").waitFor({ state: "visible" });
await page.keyboard.press("Space");
await page.waitForTimeout(200);
checks.introSkip = (await page.locator("[data-intro]").count()) === 0;
await writeFile(
  "qa/interactions.json",
  JSON.stringify({ checks, issues }, null, 2),
);
console.log(JSON.stringify({ checks, issues }, null, 2));
await browser.close();
if (issues.length || Object.values(checks).some((v) => !v))
  process.exitCode = 1;
