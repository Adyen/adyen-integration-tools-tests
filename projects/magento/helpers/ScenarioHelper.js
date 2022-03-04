import { expect } from "@playwright/test";
import { ProductDetailsPage } from "../pageObjects/plugin/ProductDetail.page.js";
import { ShippingDetails } from "../pageObjects/checkout/ShippingDetails.page.js";
import { SuccessfulCheckoutPage } from "../pageObjects/checkout/SuccessfulCheckout.page.js";
import { ShoppingCartPage } from "../pageObjects/plugin/ShoppingCart.page.js";

export async function goToShippingWithFullCart(page, additionalItemCount = 0) {
  const productDetailsPage = new ProductDetailsPage(page);
  await productDetailsPage.addItemToCart("joust-duffle-bag.html");

  await expect(await productDetailsPage.currentCartItemCount).toEqual("1");

  if (additionalItemCount >= 1) {
    await productDetailsPage.addItemWithOptionsToCart(
      "breathe-easy-tank.html",
      "M",
      additionalItemCount
    );
    await expect(await productDetailsPage.currentCartItemCount)
      .toEqual((additionalItemCount + 1).toString());
  }
}

export async function proceedToPaymentAs(page, user) {
  const shippingDetailsPage = new ShippingDetails(page);
  await shippingDetailsPage.goTo();
  await shippingDetailsPage.fillShippingDetailsAndProceedToPayment(user);
}

export async function verifySuccessfulPayment(page, redirect = true) {
  const successfulCheckoutPage = new SuccessfulCheckoutPage(page);
  if (redirect != false) {
    await successfulCheckoutPage.waitForRedirection();
  }
  await expect(await successfulCheckoutPage.pageTitle.innerText()).toEqual(
    "Thank you for your purchase!"
  );
}

export async function verifyFailedPayment(page) {
  const errorMessage = await new ShoppingCartPage(
    page
  ).errorMessage.innerText();
  await expect(errorMessage).toEqual(
    "Your payment failed, Please try again later"
  );
}
