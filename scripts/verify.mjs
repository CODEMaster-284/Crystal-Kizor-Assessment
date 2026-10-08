import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("qa", { recursive: true });
// Deterministic fallback coverage: this host uses software WebGL with screenshot driver warnings.
const browser = await chromium.launch({
  headless: true,
  args: ["--disable-gpu", "--disable-software-rasterizer"],
});
const results = [];
for (const reducedMotion of ["no-preference", "reduce"]) {
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    console.log("Checking", width, reducedMotion);
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion,
    });
    const page = await context.newPage();
    const issues = [];
    page.on("pageerror", (e) => issues.push(e.message));
    page.on("console", (m) => {
      if (["error", "warning"].includes(m.type())) issues.push(m.text());
    });
    await page.goto("http://localhost:4173", { waitUntil: "domcontentloaded" });
    console.log("Loaded");
    await page.waitForTimeout(2200);
    const dimensions = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    if (dimensions.scroll > width)
      issues.push(`Overflow: ${dimensions.scroll} > ${width}`);
    await page.evaluate(async () => {
      const height = document.body.scrollHeight;
      for (let y = 0; y < height; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
    console.log("Scrolled");
    await page.screenshot({
      path: `qa/${width}-${reducedMotion}-full.png`,
      fullPage: true,
      timeout: 15000,
    });
    await page.screenshot({
      path: `qa/${width}-${reducedMotion}-viewport.png`,
      timeout: 15000,
    });
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page.getByRole("dialog").waitFor();
    await page.keyboard.press("Escape");
    for (let i = 0; i < 20; i++) {
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      await page.keyboard.press("Escape");
    }
    const locked = await page.evaluate(
      () =>
        document.body.style.overflow === "hidden" ||
        document.querySelector("main").inert,
    );
    if (locked) issues.push("Menu left scroll lock or inert main");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    results.push({ width, reducedMotion, dimensions, issues });
    await context.close();
  }
}
const context = await browser.newContext({
  viewport: { width: 390, height: 900 },
  javaScriptEnabled: false,
});
const page = await context.newPage();
await page.goto("http://localhost:4173");
const text = await page.locator("body").innerText();
results.push({
  noJavaScript: text.includes("Alive and Free") && text.includes("Contact"),
});
await context.close();
await writeFile("qa/results.json", JSON.stringify(results, null, 2));
await browser.close();
console.log(JSON.stringify(results, null, 2));
if (results.some((r) => r.issues?.length)) process.exitCode = 1;
