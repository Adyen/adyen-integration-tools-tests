import { expect } from "@playwright/test";
import { ProductDetailsPage } from "../pageObjects/plugin/ProductDetail.page.js";
import { ShippingDetails } from "../pageObjects/plugin/ShippingDetails.page.js";
import { SuccessfulCheckoutPage } from "../pageObjects/checkout/SuccessfulCheckout.page.js";
import { ShoppingCartPage } from "../pageObjects/plugin/ShoppingCart.page.js";
import { LoginPage } from "../pageObjects/plugin/Login.page.js";

export async function goToShippingWithFullCart(page, additionalItemCount = 0, itemURL="joust-duffle-bag.html") {
  const productDetailsPage = new ProductDetailsPage(page);
  await productDetailsPage.addItemToCart(itemURL);

  if (additionalItemCount >= 1) {
    await productDetailsPage.addItemWithOptionsToCart(
      "breathe-easy-tank.html",
      "M",
      additionalItemCount
    );
  }

  await page.waitForLoadState("networkidle", { timeout: 20000 });
}

export async function loginAs(page, user) {
  const loginPage = new LoginPage(page);
  await loginPage.goTo();
  await loginPage.login(user);
}

export async function proceedToPaymentAs(page, user, isGuest = true) {
  const shippingDetailsPage = new ShippingDetails(page);
  await shippingDetailsPage.goTo();

  isGuest?await shippingDetailsPage.fillShippingDetailsAndProceedToPayment(user)
  :await shippingDetailsPage.proceedToPaymentWithSavedAddress();
}

/* This method should only be used for cases where the user should fill the billing
details only on payment page; e.g. For virtual products */
export async function fillBillingAddress(page, user){
  await new ShippingDetails(page, page.locator(".payment-method._active"))
  .fillShippingDetails(user, false);
  await page.getByRole('button', { name: 'Update' }).click();
}

export async function verifySuccessfulPayment(page, redirect = true, timeout) {
  const successfulCheckoutPage = new SuccessfulCheckoutPage(page);
  if (redirect !== false) {
    await successfulCheckoutPage.waitForRedirection(timeout);
  }
  expect(await successfulCheckoutPage.pageTitle.innerText()).toContain(
    "Thank you for your purchase!"
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
  const placeOrderButton = page.locator("button[x-bind='buttonPlaceOrder()']").last();

  await placeOrderButton.click({timeout: 10000});
}

export async function proceedToPaymentWithoutShipping(page) {
  await page.goto("/checkout#payment");
  await new AnimationHelper(page).waitForAnimation();
}
