import { test, expect } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import { PaymentDetailsPage } from "../pageObjects/checkout/PaymentDetails.page.js";
import { ShoppingCartPage } from "../pageObjects/plugin/ShoppingCart.page.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
} from "../helpers/ScenarioHelper.js";
import { SuccessfulCheckoutPage } from "../pageObjects/checkout/SuccessfulCheckout.page.js";

const paymentResources = new PaymentResources();
const users = paymentResources.guestUser;

test.describe.parallel("Payment with iDeal", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
  });

  test("should succeed via Test Issuer", async ({ page }) => {
    await proceedToPaymentAs(page, users.dutch);
    await makeIDealPayment(page, "Test Issuer");
    await verifySuccessfulIdealCheckout(page);
  });

  test("should fail via Failing Test Issuer", async ({ page }) => {
    await proceedToPaymentAs(page, users.dutch);
    await makeIDealPayment(page, "Test Issuer Refused");
    await verifyFailedIdealCheckout(page);
  });
});

async function makeIDealPayment(page, issuerName) {
  const paymentDetailPage = new PaymentDetailsPage(page);
  const idealPaymentSection = await paymentDetailPage.selectIDeal();
  await idealPaymentSection.selectIdealIssuer(issuerName);

  const issuerPage = await idealPaymentSection.placeOrder();
  await issuerPage.continuePayment();
}

async function verifySuccessfulIdealCheckout(page) {
  const successMessage = await new SuccessfulCheckoutPage(page).titleText;
  await expect(successMessage).toEqual("Thank you for your purchase!");
}

async function verifyFailedIdealCheckout(page) {
  const errorMessage = await new ShoppingCartPage(
    page
  ).errorMessage.innerText();
  await expect(errorMessage).toEqual(
    "Your payment failed, Please try again later"
  );
}
