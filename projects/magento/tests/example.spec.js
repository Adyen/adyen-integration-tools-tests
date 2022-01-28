import { test, expect } from "@playwright/test";
import { ProductDetailsPage } from "../pages/plugin/ProductDetail.page.js";

test("basic test", async ({ page }) => {
  const productDetailPage = new ProductDetailsPage(page);
  await productDetailPage.addItemToCart("joust-duffle-bag.html");
  await productDetailPage.addItemWithOptionsToCart(
    "breathe-easy-tank.html",
    "M",
    2
  );
  await expect(await productDetailPage.currentCartItemCount).toEqual("3");
});
