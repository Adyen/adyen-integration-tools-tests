import { expect } from "@playwright/test";
import { ProductDetailPage } from "../pageObjects/plugin/ProductDetail.page";

export async function goToShippingWithFullCart(page, quantity) {
  const productDetailPage = new ProductDetailPage(page);

  await productDetailPage.addItemToCart("Main-product-free-shipping-with-highlighting/SWDEMO10006",
    quantity);
  expect(await productDetailPage.alertMessage.textContent()).toContain("product has been added to the shopping cart");
  await productDetailPage.clickProceedToCheckout();
}
