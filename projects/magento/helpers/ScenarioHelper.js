import { expect } from "@playwright/test";
import { ProductDetailsPage } from "../pageObjects/plugin/ProductDetail.page.js";
import { ShippingDetails } from "../pageObjects/checkout/ShippingDetails.page.js";

export async function goToShippingWithFullCart(page, multiItems = false) {
  const productDetailsPage = new ProductDetailsPage(page);
  await productDetailsPage.addItemToCart("joust-duffle-bag.html");

  await expect(await productDetailsPage.currentCartItemCount).toEqual("1");

  if (multiItems != false) {
    await productDetailsPage.addItemWithOptionsToCart(
      "breathe-easy-tank.html",
      "M",
      2
    );
    await expect(await productDetailsPage.currentCartItemCount).toEqual("3");
  }
}

export async function proceedToPaymentAs(page, user) {
  const shippingDetailsPage = new ShippingDetails(page);
  await shippingDetailsPage.goTo();
  await shippingDetailsPage.fillShippingDetailsAndProceedToPayment(user);
}