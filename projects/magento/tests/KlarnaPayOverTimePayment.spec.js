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

test.describe.parallel("Payment via Klarna Pay Over Time", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
  });

  test("should succeed", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    const klarnaPaymentPage = await proceedToKlarnaPayOverTime(page);

    await klarnaPaymentPage.makeKlarnaPayment("overTime", user.phoneNumber);
    await verifySuccessfulPayment(page);
  });

  test("should fail if cancelled", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    const klarnaPaymentPage = await proceedToKlarnaPayOverTime(page);

    await klarnaPaymentPage.makeKlarnaPayment("cancel");
    await verifyFailedPayment(page);
  });
});

async function proceedToKlarnaPayOverTime(page) {
  const paymentDetailPage = new PaymentDetailsPage(page);
  const klarnaPayOverTimeSection =
    await paymentDetailPage.selectKlarnaPayOverTime(page);
  await klarnaPayOverTimeSection.placeOrder();
  return new KlarnaPaymentPage(page);
}
