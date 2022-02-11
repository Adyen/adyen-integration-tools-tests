import { test } from "@playwright/test";
import PaymentResources from "../../common/PaymentResources.js";
import { PaymentDetailsPage } from "../pageObjects/checkout/PaymentDetails.page.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
  verifySuccessfulCheckout,
} from "../helpers/ScenarioHelper.js";

const paymentResources = new PaymentResources();
const users = paymentResources.guestUser;

test.describe.parallel("Payment with", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
  });

  test("iDeal should succeed", async ({ page }) => {
    proceedToPaymentAs(page, users.iDeal);

    await makeiDealPayment();

    await verifySuccessfulCheckout(page);
  });
});

async function makeiDealPayment() {
  const paymentDetailPage = new PaymentDetailsPage();
}
