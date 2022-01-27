import { test, expect } from "@playwright/test";
import { ProductDetailPage } from "../pages/plugin/ProductDetail.page.js";

test("basic test", async ({ page }) => {
  const productDetailPage = new ProductDetailPage(page);
  await productDetailPage.addItemToCart("joust-duffle-bag.html");
  await productDetailPage.addItemWithOptionsToCart(
    "breathe-easy-tank.html",
    "M",
    2
  );

  console.log(await productDetailPage.currentCartItemCount);
  await expect(await productDetailPage.currentCartItemCount).toEqual("3");
});
