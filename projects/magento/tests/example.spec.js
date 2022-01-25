// @ts-check
const { test, expect } = require("@playwright/test");

test("basic test", async ({ page }) => {
  await page.goto("/");
  await page.locator("text=Get started").click();
  await expect(page).toHaveTitle(/Getting started/);
});
