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

test.describe.parallel("Payment via Klarna Pay Over Time", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
  });

  test.fixme("ECP-8578 should succeed", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    const klarnaPaymentPage = await proceedToKlarnaPayOverTime(page);

    await klarnaPaymentPage.makeKlarnaPayment("overTime", user.phoneNumber);
    await verifySuccessfulPayment(page);
  });
});

async function proceedToKlarnaPayOverTime(page) {
  await new PaymentDetailsPage(page).selectKlarnaPayOverTime();
  await placeOrder(page);
  return new KlarnaPaymentPage(page);
}
