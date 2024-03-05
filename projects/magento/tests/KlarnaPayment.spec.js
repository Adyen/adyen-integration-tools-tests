import { test } from "@playwright/test";
import KlarnaPaymentPage from "../../common/redirect/KlarnaPaymentPage.js";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  placeOrder,
  proceedToPaymentAs,
  verifyFailedPayment,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";

const paymentResources = new PaymentResources();
const user = paymentResources.guestUser.klarna.approved.nl;

test.describe.only("Payment via Klarna", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
  });

  test("should succeed via Pay Now", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    const klarnaPaymentPage = await proceedToKlarnaPayNow(page);

    await klarnaPaymentPage.makeKlarnaPayment(user.phoneNumber, true);
    await verifySuccessfulPayment(page, true, 25000);
  });

  test("should succeed via Pay Later", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    const klarnaPaymentPage = await proceedToKlarnaPayLater(page);

    await klarnaPaymentPage.makeKlarnaPayment(user.phoneNumber, false);
    await verifySuccessfulPayment(page, true, 25000);
  });

  test("should succeed via Pay Over Time", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    const klarnaPaymentPage = await proceedToKlarnaPayOverTime(page);

    await klarnaPaymentPage.makeKlarnaPayment(user.phoneNumber, false);
    await verifySuccessfulPayment(page, true, 25000);
  });

  test("should be handled properly if cancelled", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    const klarnaPaymentPage = await proceedToKlarnaPayNow(page);

    await klarnaPaymentPage.cancelKlarnaPayment();
    await verifyFailedPayment(page);
  });
});

async function proceedToKlarnaPayNow(page) {
  await new PaymentDetailsPage(page).selectKlarnaPayNow();
  await placeOrder(page);
  return new KlarnaPaymentPage(page);
}

async function proceedToKlarnaPayOverTime(page) {
  await new PaymentDetailsPage(page).selectKlarnaPayOverTime();
  await placeOrder(page);
  return new KlarnaPaymentPage(page);
}

async function proceedToKlarnaPayLater(page) {
  await new PaymentDetailsPage(page).selectKlarnaPayLater();
  await placeOrder(page);
  return new KlarnaPaymentPage(page);
}
