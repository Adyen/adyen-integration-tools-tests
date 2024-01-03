import { expect } from "@playwright/test";
import { ProductDetailsPage } from "../pageObjects/plugin/ProductDetail.page.js";
import { ShippingDetails } from "../pageObjects/plugin/ShippingDetails.page.js";
import { SuccessfulCheckoutPage } from "../pageObjects/checkout/SuccessfulCheckout.page.js";
import { ShoppingCartPage } from "../pageObjects/plugin/ShoppingCart.page.js";
import { LoginPage } from "../pageObjects/plugin/Login.page.js";
import { AdminLoginPage } from "../pageObjects/plugin/AdminLogin.page.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";
import { IdealIssuerPage } from "../../common/redirect/IdealIssuerPage.js";

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

  await page.waitForLoadState("networkidle", { timeout: 15000 });
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

export async function verifySuccessfulPayment(page, redirect = true, timeout) {
  const successfulCheckoutPage = new SuccessfulCheckoutPage(page);
  if (redirect != false) {
    await successfulCheckoutPage.waitForRedirection(timeout);
  }
  expect(await successfulCheckoutPage.pageTitle.innerText()).toContain(
    "Thank you for your purchase!"
  );
}

export async function verifyPaymentRefusal(page) {
  const paymentDetailsPage = new PaymentDetailsPage(page);
  expect(await paymentDetailsPage.errorMessageContainer.innerText()).toContain(
    "The payment is REFUSED."
    );
}

export async function getOrderNumber(page){
  return (await new SuccessfulCheckoutPage(page).orderNumber());
}


export async function verifyVoucherCouponGeneration(page) {
  const successfulCheckoutPage = new SuccessfulCheckoutPage(page);
  await expect(successfulCheckoutPage.voucherCodeContainer).toBeVisible();
}

export async function verifyFailedPayment(page) {
  const errorMessage = await new ShoppingCartPage(
    page
  ).errorMessage.innerText();
  expect(errorMessage).toContain(
    "Your payment failed, Please try again later"
  );
}

export async function placeOrder(page) {
  const placeOrderButton = page.locator(
    ".payment-method._active button[type=submit]"
  );

  await placeOrderButton.click();
}

export async function makeIDealPayment(page, issuerName) {
  const paymentDetailPage = new PaymentDetailsPage(page);
  const idealPaymentSection = await paymentDetailPage.selectIDeal();
  await idealPaymentSection.selectIdealIssuer(issuerName);

  await placeOrder(page);
  await page.waitForNavigation();
  await new IdealIssuerPage(page).continuePayment();
}
