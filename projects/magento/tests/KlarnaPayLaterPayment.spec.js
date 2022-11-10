import { test } from "@playwright/test";
import KlarnaPaymentPage from "../../common/redirect/KlarnaPaymentPage.js";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
  verifyFailedPayment,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";

const paymentResources = new PaymentResources();
const user = paymentResources.guestUser.klarna.approved.nl;

test.describe.parallel("Payment via Klarna Pay Later", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
  });

  test("should succeed", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    const klarnaPaymentPage = await proceedToKlarnaPayLater(page);

    await klarnaPaymentPage.makeKlarnaPayment("later", user.phoneNumber);
    await verifySuccessfulPayment(page);
  });

  test("should fail if cancelled", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    const klarnaPaymentPage = await proceedToKlarnaPayLater(page);

    await klarnaPaymentPage.makeKlarnaPayment("cancel");
    await verifyFailedPayment(page);
  });
});

async function proceedToKlarnaPayLater(page) {
  const paymentDetailPage = new PaymentDetailsPage(page);
  const klarnaPayLaterSection = await paymentDetailPage.selectKlarnaPayLater(
    page
  );
  await klarnaPayLaterSection.placeOrder();
  return new KlarnaPaymentPage(page);
}
