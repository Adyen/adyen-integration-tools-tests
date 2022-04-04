import { test } from "@playwright/test";
import KlarnaPaymentPage from "../../common/KlarnaPaymentPage.js";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
  verifyFailedPayment,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/checkout/PaymentDetails.page.js";

const paymentResources = new PaymentResources();
const user = paymentResources.guestUser.klarna.approved.nl;

test.describe.parallel("Payment via Klarna Pay Now", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
  });

  test("should succeed via direct debit", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    const klarnaPaymentPage = await proceedToKlarnaPayNow(page);

    await klarnaPaymentPage.makeKlarnaPayment("directDebit", user.phoneNumber);
    await verifySuccessfulPayment(page);
  });

  test("should succeed via direct bank transfer", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    const klarnaPaymentPage = await proceedToKlarnaPayNow(page);

    await klarnaPaymentPage.makeKlarnaPayment(
      "directBankTransfer",
      user.phoneNumber
    );
    await verifySuccessfulPayment(page);
  });

  test("should fail if cancelled", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    const klarnaPaymentPage = await proceedToKlarnaPayNow(page);

    await klarnaPaymentPage.makeKlarnaPayment("cancel");
    await verifyFailedPayment(page);
  });
});

async function proceedToKlarnaPayNow(page) {
  const paymentDetailPage = new PaymentDetailsPage(page);
  const klarnaPayNowSection = await paymentDetailPage.selectKlarnaPayNow(page);
  await klarnaPayNowSection.placeOrder();
  return new KlarnaPaymentPage(page);
}
