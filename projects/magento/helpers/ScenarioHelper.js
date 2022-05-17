import { expect } from "@playwright/test";
import { ProductDetailsPage } from "../pageObjects/plugin/ProductDetail.page.js";
import { ShippingDetails } from "../pageObjects/checkout/ShippingDetails.page.js";
import { SuccessfulCheckoutPage } from "../pageObjects/checkout/SuccessfulCheckout.page.js";
import { ShoppingCartPage } from "../pageObjects/plugin/ShoppingCart.page.js";
import { LoginPage } from "../pageObjects/plugin/Login.page.js";
import { AdminLoginPage } from "../pageObjects/plugin/AdminLogin.page.js";

export async function goToShippingWithFullCart(page, additionalItemCount = 0) {
  const productDetailsPage = new ProductDetailsPage(page);
  await productDetailsPage.addItemToCart("joust-duffle-bag.html");

  if (additionalItemCount >= 1) {
    await productDetailsPage.addItemWithOptionsToCart(
      "breathe-easy-tank.html",
      "M",
      additionalItemCount
    );
  }

  expect
    .soft(parseInt(await productDetailsPage.currentCartItemCount()))
    .toBeGreaterThanOrEqual(1);
}

export async function loginAs(page, user) {
  const loginPage = new LoginPage(page);
  await loginPage.goTo();
  await loginPage.login(user);
}

export async function loginAsAdmin(page, user) {
  const adminLoginPage = new AdminLoginPage(page);
  await adminLoginPage.goTo();
  await adminLoginPage.login(user);
}

export async function proceedToPaymentAs(page, user, isGuest = true) {
  const shippingDetailsPage = new ShippingDetails(page);
  await shippingDetailsPage.goTo();

  // Used switch since more functionality is to be added for registered users
  switch (isGuest) {
    case true:
      await shippingDetailsPage.fillShippingDetailsAndProceedToPayment(user);
      break;
    case false:
      await shippingDetailsPage.proceedToPaymentWithSavedAddress();
      break;
  }
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

export async function verifyVoucherCouponGeneration(page) {
  const successfulCheckoutPage = new SuccessfulCheckoutPage(page);
  await expect(successfulCheckoutPage.voucherCoudeContainer).toBeVisible();
}

export async function verifyFailedPayment(page) {
  const errorMessage = await new ShoppingCartPage(
    page
  ).errorMessage.innerText();
  await expect(errorMessage).toEqual(
    "Your payment failed, Please try again later"
  );
}
