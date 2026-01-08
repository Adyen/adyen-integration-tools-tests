import { expect } from "@playwright/test";
import { ProductDetailsPage } from "../pageObjects/plugin/ProductDetail.page.js";
import { ShippingDetails } from "../pageObjects/plugin/ShippingDetails.page.js";
import { SuccessfulCheckoutPage } from "../pageObjects/checkout/SuccessfulCheckout.page.js";
import { ShoppingCartPage } from "../pageObjects/plugin/ShoppingCart.page.js";
import { LoginPage } from "../pageObjects/plugin/Login.page.js";
import { AdminLoginPage } from "../pageObjects/plugin/AdminLogin.page.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";
import { IdealIssuerPage } from "../../common/redirect/IdealIssuerPage.js";
import { AnimationHelper } from "./AnimationHelper.js";

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
}

export async function loginAs(page, user) {
  const loginPage = new LoginPage(page);
  await loginPage.goTo();
  await loginPage.login(user);
}

export async function loginAsAdmin(page, user) {
  const adminLoginPage = new AdminLoginPage(page);
  await adminLoginPage.goTo();

    // If login form is visible -> login
    const needsLogin = await adminLoginPage.usernameInput
        .isVisible({ timeout: 1500 })
        .catch(() => false);

    if (needsLogin) {
        await adminLoginPage.login(user);

        // Wait until we are in the admin area (URL changes away from /admin/ login)
        await page.waitForURL(/\/admin(?!\/$)/, { timeout: 30_000 }).catch(() => {});
    }

    // Final "logged in" signal (menu is a good one)
    await page.locator("#menu-magento-backend-system").waitFor({ timeout: 30_000 });
    await page.waitForLoadState("networkidle").catch(() => {});
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
  await new AnimationHelper(page).waitForAnimation();
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

export async function verifyFailedPayment(page, redirect = false) {
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

/** @deprecated on Ideal 2.0 use makeIDeal2Payment() instead */
export async function makeIDealPayment(page, issuerName) {
  const paymentDetailPage = new PaymentDetailsPage(page);
  const idealPaymentSection = await paymentDetailPage.selectIDeal();
  await idealPaymentSection.selectIdealIssuer(issuerName);

  await placeOrder(page);
  await page.waitForURL("**/acquirersimulator/**", {timeout: 25000});
  await new IdealIssuerPage(page).continuePayment();
}

export async function makeIDeal2Payment(page, bankName, success = true) {
  const paymentDetailPage = new PaymentDetailsPage(page);
  await paymentDetailPage.selectIDeal();

  await placeOrder(page);
  await page.waitForURL("**/ext.pay.ideal.nl/**", {timeout: 25000});

  const idealIssuerPage = new IdealIssuerPage(page, bankName);

  await idealIssuerPage.proceedWithSelectedBank();

  if (success) {
    await idealIssuerPage.simulateSuccess();
  } else {
    await idealIssuerPage.simulateFailure();
  }

  await page.waitForLoadState();
}

export async function proceedToPaymentWithoutShipping(page) {
  await page.goto("/checkout#payment");
  await new AnimationHelper(page).waitForAnimation();
}

export async function extractPspReferenceFromAdminOrder(page) {
    // Locate the comment block that contains Adyen transaction info
    const commentLocator = page
        .locator('#order_history_block .note-list .note-list-item .note-list-comment')
        .filter({ hasText: 'Start Adyen transaction' })
        .first();

    // Wait until Magento has rendered the comment
    await expect(commentLocator).toBeVisible({ timeout: 30_000 });

    const commentText = await commentLocator.innerText();

    /**
     * Example text we expect:
     *
     * Start Adyen transaction
     * "API endpoint: /payments"
     * "Result code: Authorised"
     * "PSP reference: QNXTWZPX9TX9MH75"
     * "Payment method: visa"
     */
    const match = commentText.match(/PSP reference:\s*"?([A-Z0-9]+)"?/i);

    if (!match) {
        throw new Error(
            `PSP reference not found in Admin order comment.\n` +
            `Extracted text:\n${commentText}`
        );
    }

    return match[1];
}
